import { defineConfig } from "vitest/config";
import pkg from "./package.json";

export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: "dist",
		lib: {
			name: pkg.name,
			entry: "./src/index.ts",
			fileName: "index",
		},
	},
	test: {
		coverage: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100,
		},
	},
});
