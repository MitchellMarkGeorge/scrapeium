import { Token, TokenType, newToken } from "./types";

export class Lexer {
  private source: string;
  // current examined character
  private currentChar = "";
  // index of the current examined character
  private currentIndex = 0;
  // this represents the start index of a potential mulit character token (like and identifier or variable)
  private startIndex = 0;
  // index of the next character
  private lineNumber = 1;

  constructor(source: string) {
    this.source = source;

    // if the sorce is empty (the only condition at this point where the length and the currentIndex will be the same)
    if (this.source.length === 0) {
      this.currentChar = "\0";
    } else {
      this.currentChar = this.source.charAt(this.currentIndex); // remember: currentIndex is 0 here
    }
    // set up the first character
    // this.consume();
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
    // set the start index
    this.startIndex = this.currentIndex;

    switch (this.currentChar) {
      case ":":
        // need to return this imidiately so it dosen't accidentally skip over/consume another character
        return this.variable();
      // break;
      case ",":
        token = newToken(TokenType.COMMA, this.currentChar, this.lineNumber);
        break;
      case "(":
        token = newToken(
          TokenType.LEFT_ROUND_BRACKET,
          this.currentChar,
          this.lineNumber,
        );
        break;
      case ")":
        token = newToken(
          TokenType.RIGHT_ROUND_BRACKET,
          this.currentChar,
          this.lineNumber,
        );
        break;
      case "{":
        token = newToken(
          TokenType.LEFT_CURLY_BRACKET,
          this.currentChar,
          this.lineNumber,
        );
        break;
      case "}":
        token = newToken(
          TokenType.RIGHT_CURLY_BRACKET,
          this.currentChar,
          this.lineNumber,
        );
        break;
      case "[":
        token = newToken(
          TokenType.LEFT_SQUARE_BRACKET,
          this.currentChar,
          this.lineNumber,
        );
        break;
      case "]":
        token = newToken(
          TokenType.RIGHT_SQUARE_BRACKET,
          this.currentChar,
          this.lineNumber,
        );
        break;
      case "=":
        token = newToken(
          TokenType.EQUALS_OPERATOR,
          this.currentChar,
          this.lineNumber,
        );
        break;
      case ">":
        token = newToken(
          TokenType.PREFIX_OPERATOR,
          this.currentChar,
          this.lineNumber,
        );
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

  // sets up the next character to be examined
  private consume() {
    // sets up the index for the next character
    // this has be first as the first character is already read in the constructor
    this.currentIndex++;
    // if there are no more tokens to read, set the current token to 0
    if (this.currentIndex >= this.source.length) {
      this.currentChar = "\0";
    } else {
      // set the current char
      this.currentChar = this.source.charAt(this.currentIndex);
    }
  }

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
    while (this.currentChar !== "\n" && this.currentChar !== "\0") {
      // cant use isAtEnd() as it will end loop one character early, needs to ACTUALLY be at the end
      this.consume();
    }

    this.skipWhitespace(); // this accounts for the last newline character (and any other potential whitespace after) and increases the line number
    // this.consume()
    // this.lineNumber++
  }

  // private isAtEnd() {
  //   // could change it to
  //   return this.currentChar === "\0";
  //   return this.nextIndex >= this.source.length; // is this the best way to do this?
  // }

  private variable(): Token {
    // set the inital index (the index of the ":")
    // const initalIndex = this.currentIndex;

    do {
      // using this do-while makes sure the ":" is consumed
      this.consume();
      // read the rest of the varible as an identifier
    } while (this.isAlpha(this.currentChar));

    // get the literal value of the variable (including the ":")

    // remove the ":" as it has no internal meaning... it is only needed in syntax
    const value = this.source.substring(this.startIndex + 1, this.currentIndex);
    if (value.length === 0) { // this meaning it was just the ":" and there was no identifier at the end
      throw new Error(`Invalid ":" at line ${this.lineNumber}`);
    }

    return newToken(TokenType.VARIABLE, value, this.lineNumber);
  }

  private identifier(): Token {
    // const initalIndex = this.currentIndex;
    while (this.isAlpha(this.currentChar)) {
      this.consume();
    }
    const value = this.source.substring(this.startIndex, this.currentIndex);
    const token = newToken(TokenType.IDENTIFIER, value, this.lineNumber);
    if (this.isStatement(value)) {
      token.type = TokenType.STATEMENT;
    }
    return token;
  }

  private number(): Token {
    // const initalIndex = this.currentIndex;
    while (this.isDigit(this.currentChar)) {
      this.consume();
    }
    const value = this.source.substring(this.startIndex, this.currentIndex);
    return newToken(TokenType.INTEGER, value, this.lineNumber);
  }

  private string(): Token {
    // const initalIndex = this.currentIndex;
    do {
      if (this.currentChar === "\n") {
        this.lineNumber++;
      }
      this.consume();
    } while (this.currentChar !== '"' && this.currentChar !== "\0");

    if (this.currentChar === "\0") {
      throw new Error(`Unterminated string at line ${this.lineNumber}`);
    }

    // consume the last '"'
    this.consume(); // is this then needed?

    // strip out the quotes
    const value = this.source.substring(this.startIndex + 1, this.currentIndex - 1);
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
