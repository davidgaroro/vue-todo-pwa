<template>
  <h1 class="mt-5 mb-4 text-primary">TODOS</h1>
  <input
    class="form-control form-control-lg mb-3"
    type="text"
    autofocus
    autocomplete="off"
    aria-label="New todo text"
    placeholder="What needs to be done?"
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
  data() {
    return {
      todos: [
        { id: 1, text: "Learn JavaScript", done: true },
        { id: 2, text: "Learn Vue 3", done: true },
        { id: 3, text: "Learn Bootstrap 5", done: false },
        { id: 4, text: "Build something awesome!", done: false },
      ],
    };
  },
};
</script>
