"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Camera = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glMatrix = require("gl-matrix");

var _Vec = require("./Vec");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Camera = exports.Camera = function () {
    function Camera() {
        _classCallCheck(this, Camera);

        this.projectionMat = _glMatrix.mat4.create();
        this.modelViewMat = _glMatrix.mat4.create();
        this.camPositon = new _Vec.Vec(0, 0, 0);
        this.camCenter = new _Vec.Vec(0, 0, 0);
        this.camUp = new _Vec.Vec(0, 0, 0);
        window.r = this.modelViewMat;
    }

    _createClass(Camera, [{
        key: "setPerspective",
        value: function setPerspective(fovy, aspect, zNear, zFar) {
            _glMatrix.mat4.perspective(this.projectionMat, fovy, aspect, zNear, zFar);
        }
    }, {
        key: "setOrtho",
        value: function setOrtho(left, right, top, bottom, zNear, zFar) {
            _glMatrix.mat4.ortho(this.projectionMat, left, right, bottom, top, zNear, zFar);
        }
    }, {
        key: "setCamPosition",
        value: function setCamPosition(camvec) {
            this.camPositon = camvec;
        }
    }, {
        key: "setCamCenter",
        value: function setCamCenter(cenvec) {
            this.camCenter = cenvec;
        }
    }, {
        key: "setCamUp",
        value: function setCamUp(upvec) {
            this.camUp = upvec;
        }
    }, {
        key: "translate",
        value: function translate(deltavec) {
            this.camCenter.add(deltavec);
            this.camPositon.add(deltavec);
        }
    }, {
        key: "generate",
        value: function generate() {
            _glMatrix.mat4.lookAt(this.modelViewMat, this.camPositon.getGLMatVec3(), this.camCenter.getGLMatVec3(), this.camUp.getGLMatVec3());
            window.x = this.modelViewMat;
            window.w = this.camPositon;
        }
    }, {
        key: "getMatrix",
        value: function getMatrix() {
            this.generate();
            return {
                proj: this.projectionMat,
                view: this.modelViewMat
            };
        }
    }]);

    return Camera;
}();