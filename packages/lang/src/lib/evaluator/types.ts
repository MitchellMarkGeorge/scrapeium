import { Primitive } from "../parser/types";

export interface ResultType {
  // result: ExpressionBlockResult | ObjectBlockResult | ArrayBlockResult;
  result: BlockResult;
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

export type ExpressionBlockResult = Primitive;

// export type ObjectBlockResult = Record<
//   string,
//   ExpressionBlockResult | ObjectBlockResult | ArrayBlockResult
// >; // by doing it the other way, it means it can only be one type at a time. this way means that each element/value can be of either types
//
export interface ObjectBlockResult {
  [key: string]: BlockResult
}

// export type ArrayBlockResult =
//   | Array<ExpressionBlockResult>
//   | Array<ObjectBlockResult>; // it is only going to be an array of one of those values, not potentially mixed

// TODO change it back to previous correct definition when evaluator figured
export type ArrayBlockResult = Array<ExpressionBlockResult | ObjectBlockResult>

export type BlockResult =
  | ExpressionBlockResult
  | ObjectBlockResult
  | ArrayBlockResult;


