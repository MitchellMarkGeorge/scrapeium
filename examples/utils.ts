import fs from "fs";

export function getHTML(path: string) {
  return fs.readFileSync(path, "utf8")
}
