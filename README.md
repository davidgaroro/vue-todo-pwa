# vue-todo-pwa

This project is a simple Todo [PWA] (Progressive Web App) based on the Vuex [TodoMVC] example.<br>
Perfect to learn the basics about [Vue 3], [Vuex] and [Bootstrap 5] technologies.

[pwa]: https://developers.google.com/web/progressive-web-apps
[todomvc]: https://github.com/vuejs/vuex/tree/4.0/examples
[vue 3]: https://v3.vuejs.org
[vuex]: https://next.vuex.vuejs.org
[bootstrap 5]: https://getbootstrap.com


<p align="center">
  <a href="https://davidgaroro.github.io/vue-todo-pwa" target="_blank" rel="noopener">
    <img src="https://i.imgur.com/2kAywUP.png"><br>
    Live Demo
  </a>
</p>

## Built With

### Dependencies

| Name           | Description                                          |     |
| -------------- | ---------------------------------------------------- | :-: |
| [Vue 3]        | Progressive JavaScript Framework                     | 🖖  |
| [Vuex 4]       | ️Centralized State Management for Vue.js             | 🗃️  |
| [Vue Router 4] | Official Router for Vue.js                           | 🚦  |
| [Vue CLI 4]    | ️Standard Tooling for Vue.js Development             | 🛠️  |
| [Bootstrap 5]  | The most popular HTML, CSS, and JavaScript framework | 📚  |

[vue 3]: https://v3.vuejs.org
[vuex 4]: https://next.vuex.vuejs.org
[vue router 4]: https://next.router.vuejs.org
[vue cli 4]: https://cli.vuejs.org
[bootstrap 5]: https://getbootstrap.com

## Vue Composition API (optional)

This project includes components with their alternate version made with the composition API.

> For more information on how to use Composition API, visit the [official documentation]

[official documentation]: https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api

### How to use the alternative component version

To toggle between classic or composition components you only have to comment or uncomment, or just edit the name component:

```js
<!-- router/index.js -->
  ...
  import Home from "../views/Home.vue"; // classic
  // import Home from "../views/Home.composition.vue"; // made with composition api
  ...
```

## Installation

### Clone repository

```
git clone https://github.com/davidgaroro/vue-todo-pwa.git
cd vue-todo-pwa
```

### Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

## Donation

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate?hosted_button_id=T7CVYXY994KHJ)

## License

[MIT](./LICENSE) &copy; davidgaroro
