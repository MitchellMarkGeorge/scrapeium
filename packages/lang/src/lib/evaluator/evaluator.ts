import { Primitive, Query } from "../parser/types";
import {
  Block,
  BlockType,
  ObjectBlock,
  ArrayBlock,
  ExpressionBlock,
  BlockPrefix,
} from "../parser/types/blocks";
import {
  QueryStatement,
  ReadAttributeStatement,
  ReadStatement,
  SelectChildStatement,
  SelectStatement,
  Statement,
  StatementType,
  ToNumberStatement,
} from "../parser/types/statements";
import { Scope } from "./Scope";
import {
  ArrayBlockResult,
  ExpressionBlockResult,
  BlockResult,
  ObjectBlockResult,
  ResultType,
} from "./types";

// can test this locally by using test html files
export class Evaluator {
  private query: Query

  /**
   * Evaluator class for Scrapeium (tree-walking interpreter)
   * @param query root node of AST (from Parser)
   */
  constructor(query: Query) {
    this.query = query;
    // this.document = document;
  }

  public eval(document: Document): ResultType {
    const { rootBlock } = this.query;
    const scope = new Scope(null);
    this.defineVariables(document.documentElement, scope)
    // TODO replace all this.document.querySelector/querySelectorAll to use element
    // this way, selector quering can be based on the decendants, and the children of a block prefix only 
    // operate under the context of selected element/elements, not the entire document
    // this is the same for each subsequent scope (and travels back up)
    // the default :element is the document element
    return {
      result: this.evalBlock(rootBlock, scope),
    };
  }

  private evalBlock(block: Block, scope: Scope): BlockResult {
    switch (block.type) {
      case BlockType.ARRAY_BLOCK:
        // do i have to type cast??
        return this.evalArrayBlock(block as ArrayBlock, scope);

      case BlockType.OBJECT_BLOCK:
        return this.evalObjectBlock(block as ObjectBlock, scope);

      case BlockType.EXPRESSION_BLOCK:
        return this.evalExpressionBlock(block as ExpressionBlock, scope);
    }
  }

  private evalBlockPrefix(block: BlockPrefix, scope: Scope) {
    // this method essentially "mutates" or changes the given scope and returns nuthong
    const selector = block.value;
    const parentElement = scope.getValue("element") as Element;

    const selectedElement = parentElement.querySelector(selector);
    if (!selectedElement) {
      throw new Error(`No descendant element matches selector "${selector}"`);
    } else {
      this.defineVariables(selectedElement, scope);
    }

    // handdle if null or undefines
    // set the :element value of the given scope
    // and all of the assocciated variables with it (next sibling, innerText, etc)
  }

  private evalArrayBlockPrefix(block: BlockPrefix, scope: Scope) {
    const selector = block.value;
    const parentElement = scope.getValue("element") as Element

    const elements = parentElement.querySelectorAll(selector);
    if (elements.length === 0) {
      throw new Error(`No descendant elements match selector "${selector}"`);
    }
    // just return it rather than trying to put it in scope
    return elements;
  }

  private defineVariables(element: Element, scope: Scope) {
    scope.setValue("element", element); //
    if (element.firstElementChild) {
      scope.setValue("first_child", element.firstElementChild);
    }
    if (element.lastElementChild) {
      scope.setValue("last_child", element.lastElementChild);
    }

    if (element.nextElementSibling) {
      scope.setValue("next_sibling", element.nextElementSibling);
    }
    if (element.previousElementSibling) {
      scope.setValue("previous_sibling", element.previousElementSibling);
    }

    if (element.innerHTML) {
      // could be an empty string
      scope.setValue("inner_html", element.innerHTML);
    }
    if (element.id) {
      // could be an empty string
      scope.setValue("id", element.id);
    }

    if (element.className) {
      // could be an empty string
      scope.setValue("class", element.className);
    }

    if ((element as HTMLElement).innerText) {
      // could be an empty string
      scope.setValue("inner_text", (element as HTMLElement).innerText);
    }

    if (element.textContent) {
      scope.setValue("text_content", element.textContent);
    }
  }

  private evalArrayBlock(block: ArrayBlock, scope: Scope): ArrayBlockResult {
    // evaluate block prefix (for this one, select all)
    const elements = this.evalArrayBlockPrefix(block.blockPrefix, scope);
    // const elements = scope.getValue("elements") as NodeListOf<Element>;
    const result: ArrayBlockResult = [];
    const body = block.body;

    elements.forEach((element, count) => {
      // a new scope is only created when entering new sub blocks (and they extend the current block)
      const newScope = new Scope(scope);
      this.defineVariables(element, newScope); // define the element and all its values for the subblocks
      // basically the same block being "ececuted" multiple times, but with a different element context
      newScope.setValue("count", count.toString());
      // TODO technically uneccesary as the the body type will always be the same
      // have different methods for each type?
      if (body.type === BlockType.OBJECT_BLOCK) {
        result.push(this.evalObjectBlock(body as ObjectBlock, newScope));
      } else if (body.type === BlockType.EXPRESSION_BLOCK) {
        result.push(
          this.evalExpressionBlock(body as ExpressionBlock, newScope),
        );
      }
    });

    return result;
  }
  private evalObjectBlock(block: ObjectBlock, scope: Scope): ObjectBlockResult {
    if (block.blockPrefix) {
      this.evalBlockPrefix(block.blockPrefix, scope);
    }

    const result: ObjectBlockResult = {};

    block.body.forEach((keyValue) => {
      const { key, value } = keyValue;
      const newScope = new Scope(scope); // shold it
      result[key] = this.evalBlock(value, newScope);
    });

    return result;
  }
  private evalExpressionBlock(
    block: ExpressionBlock,
    scope: Scope,
  ): ExpressionBlockResult {
    // should expression blocks have thier own scope
    // can only be altered using the block prefix and the statements it evaluates
    const newScope = new Scope(scope);
    if (block.blockPrefix) {
      this.evalBlockPrefix(block.blockPrefix, newScope);
    }

    // if there is ohnly one statement, eval it and return
    // else, run all of them and retun the last result

    const body = block.body;
    let result: Primitive = null;
    if (Array.isArray(body)) {
      // Array of statements
      body.forEach((statement) => {
        // keep seting the varibale till the last one
        result = this.evalStatement(statement, newScope);
      });
      // return result;
    } else {
      result = this.evalStatement(body, newScope);
      // return this.evalStatement(body, scope);
    }

    if (result === null) {
      throw new Error("Expression block returned null");
    } else {
      return result;
    } 
  }
  private evalStatement(block: Statement, scope: Scope): Primitive {
    switch (block.type) {
      case StatementType.QUERY:
        return this.evalQueryStatement(block as QueryStatement, scope);
      case StatementType.SELECT:
        return this.evalSelectStatement(block as SelectStatement, scope);
      case StatementType.SELECT_CHILD:
        return this.evalSelectChildStatement(
          block as SelectChildStatement,
          scope,
        );
      case StatementType.READ:
        return this.evalReadStatement(block as ReadStatement, scope);
      case StatementType.READ_ATTRIBUTE:
        return this.evalReadAttributeStatement(
          block as ReadAttributeStatement,
          scope,
        );
      case StatementType.TO_NUMBER:
        return this.evalToNumberStatement(block as ToNumberStatement, scope);
    }
  }

  private evalQueryStatement(block: QueryStatement, scope: Scope): Primitive {
    const selector = block.selectorString;
    const parentElement = scope.getValue("element") as Element

    const element = parentElement.querySelector(selector);
    if (!element) {
      throw new Error(`No descendant element matches selector "${selector}"`);
    }

    this.defineVariables(element, scope);
    return null;
    // should this method return null or shoukd it return the element representation?
  }
  private evalSelectStatement(block: SelectStatement, scope: Scope): Primitive {
    const value = scope.getValue(block.variable) as Element;
    // need a way to get the element type without the value

    if (typeof value === "object") { // checks if it an element object
      // scope.setValue("element", value);
      this.defineVariables(value, scope);
      return null;
    } else {
      throw new Error("Varible in select statement must point to an element");
    }
  }
  private evalSelectChildStatement(
    block: SelectChildStatement,
    scope: Scope,
  ): Primitive {
    const selectedChildId = block.selectedChild;
    const element = scope.getValue("element") as Element;
    const selectedChild = element.children[selectedChildId];

    if (selectedChild) {
      // scope.setValue("element", selectedChild);
      this.defineVariables(selectedChild, scope);
      return null;
    } else {
      throw new Error(`No child element at index ${selectedChildId}`);
    }
  }
  private evalReadStatement(block: ReadStatement, scope: Scope): Primitive {
    const { variable } = block;
    return scope.getValue(variable);
  }
  private evalReadAttributeStatement(
    block: ReadAttributeStatement,
    scope: Scope,
  ): Primitive {
    const element = scope.getValue("element") as Element;
    const { attribute } = block;

    if (element.hasAttribute(attribute)) {
      return element.getAttribute(attribute);
    } else {
      throw new Error(`The element does not contain attribute "${attribute}"`);
    }
  }
  private evalToNumberStatement(
    block: ToNumberStatement,
    scope: Scope,
  ): Primitive {
    const { variable } = block;

    const value = scope.getValue(variable);
    if (typeof value !== "string") {
      throw new Error(`Can only convert string to number`);
    } else {
      const result = parseInt(value); // what about floats
      if (isNaN(result)) {
        throw new Error(`Unable to convert value "${value}" to string`);
      } else return result;
    }
  }
}
