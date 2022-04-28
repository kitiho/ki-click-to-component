export function getPathToSource(source: any) {
  const {
    columnNumber = 1,
    fileName,
    lineNumber = 1,
  } = source

  return `${fileName}:${lineNumber}:${columnNumber}`
}
