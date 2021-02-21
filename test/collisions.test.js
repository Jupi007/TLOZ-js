import assert from 'assert';
import { Collisions } from "../build/functions.js";

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
    it('should have collision', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            dx: 3,
            dy: 0,
        };

        let box2 = {
            x: 5,
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
    it('should have collision', () => {
        let box1 = {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
            dx: 5,
            dy: 0,
        };

        let box2 = {
            x: 7,
            y: 0,
            width: 5,
            height: 5,
        };

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.x, 2);
        assert.strictEqual(box1.dx, 0);
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
