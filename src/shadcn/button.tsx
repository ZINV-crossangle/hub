import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

function Button({
    className,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> & {
    asChild?: boolean;
}) {
    const Comp = asChild ? Slot : "button";

    return <Comp data-slot="button" className={cn(className)} {...props} />;
}

export { Button };
