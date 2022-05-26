class CustomError extends Error {
  constructor(message: string, lineNumber: number) {
    super(`${message} (line ${lineNumber})`);
  }
}

export class LexerError extends CustomError {
  constructor(message: string, lineNumber: number) {
    super(message, lineNumber);
    // this.name = "LexerError"
    Object.setPrototypeOf(this, LexerError.prototype)
  }
}

export class ParserError extends CustomError {
  constructor(message: string, lineNumber: number) {
    super(message, lineNumber);
    // this.name = "ParserError"
    Object.setPrototypeOf(this, LexerError.prototype)
  }
}

export class RuntimeError extends CustomError {
  constructor(message: string, lineNumber: number) {
    super(message, lineNumber);
    // this.name = "RuntimeError"
    Object.setPrototypeOf(this, LexerError.prototype)
  }
}
