# the-world-engine.ts
 three.js based, unity like game engine for browser.

[![npm](https://img.shields.io/npm/v/the-world-engine)](https://www.npmjs.com/package/the-world-engine) [![coverage](https://img.shields.io/codecov/c/github/The-World-Space/the-world-engine.ts/main)](https://app.codecov.io/gh/The-World-Space/the-world-engine.ts/) [![last commit](https://img.shields.io/github/last-commit/The-World-Space/the-world-engine.ts)](https://github.com/The-World-Space/the-world-engine.ts/commits/dev) [![language](https://img.shields.io/github/languages/top/The-World-Space/the-world-engine.ts)](https://www.typescriptlang.org/) [![license](https://img.shields.io/github/license/The-World-Space/the-world-engine.ts)](https://opensource.org/licenses/MIT)

```shell
npm i the-world-engine
```

#### [Demo](https://the-world-space.github.io/the-world-engine-examples/build/sans-fight-room/index.html)

![sans-fight-room](docs/image/sans-fight-room.png)

### Build your scene on Object hierarchy system

![build scene](docs/image/build_scene.gif)

### Scripting your component to attach GameObject
![write component](docs/image/write_component.gif)

## Component Features
#### Messages
- awake()
- start()
- update()
- onEnable()
- onDisable()
- onDestroy()

#### Others
- coroutine
- change script execution order
- require components
- disallow multiple components
  
  All features have a similar or same behavior to [Unity Game Engine](https://docs.unity3d.com/ScriptReference/MonoBehaviour.html).

## Examples
- [the-world-engine-examples](https://github.com/The-World-Space/the-world-engine-examples)
