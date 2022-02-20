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
        test: /\.tsx?$/,
        use: [
          { 
            loader: 'ts-loader' 
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
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
    host: "0.0.0.0",
    port: 20310,
    allowedHosts: [
      "nonamehome.iptime.org",
    ],
    client: {
      logging: "none",
    },
  },
  mode: "development",
};
