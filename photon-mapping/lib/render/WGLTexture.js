"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//WGL纹理
var WGLTexture = exports.WGLTexture = function () {
    function WGLTexture(gl, width, height, pixels) {
        _classCallCheck(this, WGLTexture);

        this.w = width;
        this.h = height;
        this.gl = gl;
        this.tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.w, this.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    _createClass(WGLTexture, [{
        key: "disableMips",
        value: function disableMips() {
            var gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }, {
        key: "getTexture",
        value: function getTexture() {
            return this.tex;
        }
    }, {
        key: "start",
        value: function start() {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
        }
    }, {
        key: "end",
        value: function end() {
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }, {
        key: "getW",
        value: function getW() {
            return this.w;
        }
    }, {
        key: "getH",
        value: function getH() {
            return this.h;
        }
    }, {
        key: "updateTexture",
        value: function updateTexture(pixels) {
            window.i = pixels;
            var gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }, {
        key: "loadImageAsync",
        value: function loadImageAsync(src) {
            var image = new Image();
            var parent = this;
            image.onload = function () {
                parent.updateTexture(image);
            };
            image.src = src;
        }
    }]);

    return WGLTexture;
}();