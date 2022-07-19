import * as common from "common_scripts/easy_unifier_common";

onEvent("jei.hide.items", e => {
    common.log("Hiding items");
    const start = new Date().getTime();

    let results = common.findItemsCached();
    if (!results) return;

    for (const item of Object.values(results.duplicates)) {
        common.log("Hiding item " + item.id);
        e.hide(item.id);
    }

    common.log(`Took ${new Date().getTime() - start}ms`);
});
