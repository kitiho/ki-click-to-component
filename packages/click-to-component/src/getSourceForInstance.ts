export function getSourceForInstance(instance: any) {
  const { _debugSource } = instance
  if (!_debugSource)
    return
  const {
    columnNumber = 1,
    fileName,
    lineNumber = 1,
  } = _debugSource

  return { columnNumber, fileName, lineNumber }
}
