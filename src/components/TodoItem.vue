<template>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <input
        class="form-check-input me-3"
        type="checkbox"
        :checked="todo.done"
        @change="toggleTodo(todo)"
      />
    </div>
    <input
      class="form-control form-control-plaintext p-1"
      :class="{ 'text-primary': todo.done }"
      type="text"
      :value="todo.text"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    />
    <button
      type="button"
      class="btn-close btn-sm ms-2"
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
