import { getReactInstanceForElement } from './getReactInstanceForElement'

export function getReactInstancesForElement(element: HTMLElement) {
  const instances = new Set()
  let instance = getReactInstanceForElement(element)

  while (instance) {
    instances.add(instance)
    instance = instance._debugOwner
  }

  return Array.from(instances)
}
