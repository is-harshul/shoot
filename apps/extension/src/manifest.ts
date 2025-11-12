import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Shoot",
  description: "Quickly share links with friends and groups.",
  version: "0.0.1",
  action: {
    default_popup: "index.html",
    default_title: "Shoot",
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  permissions: ["activeTab", "storage", "identity", "notifications"],
  host_permissions: ["<all_urls>"],
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content-script/main.ts"],
      css: ["src/content-script/styles.css"],
      run_at: "document_idle",
    },
  ],
  web_accessible_resources: [
    {
      resources: ["src/content-script/styles.css"],
      matches: ["<all_urls>"],
    },
  ],
});
