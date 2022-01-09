"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTSphere = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //Raytracing: 球体组件

var _RTMaterial = require("./RTMaterial");

var _RTShaderVariableMap = require("../RTShaderVariableMap");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RTSphere = exports.RTSphere = function () {

    //vc : Vec
    //ra : Number
    //material : RTMaterial
    //name:String
    function RTSphere(vc, ra, material, name) {
        _classCallCheck(this, RTSphere);

        this.vc = vc;
        this.ra = ra;
        this.name = "RTSphere" + name;
        if (this.va == null || this.vb == null || this.vc == null) {
            console.log("[CGProject] RTSphere: Invalid sphere object.");
        }
        this.material = new _RTMaterial.RTMaterial();
        if (this.material != null) {
            this.material = material;
        }
        this.uEM = this.name + "_EM";
        this.uCL = this.name + "_CL";
        this.uRF = this.name + "_RF";
    }

    _createClass(RTSphere, [{
        key: "updateMap",
        value: function updateMap(shaderVarMap) {
            shaderVarMap.insert(this.name + "_VC", this.vc.getGLMatVec3(), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderVarMap.insert(this.name + "_RA", this.ra, _RTShaderVariableMap.RTShaderVariableMap.FLOAT);

            shaderVarMap.insert(this.name + "_EM", this.material.em.getGLMatVec4(), _RTShaderVariableMap.RTShaderVariableMap.VEC4);
            shaderVarMap.insert(this.name + "_RF", this.material.rf, _RTShaderVariableMap.RTShaderVariableMap.FLOAT);
            shaderVarMap.insert(this.name + "_CL", this.material.cl.getGLMatVec4(), _RTShaderVariableMap.RTShaderVariableMap.VEC4);
        }
    }, {
        key: "genObject",
        value: function genObject() {
            var ret = "";
            ret = 'sSphere(' + this.name + "_VC" + ',' + this.name + "_RA" + ',' + this.name + "_EM" + "," + this.name + "_CL)";
            return ret;
        }
    }, {
        key: "genShaderIntersection",
        value: function genShaderIntersection() {
            return "\n\n                if(true){\n                    sSphere sp = " + this.genObject() + ";\n                    tc = fRaySphereIntersection(r,sp);\n                    if(tc>0.0 && tc<t){\n                        t=tc;\n                        norm = fRayPoint(r,tc) - " + this.name + '_VC' + ";\n                        emicolor = vec4(" + this.uEM + ");\n                        matcolor = vec4(" + this.uCL + ");\n                        hitType = " + this.material.tp + ";\n                        refra = " + this.uRF + ";\n                        collided=true;\n                    }\n                }\n        ";
        }
    }]);

    return RTSphere;
}();