//Raytracing: 平面类

import { Vec } from "../core/Vec"
import { RTMaterial } from "./RTMaterial"

//法向量正负按顶点给出顺序计算
export class RTPlane{
    constructor(va,vb,vc,material,name){
        this.va = va
        this.vb = vb
        this.vc = vc
        this.name = "RTPlane"+name;
        if(this.va==null||this.vb==null||this.vc==null){
            console.log("[CGProject] RTPlane: Invalid plane object.")
        }
        this.material = new RTMaterial()
        if(this.material!=null){
            this.material = material
        }
    }
    norm(){
        let v1 = new Vec(0,0,0)
        let v2 = new Vec(0,0,0)
        v1 = this.va.neg().add(this.vb)
        v2 = this.vb.neg().add(this.vc)
        return v1.cross(v2)
    }
}