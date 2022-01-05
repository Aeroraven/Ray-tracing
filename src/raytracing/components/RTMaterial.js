//Raytracing:材质组件

import { Color } from "../../core/Color"

export class RTMaterial{
    constructor(color,emission,type,refra){
        this.cl = new Color(1,1,1,1)
        this.em = new Color(1,1,1,1)
        this.tp = RTMaterial.DIFFUSE
        this.rf = 1
        if(color!=null){
            this.cl = color
        }
        if(emission!=null){
            this.em = emission
        }
        if(type!=null){
            this.tp = type
        }
        if(refra!=null){
            this.rf = refra
        }
    }
}
RTMaterial.ABSORBED = 0
RTMaterial.DIFFUSE = 1
RTMaterial.SPECULAR = 2
RTMaterial.REFRACTION = 3
RTMaterial.METAL = 4
RTMaterial.MOSSY = 5