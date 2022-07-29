// priority: 1

const CASING = "immersiveengineering:empty_casing";

const toRemove = [
    "cgm:basic_bullet",
    "cgm:advanced_bullet",
    "additionalguns:bullet_short",
    "additionalguns:bullet_long",
    "additionalguns:bullet_special",
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
            { item: CASING, count: 1 },
            { tag: "forge:gunpowder", count: 1 },
            { tag: "forge:ingots/gold", count: 1 }
        ],
        result: { item: "additionalguns:bullet_small", count: 8 },
        id: "additionalguns:bullet_small"
    },

    // Medium bullets
    {
        type: "cgm:workbench",
        materials: [
            { item: CASING, count: 1 },
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
            { item: CASING, count: 1 },
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

    // Grenades
    {
        type: "cgm:workbench",
        materials: [
            { tag: "forge:ingots/iron", count: 4 },
            { item: "minecraft:tnt", count: 1 }
        ],
        result: { item: "cgm:grenade", count: 1 },
        id: "cgm:grenade"
    },
    {
        type: "cgm:workbench",
        materials: [
            { tag: "forge:ingots/iron", count: 4 },
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
            { tag: "forge:ingots/iron", count: 4 },
            { item: "minecraft:tnt", count: 1 },
            { item: "minecraft:firework_rocket", count: 2 }
        ],
        result: { item: "cgm:missile" },
        id: "cgm:missile"
    }
];

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

const powerfulGuns = [
    "cgm:bazooka",
    "additionalguns:ravens_claw",
    "additionalguns:vintorez",
    "additionalguns:fn2000",
    "additionalguns:val",
    "additionalguns:aug",
    "additionalguns:mp7a2",
    "additionalguns:g11",
    "additionalguns:m1014",
    "additionalguns:ak104",
    "additionalguns:ak105",
    "additionalguns:akm_custom",
    "additionalguns:akm",
    "additionalguns:9a91",
    "additionalguns:ak15",
    "additionalguns:ak12",
    "additionalguns:m16a2",
    "additionalguns:m4a1s",
    "additionalguns:m4a4",
    "additionalguns:vector",
    "additionalguns:mac10",
    "additionalguns:awm",
    "additionalguns:mammoth",
    "additionalguns:ace_of_spades",
    "additionalguns:ssg08"
];

// TODO
const addIngredients = [
    { to: "additionalguns:ravens_claw", material: { item: "beyond_earth:calorite_ingot", count: 10 } }
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

function replaceMaterial(recipe: any, ingredient: CustomIngredient, replacement: CustomIngredient) {
    const materials = recipe.materials || [];
    for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        if (material[ingredient.type] === ingredient.name) {
            material[ingredient.type] = undefined;
            material[replacement.type] = replacement.name;
        }
    }
}

function addMaterial(recipe: any, ingredient: CustomIngredient, count: number) {
    recipe.materials.push({
        [ingredient.type]: ingredient.name,
        count: count
    });
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

        const json = JSON.parse(recipe.json.toString());

        if (powerfulGuns.includes(recipe.getId())) {
            addMaterial(json, { type: "item", name: "create:precision_mechanism" }, 1);
            recipe.json = json;
        }

        for (const toAdd of addIngredients.filter(a => a.to === recipe.getId())) {
            json["materials"].push(toAdd.material);
            recipe.json = json;
        }

        if (gunsNeedingSteel.includes(recipe.getId())) {
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
            recipe.json = json;
        }

        if (attachments.includes(recipe.getId())) {
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
            recipe.json = json;
        }
    });
});

function log(msg: string) {
    console.info("[CustomRecipes] " + msg);
}
