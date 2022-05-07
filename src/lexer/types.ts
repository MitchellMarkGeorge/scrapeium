export interface Token {
  type: TokenType;
  value: string;
  lineNumber: number;
  // shoukd I add column
}

export enum TokenType {
  VARIABLE = "VARIABLE", // ":" followed by an identifer
  IDENTIFIER = "IDENTIFIER", // based on snake case -> letters (lowecase and uppercase), numbers, and "_" (cant start with number)
  STATEMENT = "STATEMENT", // same as an identifier but special -- determined from lexer
  STRING = "STRING",
  COMMA = "COMMA", // ,
  PREFIX_OPERATOR = "PREFIX_OPERATOR", // >
  EQUALS_OPERATOR = "EQUALS_OPERATOR", // =
  LEFT_SQUARE_BRACKET = "LEFT_SQUARE_BRACKET", // [
  RIGHT_SQUARE_BRACKET = "RIGHT_SQUARE_BRACKET", // ]
  LEFT_ROUND_BRACKET = "LEFT_ROUND_BRACKET", // (
  RIGHT_ROUND_BRACKET = "RIGHT_ROUND_BRACKET", // )
  LEFT_CURLY_BRACKET = "LEFT_CURLY_BRACKET", // {
  RIGHT_CURLY_BRACKET = "RIGHT_CURLY_BRACKET", // }
  INTEGER = "INTEGER",
  // FLOAT,
  EOF = "EOF", // end-of-file
}

export function newToken(
  type: TokenType,
  value: string,
  lineNumber: number,
): Token {
  return {
    type,
    value,
    lineNumber,
  };
}
// export interface Position {
//   line: number,
//   column: number
// }
//
