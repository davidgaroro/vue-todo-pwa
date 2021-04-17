<template>
  <h1 class="text-primary mt-5 mb-4">TODOS</h1>
  <input
    class="form-control form-control-lg mb-3"
    type="text"
    autofocus
    autocomplete="off"
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
          :checked="allChecked"
          @change="toggleAll(!allChecked)"
        />
        <span class="text-secondary px-1">
          {{ remaining }} {{ pluralize(remaining, "item") }} left
        </span>
      </div>
      <nav class="nav">
        <ul class="nav">
          <li class="nav-item" v-for="(val, key) in filters" :key="key">
            <a
              class="nav-link px-2 py-1"
              :href="'#/' + key"
              :class="{ 'link-secondary': visibility !== key }"
              @click="visibility = key"
              >{{ capitalize(key) }}
            </a>
          </li>
        </ul>
      </nav>
    </li>
    <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
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
import { ref, computed } from "vue";
import { useStore } from "vuex";
import TodoItem from "@/components/TodoItem.composition.vue";

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.done),
  completed: (todos) => todos.filter((todo) => todo.done),
};

export default {
  name: "Home",
  props: {
    filter: String,
  },
  components: {
    TodoItem,
  },
  setup(props) {
    const store = useStore();

    // data
    const visibility = ref(props.filter);

    // computed
    const todos = computed(() => store.state.todos);
    const allChecked = computed(() => todos.value.every((todo) => todo.done));
    const filteredTodos = computed(() =>
      filters[visibility.value](todos.value)
    );
    const remaining = computed(
      () => todos.value.filter((todo) => !todo.done).length
    );

    // vuex store access
    const toggleAll = (todo) => store.dispatch("toggleAll", todo);
    const clearCompleted = () => store.dispatch("clearCompleted");

    // methods
    function addTodo(e) {
      const text = e.target.value.trim();
      if (text) {
        store.dispatch("addTodo", text);
        e.target.value = "";
      }
    }

    const pluralize = (n, w) => (n === 1 ? w : w + "s");
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // expose to template
    return {
      //data
      visibility,
      filters,
      // computed
      todos,
      allChecked,
      filteredTodos,
      remaining,
      // vuex actions
      toggleAll,
      clearCompleted,
      // methods
      addTodo,
      pluralize,
      capitalize,
    };
  },
};
</script>

<style lang="scss">
.form-check-input {
  cursor: pointer;
}
</style>
