// vite.config.ts
import { defineConfig, loadEnv } from "file:///F:/Project-Ts/jsw/kpmg-dpr-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///F:/Project-Ts/jsw/kpmg-dpr-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import rollupNodePolyFill from "file:///F:/Project-Ts/jsw/kpmg-dpr-frontend/node_modules/rollup-plugin-node-polyfills/dist/index.js";
import { NodeGlobalsPolyfillPlugin } from "file:///F:/Project-Ts/jsw/kpmg-dpr-frontend/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import fs from "fs";
import svgr from "file:///F:/Project-Ts/jsw/kpmg-dpr-frontend/node_modules/vite-plugin-svgr/dist/index.mjs";
var __vite_injected_original_dirname = "F:\\Project-Ts\\jsw\\kpmg-dpr-frontend";
var replace = (val) => {
  return val.replace(/^~/, "");
};
var vite_config_default = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    base: process.env.VITE_BASE_URL || "/",
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          titleProp: false
        }
      })
    ],
    define: {
      global: "globalThis"
    },
    server: {
      port: 3e3,
      cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "PATCH", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ["node_modules", "./src/assets"]
        }
      }
      // postcss: {
      //   plugins: [require("postcss-rtl")()],
      // },
    },
    resolve: {
      alias: [
        {
          find: /^~.+/,
          // replacement: '',
          replacement: replace
        },
        {
          find: "stream",
          replacement: "stream-browserify"
        },
        { find: "stream", replacement: "stream-browserify" },
        { find: "crypto", replacement: "crypto-browserify" },
        { find: "@src", replacement: path.resolve(__vite_injected_original_dirname, "src") },
        { find: "@store", replacement: path.resolve(__vite_injected_original_dirname, "src/redux") },
        { find: "@configs", replacement: path.resolve(__vite_injected_original_dirname, "src/configs") },
        {
          find: "url",
          replacement: "rollup-plugin-node-polyfills/polyfills/url"
        },
        {
          find: "@styles",
          replacement: path.resolve(__vite_injected_original_dirname, "src/@core/scss")
        },
        {
          find: "util",
          replacement: "rollup-plugin-node-polyfills/polyfills/util"
        },
        {
          find: "zlib",
          replacement: "rollup-plugin-node-polyfills/polyfills/zlib"
        },
        {
          find: "@utils",
          replacement: path.resolve(__vite_injected_original_dirname, "src/utility/Utils")
        },
        {
          find: "@hooks",
          replacement: path.resolve(__vite_injected_original_dirname, "src/utility/hooks")
        },
        {
          find: "@assets",
          replacement: path.resolve(__vite_injected_original_dirname, "src/@core/assets")
        },
        {
          find: "@@assets",
          replacement: path.resolve(__vite_injected_original_dirname, "src/assets")
        },
        {
          find: "@layouts",
          replacement: path.resolve(__vite_injected_original_dirname, "src/@core/layouts")
        },
        {
          find: "assert",
          replacement: "rollup-plugin-node-polyfills/polyfills/assert"
        },
        {
          find: "buffer",
          replacement: "rollup-plugin-node-polyfills/polyfills/buffer-es6"
        },
        {
          find: "process",
          replacement: "rollup-plugin-node-polyfills/polyfills/process-es6"
        },
        {
          find: "@components",
          replacement: path.resolve(__vite_injected_original_dirname, "src/@core/components")
        },
        {
          find: "@@components",
          replacement: path.resolve(__vite_injected_original_dirname, "src/views/components")
        },
        {
          find: "@modules",
          replacement: path.resolve(__vite_injected_original_dirname, "src/modules")
        }
      ]
    },
    //   esbuild: {
    //     // loader: 'jsx',
    //     // include: /.\/src\/.*\.js?$/,
    //     // exclude: [],
    //     jsx: 'automatic'
    //   },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx"
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true
          }),
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFileSync(args.path, "utf8")
              }));
            }
          }
        ]
      }
    },
    build: {
      rollupOptions: {
        plugins: [rollupNodePolyFill()]
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxQcm9qZWN0LVRzXFxcXGpzd1xcXFxrcG1nLWRwci1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcUHJvamVjdC1Uc1xcXFxqc3dcXFxca3BtZy1kcHItZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L1Byb2plY3QtVHMvanN3L2twbWctZHByLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7LyoqIEB0eXBlIHtpbXBvcnQoJ3ZpdGUnKS5Vc2VyQ29uZmlnfSAqL1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgcm9sbHVwTm9kZVBvbHlGaWxsIGZyb20gJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnXHJcbmltcG9ydCB7IE5vZGVHbG9iYWxzUG9seWZpbGxQbHVnaW4gfSBmcm9tICdAZXNidWlsZC1wbHVnaW5zL25vZGUtZ2xvYmFscy1wb2x5ZmlsbCdcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xyXG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJ1xyXG5cclxuY29uc3QgcmVwbGFjZTogYW55ID0gKHZhbCkgPT4ge1xyXG4gIHJldHVybiB2YWwucmVwbGFjZSgvXn4vLCAnJylcclxufVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9PiB7XHJcbiAgcHJvY2Vzcy5lbnYgPSB7IC4uLnByb2Nlc3MuZW52LCAuLi5sb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpIH1cclxuXHJcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcbiAgICBiYXNlOiBwcm9jZXNzLmVudi5WSVRFX0JBU0VfVVJMIHx8ICcvJyxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgcmVhY3QoKSxcclxuICAgICAgc3Zncih7XHJcbiAgICAgICAgc3Znck9wdGlvbnM6IHtcclxuICAgICAgICAgIHRpdGxlUHJvcDogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICBdLFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIHBvcnQ6IDMwMDAsXHJcbiAgICAgIGNvcnM6IHtcclxuICAgICAgICBvcmlnaW46IFsnaHR0cDovL2xvY2FsaG9zdDozMDAwJ10sXHJcbiAgICAgICAgbWV0aG9kczogWydHRVQnLCAnUEFUQ0gnLCAnUFVUJywgJ1BPU1QnLCAnREVMRVRFJywgJ09QVElPTlMnXSxcclxuICAgICAgICBhbGxvd2VkSGVhZGVyczogWydDb250ZW50LVR5cGUnLCAnQXV0aG9yaXphdGlvbicsICdYLVJlcXVlc3RlZC1XaXRoJ11cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgaW5jbHVkZVBhdGhzOiBbJ25vZGVfbW9kdWxlcycsICcuL3NyYy9hc3NldHMnXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBwb3N0Y3NzOiB7XHJcbiAgICAgIC8vICAgcGx1Z2luczogW3JlcXVpcmUoXCJwb3N0Y3NzLXJ0bFwiKSgpXSxcclxuICAgICAgLy8gfSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogL15+LisvLFxyXG4gICAgICAgICAgLy8gcmVwbGFjZW1lbnQ6ICcnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHJlcGxhY2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdzdHJlYW0nLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdzdHJlYW0tYnJvd3NlcmlmeSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgZmluZDogJ3N0cmVhbScsIHJlcGxhY2VtZW50OiAnc3RyZWFtLWJyb3dzZXJpZnknIH0sXHJcbiAgICAgICAgeyBmaW5kOiAnY3J5cHRvJywgcmVwbGFjZW1lbnQ6ICdjcnlwdG8tYnJvd3NlcmlmeScgfSxcclxuICAgICAgICB7IGZpbmQ6ICdAc3JjJywgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSB9LFxyXG4gICAgICAgIHsgZmluZDogJ0BzdG9yZScsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3JlZHV4JykgfSxcclxuICAgICAgICB7IGZpbmQ6ICdAY29uZmlncycsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbmZpZ3MnKSB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICd1cmwnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy91cmwnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAnQHN0eWxlcycsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9AY29yZS9zY3NzJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICd1dGlsJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAncm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvdXRpbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICd6bGliJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAncm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvemxpYidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAdXRpbHMnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvdXRpbGl0eS9VdGlscycpXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAnQGhvb2tzJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3V0aWxpdHkvaG9va3MnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ0Bhc3NldHMnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvQGNvcmUvYXNzZXRzJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAQGFzc2V0cycsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9hc3NldHMnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ0BsYXlvdXRzJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL0Bjb3JlL2xheW91dHMnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ2Fzc2VydCcsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL2Fzc2VydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdidWZmZXInLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9idWZmZXItZXM2J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ3Byb2Nlc3MnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9wcm9jZXNzLWVzNidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAY29tcG9uZW50cycsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9AY29yZS9jb21wb25lbnRzJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAQGNvbXBvbmVudHMnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvdmlld3MvY29tcG9uZW50cycpXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAnQG1vZHVsZXMnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbW9kdWxlcycpXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy8gICBlc2J1aWxkOiB7XHJcbiAgICAvLyAgICAgLy8gbG9hZGVyOiAnanN4JyxcclxuICAgIC8vICAgICAvLyBpbmNsdWRlOiAvLlxcL3NyY1xcLy4qXFwuanM/JC8sXHJcbiAgICAvLyAgICAgLy8gZXhjbHVkZTogW10sXHJcbiAgICAvLyAgICAganN4OiAnYXV0b21hdGljJ1xyXG4gICAgLy8gICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGVzYnVpbGRPcHRpb25zOiB7XHJcbiAgICAgICAgbG9hZGVyOiB7XHJcbiAgICAgICAgICAnLmpzJzogJ2pzeCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgIE5vZGVHbG9iYWxzUG9seWZpbGxQbHVnaW4oe1xyXG4gICAgICAgICAgICBidWZmZXI6IHRydWUsXHJcbiAgICAgICAgICAgIHByb2Nlc3M6IHRydWVcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgICAgICAgICBzZXR1cChidWlsZCkge1xyXG4gICAgICAgICAgICAgIGJ1aWxkLm9uTG9hZCh7IGZpbHRlcjogL3NyY1xcXFwuKlxcLmpzJC8gfSwgYXN5bmMgKGFyZ3MpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBsb2FkZXI6ICdqc3gnLFxyXG4gICAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlU3luYyhhcmdzLnBhdGgsICd1dGY4JylcclxuICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBwbHVnaW5zOiBbcm9sbHVwTm9kZVBvbHlGaWxsKCldXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sd0JBQXdCO0FBQy9CLFNBQVMsaUNBQWlDO0FBQzFDLE9BQU8sUUFBUTtB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
