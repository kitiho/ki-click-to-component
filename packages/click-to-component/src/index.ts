import { ClickToComponent as Component } from './ClickToComponent'

export const ClickToComponent
  = process.env.NODE_ENV === 'development' ? Component : () => null
