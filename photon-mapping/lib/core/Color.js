"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Color = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glMatrix = require("gl-matrix");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//RGBA 颜色
var Color = exports.Color = function () {
    function Color(r, g, b, a) {
        _classCallCheck(this, Color);

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    _createClass(Color, [{
        key: "getGLMatVec4",
        value: function getGLMatVec4() {
            var r = _glMatrix.vec4.create();
            r[0] = this.r;
            r[1] = this.g;
            r[2] = this.b;
            r[3] = this.a;
            return r;
        }
    }]);

    return Color;
}();