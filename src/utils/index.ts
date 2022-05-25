export function errorFactory(scope: string) {
  return (message: string, lineNumber: number) => {
    console.log(`${scope}: ${message} (line ${lineNumber})`);
    return process.exit(1)
  }
}
// export function error(message: string) {
//   console.log(message); // use console.error?
//   return process.exit(1)
// }
