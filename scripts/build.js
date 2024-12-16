import { fileURLToPath } from "node:url";
import { build } from "vite";
import { resolve } from "node:path";
import fs from "fs-extra";

const projectDir = fileURLToPath(new URL("../", import.meta.url));
const resolveLibName = (lib) => `./src/extension/${lib}/index.js`;

const libs = ["background", "content"];
const dist = resolve(projectDir, "./dist");
const publicDir = resolve(projectDir, "./public");

// Додаткова функція для створення незалежних бандлів
function createStagedBuildConfig(lib) {
    return {
        build: {
            minify: false,
            lib: {
                entry: resolve(projectDir, resolveLibName(lib)),
                name: lib,
                formats: ["iife"], // Формат для самодостатніх файлів
                fileName: () => `${lib}.js`,
            },
            rollupOptions: {
                output: {
                    manualChunks: undefined, // Вимикаємо поділ на спільні чанки
                },
            },
            outDir: dist,
            copyPublicDir: false,
            emptyOutDir: false,
        },
        resolve: {
            alias: {
                "@": resolve(projectDir, "./src"),
            },
        },
    };
}

async function prepare() {
    await fs.emptyDir(dist);
    await fs.copy(publicDir, dist);
}

await prepare();

for (const lib of libs) {
    await build({ ...createStagedBuildConfig(lib), configFile: false });
}
