import * as common from "common_scripts/easy_unifier_common";

common.log("Starting up...");

let cache = null;
try {
    common.log("Loading cache...");
    cache = JsonIO.read("kubejs/config/easy_unifier_cache.json");
} catch (e) {}

if (cache && cache.results) {
    global["easyUnifierCache"] = JSON.parse(cache.toJson().toString());
    common.log("Loaded cache!");
} else {
    common.log("Cache is invalid or missing");
}
