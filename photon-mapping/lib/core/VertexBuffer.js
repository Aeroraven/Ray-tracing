"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertexBuffer = exports.VertexBuffer = function () {
    function VertexBuffer() {
        _classCallCheck(this, VertexBuffer);

        //expand buffer
        this.vertices = new Array();
        this.colors = new Array();
        this.texture = new Array();

        //vertex list
        this.vertexlist = new Array();

        //ready state
        this.ready = false;
    }

    _createClass(VertexBuffer, [{
        key: "addVertex",
        value: function addVertex(vertex) {
            this.vertexlist.push(vertex);
            this.ready = false;
        }
    }, {
        key: "eval",
        value: function _eval() {
            if (this.ready === true) {
                return;
            }
            this.vertices = new Array();
            this.colors = new Array();
            this.texture = new Array();
            for (var i = 0; i < this.vertexlist.length; i++) {
                var el = this.vertexlist[i];
                this.vertices.push(el.pt.x);
                this.vertices.push(el.pt.y);
                this.vertices.push(el.pt.z);
                this.colors.push(el.cl.r);
                this.colors.push(el.cl.g);
                this.colors.push(el.cl.b);
                this.colors.push(el.cl.a);
                this.texture.push(el.tx.x);
                this.texture.push(el.tx.y);
            }
            this.ready = true;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.vertexlist = [];
            this.ready = false;
        }
    }]);

    return VertexBuffer;
}();