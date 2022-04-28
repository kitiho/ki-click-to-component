import { FloatingPortal } from '@floating-ui/react-dom-interactions'
import { html } from 'htm/react'
import * as React from 'react'
import { ContextMenu } from './ContextMenu'
import { getPathToSource } from './getPathToSource'
import { getSourceForElement } from './getSourceForElement'

type ValueOf<T> = T[keyof T]

export const State = {
  IDLE: 'IDLE',
  HOVER: 'HOVER',
  SELECT: 'SELECT',
}

export function ClickToComponent({ editor = 'vscode' }) {
  const [state, setState] = React.useState<ValueOf<typeof State>>(State.IDLE)

  const [target, setTarget] = React.useState<HTMLElement | null>(null)

  const onClick = React.useCallback(
    (event: MouseEvent) => {
      // 判断是否按住了option键
      if (state === State.HOVER && target instanceof HTMLElement) {
        // 通过target（dom）拿到文件的信息拼凑url打开vscode
        const source = getSourceForElement(target)
        const path = getPathToSource(source)
        const url = `${editor}://file/${path}`
        event.preventDefault()
        window.open(url)
        setState(State.IDLE)
      }
    }, [editor, state, target])

  // 菜单关闭的时候打开url
  const onClose = React.useCallback((returnValue: string) => {
    if (returnValue) {
      const url = `${editor}://file/${returnValue}`
      window.open(url)
    }
    setState(State.IDLE)
  }, [editor])

  // 右键打开菜单，这里只是更改状态和设置父元素
  const onContextMenu = React.useCallback((event: MouseEvent) => {
    const { target } = event
    if (state === State.HOVER && target instanceof HTMLElement) {
      event.preventDefault()
      setState(State.SELECT)
      setTarget(target)
    }
  }, [state])

  // option键按下的时候，更改状态
  const onKeyDown = React.useCallback((event: KeyboardEvent) => {
    switch (state) {
      case State.IDLE:
        if (event.altKey)
          setState(State.HOVER)
        break
      default:
        break
    }
  }, [state])

  // option键抬起的时候，更改状态
  const onKeyUp = React.useCallback(() => {
    switch (state) {
      case State.HOVER:
        setState(State.IDLE)
        break
      default:
        break
    }
  }, [state])

  // 按住options键，鼠标移动更改设置target
  const onMouseMove = React.useCallback((event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement))
      return

    switch (state) {
      case State.IDLE:
      case State.HOVER:
        setTarget(event.target)
        break
      default:
        break
    }
  }, [state])

  // 状态和target变化的时候，给target添加dataset属性
  React.useEffect(() => {
    for (const element of Array.from(document.querySelectorAll('[data-click-to-component-target]'))) {
      if (element instanceof HTMLElement)
        delete element.dataset.ClickToComponentTarget
    }

    if (state === State.IDLE) {
      delete window.document.body.dataset.ClickToComponentTarget
      return
    }

    if (target instanceof HTMLElement) {
      window.document.body.dataset.clickToComponent = state
      target.dataset.ClickToComponentTarget = state
    }
  }, [state, target])

  // 添加移除监听
  React.useEffect(
    () => {
      window.addEventListener('click', onClick, { capture: true })
      window.addEventListener('contextmenu', onContextMenu, { capture: true })
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      window.addEventListener('mousemove', onMouseMove)

      return function removeEventListenersFromWindow() {
        window.removeEventListener('click', onClick, { capture: true })
        window.removeEventListener('contextmenu', onContextMenu, {
          capture: true,
        })
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
        window.removeEventListener('mousemove', onMouseMove)
      }
    },
    [onClick, onContextMenu, onKeyDown, onKeyUp, onMouseMove],
  )

  return html`
  <style key="click-to-component-style">
  [data-click-to-component] * {
    pointer-events: auto !important;
  }

  [data-click-to-component-target] {
    cursor: var(--click-to-component-cursor, context-menu) !important;
    outline: var(
      --click-to-component-outline,
      2px solid lightgreen
    ) !important;
    outline-offset: -2px;
    outline-style: inset;
  }
  </style>

  <${FloatingPortal} key="click-to-component-portal">
      ${html`<${ContextMenu}
        key="click-to-component-contextmenu"
        onClose=${onClose}
      />`}
    </${FloatingPortal}
  `
}
