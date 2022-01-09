"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTMaterial = undefined;

var _Color = require("../../core/Color");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } //Raytracing:材质组件

var RTMaterial = exports.RTMaterial = function RTMaterial(color, emission, type) {
    _classCallCheck(this, RTMaterial);

    this.cl = new _Color.Color(1, 1, 1, 1);
    this.em = new _Color.Color(1, 1, 1, 1);
    this.tp = RTMaterial.DIFFUSE;
    if (color != null) {
        this.cl = color;
    }
    if (emission != null) {
        this.em = emission;
    }
    if (type != null) {
        this.tp = type;
    }
};

RTMaterial.DIFFUSE = 1;
RTMaterial.SPECULAR = 2;