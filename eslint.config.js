import sveltePlugin from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";

export default [
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        ecmaVersion: "latest", // 최신 JavaScript 지원
        sourceType: "module",
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      svelte: sveltePlugin,
    },
    rules: {
      "no-console": "warn",              // console 사용을 경고
      "eqeqeq": "warn",                 // ===와 !== 사용 강제
      "semi": ["error", "always"],       // 세미콜론 필수
      // "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // 미사용 변수 금지
      // "quotes": ["error", "single"],     // 작은따옴표 사용
      // "indent": ["error", 2],            // 2칸 들여쓰기
      // "comma-dangle": ["error", "never"] // 끝 콤마 금지
    },
  },
];