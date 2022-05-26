import { Lexer } from "../lexer";
import { Token, TokenType } from "../lexer/types";
import { ParserError } from "../utils";
import { Query } from "./types";
import {
  BlockPrefix,
  ObjectBlock,
  ArrayBlock,
  ExpressionBlock,
  BlockType,
  KeyValue,
} from "./types/blocks";
import {
  QueryStatement,
  SelectStatement,
  SelectChildStatement,
  Statement,
  StatementType,
  ReadStatement,
  ReadAttributeStatement,
  ToNumberStatement,
} from "./types/statements";

// work on all error messages (should be more contextual/smarter)
// might need a peek token to do so in most cases

export class Parser {
  private currentToken!: Token; // will be defined by this.advance() method call
  private lexer: Lexer;

  constructor(source: string) {
    this.lexer = new Lexer(source);
    // this.currentToken = this.lexer.nextToken()

    // set up the currentToken and the peekToken
    this.advance();
  }

  private advance() {
    const previousToken = this.currentToken;
    // move on to the next token while preserving current one

    // set up the peek token
    this.currentToken = this.lexer.nextToken();
    return previousToken; // is is needed in getting inforation from a consumed token
  }

  private match(type: TokenType) {
    return this.currentToken.type === type;
  }

  private matchStatement() {
    return (
      this.match(TokenType.QUERY) ||
      this.match(TokenType.SELECT) ||
      this.match(TokenType.SELECT_CHILD) ||
      this.match(TokenType.READ) ||
      this.match(TokenType.READ_ATTRIBUTE) ||
      this.match(TokenType.TO_NUMBER)
    );
  }

  private consume(type: TokenType, errorMessage?: string) {
    if (this.match(type)) {
      return this.advance(); // move on to the next token an return the current token
    } else {
      throw new ParserError(
        errorMessage || `Expected ${type}; Found ${this.currentToken.type}`,
        this.currentToken.lineNumber,
      );
    }
  }

  parseQuery(): Query {
    return {
      type: "QUERY_ROOT",
      rootBlock: this.parseBlock(),
    };
  }

  private parseBlock() {
    // parse "optional" block prefix
    const blockPrefix = this.parseBlockPrefix();
    if (this.match(TokenType.LEFT_SQUARE_BRACKET)) {
      return this.parseArrayBlock(blockPrefix);
    } else if (this.match(TokenType.LEFT_CURLY_BRACKET)) {
      return this.parseObjectBlock(blockPrefix);
    } else if (this.match(TokenType.LEFT_ROUND_BRACKET)) {
      return this.parseExpressionBlock(blockPrefix);
    } else if (this.matchStatement()) {
      // TODO handle root expression block with no brackets (need a way to detect statements)
      // naked expression block
      // could be ".hello" > read :inner_text
      const expressionBlock: ExpressionBlock = {
        type: BlockType.EXPRESSION_BLOCK,
        blockPrefix,
        body: this.parseStatement(),
      };
      return expressionBlock;
    } else {
      // retruns never -> never going to happen because of process.exit()
     throw new ParserError (
        `Unexpected ${this.currentToken.type}`,
        this.currentToken.lineNumber,
      );
    }
  }

  private parseBlockPrefix() {
    if (this.match(TokenType.STRING)) {
      // TODO implement blind consume method? - no, just advance
      const stringTokenValue = this.advance().value;

      const blockPrefixNode: BlockPrefix = { value: stringTokenValue };

      this.consume(TokenType.PREFIX_OPERATOR);
      return blockPrefixNode;
    } else {
      return null;
    }
  }
  private parseArrayBlock(blockPrefix: BlockPrefix | null): ArrayBlock {
    if (blockPrefix === null) {
      throw new ParserError(
        `Required block prefix missing in array block definition`,
        this.currentToken.lineNumber,
      );
    } else {
      this.consume(TokenType.LEFT_SQUARE_BRACKET);

      let body: ExpressionBlock | ObjectBlock;
      // cant have block prefix inside array block -> the array block is meant to define the context
      if (this.match(TokenType.LEFT_ROUND_BRACKET)) {
        body = this.parseExpressionBlock(null);
      } else if (this.match(TokenType.LEFT_CURLY_BRACKET)) {
        body = this.parseObjectBlock(null);
      } else if (this.matchStatement()) {
        // naked expression block
        // ".names" > [read :inner_text]
        body = {
          type: BlockType.EXPRESSION_BLOCK,
          body: this.parseStatement(),
        } as ExpressionBlock;
      } else {
        throw new ParserError(
          `Expected object block or expression block, found ${this.currentToken.value}`,
          this.currentToken.lineNumber,
        );
      }

      this.consume(TokenType.RIGHT_SQUARE_BRACKET);

      return {
        type: BlockType.ARRAY_BLOCK,
        blockPrefix,
        body,
      };
    }
  }
  private parseExpressionBlock(
    blockPrefix: BlockPrefix | null,
  ): ExpressionBlock {
    this.consume(TokenType.LEFT_ROUND_BRACKET);

    const statements = this.parseStatements();

    this.consume(TokenType.RIGHT_ROUND_BRACKET);

    return {
      type: BlockType.EXPRESSION_BLOCK,
      body: statements,
      blockPrefix,
    };
  }
  private parseObjectBlock(blockPrefix: BlockPrefix | null): ObjectBlock {
    this.consume(TokenType.LEFT_CURLY_BRACKET);

    const keyValues: KeyValue[] = [];

    // using do while makes sure there is at least one key value
    do {
      const key = this.consume(TokenType.IDENTIFIER).value;

      // {name = (query "name"),}

      this.consume(TokenType.EQUALS_OPERATOR);

      const block = this.parseBlock();

      this.consume(TokenType.COMMA, `Missing comma at end of key value pair`); // neccessary comma

      keyValues.push({
        type: "KEY_VALUE",
        key,
        value: block,
      });
    } while (!this.match(TokenType.RIGHT_CURLY_BRACKET));

    this.consume(TokenType.RIGHT_CURLY_BRACKET);

    return {
      type: BlockType.OBJECT_BLOCK,
      blockPrefix: blockPrefix,
      body: keyValues,
    };
  }
  private parseStatements(): Statement[] {
    const statements: Statement[] = [];
    // must have at least one statement
    do {
      statements.push(this.parseStatement());
    } while (!this.match(TokenType.RIGHT_ROUND_BRACKET));

    return statements;
  }
  private parseStatement(): Statement {
    switch (this.currentToken.type) {
      case TokenType.QUERY:
        return this.parseQueryStatement();
      case TokenType.SELECT:
        return this.parseSelectStatement();
      case TokenType.SELECT_CHILD:
        return this.parseSelectChildStatement();
      case TokenType.READ:
        return this.parseReadStatement();
      case TokenType.READ_ATTRIBUTE:
        return this.parseReadAttributeStatement();
      case TokenType.TO_NUMBER:
        return this.parseToNumberStatement();
      default:
        throw new ParserError(`Expected statement; Found ${this.currentToken.type}`, this.currentToken.lineNumber);
    }
  }

  private parseQueryStatement(): QueryStatement {
    this.consume(TokenType.QUERY);
    const selectorString = this.consume(TokenType.STRING).value;
    return {
      type: StatementType.QUERY,
      selectorString,
    };
  }

  private parseSelectStatement(): SelectStatement {
    this.consume(TokenType.SELECT);
    const variable = this.consume(TokenType.VARIABLE).value;
    return {
      type: StatementType.SELECT,
      variable,
    };
  }

  private parseSelectChildStatement(): SelectChildStatement {
    this.consume(TokenType.SELECT_CHILD);
    const selectedChild = parseInt(this.consume(TokenType.INTEGER).value);
    return {
      type: StatementType.SELECT_CHILD,
      selectedChild,
    };
  }

  private parseReadStatement(): ReadStatement {
    this.consume(TokenType.READ);
    const variable = this.consume(TokenType.VARIABLE).value;
    return {
      type: StatementType.READ,
      variable,
    };
  }

  private parseReadAttributeStatement(): ReadAttributeStatement {
    this.consume(TokenType.READ_ATTRIBUTE);
    const attribute = this.consume(TokenType.STRING).value;
    return {
      type: StatementType.READ_ATTRIBUTE,
      attribute,
    };
  }

  private parseToNumberStatement(): ToNumberStatement {
    this.consume(TokenType.TO_NUMBER);
    const variable = this.consume(TokenType.VARIABLE).value;
    return {
      type: StatementType.TO_NUMBER,
      variable,
    };
  }
}
