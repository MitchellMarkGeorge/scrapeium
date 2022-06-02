import { Primitive } from '../parser/types';

export class Scope {
  private parentScope: Scope | null;
  private values: Map<string, Primitive>;

  constructor(parentScope: Scope | null) {
    this.parentScope = parentScope;
    this.values = new Map<string, Primitive>();
  }

  // make varible type a union of values?
  setValue(variable: string, value: Primitive) {
    this.values.set(variable, value);
  }

  // think about this
  getValue(variable: string): Primitive {
    if (this.values.has(variable)) {
      return this.values.get(variable) as NonNullable<Primitive>; // cant return undefined
    }

    if (this.parentScope) {
      // this method is recursive and will go until it reaches the "top scope"
      return this.parentScope.getValue(variable);
    }

    throw new Error(`Undefined variable "${variable}"`); // might have to retun null in this case in order to get the line number
  }
}
