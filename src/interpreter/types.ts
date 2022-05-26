import { Primitive } from "../parser/types";

export interface ResultType {
  result: ExpressionBlockResult | ObjectBlockResult | ArrayBlockResult
}

// can be a Primitive
//
// array block result
// array of expression-block-result
// array object-block-results
//
// expression-block-result
// Primitive (could technically be null but will handle as error)
//
// object-block-results
// Record of string keys and either primitives | array block results | object-block-results

type ExpressionBlockResult = Primitive;
type ObjectBlockResult = Record<
  string,
  ExpressionBlockResult | ArrayBlockResult
>; // by doing it the other way, it means it can only be one type at a time. this way means that each element/value can be of either types
type ArrayBlockResult = Array<ExpressionBlockResult | ObjectBlockResult>;
