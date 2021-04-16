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

  clearCompleted({ state, commit }) {
    state.todos
      .filter((todo) => todo.done)
      .forEach((todo) => {
        commit("removeTodo", todo);
      });
  },
};

export default createStore({
  state,
  mutations,
  actions,
  modules: {},
});
