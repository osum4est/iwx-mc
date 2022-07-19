declare class ItemStack extends JavaObject {
    getId(): string;
    getMod(): string;
    getTags(): ResourceLocation[];
    isEmpty(): boolean;
}
