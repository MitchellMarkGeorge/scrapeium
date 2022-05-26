import { Query } from "../parser/types";

export class Interpreter {
    private ast: Query
    private result: ResultType = {} // figure out the type for this
    // just need to figure out scope
    constructor(ast: Query) {
        this.ast = ast;
    }

    // this.
}
