import fs from "fs";

const manifest = fs.readFileSync("pack/manifest.json", "utf8");
const json = JSON.parse(manifest);
json.name = "@PACK_NAME@";
json.version = "@PACK_VERSION@";
json.files.sort((a: any, b: any) => a.projectID - b.projectID);
fs.writeFileSync("pack/manifest.json", JSON.stringify(json, null, 2));
