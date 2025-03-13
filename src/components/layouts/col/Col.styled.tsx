"use client";
import { Root } from "lib/style";
import { css, styled } from "styled-components";

const gap = css`
    gap: calc(var(--gap) / 2);

    & > & {
        --gap: calc(var(--gap) / 2);
        gap: var(--gap);
    }
`;

const Style = styled.div<{
    $gap: number;
    $fit: boolean;
    $padding: { top: number; left: number; right: number; bottom: number };
    $responsive?: "desktop" | "laptop" | "tablet" | "mobile";
    $reverse?: boolean;
    $fix?: boolean;
    $fill?: boolean;
}>`
    --gap: ${({ $gap }) => ($gap === 0 ? 0 : $gap || 4)}em;

    display: flex;
    flex-direction: ${({ $reverse }) => ($reverse ? "column-reverse" : "column")};
    width: ${({ $fit }) => ($fit ? "max-content" : "-webkit-fill-available")};
    ${({ $fill }) =>
        $fill &&
        css`
            height: -webkit-fill-available;
        `}

    & > *:not(img) {
        width: -webkit-fill-available;
    }

    gap: calc(var(--gap));
    & > & {
        gap: calc(var(--gap) / 2);

        & > & {
            gap: calc(var(--gap) / 4);

            & > & {
                gap: calc(var(--gap) / 8);

                & > & {
                    gap: calc(var(--gap) / 16);

                    & > & {
                        gap: calc(var(--gap) / 32);
                    }
                }
            }
        }
    }

    ${({ $padding, $fit }) => css`
        padding: ${$padding?.top}em ${$padding?.right}em ${$padding?.bottom}em ${$padding?.left}em;
        width: calc(100% - ${$padding?.left + $padding?.right}em);
        ${$fit
            ? `height: calc(100% - ${$padding?.top + $padding?.bottom}em); min-height: max-content;`
            : `height: max-content; min-height: calc(100% - ${$padding?.top + $padding?.bottom}em);`}
    `}

    ${({ $responsive, $reverse }) => {
        switch ($responsive) {
            case "laptop":
                return css`
                    @media all and(max-width: ${Root.Device.Laptop}px) {
                        flex-direction: ${$reverse ? "row-reverse" : "row"};
                        justify-content: inherit;
                        align-items: center;
                        ${gap}
                    }
                `;
            case "tablet":
                return css`
                    @media all and(max-width: ${Root.Device.Tablet}px) {
                        flex-direction: ${$reverse ? "row-reverse" : "row"};
                        justify-content: inherit;
                        align-items: center;
                        ${gap}
                    }
                `;
            case "mobile":
                return css`
                    @media all and(max-width: ${Root.Device.Mobile}px) {
                        flex-direction: ${$reverse ? "row-reverse" : "row"};
                        justify-content: inherit;
                        align-items: center;
                        ${gap}
                    }
                `;
        }
    }}

    @media all and(max-width: ${Root.Device.Mobile}px) {
        ${gap}
    }
`;

export default Style;
