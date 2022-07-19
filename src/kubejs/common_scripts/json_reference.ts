export class JsonReference {
    parent?: JsonReference;
    key?: string;
    index?: number;
    element: JsonElement;

    constructor(element: JsonElement, parent?: JsonReference, key?: string, index?: number) {
        this.element = element;
        this.parent = parent;
        this.key = key;
        this.index = index;
    }

    setKey(key: string): void {
        if (this.parent && this.parent.element.isJsonObject()) {
            const parent = this.parent.element.getAsJsonObject();
            parent.add(key, this.element);
            parent.remove(this.key);
            this.key = key;
        }
    }

    setString(value: string): void {
        if (this.parent) {
            if (this.parent.element.isJsonObject()) {
                this.parent.element.getAsJsonObject().addProperty(this.key, value);
            } else if (this.parent.element.isJsonArray()) {
                this.parent.element.getAsJsonArray().set(this.index, value);
            }
        }
    }

    isObjectOrArray(): boolean {
        return this.element.isJsonObject() || this.element.isJsonArray();
    }

    getString(): string | null {
        if (this.element.isJsonPrimitive()) return this.element.getAsString();
        return null;
    }

    children(): JsonReference[] {
        if (this.element.isJsonObject()) {
            return this.element
                .getAsJsonObject()
                .entrySet()
                .map(entry => new JsonReference(entry.getValue(), this, entry.getKey()));
        } else if (this.element.isJsonArray()) {
            const children = [];
            const array = this.element.getAsJsonArray();
            for (let i = 0; i < array.size(); i++) children.push(new JsonReference(array.get(i), this, undefined, i));
            return children;
        } else {
            return [];
        }
    }
}
