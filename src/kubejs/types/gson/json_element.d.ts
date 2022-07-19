declare class JsonElement extends JavaObject {
    isJsonObject(): boolean;
    isJsonArray(): boolean;
    isJsonPrimitive(): boolean;
    getAsJsonObject(): JsonObject;
    getAsJsonArray(): JsonArray;
    getAsString(): string;
}
