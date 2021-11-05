export class SpriteLoader {
    static load(src: string): HTMLImageElement {
        let sprite = new Image();
        sprite.src = src;
        return sprite;
    }
}

export class AudioLoader {
    static load(src: string, loop:boolean = false): HTMLAudioElement {
        let audio = new Audio(src);
        audio.loop = loop;
        return audio;
    }
}
