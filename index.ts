import { Lexer } from "./src/lexer";
import { TokenType } from "./src/lexer/types";

// const example = `{
//  # "hello",
//   name = (
//     select ".name"
//     read :inner_text
//   ),
//   age = ".age" > read :inner_text,
// }` // not reading the first character
//

const example = `"hello" :bye`;

const lexer = new Lexer(example);

let token = lexer.nextToken();

while (token.type !== TokenType.EOF) {
  console.log(token);
  token = lexer.nextToken();
}
console.log(token); // eof token
