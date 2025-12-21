/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SANITY_API_TOKEN?: string;
    readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
