import { describe } from 'mocha';
import assert from 'assert';
import { MathPlus } from "../src/ts/Libraries/MathPlus";

describe('Test MathPlus.trunc()', () => {
    it('should truncate given number at given decimal', () => {
        assert.strictEqual(MathPlus.trunc(1.123, 0), 1);
        assert.strictEqual(MathPlus.trunc(1.123, 2), 1.12);
        assert.strictEqual(MathPlus.trunc(1.123, 5), 1.123);
    });
});

describe('Test MathPlus.round()', () => {
    it('should round given number at given decimal', () => {
        assert.strictEqual(MathPlus.round(1.53, 0), 2);
        assert.strictEqual(MathPlus.round(1.53, 1), 1.5);
        assert.strictEqual(MathPlus.round(1.499, 5), 1.499);
    });
});
