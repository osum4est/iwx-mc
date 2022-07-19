declare class Player extends JavaObject {
    stages: Set<string>;
    inventory: { set: (slot: number, item: Item) => void };
}
