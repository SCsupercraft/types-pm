// Type definitions for the scratch-vm's compiler
// Project: https://github.com/LLK/scratch-vm

/**
 * A frame contains some information about the current substack being compiled.
 */
export class Frame {
  /**
   * Whether the current stack runs in a loop (while, for)
   */
  public readonly isLoop: boolean;
  /**
   * Whether the current block is the last block in the stack.
   */
  public readonly isLastBlock: boolean;
  public readonly overrideLoop: boolean;
  /**
   * The complete opcode of the block which created this frame.
   */
  public readonly parent: string;
  /**
   * Contains important context for compiling blocks,
   * use the `assignData` method to modify it.
   */
  public readonly importantData: {
    [key: string]: any;
    parents: string[];
    containedByLoop: boolean;
    containedByCase: boolean;
  };

  /**
   * Creates a new frame.
   *
   * @param isLoop       whether the current stack runs in a loop (while, for)
   * @param parentKind   the parent block's complete opcode - [EXTENSION_ID].[OPCODE]
   * @param overrideLoop defaults to `false`
   */
  constructor(isLoop: boolean, parentKind: string, overrideLoop?: boolean);

  /**
   * Assigns data from the provided object.
   *
   * @param obj the object
   */
  assignData(obj: { [key: string]: any } | Frame): void;
}

interface Input {
  asNumber(): string;
  asNumberOrNaN(): string;
  asString(): string;
  asBoolean(): string;
  asColor(): string;
  asUnknown(): string;
  asSafe(): string;
  isAlwaysNumber(): boolean;
  isAlwaysNumberOrNaN(): boolean;
  isNeverNumber(): boolean;
}

export class TypedInput implements Input {
  public readonly source: string;
  public readonly type: 1 | 2 | 3 | 4 | 5;

  constructor(source: string, type: 1 | 2 | 3 | 4 | 5);

  asNumber(): string;
  asNumberOrNaN(): string;
  asString(): string;
  asBoolean(): string;
  asColor(): string;
  asUnknown(): string;
  asSafe(): string;
  isAlwaysNumber(): boolean;
  isAlwaysNumberOrNaN(): boolean;
  isNeverNumber(): boolean;
}

export class ConstantInput implements Input {
  public readonly constantValue: string;
  public readonly safe: BarProp;

  constructor(constantValue: string, safe: boolean);

  asNumber(): string;
  asNumberOrNaN(): string;
  asString(): string;
  asBoolean(): string;
  asColor(): string;
  asUnknown(): string;
  asSafe(): string;
  isAlwaysNumber(): boolean;
  isAlwaysNumberOrNaN(): boolean;
  isNeverNumber(): boolean;
}

export class VariableInput implements Input {
  public readonly source: string;
  public readonly type: 1 | 2 | 3 | 4 | 5;

  constructor(source: string);

  /**
   * Sets the input this variable was most recently set to.
   *
   * @param input the input
   */
  setInput(input: Input): void;

  asNumber(): string;
  asNumberOrNaN(): string;
  asString(): string;
  asBoolean(): string;
  asColor(): string;
  asUnknown(): string;
  asSafe(): string;
  isAlwaysNumber(): boolean;
  isAlwaysNumberOrNaN(): boolean;
  isNeverNumber(): boolean;
}

export class VariablePool {
  /**
   * Creates a new variable pool.
   *
   * @param prefix the prefix at the start of the variable name,
   *               can't be empty
   */
  constructor(prefix: string);

  /**
   * Gets a new unique variable name.
   */
  next(): string;
}

/**
 * Imports passed from the js generator.
 */
export type JSGeneratorImports = {
  Frame: typeof Frame;
  TypedInput: typeof TypedInput;
  VariableInput: typeof VariableInput;
  ConstantInput: typeof ConstantInput;
  VariablePool: typeof VariablePool;

  /**
   * A number.
   *
   * If there as a possibility of this being `NaN`, use `TYPE_NUMBER_NAN` instead.
   */
  TYPE_NUMBER: 1;
  /**
   * A string.
   */
  TYPE_STRING: 2;
  /**
   * A boolean.
   */
  TYPE_BOOLEAN: 3;
  /**
   * A type unknown at compile-time or a type that
   * doesn't match any of the other types.
   */
  TYPE_UNKNOWN: 4;
  /**
   * A type that is either a number or `NaN`.
   */
  TYPE_NUMBER_NAN: 5;
};

export class JSGenerator {
  /**
   * The compiled javascript code.
   */
  public source: string;

  /**
   * A variable pool.
   *
   * You should only use variable names created by this variable pool.
   * @example
   * js: {
   *   myBlock: (node, compiler, imports) => {
   *     const variable = compiler.localVariables.next();
   *     compiler.source += `const ${variable} = 3;`;
   *     compiler.source += `console.log(${variable});`;
   *   },
   * },
   */
  public readonly localVariables: VariablePool;

  public readonly variableInputs: {
    [key: string]: VariableInput;
  };

  /**
   * Stack of frames, most recent is last item.
   */
  public readonly frames: ReadonlyArray<Frame>;

  /**
   * The current frame.
   */
  public readonly currentFrame: Frame;

  /**
   * Enter a new frame.
   *
   * @param {Frame} frame the new frame
   */
  pushFrame(frame: Frame): void;

  /**
   * Exit the current frame.
   */
  popFrame(): void;

  /**
   * Checks if the current block is the last command block of a loop
   *
   * @returns true if the current block is the last command of a loop
   */
  isLastBlockInLoop(): boolean;

  /**
   * Compiles an input.
   *
   * @param node the input node to compile.
   * @param visualReport if this is being called to get visual reporter content, defaults to `false`
   * @returns the compiled input
   */
  descendInput(node: object, visualReport?: boolean): Input;

  /**
   * Compiles a block.
   *
   * @param node the stacked node to compile
   */
  descendStackedBlock(node: object): void;

  /**
   * Compiles a stack/substack.
   *
   * @param nodes the nodes within a stack
   * @param frame the frame
   */
  descendStack(nodes: object[], frame: Frame): void;

  /**
   * Compile a record of input objects into a safe JS string.
   *
   * @param inputs the record to descend
   * @returns the stringified result
   */
  descendInputRecord(inputs: Record<string, unknown>): string;

  descendVariable(variable: VM.Variable): VariableInput;

  referenceVariable(variable: VM.Variable): string;

  retire(): void;

  yieldLoop(): void;

  /**
   * Write JS to yield the current thread if warp mode is disabled.
   */
  yieldNotWarp(): void;

  /**
   * Write JS to yield the current thread if warp mode is disabled or if the script seems to be stuck.
   */
  yieldStuckOrNotWarp(): void;

  yielded(): void;

  /**
   * Write JS to request a redraw.
   */
  requestRedraw(): void;

  /**
   * Generate a call into the compatibility layer.
   *
   * @param node The "compat" kind node to generate from.
   * @param setFlags Whether flags should be set describing how this function was processed.
   * @param frameName Name of the stack frame variable, if any
   * @param visualReport if this is being called to get visual reporter content
   * @returns The JS of the call.
   */
  generateCompatibilityLayerCall(
    node: any,
    setFlags: boolean,
    frameName: string | never,
    visualReport: boolean,
  ): string;

  /**
   * Creates a new constant variable with its value returned by the source code.
   * This variable is defined at the start of the compiled script.
   *
   * The name of the variable is then returned by this method.
   *
   * @param source the source code for the variable
   * @returns the name of the constant variable
   */
  evaluateOnce(source: string): string;
}
