
import { Color } from "../../core/Color"
import { RTShaderVariableMap } from "../RTShaderVariableMap"

export class RTSkyLight{
    constructor(color,name){
        this.cl = new Color(1,1,1,1)
        this.name = "RTSkyLight"+name
        if(color!=null){
            this.cl = color
        }
    }
    updateMap(shaderVarMap){
        shaderVarMap.insert(this.name+"_CL",this.cl.getGLMatVec4(),RTShaderVariableMap.VEC4)
    }
    genCode(){
        return`
        skylight = vec4(`+this.name+"_CL"+`);
        `
    }
}