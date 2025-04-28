import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [],
      manifest: {
        name: "북끄북끄",
        short_name: "북끄북끄",
        description:
          "북(Book)을 끄집어내고, 북(Book)을 (읽고) 끄적이다. 사용자가 소장한 책을 쉽게 등록하고 다른 사람들과 교환할 수 있으며 독서 기록까지 가능한 서비스",
        theme_color: "#fffdf8",
        icons: [],
      },
    }),
  ],
});
