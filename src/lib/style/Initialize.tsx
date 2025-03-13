"use client";
import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import Global from "./Global";

export function Configure({ children }: { children: any }) {
    // Only create stylesheet once with lazy initial state
    // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    const [styleSheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = styleSheet.getStyleElement();
        styleSheet.instance.clearTag();
        return <>{styles}</>;
    });

    if (typeof window !== "undefined") return <>{children}</>;

    return <StyleSheetManager sheet={styleSheet.instance}>{children}</StyleSheetManager>;
}

export default function Initialize({ children }: { children: any }) {
    console.log("console", Configure);
    console.log(123);
    return (
        <Configure>
            <>
                <Global />
                {children}
            </>
        </Configure>
    );
}
