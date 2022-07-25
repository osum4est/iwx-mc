declare class JsonObject extends JsonElement {
    entrySet(): MapEntry<string, JsonElement>[];
    get(key: string): JsonElement;
    add(key: string, value: JsonElement): void;
    has(key: string): boolean;
    addProperty(key: string, value: string): void;
    remove(key: string): void;
}
