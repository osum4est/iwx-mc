// priority: 1

const CASING = "immersiveengineering:empty_casing";

const toRemove = [
    "additionalguns:casing_small",
    "additionalguns:casing_medium",
    "additionalguns:casing_heavy",
    "additionalguns:casing_short",
    "additionalguns:casing_long",
    "additionalguns:casing_special"
];

const overrides = [
    // Small bullets
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 8 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 }
        ],
        result: { item: "additionalguns:bullet_small", count: 8 },
        id: "additionalguns:bullet_small"
    },
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 8 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 }
        ],
        result: { item: "cgm:basic_bullet", count: 8 },
        id: "cgm:basic_bullet"
    },
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 8 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 }
        ],
        result: { item: "additionalguns:bullet_short", count: 8 },
        id: "additionalguns:bullet_short"
    },

    // Medium bullets
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 4 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 },
            { tag: "forge:ingots/bronze", count: 1 }
        ],
        result: { item: "additionalguns:bullet_medium", count: 4 },
        id: "additionalguns:bullet_medium"
    },
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 4 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 },
            { tag: "forge:ingots/bronze", count: 1 }
        ],
        result: { item: "additionalguns:bullet_special", count: 4 },
        id: "additionalguns:bullet_special"
    },
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 4 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 },
            { tag: "forge:ingots/bronze", count: 1 }
        ],
        result: { item: "cgm:shell", count: 4 },
        id: "cgm:shell"
    },

    // Heavy bullets
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 2 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 },
            { tag: "forge:ingots/steel", count: 1 }
        ],
        result: { item: "additionalguns:bullet_heavy", count: 2 },
        id: "additionalguns:bullet_heavy"
    },
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 2 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 },
            { tag: "forge:ingots/steel", count: 1 }
        ],
        result: { item: "cgm:advanced_bullet", count: 2 },
        id: "cgm:advanced_bullet"
    },
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 2 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 },
            { tag: "forge:ingots/steel", count: 1 }
        ],
        result: { item: "additionalguns:bullet_long", count: 2 },
        id: "additionalguns:bullet_long"
    },

    // Grenades
    {
        type: "cgm:workbench",
        materials: [
            { tag: "forge:ingots/iron", count: 2 },
            { item: "minecraft:tnt", count: 1 }
        ],
        result: { item: "cgm:grenade", count: 1 },
        id: "cgm:grenade"
    },
    {
        type: "cgm:workbench",
        materials: [
            { tag: "forge:ingots/iron", count: 2 },
            { item: "minecraft:tnt", count: 1 },
            { tag: "forge:dusts/glowstone", count: 4 }
        ],
        result: { item: "cgm:stun_grenade", count: 1 },
        id: "cgm:stun_grenade"
    },

    // Missiles
    {
        type: "cgm:workbench",
        materials: [
            { tag: "forge:ingots/iron", count: 2 },
            { item: "minecraft:tnt", count: 1 },
            { item: "minecraft:firework_rocket", count: 2 }
        ],
        result: { item: "cgm:missile" },
        id: "cgm:missile"
    }
];

// make adv guns & ammo take steel
const gunsNeedingSteel = [
    "cgm:grenade_launcher",
    "cgm:mini_gun",
    "cgm:bazooka",
    "cgm:heavy_rifle",
    "additionalguns:mammoth",
    "additionalguns:ace_of_spades",
    "additionalguns:ots_03",
    "additionalguns:ssg08",
    "additionalguns:desert_eagle",
    "additionalguns:awm",
    "additionalguns:magnum"
];

const attachments = [
    "additionalguns:holo_scope",
    "additionalguns:zerkalo_scope",
    "additionalguns:kobra",
    "additionalguns:basic_stock",
    "additionalguns:vintorez_stock",
    "additionalguns:muzzle_brake",
    "additionalguns:tactical_muzzle_brake",
    "additionalguns:sniper_muzzle_brake",
    "additionalguns:tactical_silencer",
    "additionalguns:angled_grip",
    "cgm:short_scope",
    "cgm:medium_scope",
    "cgm:long_scope",
    "cgm:silencer",
    "cgm:weighted_stock",
    "cgm:light_stock",
    "cgm:tactical_stock",
    "cgm:specialised_grip",
    "cgm:light_grip"
];

interface CustomIngredient {
    type: "tag" | "item";
    name: string;
}

function replaceMaterial(recipe: JsonObject, ingredient: CustomIngredient, replacement: CustomIngredient) {
    const materials = recipe.get("materials").getAsJsonArray();
    for (let i = 0; i < materials.size(); i++) {
        const material = materials.get(i).getAsJsonObject();
        if (material.has(ingredient.type) && material.get(ingredient.type).getAsString() === ingredient.name) {
            material.remove(ingredient.type);
            material.addProperty(replacement.type, replacement.name);
        }
    }
}

onEvent("recipes", e => {
    e.forEachRecipe({}, recipe => {
        const override = overrides.find(o => o.id === recipe.getId());
        if (override) {
            recipe.json = JsonIO.of(override).getAsJsonObject();
            return;
        }

        if (toRemove.includes(recipe.getId())) {
            e.remove({ id: recipe.getId() });
            recipe.json = JsonIO.of({
                type: recipe.type.toString(),
                materials: [],
                result: { item: "minecraft:air" }
            }).getAsJsonObject();
            return;
        }

        if (gunsNeedingSteel.includes(recipe.getId())) {
            const json = recipe.json;
            replaceMaterial(
                json,
                { type: "tag", name: "forge:ingots/iron" },
                { type: "tag", name: "forge:ingots/steel" }
            );
            replaceMaterial(
                json,
                { type: "tag", name: "forge:nuggets/iron" },
                { type: "tag", name: "forge:nuggets/steel" }
            );
            return;
        }

        if (attachments.includes(recipe.getId())) {
            const json = recipe.json;
            replaceMaterial(
                json,
                { type: "tag", name: "forge:ingots/iron" },
                { type: "tag", name: "forge:ingots/steel" }
            );
            replaceMaterial(
                json,
                { type: "tag", name: "forge:nuggets/iron" },
                { type: "tag", name: "forge:nuggets/steel" }
            );

            replaceMaterial(
                json,
                { type: "item", name: "minecraft:glass_pane" },
                { type: "item", name: "botania:mana_glass_pane" }
            );
            replaceMaterial(
                json,
                { type: "tag", name: "forge:glass_panes" },
                { type: "item", name: "botania:mana_glass_pane" }
            );
        }
    });
});

function log(msg: string) {
    console.info("[CustomRecipes] " + msg);
}
