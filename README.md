# ki-click-to-component

## ClickToComponent

> ❗️❗️❗️Forked from [click-to-component](https://github.com/ericclemmons/click-to-component), rewrite by typescript for **learning**.

![Next.js Demo](https://github.com/ericclemmons/click-to-component/raw/main/.github/next.gif)

## Features

- <kbd>Option+Click</kbd> opens the immediate Component's source
- <kbd>Option+Right-click</kbd> opens a context menu with the parent Components' `props`, `fileName`, `columnNumber`, and `lineNumber`

## Usage
```diff
+import { ClickToComponent } from 'click-to-react-component'
 import type { AppProps } from 'next/app'
 import '../styles/globals.css'
 function MyApp({ Component, pageProps }: AppProps) {
   return (
     <>
+      <ClickToComponent />
       <Component {...pageProps} />
     </>
   )
```
