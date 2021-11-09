import { Game } from "../Game";

export class AssetManager {
    Game: Game;

    soundsToLoad = [
        "./sounds/music/intro.mp3",
        "./sounds/music/game_over.mp3",
        "./sounds/music/ending.mp3",
        "./sounds/music/overworld.mp3",
        "./sounds/music/death_mountain.mp3",
        "./sounds/music/dungeon.mp3",

        "./sounds/effect/Enemy_Die.wav",
        "./sounds/effect/Enemy_Hit.wav",
        "./sounds/effect/Fanfare.wav",
        "./sounds/effect/Get_Heart.wav",
        "./sounds/effect/Get_Item.wav",
        "./sounds/effect/Link_Die.wav",
        "./sounds/effect/Link_Hurt.wav",
        "./sounds/effect/Low_Health.wav",
        "./sounds/effect/Shield.wav",
        "./sounds/effect/Sword_Shoot.wav",
        "./sounds/effect/Sword_Slash.wav",
    ];

    imagesToLoad = [
        "./sprites/png/link-up1.png",
        "./sprites/png/link-up2.png",
        "./sprites/png/link-up-attack.png",
        "./sprites/png/link-right1.png",
        "./sprites/png/link-right2.png",
        "./sprites/png/link-right-attack.png",
        "./sprites/png/link-down1.png",
        "./sprites/png/link-down2.png",
        "./sprites/png/link-down-attack.png",
        "./sprites/png/link-left1.png",
        "./sprites/png/link-left2.png",
        "./sprites/png/link-left-attack.png",
        "./sprites/png/link-win.png",

        "./sprites/png/sword-down.png",
        "./sprites/png/sword-left.png",
        "./sprites/png/sword-right.png",
        "./sprites/png/sword-up.png",

        "./sprites/png/arrow-down.png",
        "./sprites/png/arrow-left.png",
        "./sprites/png/arrow-right.png",
        "./sprites/png/arrow-up.png",

        "./sprites/png/blue-moblin-up1.png",
        "./sprites/png/blue-moblin-up2.png",
        "./sprites/png/blue-moblin-right1.png",
        "./sprites/png/blue-moblin-right2.png",
        "./sprites/png/blue-moblin-down1.png",
        "./sprites/png/blue-moblin-down2.png",
        "./sprites/png/blue-moblin-left1.png",
        "./sprites/png/blue-moblin-left2.png",

        "./sprites/png/moblin-up1.png",
        "./sprites/png/moblin-up2.png",
        "./sprites/png/moblin-right1.png",
        "./sprites/png/moblin-right2.png",
        "./sprites/png/moblin-down1.png",
        "./sprites/png/moblin-down2.png",
        "./sprites/png/moblin-left1.png",
        "./sprites/png/moblin-left2.png",

        "./sprites/png/blue-octorok-up1.png",
        "./sprites/png/blue-octorok-up2.png",
        "./sprites/png/blue-octorok-right1.png",
        "./sprites/png/blue-octorok-right2.png",
        "./sprites/png/blue-octorok-down1.png",
        "./sprites/png/blue-octorok-down2.png",
        "./sprites/png/blue-octorok-left1.png",
        "./sprites/png/blue-octorok-left2.png",

        "./sprites/png/octorok-up1.png",
        "./sprites/png/octorok-up2.png",
        "./sprites/png/octorok-right1.png",
        "./sprites/png/octorok-right2.png",
        "./sprites/png/octorok-down1.png",
        "./sprites/png/octorok-down2.png",
        "./sprites/png/octorok-left1.png",
        "./sprites/png/octorok-left2.png",

        "./sprites/png/blue-tektite1.png",
        "./sprites/png/blue-tektite2.png",

        "./sprites/png/tektite1.png",
        "./sprites/png/tektite2.png",

        "./sprites/png/killed1.png",
        "./sprites/png/killed2.png",

        "./sprites/png/clock.png",
        "./sprites/png/fireball.png",
        "./sprites/png/empty-heart.png",
        "./sprites/png/full-heart.png",
        "./sprites/png/half-heart.png",
        "./sprites/png/heart-receptacle.png",
        
        "./sprites/png/bricks/default.png",
        "./sprites/png/bricks/default-dungeon.png",
        "./sprites/png/bricks/fire1.png",
        "./sprites/png/bricks/fire2.png",
        "./sprites/png/bricks/grave.png",
        "./sprites/png/bricks/monument-bottom-left.png",
        "./sprites/png/bricks/monument-bottom-right.png",
        "./sprites/png/bricks/monument-top-left.png",
        "./sprites/png/bricks/monument-top-right.png",
        "./sprites/png/bricks/passage.png",
        "./sprites/png/bricks/red-wall.png",
        "./sprites/png/bricks/single-red-wall.png",
        "./sprites/png/bricks/single-wall.png",
        "./sprites/png/bricks/stairs.png",
        "./sprites/png/bricks/tree.png",
        "./sprites/png/bricks/wall.png",
        "./sprites/png/bricks/wall-bottom-left.png",
        "./sprites/png/bricks/wall-bottom-right.png",
        "./sprites/png/bricks/wall-dungeon.png",
        "./sprites/png/bricks/wall-top.png",
        "./sprites/png/bricks/wall-top-left.png",
        "./sprites/png/bricks/wall-top-right.png",
        "./sprites/png/bricks/white-tree.png",
        "./sprites/png/bricks/white-wall.png",
        "./sprites/png/bricks/white-wall-bottom-left.png",
        "./sprites/png/bricks/white-wall-bottom-right.png",
        "./sprites/png/bricks/white-wall-top.png",
        "./sprites/png/bricks/white-wall-top-left.png",
        "./sprites/png/bricks/white-wall-top-right.png",
    ];

    sounds: string[];
    images: HTMLImageElement[];

    toLoad: number;
    loaded: number;

    constructor(Game: Game) {
        this.Game = Game;

        this.toLoad = this.imagesToLoad.length + this.soundsToLoad.length;
        this.loaded = 0;

        this.images = [];
        this.sounds = [];

        this.imagesToLoad.forEach(src => {
            let image = new Image();
            image.src = src;

            this.images[src] = image;

            image.addEventListener("load", () => this.loaded++, false);
        });

        this.soundsToLoad.forEach(src => {
            let sound = new Audio(src);

            this.sounds.push(src);

            sound.addEventListener("canplaythrough", () => this.loaded++, false);
        });
    }

    isLoadFinished(): boolean {
        return this.toLoad === this.loaded;
    }

    getImage(src: string): HTMLImageElement {
        return this.images[src];
    }

    getSound(src: string, loop: boolean = false): HTMLAudioElement {
        if (!this.sounds.includes(src)) throw new Error("This sound hasn't been loaded");

        let audio = new Audio(src);
        audio.loop = loop;
        
        return audio;
    }
}
