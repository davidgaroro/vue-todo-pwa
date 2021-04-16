<template>
  <h1 class="mt-5 mb-4 text-primary">TODOS</h1>
  <input
    class="form-control form-control-lg mb-3"
    type="text"
    autofocus
    autocomplete="off"
    aria-label="New todo text"
    placeholder="What needs to be done?"
    @keyup.enter="addTodo"
  />
  <ul class="list-group mb-2" v-show="todos.length">
    <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
  </ul>
  <button
    type="button"
    class="btn btn-primary w-100"
    v-show="todos.length > remaining"
    @click="clearCompleted"
  >
    Clear completed
  </button>
</template>

<script>
import { mapActions } from "vuex";
import TodoItem from "@/components/TodoItem.vue";

export default {
  name: "Home",
  components: {
    TodoItem,
  },
  computed: {
    todos() {
      return this.$store.state.todos;
    },
    remaining() {
      return this.todos.filter((todo) => !todo.done).length;
    },
  },
  methods: {
    ...mapActions(["clearCompleted"]),
    addTodo(e) {
      const text = e.target.value;
      if (text.trim()) {
        // Add new todo
        this.$store.dispatch("addTodo", text);

        // Clear input text
        e.target.value = "";
      }
    },
  },
};
</script>
