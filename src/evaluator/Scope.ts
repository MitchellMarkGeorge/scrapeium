export class Scope {
  private parentScope: Scope | null;
  private values: Map<string, Element | string >;

  constructor(parentScope: Scope | null) {
    this.parentScope = parentScope;
    this.values = new Map<string, Element | string >();
  }

  setValue(variable: string, value: Element | string) {
    this.values.set(variable, value);
  }

  // think about this
  getValue(variable: string): Element | string  {
    if (this.values.has(variable)) {
      return this.values.get(variable) as NonNullable<
        Element | string 
      >; // cant return undefined
    }

    if (this.parentScope) {
      // this method is recursive and will go until it reaches the "top scope"
      return this.parentScope.getValue(variable);
    }

    throw new Error(`Undefined variable "${variable}"`);
  }
}
