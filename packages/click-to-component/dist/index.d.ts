import * as React from 'react';

declare function ClickToComponent$1({ editor }: {
    editor?: string | undefined;
}): React.ReactElement<any, string | React.JSXElementConstructor<any>>;

declare const ClickToComponent: typeof ClickToComponent$1 | (() => null);

export { ClickToComponent };
