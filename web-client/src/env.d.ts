interface ImportMetaEnv {
  readonly VITE_APP_BACKEND_PORT: number
  readonly VITE_APP_BACKEND_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
