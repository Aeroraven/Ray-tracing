'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TrivialShader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ShaderBase2 = require('./ShaderBase');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//主着色器
//包含顶点和片段着色器
var TrivialShader = exports.TrivialShader = function (_ShaderBase) {
    _inherits(TrivialShader, _ShaderBase);

    function TrivialShader(gl) {
        _classCallCheck(this, TrivialShader);

        var _this = _possibleConstructorReturn(this, (TrivialShader.__proto__ || Object.getPrototypeOf(TrivialShader)).call(this, gl));

        _this.gl = gl;
        _this.vertexShader = '  ';
        _this.fragmentShader = '  ';
        return _this;
    }

    _createClass(TrivialShader, [{
        key: 'getFragShader',
        value: function getFragShader() {
            this.fragmentShader = '\n        varying lowp vec4 vColor;\n        varying highp vec4 vPosition;\n        varying highp vec3 vAmbientLight;\n        varying highp vec2 vTextureCoord;\n        uniform int uUsingTex;\n\n        uniform sampler2D uSampler;\n        int temp;\n        //Update\n        void main() {\n            highp vec4 ret;\n            if(uUsingTex==0){\n                ret = vec4(vColor.xyz * vAmbientLight,vColor.w);\n            }else{\n                highp vec4 tex = texture2D(uSampler,vec2(vTextureCoord.s,vTextureCoord.t));\n                ret = tex;\n                \n            }\n            ret = ret * vec4(vAmbientLight,1.0);\n            gl_FragColor = ret;\n            \n        }\n        ';
            return this.fragmentShader;
        }
    }, {
        key: 'getVertexShader',
        value: function getVertexShader() {
            this.vertexShader = '\n        attribute vec4 aVertexPosition;\n        attribute vec4 aVertexColor;\n        attribute vec2 aTextureCoord;\n\n        uniform mat4 uModelViewMatrix;\n        uniform mat4 uProjectionMatrix;\n        uniform vec3 uAmbientLight;\n\n        varying lowp vec4 vColor;\n        varying highp vec4 vPosition;\n        varying highp vec3 vAmbientLight;\n        varying highp vec2 vTextureCoord;\n\n        void main() {\n          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n          vColor = aVertexColor;\n          vAmbientLight = uAmbientLight;\n          vTextureCoord = aTextureCoord;\n          vPosition = aVertexPosition;\n        }\n        ';
            return this.vertexShader;
        }
    }, {
        key: 'getShaderProgram',
        value: function getShaderProgram() {
            return this.getShaderProgramEx(this.getVertexShader(), this.getFragShader());
        }
    }, {
        key: 'getLocationsInfo',
        value: function getLocationsInfo() {
            var shaderProgram = this.getShaderProgram();
            return {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                    vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
                    vertexTexture: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord')
                },
                uniformLocations: {
                    projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                    modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                    ambientLight: this.gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
                    usingTex: this.gl.getUniformLocation(shaderProgram, 'uUsingTex'),
                    sampler: this.gl.getUniformLocation(shaderProgram, 'uSampler')
                }
            };
        }
    }]);

    return TrivialShader;
}(_ShaderBase2.ShaderBase);