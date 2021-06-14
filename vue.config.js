const webpack = require("webpack");
const path = require("path");

module.exports = {
  pwa: {
    themeColor: "#0D6EFD",
    manifestOptions: {
      short_name: "vue-todo",
    },
  },
  devServer: {
    allowedHosts: [".ngrok.io", "localhost", "192.168.20.7"],
    https: true,
  },
  configureWebpack: {
    node: {
      Buffer: false,
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: [
          path.join(__dirname, "node_modules/buffer/index.js"),
          "Buffer",
        ],
      }),
    ],
  },
};
