//Raytracing:材质组件

import { Color } from "../../core/Color"

export class RTMaterial{
    constructor(color,emission,type){
        this.cl = new Color(1,1,1,1)
        this.em = new Color(1,1,1,1)
        this.tp = RTMaterial.DIFFUSE
        if(color!=null){
            this.cl = color
        }
        if(emission!=null){
            this.em = emission
        }
        if(type!=null){
            this.tp = type
        }
    }
}
RTMaterial.DIFFUSE = 1
RTMaterial.SPECULAR = 2