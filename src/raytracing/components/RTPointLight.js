//Raytracing: 点光源
import { Color } from "../../core/Color";
import { Vec } from "../../core/Vec";
import { RTShaderVariableMap } from "../RTShaderVariableMap"


export class RTPointLight{
    constructor(pos,col,name){
        this.cl = new Color(1,1,1,1)
        this.pos = new Vec(0,0,0)
        if(pos!=null){
            this.pos = pos
        }
        if(col!=null){
            this.col = col
        }
        this.name = "RTPointLight"+name
    }
    updateMap(shaderVarMap){
        let mp = shaderVarMap
        shaderVarMap.insert(this.name+"_PS",this.pos.getGLMatVec3(),RTShaderVariableMap.VEC3)
    }
    genShaderTest(){
        return `
                if(true){
                    if(fShadowLight(`+this.name+'_PS'+`,cp)){
                        intensity=0.0;
                    }
                }
        `
    }
}