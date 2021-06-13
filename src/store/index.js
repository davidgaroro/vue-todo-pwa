import { createStore } from "vuex";
import kappa from "kappa-core";
import rai from "random-access-idb";
import hyperswarm from "hyperswarm-web";
import pump from "pump";
import makeView from 'kappa-view';
import level from "level";

const STORAGE_KEY = "vue-todo-pwa";

// initial state
const state = {
  todos: [],
};

// mutations
const mutations = {
  addTodo(state, { todo }) {
    state.todos.push(todo);
  },

  removeTodo(state, { todo }) {
    state.todos.splice(state.todos.indexOf(todo), 1);
  },

  editTodo(state, { todo, text = todo.text, done = todo.done }) {
    const index = state.todos.indexOf(todo);

    state.todos.splice(index, 1, {
      ...todo,
      text,
      done,
    });
  },

  receiveData(state, data) {
    state.todos.splice(0, state.todos.length, ...data);
  },
};

// actions
const actions = {
  addTodo({ commit }, text) {
    commit("addTodo", {
      todo: {
        id: Date.now(),
        text,
        done: false,
      },
    });
  },

  removeTodo({ commit }, todo) {
    commit("removeTodo", { todo });
  },

  toggleTodo({ commit }, todo) {
    commit("editTodo", { todo, done: !todo.done });
  },

  editTodo({ commit }, { todo, value }) {
    commit("editTodo", { todo, text: value });
  },

  toggleAll({ state, commit }, done) {
    state.todos.forEach((todo) => {
      commit("editTodo", { todo, done });
    });
  },

  clearCompleted({ state, commit }) {
    state.todos
      .filter((todo) => todo.done)
      .forEach((todo) => {
        commit("removeTodo", { todo });
      });
  },
};

function ArrayBufferFromString(str) {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

var kvView = makeView(level(STORAGE_KEY + '-kv', { valueEncoding: "json" }), { valueEncoding: "json" }, function (db) {
  return {
    map: function (entries, next) {
      var batch = entries.map(function (entry) {
        let { id, type, ...value } = entry.value;
        return {
          type: type === 'removeTodo' ? 'del' : 'put',
          key: id,
          value: value,
        }
      })
      db.batch(batch, next)
    },

    api: {
      get: function (core, key, cb) {
        core.ready(function () {
          db.get(key, cb)
        })
      },
      all: function (core, cb) {
        core.ready(() => {
          const data = [];
          db.createReadStream()
            .on('data', (entry) => { data.push(entry); })
            .on('end', () => { cb(data); });
        });
      },
      onUpdate: (core, cb) => {
        core.ready(() => {
          db.on('put', cb);
        })
      },
      onDelete: (core, cb) => {
        core.ready(() => {
          db.on('del', cb);
        })
      },
      onBatch: (core, cb) => {
        core.ready(() => {
          db.on('batch', cb);
        })
      },
    }
  }
});

// plugins
const plugins = [
  async (store) => {
    const topic = await crypto.subtle.digest(
      "SHA-256",
      ArrayBufferFromString(STORAGE_KEY)
    );
    const swarm = hyperswarm(/* { bootstrap: ['ws://192.168.29.7:4977'], } */);
    const dedupeId = crypto.getRandomValues(new Uint32Array(32));
    const core = kappa(rai(STORAGE_KEY + "-kappa"), { valueEncoding: "json" });
    window.core = core;
    core.use("kv", kvView);
    core.writer("local", function (err, feed) {
      swarm.join(Buffer(topic), { lookup: true, announce: true });
      swarm.on("connection", function (connection, info) {
        console.log("blah");
        connection.write(dedupeId);
        connection.once("data", function (id) {
          const dupe = info.deduplicate(dedupeId, id);
          console.log(dupe ? "[Dupe peer dropped]" : "[New peer connected!]");
          pump(
            connection,
            core.replicate(info.client, { live: true }),
            connection
          );
        });
      });
      swarm.on("updated", () => {
        console.log("Updated");
      });

      store.subscribe(({ type, payload }, state) => {
        if (type === "receiveData") {
          return;
        }
        const todoId = payload.todo.id;
        const todo = state.todos.find((t) => t.id === todoId);
        feed.append({
          type,
          timestamp: new Date().toISOString(),
          ...todo
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
      });
    });
  },
];

export default createStore({
  state,
  mutations,
  actions,
  plugins,
});
