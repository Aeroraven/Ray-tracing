"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTScene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Camera = require("../core/Camera");

var _Color = require("../core/Color");

var _Vec = require("../core/Vec");

var _WGLFrameBuffer = require("../render/WGLFrameBuffer");

var _WGLTexture = require("../render/WGLTexture");

var _RTAmbientLight = require("./components/RTAmbientLight");

var _RTSkyLight = require("./components/RTSkyLight");

var _RTPointLight = require("./components/RTPointLight");

var _RTObserver = require("./RTObserver");

var _RTShader = require("./RTShader");

var _RTShaderUtil = require("./RTShaderUtil");

var _RTShaderVariableMap = require("./RTShaderVariableMap");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RTScene = exports.RTScene = function () {
    function RTScene(gl) {
        _classCallCheck(this, RTScene);

        this.gl = gl;
        this.shaderVar = new _RTShaderVariableMap.RTShaderVariableMap();
        this.screen = new _Camera.Camera();
        this.observer = new _RTObserver.RTObserver(gl);
        this.shader = new _RTShader.RTShader(gl);
        this.compiledShader = null;
        this.geometryList = [];

        this.renderOutput = [new _WGLTexture.WGLTexture(gl, 256, 256, null), new _WGLTexture.WGLTexture(gl, 256, 256, null)];
        this.frameBuffer = new _WGLFrameBuffer.WGLFrameBuffer(gl);
        this.frameBuffer.bindTexturePingPong(gl.COLOR_ATTACHMENT0, this.renderOutput[0], this.renderOutput[0]);

        this.startTimestamp = Date.now();

        this.sampleCount = 0;

        this.sheetRect = [-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0];
        this.sheetTex = [0, 0, 0, 1, 1, 0, 1, 1];
        this.sheetColor = [0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1];
        this.sheetvb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sheetvb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sheetRect), gl.STATIC_DRAW);

        this.sheetcb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sheetcb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sheetColor), gl.STATIC_DRAW);

        this.sheettb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sheettb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sheetTex), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.screen.setOrtho(-1, 1, 1, -1, -1, 1);
        this.screen.setCamCenter(new _Vec.Vec(0, 0, -1));
        this.screen.setCamUp(new _Vec.Vec(0, 1, 0));
        this.screen.setCamPosition(new _Vec.Vec(0, 0, 0));
        //Spotlights
        this.pointlights = new Array();

        //Optional
        this.ambientLight = new _RTAmbientLight.RTAmbientLight(new _Color.Color(0, 0, 0, 1));
        this.skylight = new _RTSkyLight.RTSkyLight(new _Color.Color(0, 0, 0, 1));
    }

    _createClass(RTScene, [{
        key: "clear",
        value: function clear() {
            this.geometryList = [];
            this.shaderVar.clear();
            this.pointlights = [];
        }
    }, {
        key: "attach",
        value: function attach(x) {
            if (x instanceof _RTAmbientLight.RTAmbientLight) {
                this.ambientLight = x;
            } else if (x instanceof _RTSkyLight.RTSkyLight) {
                this.skylight = x;
            } else if (x instanceof _RTPointLight.RTPointLight) {
                this.pointlights.push(x);
            } else {
                this.geometryList.push(x);
            }
        }
    }, {
        key: "getRenderOutput",
        value: function getRenderOutput() {
            return this.renderOutput[0];
        }
    }, {
        key: "loadAlternativeTexture",
        value: function loadAlternativeTexture() {
            this.shaderVar.insert('uTexture', 0, _RTShaderVariableMap.RTShaderVariableMap.SAMPLER2D, this.renderOutput[1].getTexture());
        }
    }, {
        key: "updateMap",
        value: function updateMap() {
            for (var i = 0; i < this.geometryList.length; i++) {
                this.geometryList[i].updateMap(this.shaderVar);
            }
            for (var _i = 0; _i < this.pointlights.length; _i++) {
                this.pointlights[_i].updateMap(this.shaderVar);
            }
            this.observer.prepareShaderMap(this.shaderVar);
            this.ambientLight.updateMap(this.shaderVar);
            this.skylight.updateMap(this.shaderVar);
            this.shaderVar.insert('uProjectionMatrix', this.screen.getMatrix().proj, _RTShaderVariableMap.RTShaderVariableMap.MAT4);
            this.shaderVar.insert('uModelViewMatrix', this.screen.getMatrix().view, _RTShaderVariableMap.RTShaderVariableMap.MAT4);
            this.shaderVar.insert('uTime', Date.now() - this.startTimestamp, _RTShaderVariableMap.RTShaderVariableMap.FLOAT);
            this.shaderVar.insert('uSamples', this.sampleCount, _RTShaderVariableMap.RTShaderVariableMap.INT);
            this.loadAlternativeTexture();
        }
    }, {
        key: "genIntersectionJudge",
        value: function genIntersectionJudge() {
            var x = "";
            for (var i = 0; i < this.geometryList.length; i++) {
                x += this.geometryList[i].genShaderIntersection();
            }
            return x;
        }
    }, {
        key: "genSpotlightJudge",
        value: function genSpotlightJudge() {
            var x = "";
            for (var i = 0; i < this.pointlights.length; i++) {
                x += this.pointlights[i].genShaderTest();
            }

            return x;
        }
    }, {
        key: "genFragmentShader",
        value: function genFragmentShader() {
            this.updateMap();
            var ins = this.genIntersectionJudge();
            var amb = this.ambientLight.genCode() + this.skylight.genCode();
            var spl = this.genSpotlightJudge();
            var funcParam = {
                intersection: ins,
                ambientSetting: amb,
                pointlight: spl
            };

            var ret = _RTShaderUtil.RTShaderUtil.getFragmentShader(funcParam, this.shaderVar);
            return ret;
        }
    }, {
        key: "compile",
        value: function compile() {
            this.compiledShader = this.shader.getShaderProgram(this);
        }
    }, {
        key: "updateUniform",
        value: function updateUniform() {
            this.shaderVar.insert('uTime', new Date().getTime() - this.startTimestamp, _RTShaderVariableMap.RTShaderVariableMap.FLOAT);
            this.shaderVar.insert('uSamples', this.sampleCount, _RTShaderVariableMap.RTShaderVariableMap.INT);
        }
    }, {
        key: "clear",
        value: function clear() {
            this.frameBuffer.start();
            this.renderOutput[0].start();
            gl.viewport(0, 0, this.getRenderOutput().getW(), this.getRenderOutput().getH());
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.renderOutput[0].end();
            this.frameBuffer.end();
        }
    }, {
        key: "render",
        value: function render() {
            var doClear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            //Draw To Tex0 & Using Tex1 to Render
            var gl = this.gl;

            this.frameBuffer.bindTexturePingPong(gl.COLOR_ATTACHMENT0, this.renderOutput[0], this.renderOutput[1]);

            this.frameBuffer.start();
            this.renderOutput[0].start();
            gl.viewport(0, 0, this.getRenderOutput().getW(), this.getRenderOutput().getH());
            gl.clearColor(0, 0, 0, 1);

            gl.useProgram(this.compiledShader);
            this.shaderVar.bindShaderVarible(gl, this.compiledShader);
            this.updateUniform();
            this.loadAlternativeTexture();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.sheetcb);
            gl.vertexAttribPointer(gl.getAttribLocation(this.compiledShader, 'aVertexColor'), 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(gl.getAttribLocation(this.compiledShader, 'aVertexColor'));

            gl.bindBuffer(gl.ARRAY_BUFFER, this.sheetvb);
            gl.vertexAttribPointer(gl.getAttribLocation(this.compiledShader, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(gl.getAttribLocation(this.compiledShader, 'aVertexPosition'));

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            this.sampleCount++;

            this.renderOutput[0].end();
            this.frameBuffer.end();
            this.renderOutput.reverse();
        }
    }]);

    return RTScene;
}();