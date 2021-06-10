import { createStore } from "vuex";
import kappa from "kappa-core";
// import raw from "random-access-web";
import rai from "random-access-idb";
// import hyperswarm from "hyperswarm-web";
// import pump from "pump";
import list from "kappa-view-list";
import level from "level";
// import delay from "lodash/delay";

const STORAGE_KEY = "vue-todo-pwa";

const defaultTodos = [
  { id: 1, text: "Learn JavaScript", done: true },
  { id: 2, text: "Learn Vue 3", done: true },
  { id: 3, text: "Learn Bootstrap 5", done: false },
  { id: 4, text: "Build something awesome!", done: false },
];

// initial state
const state = {
  todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defaultTodos,
};

// mutations
const mutations = {
  addTodo(state, todo) {
    state.todos.push(todo);
  },

  removeTodo(state, todo) {
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
};

// actions
const actions = {
  addTodo({ commit }, text) {
    commit("addTodo", {
      id: Date.now(),
      text,
      done: false,
    });
  },

  removeTodo({ commit }, todo) {
    commit("removeTodo", todo);
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
        commit("removeTodo", todo);
      });
  },
};

// const topic = crypto.subtle.digest("SHA-256", STORAGE_KEY);
// const swarm = hyperswarm()
// const dedupeId = crypto.getRandomValues(new Uint32Array(32));

const timestampView = list(level("vue-todo-level"), function (msg, next) {
  if (msg.value.timestamp && typeof msg.value.timestamp === "string") {
    // sort on the 'timestamp' field
    next(null, [msg.value.timestamp]);
  } else {
    next();
  }
});

// plugins
const plugins = [
  (store) => {
    store.subscribe((mutation, { todos }) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    });

    const core = kappa(rai("vue-todo-kappa"), { valueEncoding: "json" });
    window.core = core;
    core.use("chats", timestampView);
    core.writer("local", function (err, feed) {
      // swarm.join(topic, { lookup: true, announce: true })
      // swarm.on('connection', function (connection, info) {
      //   connection.write(dedupeId)
      //   connection.once('data', function (id) {
      //     const dupe = info.deduplicate(dedupeId, id)
      //     console.log(dupe ? '[Dupe peer dropped]' : '[New peer connected!]')
      //     pump(connection, core.replicate(info.client, { live: true }), connection)
      //   });
      // });
      // swarm.on('updated', () => {
      //   console.log("Updated");
      // });

      store.subscribe((mutation) => {
        feed.append({
          type: "mutation",
          mutation: mutation,
          timestamp: new Date().toISOString(),
        });
      });
    });

    core.ready(["chats"], function () {
      console.log("Ready");
      // Delay 300ms to catch up with remote
      // Get latest 10 messages
      core.api.chats.read({ limit: 10, reverse: true }, function (err, data) {
        if (data.length === 0) return;
        console.log("Recent messages:");
        for (let msg of data.reverse()) {
          console.log(msg.value.timestamp, msg.value.mutation, msg.key);
        }
      });
      // Listen for latest message.
      core.api.chats.tail(1, function (data) {
        for (let msg of data) {
          console.log(msg.value.timestamp, msg.value.mutation, msg.key)
        }
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
