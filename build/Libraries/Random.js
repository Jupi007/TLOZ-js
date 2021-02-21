export var Random;
(function (Random) {
    function getIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    Random.getIntInclusive = getIntInclusive;
    function getOneInt(number) {
        return this.getIntInclusive(1, number) === 1;
    }
    Random.getOneInt = getOneInt;
})(Random || (Random = {}));
