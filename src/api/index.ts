import request from "graphql-request";
import { getQueryClient } from "./client";
import { prefetch } from "./prefetch";
import * as schema from "./schema";

const URLS = {
    PROXY: {
        API: `${process.env.BASE_URL || "https://beta.coinmeca.net"}/api`,
        LANGUAGE: `${process.env.BASE_URL || "https://beta.coinmeca.net"}/api/language`,
        METADATA: process.env.BASE_URL ? `${process.env.BASE_URL}/api/metadata` : "https://web3.coinmeca.net",
    },
    API: process.env.API_URL || "https://beta.coinmeca.net/api",
    METADATA: process.env.METADATA_URL || "https://web3.coinmeca.net",
};

const fetcher = {
    url: async (url: string, option?: RequestInit): Promise<Response | undefined> => {
        try {
            return await fetch(new URL(url), option);
        } catch (error) {
            console.error("Error fetching URL:", url, error);
            throw error;
        }
    },
    json: async <T>(url: string, option?: RequestInit): Promise<T> => {
        try {
            const response = await fetcher.url(url, option);
            if (response?.ok) return response.json() as T;
            return undefined as T;
        } catch (error) {
            console.error("Error fetching JSON:", url, error);
            throw error;
        }
    },
    metadata: async <T>(path: string, option?: RequestInit): Promise<T> => {
        return await fetcher.json<T>(`${URLS.METADATA}/${path?.replace(/\./g, "/")}.json`, option);
    },
    gql: async <T>(query: string): Promise<T> => {
        try {
            return await request<T>(`${URLS.PROXY.API}/query`, query);
        } catch (err) {
            console.error(`GraphQL Error: ${err}`);
            throw err;
        }
    },
};

export { getQueryClient, prefetch, schema, fetcher, URLS };
