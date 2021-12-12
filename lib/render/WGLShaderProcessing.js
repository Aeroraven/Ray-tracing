"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WGLShaderProcessing = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Log = require("../core/Log");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//WGL着色器处理
var WGLShaderProcessing = exports.WGLShaderProcessing = function () {
    function WGLShaderProcessing(gl) {
        _classCallCheck(this, WGLShaderProcessing);

        this.gl = gl;
    }

    _createClass(WGLShaderProcessing, [{
        key: "loadShader",
        value: function loadShader(type, src) {
            var shader = this.gl.createShader(type);
            this.gl.shaderSource(shader, src);
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.log("[CGProject] Failed To Compile Shader");
                console.log(this.gl.getShaderInfoLog(shader));
                this.gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
    }, {
        key: "initShaderProgram",
        value: function initShaderProgram(vertexShaderSrc, fragmentShaderSrc) {
            _Log.Log.log("Compiling Vertex Shader");
            var vShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
            _Log.Log.log("Compiling Fragment Shader");
            var fShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);
            var shaderProgram = this.gl.createProgram();
            this.gl.attachShader(shaderProgram, vShader);
            this.gl.attachShader(shaderProgram, fShader);
            this.gl.linkProgram(shaderProgram);
            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                console.log("[CGProject] Failed to initialize the shader");
                console.log(this.gl.getProgramInfoLog(shaderProgram));
                return null;
            }
            console.log("[CGProject] Shader created");
            return shaderProgram;
        }
    }]);

    return WGLShaderProcessing;
}();