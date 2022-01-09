"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = exports.Vertex = function Vertex(vec, color, texcoord) {
    _classCallCheck(this, Vertex);

    this.pt = vec;
    this.cl = color;
    if (texcoord == null) {
        this.tx = [0.0, 0.0];
    } else {
        this.tx = texcoord;
    }
};