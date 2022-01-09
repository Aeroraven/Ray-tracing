"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTAmbientLight = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Color = require("../../core/Color");

var _RTShaderVariableMap = require("../RTShaderVariableMap");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RTAmbientLight = exports.RTAmbientLight = function () {
    function RTAmbientLight(color, name) {
        _classCallCheck(this, RTAmbientLight);

        this.cl = new _Color.Color(1, 1, 1, 1);
        this.name = "RTAmbientLight" + name;
        if (color != null) {
            this.cl = color;
        }
    }

    _createClass(RTAmbientLight, [{
        key: "updateMap",
        value: function updateMap(shaderVarMap) {
            shaderVarMap.insert(this.name + "_CL", this.cl.getGLMatVec4(), _RTShaderVariableMap.RTShaderVariableMap.VEC4);
        }
    }, {
        key: "genCode",
        value: function genCode() {
            return "\n        ambient = vec4(" + this.name + "_CL" + ");\n        ";
        }
    }]);

    return RTAmbientLight;
}();