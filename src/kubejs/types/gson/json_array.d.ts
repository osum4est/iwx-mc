declare class JsonArray extends JsonElement {
    size(): number;
    get(index: number): JsonElement;
    set(index: number, element: string): void;
}
