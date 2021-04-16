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

export default createStore({
  state,
  mutations: {},
  actions: {},
  modules: {},
});
