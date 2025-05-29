import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import VitePluginVueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  // transpileDependencies: true,
  // configureWebpack: {
  //     resolve: {
  //         fallback: {
  //             crypto: require.resolve('crypto-browserify'),
  //             stream: require.resolve('stream-browserify')
  //         }
  //     }
  // },
  plugins: [
    vue(),
    VitePluginVueDevTools(),
    vueJsxPlugin(),
    tailwindcss(),
    createSvgIconsPlugin({
      // 指定 SVG图标 保存的文件夹路径
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // 指定 使用svg图标的格式
      symbolId: "icon-[dir]-[name]",
      // 指定要生成的组件名称
      // svgsDir: 'src/svgs',
    }),
  ],

  server: {
    port: 5174,
    proxy: {
      "/ws": {
        target: "wss://dashscope.aliyuncs.com/api-ws/v1/inference",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ""),
        headers: {
          Authorization: "bearer sk-653411b8109548618bfe591a57835303", // 将<your_dashscope_api_key>替换成您自己的API Key
          // "user-agent": "your_platform_info", //可选
          // "X-DashScope-WorkSpace": workspace, // 可选
          "X-DashScope-DataInspection": "enable",
        },
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ai-chat-api": {
        target:
          "http://1655842709039806.cn-shanghai.pai-eas.aliyuncs.com/api/predict/quickstart_deploy_20250323_12x3",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-chat-api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
