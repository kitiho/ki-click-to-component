export function getReactInstanceForElement(element: HTMLElement) {
  if ('__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) {
    const { renderers } = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
    for (const renderer of renderers.values()) {
      try {
        const fiber = renderer.findFiberByHostInstance(element)
        if (fiber)
          return fiber
      }
      catch (error) {
      }
    }
  }

  if ('_reactRootContainer' in element)
    return (element as any)._reactRootContainer._internalRoot.current.child

  for (const key in element) {
    if (key.startsWith('__reactInternalInstance$'))
      return (element as any)[key]

    if (key.startsWith('__reactFiber'))
      return (element as any)[key]
  }
}
