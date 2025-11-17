import { ServerConfig } from "../components/ConfigBuilder";


export const Server = ServerConfig({
    baseUrl: "https://api.constructified.com/api",
    //http://213.5.71.77:3333/api", 
    //"https://caring-endurance-production.up.railway.app/api/",
    // //'https://main-main.up.railway.app/api/',
    crypto: {
        TOKEN: "59200748-36fc-2744-355-8c1281f7fcd2",
        AES_SECRET: "kXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z",
        AES_IV: "I8zyA4lVhMCaJ5Kg"
    },
})
