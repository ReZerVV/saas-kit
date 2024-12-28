import * as path from "path";

export class Config {
    private static TS_CONFIG_FILENAME = "saas-kit.config.ts";
    private static PATH_TO_CONFIG = path.join(process.cwd(), this.TS_CONFIG_FILENAME);

    // meta
    metaFolderPath: string = ".meta";

    // resources
    resourceFiles: string = "./**/*.resource.ts";
    handlersFiles: string = "./**/*.handlers.ts";
    providersFiles: string = "./**/*.providers.ts";

    constructor(config: Partial<Config>) {
        Object.assign(this, config);
    }

    static load(): Config {
        try {
            const config = require(Config.PATH_TO_CONFIG);
            return new Config(config);
        } catch (e) {
            return new Config({});
        }
    }
}
