"use client";

import Style from "./Col.styled";

export interface Col {
    children?: any;
    title?: string;
    gap?: number | false;
    align?: "left" | "center" | "right" | "stretch";
    style?: object;
    fit?: boolean;
    fill?: boolean;
    padding?: number | any[];
    show?: "desktop" | "laptop" | "tablet" | "mobile";
    hide?: "desktop" | "laptop" | "tablet" | "mobile";
    responsive?: "desktop" | "laptop" | "tablet" | "mobile";
    reverse?: boolean;
}

export default function Col(props: Col) {
    const gap = props?.gap === 0 ? 0 : props?.gap || 4;
    const fit = props?.fit || false;
    const fill = props?.fill || false;
    const reverse = props?.reverse || false;

    const initial = 0;
    const init = (padding?: number | string): number | undefined => {
        switch (typeof padding) {
            case "string":
                return initial;
            case "number":
                return padding;
            default:
                return undefined;
        }
    };

    const padding =
        typeof props?.padding === "number"
            ? {
                  top: props?.padding,
                  right: props?.padding,
                  bottom: props?.padding,
                  left: props?.padding,
              }
            : {
                  top: (props?.padding && typeof props?.padding[0] !== "string" && props?.padding[0]) || initial,
                  right:
                      (props?.padding && (props?.padding?.length > 1 ? init(props?.padding[1]) : init(props?.padding[0]))) ||
                      initial,
                  bottom:
                      (props?.padding && (props?.padding?.length > 2 ? init(props?.padding[2]) : init(props?.padding[0]))) ||
                      initial,
                  left:
                      (props?.padding &&
                          (props?.padding?.length > 3
                              ? init(props?.padding[3])
                              : props?.padding?.length > 1
                              ? init(props?.padding[1])
                              : init(props?.padding[0]))) ||
                      initial,
              };

    return (
        <Style
            title={props?.title}
            style={props?.style}
            $padding={padding}
            $gap={gap}
            $fit={fit}
            $fill={fill}
            $responsive={props?.responsive}
            $reverse={reverse}
            data-col={props?.align}
            data-show={props?.show}
            data-hide={props?.hide}>
            {props.children}
        </Style>
    );
}
