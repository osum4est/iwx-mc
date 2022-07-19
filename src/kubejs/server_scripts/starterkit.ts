import * as common from "common_scripts/easy_unifier_common";

const STAGE = "starting_items";

interface BookObj {
    getMod(): string;
    getObject(): any;
}

class Book implements BookObj {
    constructor(private readonly id: string) {}
    getMod(): string {
        return this.id.split(":")[0];
    }
    getObject(): any {
        return {
            id: this.id
        };
    }
}

class PatchouliBook implements BookObj {
    constructor(private readonly id: string) {}
    getMod(): string {
        return this.id.split(":")[0];
    }
    getObject(): any {
        return {
            id: "patchouli:guide_book",
            tag: {
                "patchouli:book": this.id
            }
        };
    }
}

const books: BookObj[] = [
    new Book("byg:biomepedia"),
    new Book("alexsmobs:animal_dictionary"),
    new Book("tconstruct:materials_and_you"),
    new PatchouliBook("thermal:guidebook"),
    new Book("immersiveengineering:manual"),
    new PatchouliBook("industrialforegoing:industrial_foregoing"),
    new PatchouliBook("pneumaticcraft:book"),
    new Book("botania:lexicon"),
    new PatchouliBook("bloodmagic:guide"),
    new Book("ars_nouveau:worn_notebook"),
    new PatchouliBook("twilightforest:guide"),
    new PatchouliBook("apotheosis:apoth_chronicle")
];

onEvent("player.logged_in", event => {
    if (!event.player.stages.has(STAGE)) {
        event.player.stages.add(STAGE);

        let nbt: any = { "akashictome:data": {} };
        for (const book of books) {
            nbt["akashictome:data"][book.getMod()] = book.getObject();
            nbt["akashictome:data"][book.getMod()]["Count"] = 1;
        }

        common.log("Giving tome: " + JSON.stringify(nbt));
        event.player.inventory.set(0, Item.of("akashictome:tome", JSON.stringify(nbt)));
        event.player.inventory.set(1, Item.of("blue_skies:blue_journal"));
    }
});
