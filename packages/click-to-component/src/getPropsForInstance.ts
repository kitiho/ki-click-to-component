export function getPropsForInstance(instance: any) {
  const props: any = {}

  Object.entries(instance.memoizedProps).forEach(([key, value]) => {
    const type = typeof value
    if (['key'].includes(key) || value === instance.type.defaultProps?.[key])
      return

    if (['string', 'number', 'boolean', 'symbol'].includes(type)
      || value instanceof String
      || value instanceof Number
      || value instanceof Boolean
      || value instanceof Symbol)
      props[key] = value
  })
  return props
}
