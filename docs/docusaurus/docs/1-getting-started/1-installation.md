# Installation

Let's create a `the-world-engine` project with typescript and webpack dev server.

## Create a new npm project

Let's create a folder where you want it and type the following command

```bash
npm init -y
```

paste the following boilerplate files in the src folder

```html title="./src/index.html"
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>my game</title>
    <style>
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
    <link rel="icon" href="data:,">
</head>

<body>
</body>

</html>
```

```typescript title="./src/index.ts"
console.log("Hello World");

export{};
```

## Install typescript

for install [typescript](https://www.npmjs.com/package/typescript)

```bash
npm install -D typescript
```

then create `./tsconfig.json`

```json title="./tsconfig.json"
{
    "compilerOptions": {
        "target": "ES2018",
        "lib": [
            "dom",
            "dom.iterable",
            "esnext"
        ],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
    },
    "include": [
      "src"
    ]
}

```

## Webpack setup

we use [webpack](https://webpack.js.org/) for serving our game.

for installing webpack and its plugins:

```bash
npm install -D webpack webpack-cli webpack-dev-server ts-loader html-webpack-plugin
```

create `./webpack.config.js`

```js title="./webpack.config.js"
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.js",
        assetModuleFilename: "asset/[name][ext]"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader"
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: "asset"
            }
        ],
    },
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"],
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    devServer: {
        host: "localhost",
        port: 5500
    },
    mode: "development"
};
```

add scripts to package.json

```json title="./package.json"
{
    //...
    "scripts": {
        "start": "webpack serve --mode development",
        "watch": "webpack --watch",
        "build": "webpack --mode production"
    },
    //...
}
```

## Install the-world-engine

you can install the-world-engine with npm:

```bash
npm install the-world-engine
```

For compatibility of three js, the basic math types use the three js types like `Vector3`, `Quaternion`, `Matrix4` and `Euler`.

However, there is no need to install three.js separately because there is a dependency in three.js (It would have already been installed together)

## Congrats!

![console-hello-world](/img/1-getting-started/1-installation/console-hello-world.png)

The development environment is now complete. We can finally start developing our game.


:::tip info
Installing webpack or typescript is not mandatory

For example, for a project created with a `create-react-app`, just the `npm install the-world-engine` is ready for development
:::
