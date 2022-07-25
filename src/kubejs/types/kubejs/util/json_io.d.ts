declare class JsonIO {
    static of(object: any): JsonElement;
    static read(path: string): any;
    static write(path: string, object: any): void;
}
