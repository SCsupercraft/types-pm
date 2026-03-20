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
   * The block who created this frame.
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

  next(): string;
}
