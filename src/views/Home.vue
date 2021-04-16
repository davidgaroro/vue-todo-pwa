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
  <ul class="list-group">
    <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
  </ul>
</template>

<script>
// @ is an alias to /src
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
  },
  methods: {
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
