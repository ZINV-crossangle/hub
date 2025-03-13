"use client";
import { Theme, WindowSize } from "contexts";
import { Style } from "lib";
import { HydrationBoundary, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "api/client";
import { StrictMode } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const client = getQueryClient();

    return (
        <StrictMode>
            <WindowSize>
                <Theme>
                    <QueryClientProvider {...{ client }}>
                        <HydrationBoundary state={dehydrate(client)}>
                            <Style.Initialize>{children}</Style.Initialize>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </HydrationBoundary>
                    </QueryClientProvider>
                </Theme>
            </WindowSize>
        </StrictMode>
    );
}
