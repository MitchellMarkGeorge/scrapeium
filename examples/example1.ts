import { Evaluator } from "../src/evaluator";
import { Parser } from "../src/parser";
import fs from "fs";
import { JSDOM } from "jsdom";
import { inspect } from "util";
const query = `
{
  name = "#name" > read :text_content, 
  age = "#age" > to_number :text_content, 
}
`.trim(); // :inner_text does not seem to be working... innerHMTL and textContext are fine...
// inner_text next might not work in nodejs... use textContext and innerHtml instead https://github.com/jsdom/jsdom/issues/1245

// const html = fs.readFileSync("./html/example1.html", "utf8");
const html = `
<!DOCTYPE html>
<html>

<head>
  <title>Title of the document</title>
</head>

<body class="container">
  <div id="name">Mitchell</div>
  <div id="age">10</div>
</body>

</html>
`;
const { document } = new JSDOM(html).window;

const parser = new Parser(query);
const evaluator = new Evaluator(parser.parseQuery(), document);
console.log(
  inspect(evaluator.eval(), { showHidden: true, depth: null, colors: true }),
);
