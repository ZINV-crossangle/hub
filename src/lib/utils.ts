import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface Sorting {
    key: string;
    type: string;
    direction?: boolean | undefined;
}

export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export type ObjectFilter = { key?: string | string[]; value?: string | string[] } | undefined;
export type Filter = ObjectFilter | string[] | string | ObjectFilter[] | undefined;

export type ItemType = {
    [key: string]: any;
};

export function throttle(callback: (...args: any[]) => void, limit: number) {
    let lastCall = 0;

    return (...args: any[]) => {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            callback(...args);
        }
    };
}

const f = <T extends ItemType>(array: T[], filter: Filter | undefined, findOne: boolean): T[] | T | undefined => {
    if (!array.length) return findOne ? undefined : [];
    if (!filter) return findOne ? undefined : array || [];

    // Utility function to get the value from a nested key
    const getNestedValue = (obj: any, keyPath: string): any => {
        return keyPath.split(".").reduce((acc, key) => acc?.[key], obj);
    };

    const includesValue = (value: any, filter: string) => value?.toString().toLowerCase().includes(filter.toLowerCase());

    const objectFilter = (item: T, filter: ObjectFilter): boolean => {
        if (!filter) return true;

        const { key, value } = filter;
        const keys = Array.isArray(key) ? key : key ? [key] : [];
        const values = Array.isArray(value) ? value : value ? [value] : [];

        if (keys.length && values.length) {
            return keys.some((k) => values.some((v) => includesValue(getNestedValue(item, k), v)));
        }
        if (keys.length) {
            return keys.some((k) => getNestedValue(item, k) !== undefined);
        }
        if (values.length) {
            return values.some((v) => Object.values(item).some((value) => includesValue(value, v)));
        }
        return true; // No key and no value provided, return the item
    };

    const checkItem = (item: T): boolean => {
        if (typeof filter === "string") {
            return Object.values(item).some((value) => includesValue(value, filter));
        }

        if (Array.isArray(filter)) {
            if (filter.every((f) => typeof f === "string")) {
                // If filter is an array of strings
                return Object.values(item).some((value) => filter.some((f) => includesValue(value, f as string)));
            }

            if (filter.every((f) => typeof f === "object" && f !== null)) {
                // If filter is an array of object filters, apply them sequentially
                return filter.every((f) => objectFilter(item, f as ObjectFilter));
            }
        }

        if (typeof filter === "object" && filter !== null) {
            return objectFilter(item, filter as ObjectFilter);
        }

        return false;
    };

    if (findOne) {
        return array.find(checkItem);
    } else {
        return array.filter(checkItem);
    }
};

export const filter = <T extends ItemType = ItemType>(array: T[] = [], filter?: Filter): T[] => {
    return f(array, filter, false) as T[];
};

export const find = <T extends ItemType = ItemType>(array: T[] = [], filter?: Filter): T | undefined => {
    return f(array, filter, true) as T | undefined;
};

export function sort(array: any[] = [], key: string, type: string, direction: boolean | undefined = false) {
    if (!Array.isArray(array)) return [];

    const depth = (item: any, key: string) => {
        const keys = key.split(".");
        let value = item;
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) return undefined;
        }
        return value;
    };

    const exist = array.some((item) => depth(item, key) !== undefined);
    if (!exist) return [...array];

    switch (type) {
        case "string": {
            return [...array].sort((a, b) => {
                const x = depth(a, key);
                const y = depth(b, key);
                if (x === undefined || y === undefined) return 0;
                return direction ? x.localeCompare(y) : y.localeCompare(x);
            });
        }
        case "number": {
            return [...array].sort((a, b) => {
                const x = depth(a, key);
                const y = depth(b, key);
                if (x === undefined || y === undefined) return 0;
                return direction ? parseNumber(x) - parseNumber(y) : parseNumber(y) - parseNumber(x);
            });
        }
        default: {
            return [...array];
        }
    }
}

export function capitalize(text?: string) {
    if (!text || text === "") return "";
    const lower: string = text.toLowerCase();
    const cap: string = text.charAt(0).toUpperCase() + lower.slice(1);
    return cap;
}

const pattern = {
    email: /^[a-zA-Z0-9+]*$/,
    number: /^[0-9+]*$/,
    currency: /^[,.0-9]*$/,
};

type input = "email" | "number" | "currency" | "date" | string;
interface FormatOption {
    display?: boolean | number;
    limit?: number;
    unit?: boolean | number;
    fix?: number | "auto";
    max?: number;
    sign?: boolean;
    decimals?: number;
}

export function unit(value: number | string, upper?: number) {
    value = value?.toString()?.replaceAll(",", "").split(".")[0];
    upper = upper || 0;

    let copy: any = value.split(" ");
    let multiplier = 0;
    if (copy[1] && copy[1]?.length > 0) {
        if (copy[1]?.includes("T")) {
            multiplier = 12;
        } else if (copy[1]?.includes("M")) {
            multiplier = 9;
        } else if (copy[1]?.includes("B")) {
            multiplier = 6;
        } else if (copy[1]?.includes("K")) {
            multiplier = 3;
        }
    }
    value = copy[0] as string;

    let e = value?.split("e");
    if (e[1] && e[1]?.length > 0 && !isNaN(parseFloat(e[1]))) {
        copy = e[0]?.split(".");
        multiplier += parseFloat(e[1]) + copy[0].length + 1;
        if (multiplier < copy[0].length + (copy[1]?.length || 0)) {
            multiplier + copy[0].length - value.substring(0, multiplier).length;
        }
    }

    let unit = "";
    if (multiplier > 12 && 12 > upper) {
        unit = "T";
    } else if (multiplier > 9 && 9 > upper) {
        unit = "B";
    } else if (multiplier > 6 && 6 > upper) {
        unit = "M";
    } else if (multiplier > 3 && 3 > upper) {
        unit = "K";
    }
    return unit;
}

export function format(
    value?: number | string | bigint | false,
    type?: input,
    option?: boolean | number | FormatOption,
    fix?: number | "auto",
    max?: number,
    decimals?: number,
): string {
    let display = (typeof option === "object" && typeof option?.display === "boolean" && option?.display) || !!option;
    let limit =
        typeof option === "object" && typeof option?.limit === "number"
            ? option?.limit
            : typeof option === "number"
            ? option
            : undefined;
    let unit =
        typeof option === "object" &&
        (typeof option?.unit === "boolean" ? option?.unit : typeof option?.unit === "number" ? true : false);
    let upper = typeof option === "object" && typeof option?.unit === "number" ? option?.unit : 0;
    let signs = typeof option === "object" && typeof option?.sign === "boolean" ? option?.sign : true;
    decimals = typeof option === "object" && typeof option?.decimals === "number" ? option?.decimals : decimals;
    fix = typeof option === "object" ? option?.fix : fix === "auto" ? 3 : fix;
    max = typeof option === "object" ? option?.max : max;

    switch (type) {
        case "email": {
            if (!value) return "";
            if (typeof value !== "string") value = value.toString();
            if (value.indexOf("@") === 1) {
                let copy: string[] = value.split("@");
                if (0 < copy?.length && copy?.length < 2) {
                    const domain = copy[1]?.split(".");
                    console.log("domain", domain);
                } else {
                    console.log("error");
                }
            }
            return value;
        }
        case "int":
        case "number":
        case "numberic":
        case "currency": {
            if (value === undefined || value === null) return display ? "-" : "";
            if (value === false) return "0";
            if (typeof value === "number" && isNaN(value)) return display ? "-" : "";
            if (typeof value !== "number" && typeof value !== "string") return display ? "-" : "";
            value = value?.toString()?.replaceAll(",", "");
            if (value === "." || value === "0.") return display ? "0" : "0.";
            if (value === "" || value === "NaN" || value?.length <= 0) return display ? "0" : "";

            let sig = (signs && sign(value) === "-" && "-") || "";

            let copy: any = [value];
            let point = false;
            let num = false;
            let zero = 0;
            let multiplier = 0;
            let u = "";

            if (value?.includes("T")) {
                copy = value.split("T");
                multiplier = 12;
            } else if (value?.includes("B")) {
                copy = value.split("B");
                multiplier = 9;
            } else if (value?.includes("M")) {
                copy = value.split("M");
                multiplier = 6;
            } else if (value?.includes("K")) {
                copy = value.split("K");
                multiplier = 3;
            }
            value = copy[0].replaceAll(" ", "") as string;

            const e = value?.split("e");
            copy = e[0]?.split(".");
            if (e?.length > 1 && !isNaN(parseFloat(e[1]))) multiplier += parseFloat(e[1]);
            if (decimals) multiplier -= decimals;

            const m = Math.abs(multiplier);
            const n = copy[0]?.length;
            const d = copy[1]?.length || 0;

            if (multiplier < 0) {
                if (m > n) {
                    value = "0." + "0".repeat(m - n) + copy[0] + (copy[1] || "");
                } else {
                    value = copy[0]?.substring(0, n - m) + "." + copy[0]?.substring(n - m, copy[0].length) + (copy[1] || "");
                }
            } else if (multiplier > 0) {
                if (copy?.length > 1) {
                    if (m > d) {
                        value = copy[0] + copy[1] + "0".repeat(m - d);
                    } else {
                        value = copy[0] + copy[1]?.substring(0, d - m) + "." + copy[1]?.substring(d - m, copy[1]?.length);
                    }
                } else {
                    value = copy[0] + "0".repeat(m);
                }
            }

            copy = (value as string)?.split(".");
            if (unit && copy[0].length > upper) {
                let cut = copy.length;
                if (copy[0].length > 12) {
                    u = "T";
                    cut = 12;
                } else if (copy[0].length > 9) {
                    u = "B";
                    cut = 9;
                } else if (copy[0].length > 6) {
                    u = "M";
                    cut = 6;
                } else if (copy[0].length > 3) {
                    u = "K";
                    cut = 3;
                }
                cut = copy[0].length - cut;
                value = copy[0].substring(0, cut) + "." + copy[0].substring(cut, copy[0].length) + (copy[1] || "");
            }

            point = false;
            copy = "";
            for (let i = 0; i < value?.length; i++) {
                if ((!display && !point && value[i] === "0") || (!point && value[i] === ".") || !isNaN(parseInt(value[i]))) {
                    if (display && point && num && value[i] === "0") break;
                    if (point && !num && value[i] === "0") zero++;
                    if (point && value[i] !== "0") num = true;
                    if (!point && value[i] === ".") point = true;
                    copy += value[i];
                }
            }

            if (max) {
                const m = parseFloat(max?.toString()?.replaceAll(",", ""));
                copy = (parseFloat(copy?.toString) >= m ? max : copy).toString();
            }

            copy = copy?.split(".");
            if (display) {
                if (!num && (copy[0] === "" || copy[0] === "0")) {
                    point = false;
                    copy = ["0"];
                }
            }
            if (type === "currency") copy[0] = copy[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            let result = copy[0];
            if (type !== "int") {
                let dec: string | number = "";
                num = false;
                point = false;
                if (copy?.length > 1) {
                    point = true;
                    if (copy?.length > 2) {
                        for (let i = 2; i < copy?.length; i++) {
                            copy[1] += copy[i].toString();
                        }
                        copy[1] = copy[1]?.toString();
                    }

                    if (limit) {
                        let l = limit - copy[0].length;
                        const precision = copy[1].indexOf(copy[1].match(/[1-9]/)) + 1;
                        l =
                            l > precision
                                ? l
                                : copy[0].length > 1 || copy[0] !== "0"
                                ? l
                                : copy[1]?.length > 18
                                ? 18
                                : precision;
                        if (l > 0) copy[1] = copy[1]?.substring(0, l);
                    }

                    for (let i = 0; i < copy[1]?.length; i++) {
                        if (typeof fix === "number" && !isNaN(fix) && i >= fix && fix > zero) break;
                        if (!isNaN(parseInt(copy[1][i]))) {
                            if (display && copy[1][i] === "0" && num) break;
                            if (copy[1][i] !== "0") num = true;
                            dec += copy[1][i].toString();
                            if (
                                display &&
                                typeof fix === "number" &&
                                !isNaN(fix) &&
                                !isNaN(copy[1][i]) &&
                                copy[1][i] !== "0" &&
                                fix <= zero
                            )
                                break;
                        }
                    }

                    if (display && (copy[1]?.length === 0 || !num)) {
                        dec = "";
                        point = false;
                    }
                }
                result = result + (point ? "." : "") + dec;
            }
            return sig + (unit ? result + " " + u : result);
        }
        case "date": {
            if (value === undefined || value === null || value === false) return "-";
            if (typeof value !== "string") value = value.toString();
            if (value?.length > 10) value = value.substring(0, 10);

            let copy: any = "";
            for (let i = 0; i < value?.length; i++) {
                if (!isNaN(parseInt(value[i]))) {
                    copy += value[i];
                }
            }

            const d = new Date(copy * 1000);
            const date =
                ("0" + d.getDate()).slice(-2) +
                "-" +
                ("0" + (d.getMonth() + 1)).slice(-2) +
                "-" +
                d.getFullYear().toString().substring(2, 4);
            const time =
                ("0" + d.getHours()).slice(-2) +
                ":" +
                ("0" + d.getMinutes()).slice(-2) +
                ":" +
                ("0" + d.getSeconds()).slice(-2);
            return date + " " + time;
        }
        case "duration": {
            value = parseNumber(value || 0);
            const unit: string[] = ["Y", "M", "w", "d", "h", "m", "s"];
            const date: number[] = [
                Math.floor(value / 31536000),
                Math.floor((value % 31536000) / 2592000),
                Math.floor((value % 2592000) / 604800),
                Math.floor((value % 604800) / 86400),
                Math.floor((value % 86400) / 3600),
                Math.floor((value % 3600) / 60),
                Math.floor(value % 60),
            ];
            let check: boolean = false;
            let start: number = 0;
            let time: any[] = date.map((t: number, i: number) => {
                if (!check && t !== 0) {
                    check = true;
                    start = i;
                }
                if (check) {
                    return `${start <= 4 && i > start && t < 10 ? `0${t}` : t} ${unit[i]}`;
                }
            });
            let result: string = time.join(" ");
            return result
                .substring(result[0] === " " ? 1 : 0, result.length)
                .replaceAll("   ", "")
                .replaceAll("  ", "");
        }
        default: {
            if (typeof value === "undefined") return "";
            return value.toString();
        }
    }
}

export function isNumber(value?: any) {
    return typeof value === "number" && !isNaN(value);
}

export function parseNumber(value?: number | string | bigint, decimals?: number | string, max?: number): number {
    const n = Number(
        format(
            value,
            "number",
            true,
            undefined,
            max,
            typeof decimals === "number" ? decimals : typeof decimals === "string" ? parseInt(decimals) : undefined,
        ),
    );
    return isNaN(n) ? 0 : n || 0;
}

export function sign(value?: number | string): string {
    if (typeof value !== "number" && typeof value !== "string") return "";
    else {
        value = parseFloat(value?.toString());
        if (isNaN(value)) return "";
        return value > 0 ? "+" : value < 0 ? "-" : "";
    }
}

export function getFees(n: number | string, fee: number, divider?: number) {
    return (parseFloat(format(n, "number").toString()) * fee) / (divider || 10000);
}

export function getAverageRGB(pixels: Uint8ClampedArray): RGBColor {
    let r = 0,
        g = 0,
        b = 0;

    for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        // Skip alpha channel pixels[i + 3] if not needed
    }

    const numPixels = pixels.length / 4;
    r = Math.floor(r / numPixels);
    g = Math.floor(g / numPixels);
    b = Math.floor(b / numPixels);

    return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export async function getDominantColor(src: string) {
    if (!src || src === "") return "#fff";
    try {
        // Create an Image object
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;

        // Wait for the image to load
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Ensure ctx is not null before proceeding
        if (!ctx) {
            throw new Error("Failed to get 2D context from canvas");
        }

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0);

        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Calculate the average color
        const averageColor = getAverageRGB(pixels);

        // Return the dominant color as hex value
        return rgbToHex(averageColor.r, averageColor.g, averageColor.b);
    } catch (error) {
        console.error("Error:", error);
        return "#FFFFFF"; // Default white color in case of error
    }
}

export function HexToColor(address: string) {
    if (address === "" || address?.length === 0) return "";
    const HEX = "0123456789abcdef";
    let t = BigInt(address);
    let o = 136;
    t >>= BigInt(o);

    let b = new Array(6);
    for (let i = b.length; i > 0; i--) {
        b[i - 1] = HEX[Number(t & BigInt(0xf))];
        t >>= BigInt(4);
    }
    return b.join("");
}
