import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      /* Read at runtime. Declared here rather than in the root turbo.json,
         which is shared tooling this app does not own. The hosted admin
         refuses to run without the four sign-in settings; see lib/config.ts. */
      "turbo/no-undeclared-env-vars": [
        "error",
        {
          allowList: [
            "NODE_ENV",
            "ADMIN_MODE",
            "ADMIN_URL",
            "URL",
            "SESSION_SECRET",
            "GITHUB_CLIENT_ID",
            "GITHUB_CLIENT_SECRET",
            "ALLOWED_GITHUB_USERS",
            "GITHUB_REPO_OWNER",
            "GITHUB_REPO_NAME",
            "GITHUB_REPO_BRANCH",
          ],
        },
      ],
    },
  },
  {
    files: ["next.config.js"],
    languageOptions: { globals: { process: "readonly" } },
  },
];
