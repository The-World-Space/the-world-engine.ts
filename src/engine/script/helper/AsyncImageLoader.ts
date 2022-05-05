/**
 * async image loader utility
 */
export class AsyncImageLoader {
    /**
     * load image from path
     * @param url image url
     * @returns loaded image
     */
    public static loadImageFromPath(url: string): Promise<HTMLImageElement> {
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

    /**
     * load images from urls
     * @param urls image urls
     * @returns loaded images
     */
    public static loadImagesFromPath(urls: string[]): Promise<HTMLImageElement[]> {
        return Promise.all(urls.map(url => AsyncImageLoader.loadImageFromPath(url)));
    }

    /**
     * load image from unloaded image
     * @param image unloaded image
     * @returns loaded image
     */
    public static loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => {
                reject(new Error(`Failed to load image.`));
            };
        });
    }

    /**
     * load images from unloaded images
     * @param images unloaded images
     * @returns loaded images
     */
    public static loadImages(images: HTMLImageElement[]): Promise<HTMLImageElement[]> {
        return Promise.all(images.map(image => AsyncImageLoader.loadImage(image)));
    }
}
