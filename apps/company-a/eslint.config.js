import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      /* Read at runtime by the enquiry route. Declared here rather than in
         the root turbo.json, which is shared tooling this app does not own. */
      "turbo/no-undeclared-env-vars": [
        "error",
        { allowList: ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"] },
      ],
    },
  },
];
