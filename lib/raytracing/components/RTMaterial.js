"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTMaterial = undefined;

var _Color = require("../../core/Color");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } //Raytracing: Material Components


var RTMaterial = exports.RTMaterial = function RTMaterial(color, emission, type, refra) {
    _classCallCheck(this, RTMaterial);

    this.cl = new _Color.Color(1, 1, 1, 1);
    this.em = new _Color.Color(1, 1, 1, 1);
    this.tp = RTMaterial.DIFFUSE;
    this.rf = 1;
    if (color != null) {
        this.cl = color;
    }
    if (emission != null) {
        this.em = emission;
    }
    if (type != null) {
        this.tp = type;
    }
    if (refra != null) {
        this.rf = refra;
    }
};

RTMaterial.ABSORBED = 0;
RTMaterial.DIFFUSE = 1;
RTMaterial.SPECULAR = 2;
RTMaterial.REFRACTION = 3;
RTMaterial.METAL = 4;
RTMaterial.MOSSY = 5;