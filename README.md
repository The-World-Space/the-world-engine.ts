# the-world-engine.ts
three.js based, unity like game engine for browser.

[![npm](https://img.shields.io/npm/v/the-world-engine)](https://www.npmjs.com/package/the-world-engine) [![coverage](https://img.shields.io/codecov/c/github/The-World-Space/the-world-engine.ts/main)](https://app.codecov.io/gh/The-World-Space/the-world-engine.ts/) [![last commit](https://img.shields.io/github/last-commit/The-World-Space/the-world-engine.ts)](https://github.com/The-World-Space/the-world-engine.ts/commits/dev) [![language](https://img.shields.io/github/languages/top/The-World-Space/the-world-engine.ts)](https://www.typescriptlang.org/) [![license](https://img.shields.io/github/license/The-World-Space/the-world-engine.ts)](https://opensource.org/licenses/MIT)

## npm
Simply install `the-world-engine`, and the `three` and `@types/three` in peer-dependency will be installed together.
```shell
npm i the-world-engine
```

## CDN
There are umd builds available right from your browser.
the-world-engine is based on typescripts, so there are few runtime checks, so it is not recommended to use umd build if possible.

- <https://unpkg.com/js-sdsl/dist/umd/twengine.min.js>
- <https://unpkg.com/js-sdsl/dist/umd/twengine.js>

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="icon" href="data:,">
    <style> html, body { height: 100%; margin: 0; } </style>
    <script src="https://cdn.jsdelivr.net/npm/three/build/three.min.js"></script>
    <script src="https://unpkg.com/js-sdsl/dist/umd/twengine.min.js"></script>
</head>

<body>
    <script>
        const game = new TWE.Game(document.body);
        game.run(class extends TWE.Bootstrapper {
            run() {
                const instantiater = this.instantiater;
                return this.sceneBuilder
                    .withChild(instantiater.buildGameObject("camera")
                        .withComponent(TWE.Camera))
                    .withChild(instantiater.buildGameObject("sprite")
                        .withComponent(TWE.CssSpriteRenderer));
            }
        });
        game.inputHandler.startHandleEvents();
    </script>
</body>

</html>
```

#### [Demo](https://the-world-space.github.io/the-world-engine-examples/build/sans-fight-room/index.html)

![sans-fight-room](docs/image/sans-fight-room.png)

### Build your scene on Object hierarchy system

![build scene](docs/image/build_scene.gif)

### Scripting your component to attach GameObject

![write component](docs/image/write_component.gif)

## Examples

- [the-world-engine-examples](https://github.com/The-World-Space/the-world-engine-examples)

## Documentation

- [Documentation](https://the-world-space.github.io/the-world-engine.ts/build) - I'm still working on it

## Contributers

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://zly201.github.io"><img src="https://avatars.githubusercontent.com/u/59038614?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Zilong Yao</b></sub></a><br /><a href="https://github.com/The-World-Space/the-world-engine.ts/commits?author=ZLY201" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributing

Please see the [Contributing Guidelines](./CONTRIBUTING.md) for guidelines on how to contribute to the project.
