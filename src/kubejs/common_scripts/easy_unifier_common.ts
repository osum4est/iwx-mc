import EasyUnifierConfig from "./easy_unifier_config";
import { JsonReference } from "./json_reference";

export interface EasyUnifierCache {
    results: AnalyzeResults;
}

export interface EasyUnifierItem {
    id: string;
    mod: string;
    tag: Tag;
    unify: boolean;
}

export interface AnalyzeResults {
    all: { [itemId: string]: EasyUnifierItem };
    picked: { [tag: string]: EasyUnifierItem };
    duplicates: { [itemId: string]: EasyUnifierItem };
}

export interface Tag {
    str: string;
    domain: string;
    type: string;
    material: string;
}

interface AnalyzeItem extends EasyUnifierItem {
    priority: number;
}

let logsLeft = 1000;
export function log(message: string) {
    if (logsLeft) {
        console.info(`[EasyUnifier] ${message}`);
        logsLeft--;
    }
}

function findItems(): AnalyzeResults {
    const allItems: { [itemId: string]: EasyUnifierItem } = {};
    const pickedItems: { [tag: string]: AnalyzeItem } = {};
    const duplicateItems: { [itemId: string]: AnalyzeItem } = {};
    let modPriority: number;
    let item: EasyUnifierItem;

    log("Finding all items");

    Ingredient.all.stacks.forEach(stack => {
        item = getUnifierItemFromItemStack(stack);
        if (!item.unify) return;

        allItems[item.id] = item;
        modPriority = getModPriority(item.mod);
        if (!pickedItems[item.tag.str] || modPriority < pickedItems[item.tag.str].priority) {
            if (pickedItems[item.tag.str]) duplicateItems[pickedItems[item.tag.str].id] = pickedItems[item.tag.str];
            pickedItems[item.tag.str] = {
                id: item.id,
                mod: item.mod,
                tag: item.tag,
                unify: item.unify,
                priority: modPriority
            };
        } else {
            duplicateItems[item.id] = {
                id: item.id,
                mod: item.mod,
                tag: item.tag,
                unify: item.unify,
                priority: modPriority
            };
        }
    });

    log(`Found ${Object.keys(allItems).length} items`);
    log("Picked items: " + Object.keys(pickedItems).length);
    for (const k of Object.keys(pickedItems)) log(`[${k}] ${pickedItems[k].id}`);
    log("----------------------------------------------------");
    log("Duplicates: " + Object.keys(duplicateItems).length);
    for (const d of Object.keys(duplicateItems)) log(`[${d}] ${duplicateItems[d].id}`);

    return { all: allItems, picked: pickedItems, duplicates: duplicateItems };
}

function getUnifierItemFromItemStack(itemStack: ItemStack): EasyUnifierItem {
    let tags = itemStack
        .getTags()
        .map(t => parseTagString(t.toString()))
        .filter(isTypeToUnify);

    return {
        id: itemStack.getId(),
        mod: itemStack.getMod(),
        tag: tags[0],
        unify: tags.length === 1
    };
}

export function parseTagString(tag: string): Tag {
    const colonParts = tag.split(":");
    if (colonParts.length !== 2) return null;

    const slashParts = colonParts[1].split("/");
    if (slashParts.length !== 2) return null;

    const poundParts = slashParts[1].split("#");

    return {
        str: `${colonParts[0]}:${slashParts[0]}/${poundParts[0]}`,
        domain: colonParts[0],
        type: slashParts[0],
        material: poundParts[0]
    };
}

let priorityMap: { [modId: string]: number } = null;
let typesToUnifyMap: { [tag: string]: boolean } = null;
let ignoreTagsMap: { [tag: string]: boolean } = null;
let ignoreMaterialsMap: { [material: string]: boolean } = null;
let ignoreKeysMap: { [key: string]: boolean } = null;
let ignoreRecipeTypesMap: { [type: string]: boolean } = null;

export function getModPriority(mod: string) {
    if (!priorityMap) priorityMap = toObjVal(EasyUnifierConfig.modPriorities, i => i + 1);
    return priorityMap[mod] || Number.MAX_SAFE_INTEGER;
}

export function isRecipeToUnify(recipe: Recipe): boolean {
    if (!ignoreRecipeTypesMap) ignoreRecipeTypesMap = toObj(EasyUnifierConfig.ignoreRecipeTypes);
    return !ignoreRecipeTypesMap[recipe.type.toString()];
}

export function isTypeToUnify(tag: Tag) {
    if (!tag) return false;
    if (!typesToUnifyMap) typesToUnifyMap = toObj(EasyUnifierConfig.typesToUnify);
    if (!ignoreTagsMap) ignoreTagsMap = toObj(EasyUnifierConfig.ignoreTags);
    if (!ignoreMaterialsMap) ignoreMaterialsMap = toObj(EasyUnifierConfig.ignoreMaterials);

    if (ignoreMaterialsMap[tag.material]) return false;
    if (ignoreTagsMap[tag.str]) return false;
    return typesToUnifyMap[`${tag.domain}:${tag.type}`] || false;
}

export function isReferenceToFix(recipe: Recipe, reference: JsonReference): boolean {
    if (!reference) return false;
    if (!ignoreKeysMap) ignoreKeysMap = toObj(EasyUnifierConfig.ignoreKeys);

    if (ignoreKeysMap[reference.key]) return false;
    if (ignoreKeysMap[`${recipe.getMod()}:${reference.key}`]) return false;
    return true;
}

function toObj<TValue>(array: string[]): { [key: string]: boolean } {
    const obj: { [key: string]: boolean } = {};
    for (let i = 0; i < array.length; i++) obj[array[i]] = true;
    return obj;
}

function toObjVal<TValue>(array: string[], valueFunction: (i: number) => TValue): { [key: string]: TValue } {
    const obj: { [key: string]: TValue } = {};
    for (let i = 0; i < array.length; i++) obj[array[i]] = valueFunction(i);
    return obj;
}

export function findItemsCached(): AnalyzeResults {
    const cache = getCache();
    if (cache && cache.results) {
        log("Using cached results");
        return cache.results;
    }

    log("Cache not found, finding items");
    const findItemsResults = findItems();
    if (Object.keys(findItemsResults.all).length <= 0) {
        log("Could not find any items to unify. You probably need to run /reload to generate the cache.");
        return null;
    }

    saveCache({ results: findItemsResults });
    return findItemsResults;
}

function getCache(): EasyUnifierCache {
    return global["easyUnifierCache"];
}

function saveCache(cache: EasyUnifierCache) {
    global["easyUnifierCache"] = cache;
    JsonIO.write("kubejs/config/easy_unifier_cache.json", cache);
}
