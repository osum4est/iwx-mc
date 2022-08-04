// priority: 10
onEvent("recipes", e => {
    e.forEachRecipe({}, recipe => {
        if (recipe.getId() === "ironjetpacks:strap") {
            recipe.json = JsonIO.of({}).getAsJsonObject();
        } else if (recipe.getId() === "ironjetpacks:basic_coil") {
            recipe.json = JsonIO.of({}).getAsJsonObject();
        } else if (recipe.getId() === "ironjetpacks:advanced_coil") {
            recipe.json = JsonIO.of({}).getAsJsonObject();
        } else if (recipe.getId() === "ironjetpacks:elite_coil") {
            recipe.json = JsonIO.of({}).getAsJsonObject();
        } else if (recipe.getId() === "ironjetpacks:ultimate_coil") {
            recipe.json = JsonIO.of({}).getAsJsonObject();
        }
    });

    e.shaped("ironjetpacks:strap", [" I ", "LRL", " I "], {
        L: "minecraft:leather",
        I: "#forge:nuggets/iron",
        R: "angelring:itemdiamondring"
    }).id("ironjetpacks:strap");

    e.shaped("ironjetpacks:basic_coil", [" DR", "DSD", "RD "], {
        R: "#forge:dusts/redstone",
        D: "#forge:ingots/iron",
        S: "mekanism:ultimate_control_circuit"
    }).id("ironjetpacks:basic_coil");

    e.shaped("ironjetpacks:advanced_coil", [" DR", "DSD", "RD "], {
        R: "#forge:dusts/redstone",
        D: "#forge:ingots/gold",
        S: "minecraft:netherite_ingot"
    }).id("ironjetpacks:advanced_coil");

    e.shaped("ironjetpacks:elite_coil", [" DR", "DSD", "RD "], {
        R: "#forge:dusts/redstone",
        D: "#forge:gems/diamond",
        S: "botania:elementium_ingot"
    }).id("ironjetpacks:elite_coil");

    e.shaped("ironjetpacks:ultimate_coil", [" DR", "DSD", "RD "], {
        R: "#forge:dusts/redstone",
        D: "#forge:gems/emerald",
        S: "minecraft:nether_star"
    }).id("ironjetpacks:ultimate_coil");
});
