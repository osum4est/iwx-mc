import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import archiver from "archiver";

const PROJECT_ID = 637490;
const PACK_NAME = "IWX MC";
const PACK_VERSION = "1.0.0";

const ZIP_NAME = `IWX MC-${PACK_VERSION}`;
const BUILD_DIR = "./build";
const PACK_BUILD_DIR = path.join(BUILD_DIR, ZIP_NAME);

const PACK_DIR = "./pack";
const SRC_DIR = "./src";

(async () => {
    console.log(`Building pack in ${BUILD_DIR}`);
    if (fs.existsSync(BUILD_DIR)) fs.rmSync(BUILD_DIR, { recursive: true });
    fs.mkdirSync(PACK_BUILD_DIR, { recursive: true });

    console.log("Copying files");
    copyFiles();

    console.log("Updating configs");
    updateConfigs();

    console.log(`Building TypeScript`);
    await Promise.all([
        buildFolder("kubejs/server_scripts"),
        buildFolder("kubejs/client_scripts"),
        buildFolder("kubejs/startup_scripts")
    ]);

    console.log(`Making zip`);
    await makeZip();

    console.log(`Done!`);
})();

function copyFiles() {
    const files = glob.sync(`${PACK_DIR}/**/*`);
    let count = 0;
    for (const file of files) {
        if (fs.statSync(file).isFile()) {
            const dest = path.join(PACK_BUILD_DIR, file.replace(PACK_DIR, ""));
            if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(file, dest);
            count++;
        }
    }
    console.log(`Copied ${count} files`);
}

function updateConfigs() {
    const filesToUpdate = ["manifest.json", "overrides/config/bcc-common.toml"];

    const replacements: { [key: string]: string | number } = {
        PROJECT_ID,
        PACK_NAME,
        PACK_VERSION
    };

    for (const file of filesToUpdate) {
        let contents = fs.readFileSync(path.join(PACK_BUILD_DIR, file), "utf8");
        for (const key of Object.keys(replacements))
            contents = contents.replace(`@${key}@`, replacements[key].toString());
        fs.writeFileSync(path.join(PACK_BUILD_DIR, file), contents, "utf8");
    }
}

async function buildFolder(folder: string) {
    const srcs = glob.sync(path.join(SRC_DIR, folder, "**/*.ts"));
    if (!srcs.length) return;

    for (const src of srcs) {
        const res = await rollup({
            input: src,
            output: {
                format: "cjs"
            },
            plugins: [
                typescript({
                    tsconfig: "./src/kubejs/tsconfig.json"
                })
            ]
        });

        await res.write({
            dir: path.join(PACK_BUILD_DIR, "overrides", folder)
        });
    }

    console.log(`Built ${folder}`);
}

async function makeZip() {
    const zip = archiver.create("zip", {});
    zip.pipe(fs.createWriteStream(path.join(BUILD_DIR, `${ZIP_NAME}.zip`)));
    zip.directory(PACK_BUILD_DIR, false);
    await zip.finalize();
}
