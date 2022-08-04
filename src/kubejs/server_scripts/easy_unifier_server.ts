// priority: 1

import * as common from "common_scripts/easy_unifier_common";
import { AnalyzeResults } from "common_scripts/easy_unifier_common";
import EasyUnifierConfig from "common_scripts/easy_unifier_config";
import { JsonReference } from "common_scripts/json_reference";

export interface EasyUnifierRecipe {
    id: string;
    mod: string;
    type: string;
    typeMod: string;
    items: { [itemIdOrTag: string]: JsonReference[] };
    json: JsonObject;
    changed: boolean;
}

onEvent("recipes", e => {
    common.log("Unifying all recipes");
    const start = new Date().getTime();

    // Find all items
    let results = common.findItemsCached();
    if (!results) return;

    // Fix and cache all recipes, group by key so we can keep track of duplicates
    const recipesToAdd: { [key: string]: EasyUnifierRecipe[] } = {};
    e.forEachRecipe({}, recipe => {
        if (recipe.getId().startsWith("thermal:furnace")) {
            common.log("furnace recipe " + recipe.getId());
            common.log(recipe.json.toString());
        }

        // Will be null if out of scope
        const fixed = fixRecipe(recipe, results);
        if (!fixed) return;

        const key = getRecipeKey(fixed);
        if (!recipesToAdd[key]) recipesToAdd[key] = [];
        recipesToAdd[key].push(fixed);
    });

    common.log(`Found ${Object.keys(recipesToAdd).length} recipes to unify`);

    // Add the new recipes, and remove the old ones/duplicates
    let bestRecipe;
    let priority;
    for (const recipeArray of Object.values(recipesToAdd)) {
        for (const recipe of recipeArray) {
            priority = common.getModPriority(recipe.mod);
            if (!bestRecipe || priority < bestRecipe.priority) bestRecipe = { recipeObj: recipe, priority: priority };
        }

        for (const recipe of recipeArray) {
            if (recipe === bestRecipe.recipeObj && recipe.changed) {
                e.remove({ id: recipe.id });
                e.custom(recipe.json).id(getRecipeId(recipe));
            } else if (recipe !== bestRecipe.recipeObj) {
                e.remove({ id: recipe.id });
            }
        }

        bestRecipe = null;
    }

    // Remove additional recipes
    for (const recipe of EasyUnifierConfig.recipesToRemove) {
        e.remove({ id: recipe });
    }

    common.log(`Took ${new Date().getTime() - start}ms`);
});

function fixRecipe(recipe: Recipe, results: AnalyzeResults): EasyUnifierRecipe {
    const recipeJson = Utils.copy(recipe.json);
    const recipeId = recipe.getId();
    const unifierRecipe: EasyUnifierRecipe = {
        id: recipeId,
        mod: recipe.getMod(),
        type: recipe.type.toString(),
        typeMod: recipe.type.getMod(),
        items: {},
        json: recipeJson,
        changed: false
    };
    let inScope = false;

    function recurse(ref: JsonReference) {
        if (!common.isReferenceToFix(recipe, ref)) return;
        if (ref.isObjectOrArray()) {
            ref.children().forEach(recurse);
            return;
        }

        const idOrTag = ref.getString();
        if (!results.all[idOrTag] && !common.isTypeToUnify(common.parseTagString(idOrTag))) return;

        inScope = true;
        if (results.picked[idOrTag]) {
            // If the ingredient is a tag, replace it with the picked item
            const pickedItem = results.picked[idOrTag];
            if (ref.key === "tag") ref.setKey("item");
            ref.setString(pickedItem.id);
            unifierRecipe.changed = true;
        } else if (results.duplicates[idOrTag]) {
            // If the ingredient is a duplicate, replace it with the picked item
            const duplicateItem = results.duplicates[idOrTag];
            const pickedItem = results.picked[duplicateItem.tag.str];
            ref.setString(pickedItem.id);
            unifierRecipe.changed = true;
        }
    }

    if (!common.isRecipeToUnify(recipe)) return null;
    recurse(new JsonReference(recipeJson));
    return inScope ? unifierRecipe : null;
}

function getRecipeKey(recipe: EasyUnifierRecipe) {
    if (recipe.typeMod !== "minecraft") return recipe.id;
    switch (recipe.json.get("type").getAsString()) {
        case "minecraft:crafting_shaped":
            return JSON.stringify({
                type: recipe.json.get("type").getAsString(),
                pattern: recipe.json.get("pattern").toString(),
                key: recipe.json.get("key").toString(),
                result: recipe.json.get("result").toString()
            });
        case "minecraft:crafting_shapeless":
            return JSON.stringify({
                type: recipe.json.get("type").getAsString(),
                ingredients: recipe.json.get("ingredients").toString(),
                result: recipe.json.get("result").toString()
            });
        case "minecraft:smelting":
        case "minecraft:blasting":
            return JSON.stringify({
                type: recipe.json.get("type").getAsString(),
                ingredient: recipe.json.get("ingredient").toString(),
                result: recipe.json.get("result").toString()
            });
    }
    return recipe.id;
}

function getRecipeId(recipe: EasyUnifierRecipe) {
    return `kubejs:${recipe.id.replace(":", "_")}`;
}
