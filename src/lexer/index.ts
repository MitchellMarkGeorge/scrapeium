import { Token, TokenType, newToken } from "./types";

export class Lexer {
  private source: string;
  // current examined character
  private currentChar = "";
  // index of the current examined character (needed for more complex lexing in things like identifiers)
  private currentIndex = 0;
  // index of the next character
  private nextIndex = 0;
  private lineNumber = 1;

  constructor(source: string) {
    this.source = source;
    // set up the first character
    this.consume();
    // console.log(this.currentChar.length)

    // handle empty source
  }
  public nextToken(): Token {

    // skip all whitespace before looking any further
    this.skipWhitespace();
    if (this.currentChar === "#") {
      this.skipComment();
    }
    let token: Token;
    this.skipWhitespace();
    // console.log(this.currentChar)
    // console.log(this.isAtEnd())
    switch (this.currentChar) {
      case ":":
        // need to return this imidiately so it dosen't accidentally skip over/consume another character
        return this.variable();
      // break;
      case ",":
        token = newToken(TokenType.COMMA, this.currentChar, this.lineNumber);
        break;
      case "(":
        token = newToken(TokenType.LEFT_ROUND_BRACKET, this.currentChar, this.lineNumber);
        break;
      case ")":
        token = newToken(TokenType.RIGHT_ROUND_BRACKET, this.currentChar, this.lineNumber);
        break;
      case "{":
        token = newToken(TokenType.LEFT_CURLY_BRACKET, this.currentChar, this.lineNumber);
        break;
      case "}":
        token = newToken(TokenType.RIGHT_CURLY_BRACKET, this.currentChar, this.lineNumber);
        break;
      case "[":
        token = newToken(TokenType.LEFT_SQUARE_BRACKET, this.currentChar, this.lineNumber);
        break;
      case "]":
        token = newToken(TokenType.RIGHT_SQUARE_BRACKET, this.currentChar, this.lineNumber);
        break;
      case "=":
        token = newToken(TokenType.EQUALS_OPERATOR, this.currentChar, this.lineNumber);
        break;
      case ">":
        token = newToken(TokenType.PREFIX_OPERATOR, this.currentChar, this.lineNumber);
        break;
      case '"':
        token = this.string();
        break;
      case "\0":
        token = newToken(TokenType.EOF, "\0", this.lineNumber);
        break;
      default:
        if (this.isAlpha(this.currentChar)) {
          // read identifier
          // also determine if it is a statementL
          // token = this.identifier()
          return this.identifier();
        } else if (this.isDigit(this.currentChar)) {
          // read integer
          // token = this.number()
          return this.number();
        } else {
          throw new Error(
            `Illegal character ${this.currentChar} at line ${this.lineNumber}`,
          );
        }
    }
    // set up the next char to be examined
    this.consume();
    return token;
  }

  private consume() {
    // if there are no more tokens to read, set the current token to 0
    if (this.nextIndex >= this.source.length) {
      this.currentChar = "\0"; // think about this
    } else {
      // set the next token to be read
      this.currentChar = this.source.charAt(this.nextIndex);
    }
    // setup the current index and next index as well
    this.currentIndex = this.nextIndex;
    this.nextIndex++;
  }

  // "peek" at the next avalible character
  private peek() {
    if (this.nextIndex >= this.source.length) {
      return "\0"; // think about this
    } else {
      // get next token
      return this.source.charAt(this.nextIndex);
    }
  }

 // public newToken(
  //   type: TokenType,
  //   value = this.currentChar,
  //   lineNumber = this.lineNumber,
  // ): Token {
  //   return {
  //     type,
  //     value,
  //     lineNumber,
  //   };
  // }

  private skipWhitespace() {
    while (
      this.currentChar === " " ||
      this.currentChar === "\t" ||
      this.currentChar === "\r" ||
      this.currentChar === "\n"
    ) {
      if (this.currentChar === "\n") {
        this.lineNumber++;
      }
      this.consume();
    }
  }

  private skipComment() {
    while (this.currentChar !== "\n" && this.currentChar !== "\0") { // cant use isAtEnd() as it will end loop one character early, needs to ACTUALLY be at the end
      this.consume();
    }

    this.skipWhitespace(); // this accounts for the last newline character (and any other potential whitespace after) and increases the line number
    // this.consume()
    // this.lineNumber++
  }

  private isAtEnd() {
    return this.nextIndex >= this.source.length; // is this the best way to do this?
  }

  private variable(): Token {
    // set the inital index (the index of the ":")
    // console.log(this.currentIndex)
    const initalIndex = this.currentIndex;

    // consume the ":" character
    this.consume();

    // read the rest of the varible as an identifier
    while (this.isAlpha(this.currentChar)) {
      this.consume();
    }

    // get the literal value of the variable (including the ":")
    const value = this.source.substring(initalIndex, this.currentIndex);
    // console.log(value)
    // console.log(this.nextIndex, this.source.length)
    return newToken(TokenType.VARIABLE, value, this.lineNumber);
  }

  private identifier(): Token {
    const initalIndex = this.currentIndex;
    while (this.isAlpha(this.currentChar)) {
      this.consume();
    }
    const value = this.source.substring(initalIndex, this.currentIndex);
    const token = newToken(TokenType.IDENTIFIER, value, this.lineNumber);
    if (this.isStatement(value)) {
      token.type = TokenType.STATEMENT;
    }
    return token;
  }

  private number(): Token {
    const initalIndex = this.currentIndex;
    while (this.isDigit(this.currentChar)) {
      this.consume();
    }
    const value = this.source.substring(initalIndex, this.currentIndex);
    return newToken(TokenType.INTEGER, value, this.lineNumber);
  }

  private string(): Token {
    const initalIndex = this.currentIndex;
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") this.lineNumber++;
      this.consume();
    }

    // meaning the loop broke bacuae the eand was reached with no terminator
    if (this.isAtEnd()) {
      throw new Error(`Unterminated string at line ${this.lineNumber}`);
    }

    // consume the last '"'
    this.consume();

    // strip out the quotes
    const value = this.source.substring(initalIndex + 1, this.currentIndex);
    return newToken(TokenType.STRING, value, this.lineNumber);
  }

  private isAlpha(char: string) {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }

  private isDigit(char: string) {
    return char >= "0" && char <= "9";
  }

  // all the statements avalible in scrapeium

  private isStatement(identifier: string) {
    const STATEMENTS = [
      "select",
      "select_child",
      "read",
      "read_attribute",
      "to_number", // implement this later
    ];
    return STATEMENTS.includes(identifier);
  }
}
