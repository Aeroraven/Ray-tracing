//Raytracing: 水面

import { RTMaterial } from "../RTMaterial"
import { RTShaderVariableMap } from "../../RTShaderVariableMap"

export class RTWaterSurface{
    constructor(hg,material,name){
        this.name = "RTWater"+name;
        this.hg = hg
        this.material = new RTMaterial()
        if(this.material!=null){
            this.material = material
        }
        this.uEM = this.name+"_EM"
        this.uCL = this.name+"_CL"
        this.uRF = this.name+"_RF"
    }
    updateMap(shaderVarMap){
        shaderVarMap.insert(this.name+"_HG",this.hg,RTShaderVariableMap.FLOAT)
        shaderVarMap.insert(this.name+"_EM",this.material.em.getGLMatVec4(),RTShaderVariableMap.VEC4)
        shaderVarMap.insert(this.name+"_RF",this.material.rf,RTShaderVariableMap.FLOAT)
        shaderVarMap.insert(this.name+"_CL",this.material.cl.getGLMatVec4(),RTShaderVariableMap.VEC4)
    }
    genShaderIntersection(){
        return `
                if(true){
                    float dy = -0.2;
                    vec3 dr = r.direction/length(r.direction);
                    vec3 posX = vec3(r.origin.x,r.origin.y,r.origin.z);
                    float h = 0.0;
                    float d = 0.0;
                    
                    for(int i = 0; i < 100; i++)
                    {
                        h = (posX.y - getOceanWaterHeight(posX));
                        if (h < 1e-5) break;
                        posX += dr*h;
                    }
                    tc = (posX.y-r.origin.y)/dr.y;
                    if(posX.y>0.0){
                        tc=-1.0;
                    }
                    if(tc>0.0){
                        if(tc<t){
                            t=tc;
                            norm = vec3(dr.x,-dr.y,dr.z);
                            emicolor = vec4(`+this.uEM+`);
                            matcolor = vec4(`+this.uCL+`);
                            hitType = `+this.material.tp+`;
                            refra = `+this.uRF+`;
                            collided=true;
                        }
                    }
                }
            
        `
    }
}
