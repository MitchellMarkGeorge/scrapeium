// import { parser } from "./syntax.grammar";
import { parser } from "./syntax";
import { styleTags, tags as t } from "@lezer/highlight";
import { LanguageSupport, LRLanguage } from "@codemirror/language"

const scrapeiumHighlighting = styleTags({
  Comment: t.lineComment,
  "( )": t.paren,
  "[ ]": t.squareBracket,
  "{ }": t.brace,
  "=": t.definitionOperator,
  ">": t.operator,
  VariableName: t.variableName, // think about this
  Key: t.propertyName,
  String: t.string,
  Integer: t.integer,
  "query select select_child read read_attribute to_number": t.keyword,
});

const parserWithMetadata = parser.configure({
  props: [
    scrapeiumHighlighting,
  ]
});

export const scrapiumLanguage = LRLanguage.define({
  parser: parserWithMetadata,
})

export function scrapeium() {
  return new LanguageSupport(scrapiumLanguage)
}
