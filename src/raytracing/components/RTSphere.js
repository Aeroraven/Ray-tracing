//Raytracing: 球体组件

import { RTMaterial } from "./RTMaterial"
import { RTShaderVariableMap } from "../RTShaderVariableMap"

export class RTSphere{

    //vc : Vec
    //ra : Number
    //material : RTMaterial
    //name:String
    constructor(vc,ra,material,name){
        this.vc=vc
        this.ra=ra
        this.name = "RTSphere"+name;
        if(this.va==null||this.vb==null||this.vc==null){
            console.log("[CGProject] RTSphere: Invalid sphere object.")
        }
        this.material = new RTMaterial()
        if(this.material!=null){
            this.material = material
        }
        this.uEM = this.name+"_EM"
        this.uCL = this.name+"_CL"
    }

    updateMap(shaderVarMap){
        shaderVarMap.insert(this.name+"_VC",this.vc.getGLMatVec3(),RTShaderVariableMap.VEC3)
        shaderVarMap.insert(this.name+"_RA",this.ra,RTShaderVariableMap.FLOAT)

        shaderVarMap.insert(this.name+"_EM",this.material.em.getGLMatVec4(),RTShaderVariableMap.VEC4)
        shaderVarMap.insert(this.name+"_RF",this.material.rf,RTShaderVariableMap.FLOAT)
        shaderVarMap.insert(this.name+"_CL",this.material.cl.getGLMatVec4(),RTShaderVariableMap.VEC4)
    }
    genObject(){
        let ret = ``
        ret = 'sSphere('+this.name+"_VC"+','+this.name+"_RA"+','+this.name+"_EM"+","+this.name+"_CL)"
        return ret
    }
    genShaderIntersection(){
        return `

                if(true){
                    sSphere sp = `+this.genObject()+`;
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0 && tc<t){
                        t=tc;
                        norm = fRayPoint(r,tc) - `+this.name+'_VC'+`;
                        emicolor = vec4(`+this.uEM+`);
                        matcolor = vec4(`+this.uCL+`);
                        hitType = `+this.material.tp+`;
                        collided=true;
                    }
                }
        `
    }

}