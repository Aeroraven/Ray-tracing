//Raytracing: 四面体

import { RTMaterial } from "./RTMaterial"
import { RTShaderVariableMap } from "../RTShaderVariableMap"
import { RTPlane } from "./RTPlane"

export class RTTetrahedron{

    //va,vb,vc : Vec
    //material : RTMaterial
    //name:String
    constructor(va,vb,vc,vd,material,name){
        this.va = va
        this.vb = vb
        this.vc = vc
        this.vd = vd
        this.plane1 = new RTPlane(va,vb,vc,material,name+"1")
        this.plane2 = new RTPlane(va,vc,vd,material,name+"2")
        this.plane3 = new RTPlane(vb,vc,vd,material,name+"3")
        this.plane4 = new RTPlane(va,vb,vd,material,name+"4")

        this.name = "RTTetra"+name;
        if(this.va==null||this.vb==null||this.vc==null||this.vd==null){
            console.log("[CGProject] RTPlane: Invalid plane object.")
        }
        this.material = new RTMaterial()
        if(this.material!=null){
            this.material = material
        }
        this.uEM = this.name+"_EM"
        this.uCL = this.name+"_CL"
        this.uRF = this.name+"_RF"
    }
    updateMap(shaderVarMap){
        let mp = shaderVarMap
        this.plane1.updateMap(shaderVarMap)
        this.plane2.updateMap(shaderVarMap)
        this.plane3.updateMap(shaderVarMap)
        this.plane4.updateMap(shaderVarMap)
    }
    genObject(){
        let ret = ``
        ret = 'sPlane('+this.name+"_VA"+','+this.name+"_VB"+','+this.name+"_VC"+','+this.name+"_EM"+","+this.name+"_CL)"
        return ret
    }
    genShaderIntersection(){
        return this.plane1.genShaderIntersection()+this.plane2.genShaderIntersection()+this.plane3.genShaderIntersection()+this.plane4.genShaderIntersection()
    }

}