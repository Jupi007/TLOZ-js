import { describe } from 'mocha';
import assert from 'assert';
import { Collisions } from "../src/ts/Libraries/Collisions";
import { MovingBox, SimpleBox } from '../src/ts/Libraries/Boxes';

describe('Test Collisions.simpleBox()', () => {
    it('should have collision', () => {
        let box1 = new SimpleBox();
        box1.x = 0;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;

        let box2 = new SimpleBox();
        box2.x = 3;
        box2.y = 3;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.simpleBox(box1, box2));
    });

    it('should have no collision', () => {
        let box1 = new SimpleBox();
        box1.x = 0;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;

        let box2 = new SimpleBox();
        box2.x = 0;
        box2.y = 50;
        box2.width = 5;
        box2.height = 5;

        assert.ok(!Collisions.simpleBox(box1, box2));
    });
});

describe('Test Collisions.simpleMovingBox()', () => {
    it('should have collision (left to right)', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 60;
        box1.dy = 0;

        let box2 = new SimpleBox();
        box2.x = 10;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have collision (right to left)', () => {
        let box1 = new MovingBox();
        box1.x = 10;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;
        box1.dx = -60;
        box1.dy = 0;

        let box2 = new SimpleBox();
        box2.x = 0;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have collision (up to down)', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 0;
        box1.dy = 60;

        let box2 = new SimpleBox();
        box2.x = 0;
        box2.y = 10;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have collision (down to up)', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 10;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 0;
        box1.dy = -60;

        let box2 = new SimpleBox();
        box2.x = 0;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.simpleMovingBox(box1, box2));
    });

    it('should have no collision', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 2;
        box1.dy = 0;

        let box2 = new SimpleBox();
        box2.x = 10;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(!Collisions.simpleMovingBox(box1, box2));
    });
});

describe('Test Collisions.movingBox()', () => {
    it('should have collision (left to right)', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 3;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 60;
        box1.dy = 0;

        let box2 = new SimpleBox();
        box2.x = 10;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dx, 5);
    });

    it('should have collision (right to left)', () => {
        let box1 = new MovingBox();
        box1.x = 10;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;
        box1.dx = -60;
        box1.dy = 0;

        let box2 = new SimpleBox();
        box2.x = 0;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dx, -5);
    });

    it('should have collision (up to down)', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 0;
        box1.dy = 60;

        let box2 = new SimpleBox();
        box2.x = 0;
        box2.y = 10;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dy, 5);
    });

    it('should have collision (down to up)', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 10;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 0;
        box1.dy = -60;

        let box2 = new SimpleBox();
        box2.x = 0;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.dy, -5);
    });

    it('should have no collision', () => {
        let box1 = new MovingBox();
        box1.x = 0;
        box1.y = 0;
        box1.width = 5;
        box1.height = 5;
        box1.dx = 2;
        box1.dy = 0;

        let box2 = new SimpleBox();
        box2.x = 10;
        box2.y = 0;
        box2.width = 5;
        box2.height = 5;

        assert.ok(!Collisions.movingBox(box1, box2));
        assert.strictEqual(box1.x, 0);
        assert.strictEqual(box1.dx, 2);
    });
});
