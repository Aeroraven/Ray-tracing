import { Color } from "../core/Color"
import { Vec } from "../core/Vec"

//Raytracing:材质
export class RTMaterial{
    constructor(color,emission){
        this.cl = new Color(1,1,1,1)
        this.em = new Color(1,1,1,1)
        if(color!=null){
            this.cl = color
        }
        if(emission!=null){
            this.em = emission
        }
    }
}