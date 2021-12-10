//Raytracing: 点光源
import { Color } from "../../core/Color";
import { Vec } from "../../core/Vec";
import { RTShaderVariableMap } from "../RTShaderVariableMap"

/**
 * @deprecated 建议使用材质的Emission属性替代
 */
export class RTPointLight{
    constructor(pos,col,attenuation,name){
        this.cl = new Color(1,1,1,1)
        this.pos = new Vec(0,0,0)
        this.atu = new Vec(0,0,0)
        if(pos!=null){
            this.pos = pos
        }
        if(col!=null){
            this.col = col
        }
        if(attenuation!=null){
            this.atu = attenuation
        }
        this.name = "RTPointLight"+name
    }
    updateMap(shaderVarMap){
        let mp = shaderVarMap
        shaderVarMap.insert(this.name+"_PS",this.pos.getGLMatVec3(),RTShaderVariableMap.VEC3)
        shaderVarMap.insert(this.name+"_AT",this.atu.getGLMatVec3(),RTShaderVariableMap.VEC3)
    }
    genShaderTest(){
        return `
                if(true){
                    if(fShadowLight(`+this.name+'_PS'+`,cp)==false){
                        float dst = length(cp-`+this.name+"_PS"+`);
                        intensity=min(1.0,1.0/(`+this.name+"_AT"+`.x+`+this.name+`_AT.y*dst+`+this.name+`_AT.z*dst*dst));
                    }
                }
        `
    }
}