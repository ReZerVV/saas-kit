import { glob } from "glob";
import * as path from "path";
import { Config } from "./config";
import { MetaStore } from "../resource/meta";
import { pathToFileURL } from "url";

export class App {
    private config: Config;
    private metaStore: MetaStore;

    constructor() {
        this.config = Config.load();
        this.metaStore = new MetaStore();
    }

    async initMeta() {
        const files = await glob(this.config.resourceFiles, {
            ignore: "node_modules/**",
        });

        for (const file of files) {
            console.log(pathToFileURL(path.resolve(file)).href);
            require("../../../../apps/test-app/src/test.resource");
        }
    }
}
