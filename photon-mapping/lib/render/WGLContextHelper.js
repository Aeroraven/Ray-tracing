"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//WGL上下文处理
var WGLContextHelper = exports.WGLContextHelper = function () {
    function WGLContextHelper(canvasID) {
        _classCallCheck(this, WGLContextHelper);

        var dom = document.getElementById(canvasID);
        this.context = dom.getContext("webgl");
        if (!this.context) {
            window.alert("[CGProject] WGL is not supported!");
            return;
        }
    }

    _createClass(WGLContextHelper, [{
        key: "getContext",
        value: function getContext() {
            return this.context;
        }
    }]);

    return WGLContextHelper;
}();