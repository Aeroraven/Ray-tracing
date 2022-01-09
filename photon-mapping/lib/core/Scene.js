"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Scene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AmbientLight = require("../light/AmbientLight");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene = exports.Scene = function () {
    function Scene() {
        _classCallCheck(this, Scene);

        this.vbuf = new Array();
        this.ambientLight = new _AmbientLight.AmbientLight();
    }

    _createClass(Scene, [{
        key: "addShape",
        value: function addShape(x) {
            this.vbuf.push(x);
        }
    }, {
        key: "setAmbientLight",
        value: function setAmbientLight(light) {
            this.ambientLight = light;
        }
    }]);

    return Scene;
}();