interface ServerOptions {
    baseUrl: string,
    crypto: {
        TOKEN: string,
        AES_SECRET: string,
        AES_IV: string
    }
}
export const ServerConfig = (options: ServerOptions) => Object.freeze(options)