export var MathPlus;
(function (MathPlus) {
    function trunc(number, nbDecimals = 0) {
        nbDecimals = Math.trunc(nbDecimals);
        return Math.trunc(number * (10 ** nbDecimals)) / (10 ** nbDecimals);
    }
    MathPlus.trunc = trunc;
    function round(number, nbDecimals = 0) {
        nbDecimals = Math.trunc(nbDecimals);
        return Math.round(number * (10 ** nbDecimals)) / (10 ** nbDecimals);
    }
    MathPlus.round = round;
})(MathPlus || (MathPlus = {}));
