const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: "./src/test/index.ts",
  output: {
    path: path.join(__dirname, "/testbundle"),
    filename: "bundle.js",
    assetModuleFilename: 'images/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.png/,
        type: 'asset',
      }
    ],
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/test/index.html",
    }),
    new ESLintPlugin({
      extensions: 'ts',
    }),
  ],
  devServer: {
    host: "localhost",
    port: 5500,
  },
  mode: "development",
};
