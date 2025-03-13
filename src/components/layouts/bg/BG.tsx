"use client";
import Image from "next/image";
import Style, { Filter } from "./BG.styled";
import type { DetailedHTMLProps, VideoHTMLAttributes, MutableRefObject } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface BG {
    background?: string;
    filter?:
        | string
        | {
              color?: string;
              opacity?: number;
          };
    fix?: boolean;
    img?: {
        src: string | StaticImport;
        style?: object;
    };
    video?: DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
    style?: object;
    children?: any;
    reference?: MutableRefObject<any>;
}

export default function BG(props: BG) {
    const fix = props?.fix || false;
    const src = props?.img?.src || "";
    const filter =
        (typeof props?.filter === "string" && props?.filter) ||
        (typeof props?.filter === "object" && typeof props?.filter?.color === "string" && props?.filter?.color) ||
        undefined;
    const opacity =
        (typeof props?.filter === "object" && typeof props?.filter?.opacity === "number" && props?.filter?.opacity) || 0.45;

    return (
        <Style ref={props?.reference} $fix={fix} style={{ ...props?.style, background: props?.background }}>
            {props?.img?.src && (
                <Image src={src} style={{ minWidth: "100%", minHeight: "100%", ...props?.img?.style }} alt={""} />
            )}
            {props?.video?.src && <video {...props?.video} />}
            {props?.filter && <Filter $filter={filter} $opacity={opacity} />}
            {props?.children && <div>{props?.children}</div>}
        </Style>
    );
}
