"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTShader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ShaderBase2 = require("../shader/ShaderBase");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RTShader = exports.RTShader = function (_ShaderBase) {
    _inherits(RTShader, _ShaderBase);

    function RTShader(gl) {
        _classCallCheck(this, RTShader);

        var _this = _possibleConstructorReturn(this, (RTShader.__proto__ || Object.getPrototypeOf(RTShader)).call(this, gl));

        _this.gl = gl;
        _this.vertexShader = "  ";
        _this.fragmentShader = "  ";
        return _this;
    }

    _createClass(RTShader, [{
        key: "getFragShader",
        value: function getFragShader(scene) {
            this.fragmentShader = scene.genFragmentShader();
            return this.fragmentShader;
        }
    }, {
        key: "getVertexShader",
        value: function getVertexShader() {
            this.vertexShader = "#version 300 es\n        in vec4 aVertexPosition;\n        in vec4 aVertexColor;\n        in vec2 aVertexTex;\n\n        uniform mat4 uModelViewMatrix;\n        uniform mat4 uProjectionMatrix;\n        uniform vec3 raylb;\n        uniform vec3 raylt;\n        uniform vec3 rayrb;\n        uniform vec3 rayrt;\n\n        out highp vec3 ray;\n        out highp vec4 color;\n        out highp vec2 tex;\n        void main() {\n            float yp = aVertexPosition.y*0.5+0.5;\n            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n            ray = mix(mix(raylb,raylt,yp),mix(rayrb,rayrt,yp),aVertexPosition.x*0.5+0.5);\n            color = aVertexColor;\n            tex = aVertexTex;\n        }\n        ";
            return this.vertexShader;
        }
    }, {
        key: "getFragShaderTest",
        value: function getFragShaderTest(scene) {
            this.fragmentShader = "precision highp float;\n            varying highp vec3 ray;\n            void main(){\n                gl_FragColor = vec4(color);\n            }\n        ";
            return this.fragmentShader;
        }
    }, {
        key: "getShaderProgram",
        value: function getShaderProgram(scene) {
            return this.getShaderProgramEx(this.getVertexShader(), this.getFragShader(scene));
        }
    }, {
        key: "getLocationsInfo",
        value: function getLocationsInfo(scene) {
            var shaderProgram = this.getShaderProgram(scene);
            return shaderProgram;
        }
    }]);

    return RTShader;
}(_ShaderBase2.ShaderBase);