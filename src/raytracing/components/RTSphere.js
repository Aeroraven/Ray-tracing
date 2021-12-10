//Raytracing: 球体组件

import { Vec } from "../../core/Vec"
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

    //更新变量映射表
    updateMap(shaderVarMap){
        //更新顶点信息
        shaderVarMap.insert(this.name+"_VC",this.vc.getGLMatVec3(),RTShaderVariableMap.VEC3)
        shaderVarMap.insert(this.name+"_RA",this.ra,RTShaderVariableMap.FLOAT)

        //更新颜色信息(辐射强度)
        shaderVarMap.insert(this.name+"_EM",this.material.em.getGLMatVec4(),RTShaderVariableMap.VEC4)
        //更新颜色信息(材质颜色)
        shaderVarMap.insert(this.name+"_CL",this.material.cl.getGLMatVec4(),RTShaderVariableMap.VEC4)
    }
    //生成平面
    genObject(){
        let ret = ``
        ret = 'sSphere('+this.name+"_VC"+','+this.name+"_RA"+','+this.name+"_EM"+","+this.name+"_CL)"
        return ret
    }
    //生成相交判断(动态Shader)
    genShaderIntersection(){
        return `

                if(true){
                    sSphere sp = `+this.genObject()+`;
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0){
                        vec3 ip = fRayPoint(r,tc);
                        if(tc<t){
                            t=tc;
                            norm = ip - `+this.name+'_VC'+`;
                            emicolor = vec4(`+this.uEM+`);
                            matcolor = vec4(`+this.uCL+`);
                            hitType = `+this.material.tp+`;
                            collided=true;
                        }
                        
                    }
                }
        `
    }

}