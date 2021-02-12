abstract class AbstractObserver {
    currentFrame: number;
    isFirstFrame: boolean;

    constructor() {
        this.currentFrame = 0;
        this.isFirstFrame = true;
    }

    update(): void {
        this.currentFrame++;
    }
}

class StateObserver extends AbstractObserver {
    lastState: any;
    lastFrameState: any;
    state: any;
    nextState: any;

    constructor(state: any) {
        super();

        this.lastState = null;
        this.lastFrameState = null;
        this.state = state;
        this.nextState = null;
    }

    setNextState(state: any): void {
        this.nextState = state;
    }

    update(): void {
        this.lastFrameState = this.state;

        if (this.nextState !== null) {
            this.lastState = this.state;
            this.state = this.nextState;
            this.nextState = null;
            this.currentFrame = 0;
        }
        else {
            this.isFirstFrame = false;
        }

        super.update();
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
        if (this.currentFrame >= this.animationStepDuration) {
            this.currentFrame = 0;
            this.currentAnimationStep =
                (this.currentAnimationStep + 1 > this.nbAnimationStep)
                ? 1
                : this.currentAnimationStep + 1;

            this.isFirstFrame = true;
        }
        else {
            this.isFirstFrame = false;
        }

        super.update();
    }
}
