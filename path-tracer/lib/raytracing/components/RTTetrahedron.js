"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTTetrahedron = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //Raytracing: 四面体

var _RTMaterial = require("./RTMaterial");

var _RTShaderVariableMap = require("../RTShaderVariableMap");

var _RTPlane = require("./RTPlane");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RTTetrahedron = exports.RTTetrahedron = function () {

    //va,vb,vc : Vec
    //material : RTMaterial
    //name:String
    function RTTetrahedron(va, vb, vc, vd, material, name) {
        _classCallCheck(this, RTTetrahedron);

        this.va = va;
        this.vb = vb;
        this.vc = vc;
        this.vd = vd;
        this.plane1 = new _RTPlane.RTPlane(va, vb, vc, material, name + "1");
        this.plane2 = new _RTPlane.RTPlane(va, vc, vd, material, name + "2");
        this.plane3 = new _RTPlane.RTPlane(vb, vc, vd, material, name + "3");
        this.plane4 = new _RTPlane.RTPlane(va, vb, vd, material, name + "4");

        this.name = "RTTetra" + name;
        if (this.va == null || this.vb == null || this.vc == null || this.vd == null) {
            console.log("[CGProject] RTPlane: Invalid plane object.");
        }
        this.material = new _RTMaterial.RTMaterial();
        if (this.material != null) {
            this.material = material;
        }
        this.uEM = this.name + "_EM";
        this.uCL = this.name + "_CL";
        this.uRF = this.name + "_RF";
    }

    _createClass(RTTetrahedron, [{
        key: "updateMap",
        value: function updateMap(shaderVarMap) {
            var mp = shaderVarMap;
            this.plane1.updateMap(shaderVarMap);
            this.plane2.updateMap(shaderVarMap);
            this.plane3.updateMap(shaderVarMap);
            this.plane4.updateMap(shaderVarMap);
        }
    }, {
        key: "genObject",
        value: function genObject() {
            var ret = "";
            ret = 'sPlane(' + this.name + "_VA" + ',' + this.name + "_VB" + ',' + this.name + "_VC" + ',' + this.name + "_EM" + "," + this.name + "_CL)";
            return ret;
        }
    }, {
        key: "genShaderIntersection",
        value: function genShaderIntersection() {
            return this.plane1.genShaderIntersection() + this.plane2.genShaderIntersection() + this.plane3.genShaderIntersection() + this.plane4.genShaderIntersection();
        }
    }]);

    return RTTetrahedron;
}();