"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RTPlane = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //Raytracing: 平面组件

var _RTMaterial = require("./RTMaterial");

var _RTShaderVariableMap = require("../RTShaderVariableMap");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RTPlane = exports.RTPlane = function () {

    //va,vb,vc : Vec
    //material : RTMaterial
    //name:String
    function RTPlane(va, vb, vc, material, name) {
        _classCallCheck(this, RTPlane);

        this.va = va;
        this.vb = vb;
        this.vc = vc;
        this.name = "RTPlane" + name;
        if (this.va == null || this.vb == null || this.vc == null) {
            console.log("[CGProject] RTPlane: Invalid plane object.");
        }
        this.material = new _RTMaterial.RTMaterial();
        if (this.material != null) {
            this.material = material;
        }
        this.uEM = this.name + "_EM";
        this.uCL = this.name + "_CL";
    }

    _createClass(RTPlane, [{
        key: "updateMap",
        value: function updateMap(shaderVarMap) {
            var mp = shaderVarMap;
            shaderVarMap.insert(this.name + "_VA", this.va.getGLMatVec3(), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderVarMap.insert(this.name + "_VB", this.vb.getGLMatVec3(), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderVarMap.insert(this.name + "_VC", this.vc.getGLMatVec3(), _RTShaderVariableMap.RTShaderVariableMap.VEC3);
            shaderVarMap.insert(this.name + "_EM", this.material.em.getGLMatVec4(), _RTShaderVariableMap.RTShaderVariableMap.VEC4);
            shaderVarMap.insert(this.name + "_CL", this.material.cl.getGLMatVec4(), _RTShaderVariableMap.RTShaderVariableMap.VEC4);
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
            return "\n                if(true){\n                    sPlane pl = " + this.genObject() + ";\n                    tc = fRayPlaneIntersection(r,pl);\n                    if(tc>0.0){\n                        vec3 ip = fRayPoint(r,tc);\n                        if(fInsidePlane(pl,ip)){\n                            if(tc<t){\n                                t=tc;\n                                norm = fPlaneNorm(pl);\n                                emicolor = vec4(" + this.uEM + ");\n                                matcolor = vec4(" + this.uCL + ");\n                                hitType = " + this.material.tp + ";\n                                collided=true;\n                            }\n                        }\n                    }\n                }\n            \n        ";
        }
    }]);

    return RTPlane;
}();