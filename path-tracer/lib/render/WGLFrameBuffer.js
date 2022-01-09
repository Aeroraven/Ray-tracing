"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//WGL帧缓冲处理
//该类辅助重定向渲染结果到贴图上
var WGLFrameBuffer = exports.WGLFrameBuffer = function () {
    function WGLFrameBuffer(gl) {
        _classCallCheck(this, WGLFrameBuffer);

        this.gl = gl;
        this.fb = gl.createFramebuffer();
        this.depBuf = gl.createRenderbuffer();
        this.depth = false;
    }

    _createClass(WGLFrameBuffer, [{
        key: "bindTexture",
        value: function bindTexture(attachment, texture, depth) {
            var gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
            gl.bindTexture(gl.TEXTURE_2D, texture.getTexture());
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture.getTexture(), texture, 0);
            this.depth = depth;
            if (depth) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.depBuf);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture.getW(), texture.getH());
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depBuf);
            }
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }, {
        key: "bindTexturePingPong",
        value: function bindTexturePingPong(attachment, textureA, textureB) {
            var gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
            gl.bindTexture(gl.TEXTURE_2D, textureA.getTexture());
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, textureB.getTexture(), 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }, {
        key: "start",
        value: function start() {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
        }
    }, {
        key: "end",
        value: function end() {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
    }]);

    return WGLFrameBuffer;
}();