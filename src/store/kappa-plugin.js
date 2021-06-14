import kappa from "kappa-core";
import rai from "random-access-idb";
import hyperswarm from "hyperswarm-web";
import pump from "pump";
import level from "level";
import kvView from "../kappa-kv-view";

const STORAGE_KEY = "vue-todo-pwa";

function ArrayBufferFromString(str) {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export default async (store) => {
  const topic = Buffer.from(
    await crypto.subtle.digest("SHA-256", ArrayBufferFromString(STORAGE_KEY))
  );
  const swarm = hyperswarm(/* { bootstrap: ['ws://192.168.29.7:4977'], } */);
  window.swarm = swarm;
  const core = kappa(rai(STORAGE_KEY + "-kappa"), {
    valueEncoding: "json",
  });
  window.core = core;
  core.use("kv", kvView(level(STORAGE_KEY + "-kv", { valueEncoding: "json" })));
  core.writer("local", function (err, feed) {
    swarm.join(topic, { lookup: true, announce: true });
    swarm.on("connection", function (connection, info) {
      console.log("[New peer connected!]");
      pump(connection, core.replicate(info.client, { live: true }), connection);
    });

    store.subscribe(({ type, payload: { todo } }, state) => {
      if (type === "receiveData") {
        return;
      }
      const todoId = todo.id;
      todo = state.todos.find((t) => t.id === todoId) || todo;
      feed.append({
        type: type === "removeTodo" ? "del" : "put",
        timestamp: new Date().toISOString(),
        ...todo,
      });
    });
  });

  core.ready([], function () {
    // Load all messages
    core.api.kv.all((data) => {
      store.commit(
        "receiveData",
        data.map(({ key, value }) => {
          return {
            id: key,
            ...value,
          };
        })
      );
    });
    // // Listen for latest message.
    core.api.kv.on("update", (k, v) => {
      console.log(k, v);
    });
    core.api.kv.on("batch", (ops) => {
      console.log(ops);
      core.api.kv.all((data) => {
        store.commit(
          "receiveData",
          data.map(({ key, value }) => {
            return {
              id: key,
              ...value,
            };
          })
        );
      });
    });
    core.api.kv.on("del", () => {
      core.api.kv.all((data) => {
        store.commit(
          "receiveData",
          data.map(({ key, value }) => {
            return {
              id: key,
              ...value,
            };
          })
        );
      });
    });
  });
};
