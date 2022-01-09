"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShaderBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WGLShaderProcessing = require("../render/WGLShaderProcessing");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//着色器基类
var ShaderBase = exports.ShaderBase = function () {
    function ShaderBase(gl) {
        _classCallCheck(this, ShaderBase);

        this.gl = gl;
        this.vertexShader = "";
        this.fragmentShader = "";
    }

    _createClass(ShaderBase, [{
        key: "getVertexShader",
        value: function getVertexShader() {}
    }, {
        key: "getFragmentShader",
        value: function getFragmentShader() {}
    }, {
        key: "getShaderProgramEx",
        value: function getShaderProgramEx(vert, frag) {
            var shaderHelper = new _WGLShaderProcessing.WGLShaderProcessing(this.gl);
            console.log(vert);
            console.log(frag);
            return shaderHelper.initShaderProgram(vert, frag);
        }
    }]);

    return ShaderBase;
}();