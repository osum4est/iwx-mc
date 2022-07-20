import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import archiver from "archiver";
import { program } from "commander";
import * as https from "https";
import * as child_process from "child_process";

const PROPERTIES: { [key: string]: string | number } = {
    PROJECT_ID: 637490,
    PACK_NAME: "IWX MC",
    PACK_VERSION: "1.0.1"
};

const FILES_TO_UPDATE = ["manifest.json", "**/config/bcc-common.toml"];

const CLIENT_ONLY_MODS = [
    "rubidium",
    "betteradvancements",
    "betterfoliage",
    "betterthirdperson",
    "betterf3",
    "equipmentcompare",
    "farsight",
    "dynamiclights",
    "oculus",
    "nekosenchantedbooks",
    "legendarytooltips",
    "ding-",
    "entityculling-forge",
    "mousetweaks-forge"
];

const BUILD_DIR = "./build";
const PACK_BUILD_DIR = path.join(BUILD_DIR, "instance");

const SRC_DIR = "./src";
const PACK_DIR = "./pack";
const PACK_OVERRIDES_DIR = "./pack_overrides";
const SERVER_PACK_OVERRIDES_DIR = "./server_pack_overrides";

(async () => {
    program.option("-s, --server <mods dir>", "build server pack using the specified mods directory").parse();

    const { server } = program.opts<{ server: string }>();
    if (!fs.existsSync(server)) {
        console.error(`${server} is not a directory`);
        process.exit(1);
    }

    console.log(`Building${server ? " server " : " "}pack in ${BUILD_DIR}`);
    if (fs.existsSync(BUILD_DIR)) fs.rmSync(BUILD_DIR, { recursive: true });
    fs.mkdirSync(PACK_BUILD_DIR, { recursive: true });

    if (server) {
        console.log("Setting up forge");
        await setUpForge();
    }

    console.log("Copying files");
    if (server) {
        copyFiles(PACK_OVERRIDES_DIR, PACK_BUILD_DIR);
        copyFiles(SERVER_PACK_OVERRIDES_DIR, PACK_BUILD_DIR);
        copyMods(server, path.join(PACK_BUILD_DIR, "mods"));
    } else {
        copyFiles(PACK_DIR, PACK_BUILD_DIR);
        copyFiles(PACK_OVERRIDES_DIR, path.join(PACK_BUILD_DIR, "overrides"));
    }

    console.log("Updating configs");
    updateConfigs();

    console.log(`Building TypeScript`);
    const dir = server ? PACK_BUILD_DIR : path.join(PACK_BUILD_DIR, "overrides");
    await Promise.all([
        buildFolder("kubejs/server_scripts", dir),
        buildFolder("kubejs/client_scripts", dir),
        buildFolder("kubejs/startup_scripts", dir)
    ]);

    console.log(`Making zip`);
    let zipName = `${PROPERTIES.PACK_NAME}-${PROPERTIES.PACK_VERSION}`;
    if (server) zipName += "-server";
    await makeZip(zipName + ".zip");

    console.log(`Done!`);
})();

async function setUpForge() {
    const manifest = JSON.parse(fs.readFileSync(path.join(PACK_DIR, "manifest.json"), "utf8"));
    const minecraftVersion = manifest.minecraft.version;
    const forgeVersion = manifest.minecraft.modLoaders.find((l: any) => l.primary)?.id;
    if (!forgeVersion || !forgeVersion.startsWith("forge-")) {
        console.error("Mod loader not supported");
        process.exit(1);
    }

    const version = `${minecraftVersion}-${forgeVersion.split("-")[1]}`;
    const url = `https://maven.minecraftforge.net/net/minecraftforge/forge/${version}/forge-${version}-installer.jar`;
    const installerPath = path.join(BUILD_DIR, `forge-${version}-installer.jar`);

    console.log("Downloading forge");
    await downloadFile(url, installerPath);

    console.log("Installing forge");
    child_process.execSync(`java -jar ${installerPath} --installServer ${PACK_BUILD_DIR}`);
}

function downloadFile(url: string, dest: string) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, res => {
            if (res.statusCode !== 200) {
                reject(`Failed to download ${url}: ${res.statusCode}`);
                return;
            }
            res.pipe(fs.createWriteStream(dest));
            res.on("end", resolve);
        });
        req.on("error", reject);
    });
}

function copyFiles(from: string, to: string) {
    const files = glob.sync(`${from}/**/*`);
    let count = 0;
    for (const file of files) {
        if (!fs.statSync(file).isFile()) continue;
        const dest = path.join(to, file.replace(from, ""));
        if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
        count++;
    }
    console.log(`Copied ${count} files`);
}

function copyMods(from: string, to: string) {
    const files = glob.sync(`${from}/*.jar`);
    let count = 0;

    for (const file of files) {
        if (CLIENT_ONLY_MODS.find(text => file.toLowerCase().startsWith(text.toLowerCase()))) continue;
        const dest = path.join(to, file.replace(from, ""));
        if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
        count++;
    }

    console.log(`Copied ${count} mods`);
}

function updateConfigs() {
    for (const globFile of FILES_TO_UPDATE) {
        for (const file of glob.sync(path.join(BUILD_DIR, globFile))) {
            console.log("Updating " + file);
            let contents = fs.readFileSync(file, "utf8");
            for (const key of Object.keys(PROPERTIES))
                contents = contents.replace(`@${key}@`, PROPERTIES[key].toString());
            fs.writeFileSync(file, contents, "utf8");
        }
    }
}

async function buildFolder(folder: string, outDir: string) {
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
            dir: path.join(outDir, folder)
        });
    }

    console.log(`Built ${folder}`);
}

async function makeZip(name: string) {
    const zip = archiver.create("zip", {});
    zip.pipe(fs.createWriteStream(path.join(BUILD_DIR, name)));
    zip.directory(PACK_BUILD_DIR, false);
    await zip.finalize();
}
