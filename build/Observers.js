export class AbstractObserver {
    constructor() {
        this.currentFrame = 0;
        this.isFirstFrame = true;
    }
    update(dt) {
        this.currentFrame += dt;
    }
}
export class StateObserver extends AbstractObserver {
    constructor(state) {
        super();
        this.lastState = null;
        this.lastFrameState = null;
        this.state = state;
        this.nextState = null;
    }
    setNextState(state) {
        this.nextState = state;
    }
    update(dt) {
        this.lastFrameState = this.state;
        if (this.nextState !== null) {
            this.lastState = this.state;
            this.state = this.nextState;
            this.nextState = null;
            this.currentFrame = 0;
            this.isFirstFrame = true;
        }
        else {
            this.isFirstFrame = false;
        }
        super.update(dt);
    }
    get() {
        return this.state;
    }
    getLast() {
        return this.lastState;
    }
    getLastFrame() {
        return this.lastFrameState;
    }
    is(state) {
        return this.state === state;
    }
    isIn(...states) {
        return states.some(s => this.is(s));
    }
    was(state) {
        return this.lastState === state;
    }
    wasIn(...states) {
        return states.some(s => this.was(s));
    }
    wasLastFrame(state) {
        return this.lastFrameState === state;
    }
    wasInLastFrame(...states) {
        return states.some(s => this.wasLastFrame(s));
    }
}
export class AnimationObserver extends AbstractObserver {
    constructor(animationStepDuration, nbAnimationStep) {
        super();
        this.currentAnimationStep = 1;
        this.animationStepDuration = animationStepDuration;
        this.nbAnimationStep = nbAnimationStep;
    }
    update(dt) {
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
