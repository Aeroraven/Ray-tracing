//Raytracing: 天空光照 
//当光线无法和任何物体相交时，返回天空光照颜色。只支持纯色的天空光照。
//SkyLight和AmbientLight不同

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