export class AsyncImageLoader {
    static loadImageFromPath(url: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => {
                reject(new Error(`Failed to load image "${url}".`));
            };
            image.src = url;
        });
    }

    static loadImagesFromPath(urls: string[]): Promise<HTMLImageElement[]> {
        return Promise.all(urls.map(url => AsyncImageLoader.loadImageFromPath(url)));
    }

    static loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => {
                reject(new Error(`Failed to load image.`));
            };
        });
    }

    static loadImages(images: HTMLImageElement[]): Promise<HTMLImageElement[]> {
        return Promise.all(images.map(image => AsyncImageLoader.loadImage(image)));
    }
}
