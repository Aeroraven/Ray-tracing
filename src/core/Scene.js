import { AmbientLight } from "../light/AmbientLight"

export class Scene{
    constructor(){
        this.vbuf = new Array()
        this.ambientLight = new AmbientLight()
    }
    addShape(x){
        this.vbuf.push(x)
    }
    setAmbientLight(light){
        this.ambientLight = light
    }

}