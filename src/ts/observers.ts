abstract class AbstractObserver {
    currentFrame: number;
    isFirstFrame: boolean;

    constructor() {
        this.currentFrame = 0;
        this.isFirstFrame = true;
    }

    update(): void {
        this.currentFrame++;
        this.isFirstFrame = false;
    }
}

class StateObserver extends AbstractObserver {
    state: any;
    lastState: any;
    lastFrameState: any;

    constructor(state: any) {
        super();

        this.state = state;
    }

    set(state: any): void {
        if (this.state === state) return;

        this.lastState = this.state;
        this.lastFrameState = this.state;
        this.state = state;
        this.currentFrame = 0;
        this.isFirstFrame = true;
    }

    update(): void {
        super.update();
        this.lastFrameState = this.state;
    }

    get(): any {
        return this.state;
    }

    getLast(): any {
        return this.lastState;
    }

    getLastFrame(): any {
        return this.lastFrameState;
    }

    is(state: any): boolean {
        return this.state === state;
    }

    isIn(...states: any[]): boolean {
        return states.some(s => this.is(s));
    }

    was(state: any): boolean {
        return this.lastState === state;
    }

    wasIn(...states: any[]): boolean {
        return states.some(s => this.was(s));
    }

    wasLastFrame(state: any): boolean {
        return this.lastFrameState === state;
    }

    wasInLastFrame(...states: any[]): boolean {
        return states.some(s => this.wasLastFrame(s));
    }
}

class AnimationObserver extends AbstractObserver {
    animationStepDuration: number;

    currentAnimationStep = 1;
    nbAnimationStep: number;

    constructor(animationStepDuration: number, nbAnimationStep: number) {
        super();

        this.animationStepDuration = animationStepDuration;
        this.nbAnimationStep = nbAnimationStep;
    }

    update(): void {
        super.update();

        if (this.currentFrame >= this.animationStepDuration) {
            this.currentFrame = 0;
            this.currentAnimationStep =
                (this.currentAnimationStep + 1 > this.nbAnimationStep)
                ? 1
                : this.currentAnimationStep + 1
            ;
            this.isFirstFrame = true;
        }
    }
}
