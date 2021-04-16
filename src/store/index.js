import { createStore } from "vuex";

// initial state
const state = {
  todos: [
    { id: 1, text: "Learn JavaScript", done: true },
    { id: 2, text: "Learn Vue 3", done: true },
    { id: 3, text: "Learn Bootstrap 5", done: false },
    { id: 4, text: "Build something awesome!", done: false },
  ],
};

// mutations
const mutations = {
  addTodo(state, todo) {
    state.todos.push(todo);
  },

  removeTodo(state, todo) {
    state.todos.splice(state.todos.indexOf(todo), 1);
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
};

export default createStore({
  state,
  mutations,
  actions,
  modules: {},
});
