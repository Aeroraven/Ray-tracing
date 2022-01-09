import { Vec } from "../core/Vec";

export class AmbientLight{
    constructor(){
        this.light = new Vec(1,1,1)
    }
    setLight(light){
        this.light = light
    }
}