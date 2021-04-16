<template>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <div class="my-auto">
      <input
        class="form-check-input me-3"
        type="checkbox"
        aria-label="Todo checkbox"
        :checked="todo.done"
        @change="toggleTodo(todo)"
      />
    </div>
    <input
      class="form-control form-control-plaintext p-1"
      type="text"
      aria-label="Todo text"
      :value="todo.text"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    />
    <button
      type="button"
      class="btn-close btn-sm ms-2"
      aria-label="Remove todo"
      @click="removeTodo(todo)"
    ></button>
  </li>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "TodoItem",
  props: {
    todo: Object,
  },
  methods: {
    ...mapActions(["toggleTodo", "editTodo", "removeTodo"]),
    doneEdit(e) {
      const value = e.target.value.trim();
      const todo = this.todo;
      if (!value) {
        this.removeTodo(todo);
      } else {
        this.editTodo({
          todo,
          value,
        });
      }
    },
    cancelEdit(e) {
      e.target.blur();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.form-check-input {
  cursor: pointer;
}
</style>
