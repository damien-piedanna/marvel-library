// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    buildModules: ['@nuxtjs/tailwindcss'],
    publicRuntimeConfig: {
        API_BASE_URL: process.env.API_BASE_URL,
        API_PUBLIC_KEY: process.env.API_PUBLIC_KEY,
        API_PRIVATE_KEY: process.env.API_PRIVATE_KEY
    },
    app: {
        head: {
            title: 'Marvel test',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    name: 'Marvel test',
                    content: 'Marvel test application',
                },
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        },
    },
})
