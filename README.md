# Type definitions for PenguinMod

This is a fork of [@turbowarp/types-tw](https://github.com/TurboWarp/types-tw) with additional types for PenguinMod.

A possibly more human-readable version of the TypeScript definitions can be found at: https://scsupercraft.github.io/types-pm/

Install with:

```
npm install penguinmod-types@git+https://github.com/SCsupercraft/types-pm.git#pm
```

Next, you must use `tsconfig.json` to configure TypeScript to know how to find the types.

```json5
{
  "compilerOptions": {
    // If you use require() or "module": "CommonJS", remove these lines.
    // If you use "module": "ES6", synthetic default imports are required.
    "module": "ES6",
    "allowSyntheticDefaultImports": true,

    // Tell TypeScript where to find the types for Scratch libraries.
    "paths": {
      "scratch-vm": ["./node_modules/penguinmod-types/index.d.ts"],
      "scratch-render": ["./node_modules/penguinmod-types/index.d.ts"],
      "scratch-svg-renderer": ["./node_modules/penguinmod-types/index.d.ts"],
      "scratch-render-fonts": ["./node_modules/penguinmod-types/index.d.ts"],
      "scratch-storage": ["./node_modules/penguinmod-types/index.d.ts"],
      "scratch-audio": ["./node_modules/penguinmod-types/index.d.ts"],
      "scratch-parser": ["./node_modules/penguinmod-types/index.d.ts"],
      "scratch-blocks": ["./node_modules/penguinmod-types/index.d.ts"]
    },

    // Recommended strictness settings. Change as you please.
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitThis": true
  }
}
```

For PenguinMod extensions add the following in your `tsconfig.json` file to get access to the `Scratch` global object:

```json5
{
  "include": ["./node_modules/penguinmod-types/types/scratch-vm-extension.d.ts"]
}
```

Then in your JavaScript or TypeScript:

```js
import VM from 'scratch-vm';
const vm = new VM();
vm.loadProject(/* read a project somehow */ new ArrayBuffer(100)).then(() => {
  vm.start();
  vm.greenFlag();
});
```

Or if you still use require():

```js
const VM = require('scratch-vm');
const vm = new VM();
vm.loadProject(/* read a project somehow */ new ArrayBuffer(100)).then(() => {
  vm.start();
  vm.greenFlag();
});
```

## Tests

There are some tests in the `tests` folder. These files are never actually run, but the code will be type checked.

## License

Type definitions and test code are licensed under the Apache 2.0 license.

The libraries being documented may be under different licenses.
