declare class Recipe extends JavaObject {
    json: JsonObject;
    type: RecipeType;

    getId(): string;
    getMod(): string;

    id(id: string): Recipe;
}
