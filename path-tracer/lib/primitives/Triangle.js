"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Triangle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vertex = require("../core/Vertex");

var _VertexBuffer2 = require("../core/VertexBuffer");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Triangle = exports.Triangle = function (_VertexBuffer) {
    _inherits(Triangle, _VertexBuffer);

    function Triangle(vertexA, vertexB, vertexC) {
        _classCallCheck(this, Triangle);

        var _this = _possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).call(this));

        if (vertexA != null) {
            _this.set(vertexA, vertexB, vertexC);
        }
        return _this;
    }

    _createClass(Triangle, [{
        key: "set",
        value: function set(vertexA, vertexB, vertexC) {
            this.clear();
            this.va = vertexA;
            this.vb = vertexB;
            this.vc = vertexC;
            this.addVertex(this.va);
            this.addVertex(this.vb);
            this.addVertex(this.vc);
            this.eval();
        }
    }, {
        key: "getNormalVector",
        value: function getNormalVector() {
            var v1 = this.va.pt.add(this.vb.pt.neg());
            var v2 = this.vb.pt.add(this.vc.pt.neg());
            var vNorm = v1.cross(v2).norm();
            return vNorm;
        }
    }, {
        key: "setp",
        value: function setp(vecA, vecB, vecC, col) {
            this.va = new _Vertex.Vertex(vecA, col);
            this.vb = new _Vertex.Vertex(vecB, col);
            this.vc = new _Vertex.Vertex(vecC, col);
            this.clear();
            this.addVertex(this.va);
            this.addVertex(this.vb);
            this.addVertex(this.vc);
            this.eval();
        }
    }]);

    return Triangle;
}(_VertexBuffer2.VertexBuffer);