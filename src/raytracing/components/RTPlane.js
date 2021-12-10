//Raytracing: 平面组件
//法向量正负按顶点给出顺序计算

import { RTMaterial } from "./RTMaterial"
import { RTShaderVariableMap } from "../RTShaderVariableMap"

export class RTPlane{

    //va,vb,vc : Vec
    //material : RTMaterial
    //name:String
    constructor(va,vb,vc,material,name){
        this.va = va
        this.vb = vb
        this.vc = vc
        this.name = "RTPlane"+name;
        if(this.va==null||this.vb==null||this.vc==null){
            console.log("[CGProject] RTPlane: Invalid plane object.")
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
        let mp = shaderVarMap
        //更新顶点信息
        shaderVarMap.insert(this.name+"_VA",this.va.getGLMatVec3(),RTShaderVariableMap.VEC3)
        shaderVarMap.insert(this.name+"_VB",this.vb.getGLMatVec3(),RTShaderVariableMap.VEC3)
        shaderVarMap.insert(this.name+"_VC",this.vc.getGLMatVec3(),RTShaderVariableMap.VEC3)

        //更新颜色信息(辐射强度)
        shaderVarMap.insert(this.name+"_EM",this.material.em.getGLMatVec4(),RTShaderVariableMap.VEC4)
        //更新颜色信息(材质颜色)
        shaderVarMap.insert(this.name+"_CL",this.material.cl.getGLMatVec4(),RTShaderVariableMap.VEC4)
    }
    //生成平面
    genObject(){
        let ret = ``
        ret = 'sPlane('+this.name+"_VA"+','+this.name+"_VB"+','+this.name+"_VC"+','+this.name+"_EM"+","+this.name+"_CL)"
        return ret
    }
    //生成相交判断(动态Shader)
    genShaderIntersection(){
        return `
                if(true){
                    sPlane pl = `+this.genObject()+`;
                    tc = fRayPlaneIntersection(r,pl);
                    if(tc>0.0){
                        vec3 ip = fRayPoint(r,tc);
                        if(fInsidePlane(pl,ip)){
                            if(tc<t){
                                t=tc;
                                norm = fPlaneNorm(pl);
                                emicolor = vec4(`+this.uEM+`);
                                matcolor = vec4(`+this.uCL+`);
                                hitType = `+this.material.tp+`;
                                collided=true;
                            }
                        }
                    }
                }
            
        `
    }

}