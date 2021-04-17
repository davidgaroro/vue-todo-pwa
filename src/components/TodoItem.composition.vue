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
import { useStore } from "vuex";

export default {
  name: "TodoItem",
  props: {
    todo: Object,
  },
  setup(props) {
    // vuex store access
    const store = useStore();
    const toggleTodo = (todo) => store.dispatch("toggleTodo", todo);
    const editTodo = (todo) => store.dispatch("editTodo", todo);
    const removeTodo = (todo) => store.dispatch("removeTodo", todo);

    // methods
    function doneEdit(e) {
      const value = e.target.value.trim();
      const todo = props.todo;
      if (!value) {
        removeTodo(todo);
      } else {
        editTodo({
          todo,
          value,
        });
      }
    }

    function cancelEdit(e) {
      e.target.blur();
    }

    // expose to template
    return {
      toggleTodo,
      removeTodo,
      doneEdit,
      cancelEdit,
    };
  },
};
</script>
