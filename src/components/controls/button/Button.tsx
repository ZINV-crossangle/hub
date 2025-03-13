"use client";
// import { type Icon } from "components/elements/icon/Icon";
import Style from "./Button.styled";

export interface Button {
    style?: object;
    title?: string;
    variant?: "glass" | "line" | "solid";
    align?: "left" | "center" | "right";
    color?: string;
    gap?: number;
    radius?: number;
    fit?: boolean;
    // icon?: string | Icon;
    // iconLeft?: string | Icon;
    // iconRight?: string | Icon;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onClickLonger?: React.MouseEventHandler<HTMLButtonElement>;
    onBlur?: React.FocusEventHandler<HTMLButtonElement>;
    scale?: number;
    hide?: boolean;
    disabled?: boolean;
    children?: any;
}

export default function Button(props: Button) {
    const { style, title, variant, align, color, fit, onClick, onBlur, scale, hide, disabled, children, radius } = props;

    function handleClickLonger(e?: any) {
        if (props?.disabled) return;
        if (typeof props?.onClickLonger === "function") props?.onClickLonger(e);
    }

    return (
        <Style
            data-slot="button"
            style={style}
            title={title}
            $type={variant}
            $align={align}
            $color={color || "black"}
            $scale={scale || 1}
            $radius={radius || 0}
            $fit={fit || false}
            $hide={hide || false}
            $disabled={disabled || false}
            onClick={(e: any) => onClick?.(e)}
            onMouseDown={(e: any) => handleClickLonger(e)}
            onTouchStart={(e: any) => handleClickLonger(e)}
            onBlur={(e: any) => onBlur?.(e)}>
            <div>
                <span>{children}</span>
            </div>
        </Style>
    );
}
