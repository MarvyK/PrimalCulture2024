import { defineConfig } from "astro/config";

export default defineConfig({
  // Staging on Github
  // site: "https://marvyk.github.io",
  // base: "",

  //LIVE
  site: "https://primalculture.co.za",
  output: "static",
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
});
