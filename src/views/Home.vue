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
  <ul class="list-group mb-3" v-show="todos.length">
    <li
      class="list-group-item d-flex justify-content-between align-items-center"
    >
      <div>
        <input
          class="form-check-input me-3"
          type="checkbox"
          aria-label="Select all"
          :checked="allChecked"
          @change="toggleAll(!allChecked)"
        />
        <strong>{{ remaining }}</strong>
        {{ pluralize(remaining, "item") }} left
      </div>
    </li>
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
    allChecked() {
      return this.todos.every((todo) => todo.done);
    },
    remaining() {
      return this.todos.filter((todo) => !todo.done).length;
    },
  },
  methods: {
    ...mapActions(["toggleAll", "clearCompleted"]),
    addTodo(e) {
      const text = e.target.value;
      if (text.trim()) {
        // Add new todo
        this.$store.dispatch("addTodo", text);

        // Clear input text
        e.target.value = "";
      }
    },
    pluralize(n, w) {
      return n === 1 ? w : w + "s";
    },
  },
};
</script>

<style lang="scss">
.form-check-input {
  cursor: pointer;
}
</style>
