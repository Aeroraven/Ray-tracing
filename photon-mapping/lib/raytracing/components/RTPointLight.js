"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTPointLight = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //Raytracing: 点光源


var _Color = require("../../core/Color");

var _Vec = require("../../core/Vec");

var _RTShaderVariableMap = require("../RTShaderVariableMap");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @deprecated 建议使用材质的Emission属性替代
 */
var RTPointLight = exports.RTPointLight = function () {
    function RTPointLight(pos, col, attenuation, name) {
        _classCallCheck(this, RTPointLight);

        window.alert("请不要使用点光源！");
        this.cl = new _Color.Color(1, 1, 1, 1);
        this.pos = new _Vec.Vec(0, 0, 0);
        this.atu = new _Vec.Vec(0, 0, 0);
        if (pos != null) {
            this.pos = pos;
        }
        if (col != null) {
            this.col = col;
        }
        if (attenuation != null) {
            this.atu = attenuation;
        }
        this.name = "RTPointLight" + name;
    }

    _createClass(RTPointLight, [{
        key: "updateMap",
        value: function updateMap(shaderVarMap) {
            var mp = shaderVarMap;
            shaderVarMap.insert(this.name + "_PS", this.pos.getGLMatVec3(), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderVarMap.insert(this.name + "_AT", this.atu.getGLMatVec3(), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
        }
    }, {
        key: "genShaderTest",
        value: function genShaderTest() {
            window.alert("请不要使用点光源！");
            return "\n                if(true){\n                    if(fShadowLight(" + this.name + '_PS' + ",cp)==false){\n                        float dst = length(cp-" + this.name + "_PS" + ");\n                        intensity=min(1.0,1.0/(" + this.name + "_AT" + ".x+" + this.name + "_AT.y*dst+" + this.name + "_AT.z*dst*dst));\n                    }\n                }\n        ";
        }
    }]);

    return RTPointLight;
}();