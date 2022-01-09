"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Rect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _VertexBuffer2 = require("../core/VertexBuffer");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//矩形
var Rect = exports.Rect = function (_VertexBuffer) {
    _inherits(Rect, _VertexBuffer);

    function Rect(vertexA, vertexB, vertexC, vertexD) {
        _classCallCheck(this, Rect);

        var _this = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this));

        _this.set(vertexA, vertexB, vertexC, vertexD);
        return _this;
    }

    _createClass(Rect, [{
        key: "set",
        value: function set(vertexA, vertexB, vertexC, vertexD) {
            this.va = vertexA;
            this.vb = vertexB;
            this.vc = vertexC;
            this.vd = vertexD;
            this.addVertex(this.va);
            this.addVertex(this.vb);
            this.addVertex(this.vc);
            this.addVertex(this.vd);
            this.addVertex(this.vc);
            this.addVertex(this.vb);
            this.eval();
        }
    }, {
        key: "getNormalVector",
        value: function getNormalVector() {
            var v1 = this.va.add(this);
        }
    }]);

    return Rect;
}(_VertexBuffer2.VertexBuffer);