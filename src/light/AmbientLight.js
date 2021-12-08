import { Vec } from "../core/Vec";

//环境光照/全局亮度
//该类用于定义aAmbientLight的着色器变量，设定全局亮度
export class AmbientLight{
    constructor(){
        this.light = new Vec(1,1,1)
    }
    setLight(light){
        this.light = light
    }
}