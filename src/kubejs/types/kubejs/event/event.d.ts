type EventName = "recipes" | "jei.hide.items" | "player.logged_in";

type EventType<T extends EventName> = T extends "recipes"
    ? RecipeEvent
    : T extends "jei.hide.items"
    ? HideJEIEvent
    : T extends "player.logged_in"
    ? SimplePlayerEvent
    : never;
