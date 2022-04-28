import { useFloating, offset, flip, shift, arrow, useInteractions, useRole, useDismiss, useListNavigation, autoUpdate, FloatingOverlay, FloatingFocusManager, FloatingPortal } from '@floating-ui/react-dom-interactions';
import { html } from 'htm/react';
import * as React from 'react';
import React__default from 'react';
import mergeRefs from 'react-merge-refs';

function getReactInstanceForElement(element) {
  if ("__REACT_DEVTOOLS_GLOBAL_HOOK__" in window) {
    const { renderers } = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    for (const renderer of renderers.values()) {
      try {
        const fiber = renderer.findFiberByHostInstance(element);
        if (fiber)
          return fiber;
      } catch (error) {
      }
    }
  }
  if ("_reactRootContainer" in element)
    return element._reactRootContainer._internalRoot.current.child;
  for (const key in element) {
    if (key.startsWith("__reactInternalInstance$"))
      return element[key];
    if (key.startsWith("__reactFiber"))
      return element[key];
  }
}

function getReactInstancesForElement(element) {
  const instances = /* @__PURE__ */ new Set();
  let instance = getReactInstanceForElement(element);
  while (instance) {
    instances.add(instance);
    instance = instance._debugOwner;
  }
  return Array.from(instances);
}

function getSourceForInstance(instance) {
  console.log(instance);
  const { _debugSource } = instance;
  if (!_debugSource)
    return;
  const {
    columnNumber = 1,
    fileName,
    lineNumber = 1
  } = _debugSource;
  return { columnNumber, fileName, lineNumber };
}

function getDisplayNameForInstance(instance) {
  const { elementType, tag } = instance;
  switch (tag) {
    case 0:
    case 1:
      return elementType.displayName || elementType.name || "Anonymous Component";
    case 5:
      return elementType;
    case 6:
      return "String";
    case 7:
      return "React.Fragment";
    case 9:
      return "Context.Consumer";
    case 10:
      return "Context.Provider";
    case 11:
      return "React.forwardRef";
    case 15:
      return elementType.type.name || "React.memo";
    case 16:
      return "React.lazy";
    default:
      console.warn(`Unrecognized React Fiber tag: ${tag}`, instance);
      return "Unknown Component";
  }
}

function getPathToSource(source) {
  const {
    columnNumber = 1,
    fileName,
    lineNumber = 1
  } = source;
  return `${fileName}:${lineNumber}:${columnNumber}`;
}

function getPropsForInstance(instance) {
  const props = {};
  Object.entries(instance.memoizedProps).forEach(([key, value]) => {
    const type = typeof value;
    if (["key"].includes(key) || value === instance.type.defaultProps?.[key])
      return;
    if (["string", "number", "boolean", "symbol"].includes(type) || value instanceof String || value instanceof Number || value instanceof Boolean || value instanceof Symbol)
      props[key] = value;
  });
  return props;
}

const ComponentContextMenu = (props, ref) => {
  const { onClose } = props;
  const [target, setTarget] = React__default.useState(null);
  const arrowRef = React__default.useRef(null);
  const [activeIndex, setActiveIndex] = React__default.useState(null);
  const [open, setOpen] = React__default.useState(false);
  const listItemsRef = React__default.useRef([]);
  const { x, y, reference, floating, strategy, refs, update, context, placement, middlewareData: { arrow: { x: arrowX, y: arrowY } = {} } } = useFloating({
    open,
    onOpenChange(open2) {
      setOpen(open2);
      if (!open2)
        onClose?.();
    },
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip(),
      shift(),
      arrow({ element: arrowRef })
    ],
    placement: "right"
  });
  const { getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: "menu" }),
    useDismiss(context),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      onNavigate: setActiveIndex,
      focusItemOnHover: false
    })
  ]);
  React__default.useEffect(() => {
    if (open && refs.reference.current && refs.floating.current)
      return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [open, update, refs.reference, refs.floating]);
  const mergedReferenceRef = React__default.useMemo(() => mergeRefs([ref, reference]), [ref, reference]);
  React__default.useEffect(() => {
    function onContextMenu(e) {
      if (!e.altKey)
        return;
      e.preventDefault();
      mergedReferenceRef({
        getBoundingClientRect() {
          return {
            x: e.clientX,
            y: e.clientY,
            width: 0,
            height: 0,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX
          };
        }
      });
      setOpen(true);
      if (e.target instanceof HTMLElement)
        setTarget(e.target);
    }
    document.addEventListener("contextmenu", onContextMenu);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, [mergedReferenceRef]);
  React__default.useLayoutEffect(() => {
    if (open)
      refs.floating.current?.focus();
  }, [open, refs.floating]);
  React__default.useLayoutEffect(() => {
    if (!arrowRef.current)
      return;
    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right"
    }[placement.split("-")[0]];
    Object.assign(arrowRef.current.style, {
      display: "block",
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      right: "",
      bottom: "",
      [staticSide]: "-4px"
    });
  }, [arrowX, arrowY, placement]);
  if (!target)
    return null;
  const instances = getReactInstancesForElement(target).filter((instance) => getSourceForInstance(instance));
  return html`
  <style key="click-to-component-contextmenu-style">
  [data-click-to-component-contextmenu],
  [data-click-to-component-contextmenu] * {
    box-sizing: border-box !important;
  }
  [data-click-to-component-contextmenu] {
    all: unset;
    outline: 0;
    background: white;
    color: black;
    font-weight: bold;
    overflow: visible;
    padding: 5px;
    font-size: 13px;
    border-radius: 6px;
    border: none;
    --shadow-color: 0deg 0% 0%;
    --shadow-elevation-low: 0px -1px 0.8px hsl(var(--shadow-color) / 0.1),
      0px -1.2px 0.9px -2.5px hsl(var(--shadow-color) / 0.07),
      0px -3px 2.3px -5px hsl(var(--shadow-color) / 0.03);
    --shadow-elevation-medium: 0px 1px 0.8px
        hsl(var(--shadow-color) / 0.11),
      0px 1.5px 1.1px -1.7px hsl(var(--shadow-color) / 0.08),
      0px 5.1px 3.8px -3.3px hsl(var(--shadow-color) / 0.05),
      0px 15px 11.3px -5px hsl(var(--shadow-color) / 0.03);
    --shadow-elevation-high: 0px 1px 0.8px hsl(var(--shadow-color) / 0.1),
      0px 1.1px 0.8px -0.7px hsl(var(--shadow-color) / 0.09),
      0px 2.1px 1.6px -1.4px hsl(var(--shadow-color) / 0.07),
      0px 4.9px 3.7px -2.1px hsl(var(--shadow-color) / 0.06),
      0px 10.1px 7.6px -2.9px hsl(var(--shadow-color) / 0.05),
      0px 18.9px 14.2px -3.6px hsl(var(--shadow-color) / 0.04),
      0px 31.9px 23.9px -4.3px hsl(var(--shadow-color) / 0.02),
      0px 50px 37.5px -5px hsl(var(--shadow-color) / 0.01);
    box-shadow: var(--shadow-elevation-high);
    filter: drop-shadow(0px 0px 0.5px rgba(0 0 0 / 50%));
  }
  [data-click-to-component-contextmenu] button {
    all: unset;
    outline: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 5px;
    border-radius: 4px;
    font-size: 13px;
  }
  [data-click-to-component-contextmenu] button:focus,
  [data-click-to-component-contextmenu] button:not([disabled]):active {
    cursor: pointer;
    background: royalblue;
    color: white;
    box-shadow: var(--shadow-elevation-medium);
  }
  [data-click-to-component-contextmenu] button:focus code,
  [data-click-to-component-contextmenu]
    button:not([disabled]):active
    code {
    color: white;
  }
  [data-click-to-component-contextmenu] button > * + * {
    margin-top: 3px;
  }
  [data-click-to-component-contextmenu] button code {
    color: royalblue;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
  }
  [data-click-to-component-contextmenu] button code var {
    background: rgba(0 0 0 / 5%);
    cursor: help;
    border-radius: 3px;
    padding: 3px 6px;
    font-style: normal;
    font-weight: normal;
    font-family: ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol', 'Noto Color Emoji';
  }
  [data-click-to-component-contextmenu] button cite {
    font-weight: normal;
    font-style: normal;
    font-size: 11px;
    opacity: 0.5;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
  }
  [data-click-to-component-contextmenu] button cite data::after {
    content: attr(value);
    float: right;
    padding-left: 15px;
    font-family: ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol', 'Noto Color Emoji';
  }
  [data-click-to-component-contextmenu-arrow] {
    display: none;
    position: absolute;
    background: inherit;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
  }
</style>

${open && html`
<${FloatingOverlay} key="click-to-component-overlay" lockScroll>
          <${FloatingFocusManager} context=${context}>
            <dialog
              ...${getFloatingProps({
    ref: floating,
    style: {
      position: strategy,
      top: y ?? "",
      left: x ?? ""
    }
  })}
              data-click-to-component-contextmenu
              onClose=${function handleClose() {
    onClose?.(refs.floating.current.returnValue);
    setOpen(false);
  }}
              open
            >
            <form method="dialog">
                ${instances.map((instance, i) => {
    const name = getDisplayNameForInstance(instance);
    const source = getSourceForInstance(instance);
    const path = getPathToSource(source);
    const props2 = getPropsForInstance(instance);
    return html`
                    <button
                      ...${getItemProps({
      role: "menuitem",
      ref(node) {
        listItemsRef.current[i] = node;
      }
    })}
                      key=${i}
                      name="path"
                      type="submit"
                      value=${path}
                    >
                      <code>
                        ${"<"}${name}
                        ${Object.entries(props2).map(([prop, value]) => html`
                            ${" "}
                            <var key=${prop} title="${value}">${prop}</var>
                          `)}
                        ${">"}
                      </code>
                      <cite>
                        <data
                          value="${source?.lineNumber}:${source?.columnNumber}"
                        >
                          ${source?.fileName.replace(/.*(src|pages)/, "$1")}
                        </data>
                      </cite>
                    </button>
                  `;
  })}
              </form>
              <div
              data-click-to-component-contextmenu-arrow
              ref=${arrowRef}
            />
          </dialog>
        </${FloatingFocusManager}>
      </${FloatingOverlay}>
`}

`;
};
const ContextMenu = React__default.forwardRef(ComponentContextMenu);

function getSourceForElement(element) {
  const instance = getReactInstanceForElement(element);
  const source = getSourceForInstance(instance);
  if (source)
    return source;
  console.warn("Couldn't find a React instance for the element", element);
}

const State = {
  IDLE: "IDLE",
  HOVER: "HOVER",
  SELECT: "SELECT"
};
function ClickToComponent$1({ editor = "vscode" }) {
  const [state, setState] = React.useState(State.IDLE);
  const [target, setTarget] = React.useState(null);
  const onClick = React.useCallback((event) => {
    if (state === State.HOVER && target instanceof HTMLElement) {
      const source = getSourceForElement(target);
      const path = getPathToSource(source);
      const url = `${editor}://file/${path}`;
      event.preventDefault();
      window.open(url);
      setState(State.IDLE);
    }
  }, [editor, state, target]);
  const onClose = React.useCallback((returnValue) => {
    if (returnValue) {
      const url = `${editor}://file/${returnValue}`;
      window.open(url);
    }
    setState(State.IDLE);
  }, [editor]);
  const onContextMenu = React.useCallback((event) => {
    const { target: target2 } = event;
    if (state === State.HOVER && target2 instanceof HTMLElement) {
      event.preventDefault();
      setState(State.SELECT);
      setTarget(target2);
    }
  }, [state]);
  const onKeyDown = React.useCallback((event) => {
    switch (state) {
      case State.IDLE:
        if (event.altKey)
          setState(State.HOVER);
        break;
    }
  }, [state]);
  const onKeyUp = React.useCallback(() => {
    switch (state) {
      case State.HOVER:
        setState(State.IDLE);
        break;
    }
  }, [state]);
  const onMouseMove = React.useCallback((event) => {
    if (!(event.target instanceof HTMLElement))
      return;
    switch (state) {
      case State.IDLE:
      case State.HOVER:
        setTarget(event.target);
        break;
    }
  }, [state]);
  React.useEffect(() => {
    for (const element of Array.from(document.querySelectorAll("[data-click-to-component-target]"))) {
      if (element instanceof HTMLElement)
        delete element.dataset.ClickToComponentTarget;
    }
    if (state === State.IDLE) {
      delete window.document.body.dataset.ClickToComponentTarget;
      return;
    }
    if (target instanceof HTMLElement) {
      window.document.body.dataset.clickToComponent = state;
      target.dataset.ClickToComponentTarget = state;
    }
  }, [state, target]);
  React.useEffect(() => {
    window.addEventListener("click", onClick, { capture: true });
    window.addEventListener("contextmenu", onContextMenu, { capture: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    return function removeEventListenersFromWindow() {
      window.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("contextmenu", onContextMenu, {
        capture: true
      });
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onClick, onContextMenu, onKeyDown, onKeyUp, onMouseMove]);
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
  `;
}

const ClickToComponent = process.env.NODE_ENV === "development" ? ClickToComponent$1 : () => null;

export { ClickToComponent };
