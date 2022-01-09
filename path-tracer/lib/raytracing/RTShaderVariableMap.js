"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTShaderVariableMap = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Log = require("../core/Log");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Raytracing: Uniform 常量映射表
var RTShaderVariableMap = exports.RTShaderVariableMap = function () {
    function RTShaderVariableMap() {
        _classCallCheck(this, RTShaderVariableMap);

        this.hashmap = {};
    }

    _createClass(RTShaderVariableMap, [{
        key: "insert",
        value: function insert(varName, initValue, type) {
            var ext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            this.hashmap[varName] = {};
            this.hashmap[varName].type = type;
            this.hashmap[varName].initValue = initValue;
            this.hashmap[varName].name = varName;
            this.hashmap[varName].ext = ext;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.hashmap = {};
        }
    }, {
        key: "getSourceFragment",
        value: function getSourceFragment() {
            var x = '';
            for (var el in this.hashmap) {
                var e = this.hashmap[el];
                x += "uniform ";
                x += e.type;
                x += e.name;
                x += ';\n';
            }
            return x;
        }
    }, {
        key: "bindShaderVarible",
        value: function bindShaderVarible(gl, shaderProgram) {
            for (var el in this.hashmap) {
                var e = this.hashmap[el];
                var u = gl.getUniformLocation(shaderProgram, e.name);
                _Log.Log.log("Binding uniform variable:" + el + "( " + e.type + ")");
                _Log.Log.log(e.initValue);
                if (e.type == RTShaderVariableMap.MAT4) {
                    gl.uniformMatrix4fv(u, false, e.initValue);
                }
                if (e.type == RTShaderVariableMap.VEC3) {
                    gl.uniform3fv(u, e.initValue);
                }
                if (e.type == RTShaderVariableMap.VEC4) {
                    gl.uniform4fv(u, e.initValue);
                }
                if (e.type == RTShaderVariableMap.VEC2) {
                    gl.uniform2fv(u, e.initValue);
                }
                if (e.type == RTShaderVariableMap.INT) {
                    gl.uniform1i(u, e.initValue);
                }
                if (e.type == RTShaderVariableMap.FLOAT) {
                    gl.uniform1f(u, e.initValue);
                }
                if (e.type == RTShaderVariableMap.SAMPLER2D) {
                    if (e.initValue == 0) {
                        gl.activeTexture(gl.TEXTURE0);
                    }
                    gl.bindTexture(gl.TEXTURE_2D, e.ext);
                    gl.uniform1i(u, e.initValue);
                }
                //console.log(this.shaderVar)
            }
        }
    }]);

    return RTShaderVariableMap;
}();

RTShaderVariableMap.MAT4 = 'mat4 ';
RTShaderVariableMap.VEC3 = 'vec3 ';
RTShaderVariableMap.VEC4 = 'vec4 ';
RTShaderVariableMap.VEC2 = 'vec2 ';
RTShaderVariableMap.INT = 'int ';
RTShaderVariableMap.BOOL = 'bool ';
RTShaderVariableMap.FLOAT = 'float ';
RTShaderVariableMap.SAMPLER2D = 'sampler2D ';