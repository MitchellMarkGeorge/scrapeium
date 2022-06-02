class CustomError extends Error {
  constructor(message: string, lineNumber: number) {
    super(`${message} (line ${lineNumber})`);
  }
}


/**
 * Error that is thrown when an error occurs in the lexer
 * @param message  error message
 * @param lineNumber line number error occured at
 */
export class LexerError extends CustomError {
  constructor(message: string, lineNumber: number) {
    super(message, lineNumber);
    // this.name = "LexerError"
    Object.setPrototypeOf(this, LexerError.prototype)
  }
}

/**
 * Error that is thrown when an error occurs in the parser
 * @param message  error message
 * @param lineNumber line number error occured at
 */
export class ParserError extends CustomError {
  constructor(message: string, lineNumber: number) {
    super(message, lineNumber);
    // this.name = "ParserError"
    Object.setPrototypeOf(this, LexerError.prototype)
  }
}

/**
 * Error that is thrown when an error occurs in the evaluator
 * @param message  error message
 * @param lineNumber line number error occured at
 */
export class RuntimeError extends CustomError {
  constructor(message: string, lineNumber: number) {
    super(message, lineNumber);
    // this.name = "RuntimeError"
    Object.setPrototypeOf(this, LexerError.prototype)
  }
}
