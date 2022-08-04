declare class RecipeEvent extends JavaObject {
    remove(filter: RecipeFilter): void;
    shaped(result: string, pattern: string[], key: { [key: string]: string }): Recipe;
    custom(json: JsonObject): Recipe;
    forEachRecipe(filter: RecipeFilter, callback: (recipe: Recipe) => void): void;
}
