declare class RecipeEvent extends JavaObject {
    remove(filter: RecipeFilter): void;
    custom(json: JsonObject): Recipe;
    forEachRecipe(filter: RecipeFilter, callback: (recipe: Recipe) => void): void;
}
