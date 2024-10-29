import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://marvyk.github.io',
    base: '/PrimalCulture2024',
    image: {
        service: {
            entrypoint: 'astro/assets/services/sharp'
        }
    }
});