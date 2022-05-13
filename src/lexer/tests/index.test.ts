import { Lexer } from "..";
import { newToken, Token, TokenType } from "../types";

test("empty string yeilds EOF token", () => {
  const query = "";
  const lexer = new Lexer(query);
  const token = lexer.nextToken();
  const expextedToken: Token = {
    type: TokenType.EOF,
    value: "\0",
    lineNumber: 1,
  };
  expect(token).toEqual(expextedToken);
});

test("comments are skiped and yeilds EOF token", () => {
  const query = "# hello";
  const lexer = new Lexer(query);
  const token = lexer.nextToken();
  const expextedToken: Token = {
    type: TokenType.EOF,
    value: "\0",
    lineNumber: 1,
  };
  console.log(token);
  expect(token).toEqual(expextedToken);
});

test("query statement yeilds correct tokens", () => {
  //
  const query = `query ".name"`;
  const lexer = new Lexer(query);

  const expectedTokens = [
    newToken(TokenType.STATEMENT, "query", 1),
    newToken(TokenType.STRING, ".name", 1),
  ];

  expectedTokens.forEach((token) => {
    expect(lexer.nextToken()).toEqual(token);
  });
});

test("select statement with variable yeilds correct tokens", () => {
  //
  const query = `select :next_child`;
  const lexer = new Lexer(query);

  const expectedTokens = [
    newToken(TokenType.STATEMENT, "select", 1),
    newToken(TokenType.VARIABLE, "next_child", 1),
  ];

  expectedTokens.forEach((token) => {
    expect(lexer.nextToken()).toEqual(token);
  });
});

test("read statement yeilds correct tokens", () => {
  //
  const query = `read :inner_text`;
  const lexer = new Lexer(query);

  const expectedTokens = [
    newToken(TokenType.STATEMENT, "read", 1),
    newToken(TokenType.VARIABLE, "inner_text", 1), // is the ":" still needed?
  ];

  expectedTokens.forEach((token) => {
    expect(lexer.nextToken()).toEqual(token);
  });
});

test("select_child statement yeilds correct tokens", () => {
  //
  const query = `select_child 3`;
  const lexer = new Lexer(query);

  const expectedTokens = [
    newToken(TokenType.STATEMENT, "select_child", 1),
    newToken(TokenType.INTEGER, "3", 1), // is the ":" still needed?
  ];

  expectedTokens.forEach((token) => {
    expect(lexer.nextToken()).toEqual(token);
  });
});

test("invalid varible reference should throw and errror", () => {
  const query = `:`;
  const lexer = new Lexer(query);

  expect(() => {
    lexer.nextToken()
  }).toThrow();
})

test("unterminated string shoukd throw an error", () => {
  const query = `"hello`;
  const lexer = new Lexer(query);

  expect(() => {
    lexer.nextToken()
  }).toThrow();
})

test("unkown character shoukd throw an error", () => {
  const query = `.`;
  const lexer = new Lexer(query);

  expect(() => {
    lexer.nextToken()
  }).toThrow();
})

test("to_number statement yeilds correct tokens", () => {
  //
  const query = `to_number :inner_text`;
  const lexer = new Lexer(query);

  const expectedTokens = [
    newToken(TokenType.STATEMENT, "to_number", 1),
    newToken(TokenType.VARIABLE, "inner_text", 1), // is the ":" still needed?
  ];

  expectedTokens.forEach((token) => {
    expect(lexer.nextToken()).toEqual(token);
  });
});

test("read statement yeilds correct tokens", () => {
  //
  const query = `read :inner_text`;
  const lexer = new Lexer(query);

  const expectedTokens = [
    newToken(TokenType.STATEMENT, "read", 1),
    newToken(TokenType.VARIABLE, "inner_text", 1), // is the ":" still needed?
  ];

  expectedTokens.forEach((token) => {
    expect(lexer.nextToken()).toEqual(token);
  });
});

test("read_attribute statement yeilds correct tokens", () => {
  //
  const query = `read_attribute "class"`;
  const lexer = new Lexer(query);

  const expectedTokens = [
    newToken(TokenType.STATEMENT, "read_attribute", 1),
    newToken(TokenType.STRING, "class", 1), // is the ":" still needed?
  ];

  expectedTokens.forEach((token) => {
    expect(lexer.nextToken()).toEqual(token);
  });
});



// test errors as well
//
// test("", () => {
//   const query = "";
//   const lexer = new Lexer(query);
//   const token = lexer.nextToken();
//   const expextedToken: Token = { type: TokenType.EOF, value: "\0", lineNumber: 1};
//   expect(token).toEqual(expextedToken);
// })
