import { createStore } from "vuex";
import kappaPlugin from "./kappa-plugin";

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

// plugins
const plugins = [kappaPlugin];

export default createStore({
  state,
  mutations,
  actions,
  plugins,
});
