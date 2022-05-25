import { Lexer } from "./src/lexer";
import { TokenType } from "./src/lexer/types";
import { Parser } from "./src/parser";
import { inspect } from "util";

// const example = `{
//  # "hello",
//   name = (
//     select ".name"
//     read :inner_text
//   ),
//   age = ".age" > read :inner_text,
// }` // not reading the first character
//

// should commas be enforced????
const example = `
"#info" > {
    name = read :inner_text,
    age = (
        query ".age"
        read :inner_text
    ),
    friends = ".friends" > [{
        text = (to_number :inner_text),
    }],
}
`;

const parser = new Parser(example);

console.log(
  inspect(parser.parseQuery(), { showHidden: true, depth: null, colors: true }),
);

// const lexer = new Lexer(example);

// let token = lexer.nextToken();

// while (token.type !== TokenType.EOF) {
//   console.log(token);
//   token = lexer.nextToken();
// }
// console.log(token); // eof token
