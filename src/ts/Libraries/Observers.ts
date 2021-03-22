export abstract class AbstractObserver {
    currentFrame: number;
    isFirstFrame: boolean;

    constructor() {
        this.currentFrame = 0;
        this.isFirstFrame = true;
    }

    update(dt: number): void {
        this.currentFrame += dt;
    }
}

export class StateObserver extends AbstractObserver {
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

    set(state: any): void {
        this.lastState = this.state;
        this.state = state;
        this.nextState = null;
        this.currentFrame = 0;
        this.isFirstFrame = true;
    }

    setNextState(state: any): void {
        this.nextState = state;
    }

    update(dt: number): void {
        this.lastFrameState = this.state;

        if (this.nextState !== null) {
            this.set(this.nextState);
        }
        else {
            this.isFirstFrame = false;
        }

        super.update(dt);
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

export class AnimationObserver extends AbstractObserver {
    animationStepDuration: number;

    currentAnimationStep = 1;
    nbAnimationStep: number;

    constructor(animationStepDuration: number, nbAnimationStep: number) {
        super();

        this.animationStepDuration = animationStepDuration;
        this.nbAnimationStep = nbAnimationStep;
    }

    update(dt: number): void {
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

        super.update(dt);
    }
}
