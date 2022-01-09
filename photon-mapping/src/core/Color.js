import { vec4 } from "gl-matrix"

//RGBA 颜色
export class Color{
    constructor(r,g,b,a){
        this.r=r
        this.g=g
        this.b=b
        this.a=a
    }
    getGLMatVec4(){
        let r = vec4.create()
        r[0] = this.r
        r[1] = this.g
        r[2] = this.b 
        r[3] = this.a
        return r
    }
    
}