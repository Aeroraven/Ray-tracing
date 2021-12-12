"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WGLScene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene2 = require("../core/Scene");

var _WGLFrameBuffer = require("./WGLFrameBuffer");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//WGL场景
//该类使用WebGL实现基类Scene的功能
var WGLScene = exports.WGLScene = function (_Scene) {
    _inherits(WGLScene, _Scene);

    function WGLScene(gl) {
        _classCallCheck(this, WGLScene);

        var _this = _possibleConstructorReturn(this, (WGLScene.__proto__ || Object.getPrototypeOf(WGLScene)).call(this));

        _this.gl = gl;
        _this.fb = new _WGLFrameBuffer.WGLFrameBuffer(gl);
        _this.usingTex = 0;
        return _this;
    }

    _createClass(WGLScene, [{
        key: "getFrameBuffer",
        value: function getFrameBuffer() {
            return this.fb;
        }
    }, {
        key: "getGLVertexArray",
        value: function getGLVertexArray() {
            //For convenience
            var gl = this.gl;
            //Get buffer
            var vlist = [];
            var clist = [];
            var tlist = [];
            var cnt = 0;
            for (var i = 0; i < this.vbuf.length; i++) {
                var el = this.vbuf[i];
                el.eval();
                vlist = vlist.concat(el.vertices);
                clist = clist.concat(el.colors);
                tlist = tlist.concat(el.texture);
                cnt += el.vertexlist.length;
            }
            window.w = {
                v: vlist,
                t: tlist,
                c: clist

                //Get WGL vertex buffer
            };var glvbuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, glvbuf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vlist), gl.STATIC_DRAW);

            //Get WGL color buffer
            var glcbuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, glcbuf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(clist), gl.STATIC_DRAW);

            //Get WGL tex buffer
            var gltbuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, gltbuf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tlist), gl.STATIC_DRAW);

            var ret = {
                vb: glvbuf,
                cb: glcbuf,
                tb: gltbuf,
                vnum: cnt
            };
            window.r = ret;
            return ret;
        }
    }, {
        key: "render",
        value: function render(shaderInfo, camera, texture) {
            //Render preparation
            var gl = this.gl;
            gl.clearColor(0, 0, 0, 1);
            gl.clearDepth(1);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.renderInternal(shaderInfo, camera, texture);
        }
    }, {
        key: "renderInternal",
        value: function renderInternal(shaderInfo, camera, texture, fbtex) {
            var gl = this.gl;
            var uniformMatrix = camera.getMatrix();
            var projectionMatrix = uniformMatrix.proj;
            var modelViewMat = uniformMatrix.view;

            //Get buffer
            var buf = this.getGLVertexArray();

            //Bind Vertex
            gl.bindBuffer(gl.ARRAY_BUFFER, buf.vb);
            gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

            //Bind Color
            gl.bindBuffer(gl.ARRAY_BUFFER, buf.cb);
            gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);

            //If UseTex
            if (this.usingTex) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buf.tb);
                gl.vertexAttribPointer(shaderInfo.attribLocations.vertexTexture, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexTexture);
            }

            gl.useProgram(shaderInfo.program);
            gl.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
            gl.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, modelViewMat);
            gl.uniform3fv(shaderInfo.uniformLocations.ambientLight, this.ambientLight.light.getGLMatVec3());
            gl.activeTexture(gl.TEXTURE0);
            if (texture != null) {
                texture.start();
            }
            gl.uniform1i(shaderInfo.uniformLocations.usingTex, this.usingTex);
            gl.uniform1i(shaderInfo.uniformLocations.sampler, 0);
            if (fbtex != null) {
                fbtex.end();
            }
            gl.drawArrays(gl.TRIANGLES, 0, buf.vnum);
            if (texture != null) {
                texture.end();
            }
        }
    }, {
        key: "renderToTexture",
        value: function renderToTexture(shaderInfo, camera, texture) {
            var gl = this.gl;
            this.fb.start();
            texture.start();
            gl.viewport(0, 0, texture.getW(), texture.getH());
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.renderInternal(shaderInfo, camera, null, texture);
            texture.end();
            this.fb.end();
        }
    }]);

    return WGLScene;
}(_Scene2.Scene);