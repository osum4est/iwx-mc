const EasyUnifierConfig = {
    /**
     * If there are duplicate items from multiple mods, the one from the mod highest in this list will be picked. If a
     * duplicate belongs to no mod in this list, whatever mod it shows up in first will be picked.
     */
    modPriorities: ["minecraft", "thermal", "mekanism", "immersiveengineering"],

    /**
     * Duplicates of items with these forge tags will be removed.
     */
    typesToUnify: [
        // "forge:ores", Don't unify ores, since we are using excavated variants.
        "forge:raw_materials",
        "forge:dusts",
        "forge:ingots",
        "forge:rods",
        "forge:gears",
        "forge:plates",
        "forge:nuggets",
        "forge:storage_blocks"
    ],

    /**
     * These tags will be ignored.
     */
    ignoreTags: ["forge:rods/wooden", "forge:storage_blocks/copper", "forge:storage_blocks/quartz"],

    /**
     * Tags with these materials will be ignored.
     */
    ignoreMaterials: ["metal", "all_metal"],

    /**
     * Any items inside recipe JSON objects with these keys will not be modified.
     */
    ignoreKeys: ["immersiveengineering:conditions"],

    /**
     * These recipes will not be modified.
     */
    ignoreRecipeTypes: ["bloodmagic:meteor"],

    /**
     * Additional recipes to remove
     */
    recipesToRemove: [
        "industrialforegoing:iron_gear",
        "industrialforegoing:gold_gear",
        "industrialforegoing:diamond_gear"
    ]
};

export default EasyUnifierConfig;
