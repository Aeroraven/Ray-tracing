"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTObserver = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glMatrix = require("gl-matrix");

var _Camera = require("../core/Camera");

var _Vec = require("../core/Vec");

var _RTShaderVariableMap = require("./RTShaderVariableMap");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RTObserver = exports.RTObserver = function () {
    function RTObserver(gl) {
        _classCallCheck(this, RTObserver);

        this.cam = new _Camera.Camera();
        this.cam.setPerspective(45 * Math.PI / 180, gl.canvas.height / gl.canvas.width, 0.1, 100);
        this.cam.setCamPosition(new _Vec.Vec(0, 0, -6));
        this.cam.setCamUp(new _Vec.Vec(0, 1, 0));
        this.cam.setCamCenter(new _Vec.Vec(0, 0, 0));
    }

    _createClass(RTObserver, [{
        key: "getCameraMatrix",
        value: function getCameraMatrix() {
            return _glMatrix.mat4.mul(this.cam.getMatrix().proj, this.cam.getMatrix().view);
        }
    }, {
        key: "getEye",
        value: function getEye() {
            return this.cam.camPositon;
        }
    }, {
        key: "getRay",
        value: function getRay(x, y) {
            var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            var orgvec = new _Vec.Vec(x, y, z);
            var orgvecm = _glMatrix.mat4.create();
            _glMatrix.mat4.set(orgvecm, orgvec.x, 0, 0, 0, orgvec.y, 0, 0, 0, orgvec.z, 0, 0, 0, 1, 0, 0, 0);
            var projvecm = _glMatrix.mat4.create();
            _glMatrix.mat4.mul(projvecm, projvecm, orgvecm);
            var projvec = new _Vec.Vec(projvecm[0], projvecm[4], projvecm[8]);
            //console.log(this.cam)
            var ray = projvec.add(this.getEye().neg());
            return ray.getGLMatVec3();
        }
    }, {
        key: "prepareShaderMap",
        value: function prepareShaderMap(shaderMap) {
            shaderMap.insert('raylt', this.getRay(-1, 1), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderMap.insert('raylb', this.getRay(-1, -1), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderMap.insert('rayrb', this.getRay(1, -1), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderMap.insert('rayrt', this.getRay(1, 1), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderMap.insert('eye', this.getEye().getGLMatVec3(), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
        }
    }]);

    return RTObserver;
}();