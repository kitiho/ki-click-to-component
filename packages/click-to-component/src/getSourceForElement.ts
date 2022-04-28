import { getReactInstanceForElement } from './getReactInstanceForElement'
import { getSourceForInstance } from './getSourceForInstance'

export function getSourceForElement(
  element: HTMLElement,
) {
  const instance = getReactInstanceForElement(element)
  const source = getSourceForInstance(instance)

  if (source)
    return source

  console.warn('Couldn\'t find a React instance for the element', element)
}
