import assert from 'assert';
import { Collisions } from "../build/Libraries/Collisions.js";

describe('Test Collisions.simpleBox()', () => {
    it('should have collision', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        };

        let box2 = {
            x: 2,
            y: 2,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.simpleBox(box1, box2));
    });

    it('should have no collision', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        };

        let box2 = {
            x: 0,
            y: 50,
            width: 5,
            height: 5,
        };

        assert.ok(!Collisions.simpleBox(box1, box2));
    });
});

describe('Test Collisions.simpleMovingBox()', () => {
    it('should have collision (left to right)', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            dx: 60,
            dy: 0,
        };

        let box2 = {
            x: 10,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have collision (right to left)', () => {
        let box1 = {
            x: 10,
            y: 0,
            width: 5,
            height: 5,
            dx: -60,
            dy: 0,
        };

        let box2 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have collision (up to down)', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            dx: 0,
            dy: 60,
        };

        let box2 = {
            x: 0,
            y: 10,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have collision (down to up)', () => {
        let box1 = {
            x: 0,
            y: 10,
            width: 5,
            height: 5,
            dx: 0,
            dy: -60,
        };

        let box2 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have no collision', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            dx: 2,
            dy: 0,
        };

        let box2 = {
            x: 10,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(!Collisions.simpleMovingBox(box1, box2));
    });
});

describe('Test Collisions.movingBox()', () => {
    it('should have collision (left to right)', () => {
        let box1 = {
            x: 0,
            y: 3,
            width: 5,
            height: 5,
            dx: 60,
            dy: 0,
        };

        let box2 = {
            x: 10,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dx, 5);
    });

    it('should have collision (right to left)', () => {
        let box1 = {
            x: 10,
            y: 0,
            width: 5,
            height: 5,
            dx: -60,
            dy: 0,
        };

        let box2 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dx, -5);
    });

    it('should have collision (up to down)', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            dx: 0,
            dy: 60,
        };

        let box2 = {
            x: 0,
            y: 10,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dy, 5);
    });

    it('should have collision (down to up)', () => {
        let box1 = {
            x: 0,
            y: 10,
            width: 5,
            height: 5,
            dx: 0,
            dy: -60,
        };

        let box2 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dy, -5);
    });

    it('should have no collision', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            dx: 2,
            dy: 0,
        };

        let box2 = {
            x: 10,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(!Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.x, 0);
        assert.strictEqual(box1.dx, 2);
    });
});
