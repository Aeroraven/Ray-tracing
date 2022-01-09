"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AmbientLight = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vec = require("../core/Vec");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AmbientLight = exports.AmbientLight = function () {
    function AmbientLight() {
        _classCallCheck(this, AmbientLight);

        this.light = new _Vec.Vec(1, 1, 1);
    }

    _createClass(AmbientLight, [{
        key: "setLight",
        value: function setLight(light) {
            this.light = light;
        }
    }]);

    return AmbientLight;
}();