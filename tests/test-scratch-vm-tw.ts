import VM from 'scratch-vm';
const vm = new VM();

vm.saveProjectSb3() as Promise<Blob>;
vm.saveProjectSb3('arraybuffer') as Promise<ArrayBuffer>;
vm.saveProjectSb3('uint8array') as Promise<Uint8Array>;
// @ts-expect-error
vm.saveProjectSb3('uint8array') as Promise<Blob>;

vm.saveProjectSb3Stream() as JSZip.StreamHelper<'arraybuffer'>;
vm.saveProjectSb3Stream('blob') as JSZip.StreamHelper<'blob'>;

vm.setStageSize(480, 360);

const Sprite = vm.exports.Sprite;
const RenderedTarget = vm.exports.RenderedTarget;
const sprite = new Sprite(null, vm.runtime);
const target = new RenderedTarget(sprite, vm.runtime);
target.setXY(10, 10);

Scratch.translate('enter AR mode') as string;
Scratch.translate(
  {
    id: 'test1',
    default: 'Message 1: {var}',
    description: 'Description',
  },
  {
    var: 'test',
  },
) as string;
Scratch.translate({
  id: 'sync',
  default: 'Change the location of [STR] to [STR2]',
}) as string;

Scratch.translate.setup({
  it: {
    addValueInList: 'xyz [VALUE] fgh [LIST]',
    clearList: '!!! [LIST]',
  },
  'zh-cn': {
    copyList: 'aaa [LIST1] bbb [LIST2]',
    name: 'ccc',
  },
});

target.extensionStorage['stretch'] = '';
target.extensionStorage['stretch'] = ['a'];
target.extensionStorage['stretch'] = { b: 'a' };
target.extensionStorage['stretch'] = [
  {
    b: [
      1,
      true,
      false,
      null,
      'a',
      [
        {
          a: {
            b: 'c',
          },
        },
      ],
    ],
  },
];
vm.runtime.extensionStorage['a'] = 'b';

const promptResult = prompt('what is your name');
promptResult as Promise<string>;
promptResult as Promise<null>;
promptResult as string;
promptResult as null;

class CustomType implements VM.SerializableCustomType<'myType'> {
  customId: 'myType' = 'myType';

  toString(): string {
    return '<MyType>';
  }
}

vm.runtime.registerSerializer<CustomType, 'myType'>(
  'myType',
  (type) => {
    return {};
  },
  (data) => {
    return new CustomType();
  },
);

vm.runtime.registerCompiledExtensionBlocks('myExtension', {
  ir: {
    myBlock: (generator, block) => {
      return { arg: {} };
    },
  },
  js: {
    myBlock: (node, compiler, imports) => {
      const frame = new imports.Frame(false, 'myBlock');

      compiler.pushFrame(frame);

      compiler.descendInput(node.arg).asUnknown();

      const variable = compiler.localVariables.next();
      compiler.source += `const ${variable} = 3;`;
      compiler.source += `console.log(${variable});`;

      compiler.popFrame();

      return new imports.TypedInput('5', imports.TYPE_NUMBER);
    },
  },
});
