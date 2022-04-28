export function getDisplayNameForInstance(instance: any) {
  const { elementType, tag } = instance

  switch (tag) {
    case 0:
    case 1:
      return (elementType.displayName || elementType.name || 'Anonymous Component')
    case 5: // HostComponent:
      return elementType

    case 6: // HostText:
      return 'String'

    case 7: // Fragment
      return 'React.Fragment'

    case 9: // ContextConsumer
      return 'Context.Consumer'

    case 10: // ContextProvider
      return 'Context.Provider'

    case 11: // ForwardRef
      return 'React.forwardRef'

    case 15: // MemoComponent
      // Attempt to get name from wrapped component
      return elementType.type.name || 'React.memo'

    case 16: // LazyComponent
      return 'React.lazy'

    default:
      console.warn(`Unrecognized React Fiber tag: ${tag}`, instance)
      return 'Unknown Component'
  }
}
