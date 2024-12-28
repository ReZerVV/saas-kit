export class PropertyMeta {}

export class ResourceMeta {}

export class MetaStore {
    private data: Map<string, ResourceMeta> = new Map();

    public get(key: string): ResourceMeta | undefined {
        return this.data.get(key);
    }

    public set(key: string, value: ResourceMeta): void {
        this.data.set(key, value);
    }

    public delete(key: string): void {
        this.data.delete(key);
    }
}
