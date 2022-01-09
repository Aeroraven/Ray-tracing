"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Vec = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glMatrix = require("gl-matrix");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vec = exports.Vec = function () {
    function Vec(x, y, z) {
        _classCallCheck(this, Vec);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    _createClass(Vec, [{
        key: "add",
        value: function add(vec) {
            return new Vec(this.x + vec.x, this.y + vec.y, this.z + vec.z);
        }
    }, {
        key: "dot",
        value: function dot(vec) {
            return new Vec(this.x * vec.x, this.y * vec.y, this.z * vec.z);
        }
    }, {
        key: "cross",
        value: function cross(vec) {
            return new Vec(y * vec.z - z * vec.y, -x * vec.z + z * vec.x, x * vec.y - y * vec.x);
        }
    }, {
        key: "neg",
        value: function neg() {
            return new Vec(-this.x, -this.y, -this.z);
        }
    }, {
        key: "set",
        value: function set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }, {
        key: "getGLMatVec3",
        value: function getGLMatVec3() {
            var r = _glMatrix.vec3.create();
            r[0] = this.x;
            r[1] = this.y;
            r[2] = this.z;
            return r;
        }
    }, {
        key: "dist",
        value: function dist() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
    }, {
        key: "norm",
        value: function norm() {
            var dist = this.dist();
            return new Vec(this.x / dist, this.y / dist, this.z / dist);
        }
    }, {
        key: "magnify",
        value: function magnify(num) {
            return new Vec(this.x * num, this.y * num, this.z * num);
        }
    }]);

    return Vec;
}();