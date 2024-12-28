import fs from "fs";
import path from "path";

type ResourceModule = {
    [key: string]: any;
};

export class ResourceLoader {
    private loadedResources: Map<string, ResourceModule> = new Map();

    /**
     * Загружает все файлы с расширением .resource.ts из указанной директории и её поддиректорий
     * @param directoryPath - Путь к директории для поиска ресурсов
     * @returns Promise<Map<string, ResourceModule>> - Карта загруженных ресурсов
     */
    async loadResources(directoryPath: string): Promise<Map<string, ResourceModule>> {
        try {
            // Получаем абсолютный путь
            const absolutePath = path.resolve(directoryPath);

            // Рекурсивно ищем все файлы .resource.ts
            await this.findAndLoadResources(absolutePath);

            return this.loadedResources;
        } catch (error) {
            console.error("Error loading resources:", error);
            throw error;
        }
    }

    /**
     * Рекурсивно ищет и загружает ресурсы из директории
     */
    private async findAndLoadResources(dirPath: string): Promise<void> {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Рекурсивно обходим поддиректории
                await this.findAndLoadResources(fullPath);
            } else if (this.isResourceFile(file)) {
                // Загружаем файл ресурса
                await this.loadResourceFile(fullPath);
            }
        }
    }

    /**
     * Проверяет, является ли файл ресурсом
     */
    private isResourceFile(filename: string): boolean {
        return filename.endsWith(".resource.ts");
    }

    /**
     * Загружает отдельный файл ресурса
     */
    private async loadResourceFile(filePath: string): Promise<void> {
        try {
            // Если используется ESM
            if (process.env.NODE_ENV === "module") {
                const module = await import(filePath);
                this.loadedResources.set(filePath, module);
            } else {
                // Если используется CommonJS
                const module = require(filePath);
                this.loadedResources.set(filePath, module);
            }
        } catch (error) {
            console.error(`Error loading resource file ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Получает загруженный ресурс по пути к файлу
     */
    getResource(filePath: string): ResourceModule | undefined {
        return this.loadedResources.get(path.resolve(filePath));
    }

    /**
     * Получает все загруженные ресурсы
     */
    getAllResources(): ResourceModule[] {
        return Array.from(this.loadedResources.values());
    }
}
