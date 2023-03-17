import { createContext } from "react";

export interface DemoContextValues {
    query: string,
    setQuery: (query: string) => void
    html: string,
    setHtml: (html: string) => void
    // outputLang: "json5" | "yaml"
    // setOutputLang: (lang: "json5" | "yaml") => void;
    // reset: () => void;
    runQuery: () => void;
}
export const DemoContext = createContext<DemoContextValues | null>(null)