import { vec3 } from "gl-matrix"

//3D Vector
export class Vec{
    constructor(x,y,z){
        this.x=x
        this.y=y
        this.z=z
    }
    add(vec){
        return new Vec(x+vec.x,y+vec.y,z+vec.z)
    }
    dot(vec){
        return new Vec(x*vec.x,y*vec.y,z*vec.z)
    }
    cross(vec){
        return new Vec(
            y*vec.z-z*vec.y,
            -x*vec.z+z*vec.x,
            x*vec.y-y*vec.x
        )
    }
    set(x,y,z){
        this.x=x
        this.y=y
        this.z=z
    }
    getGLMatVec3(){
        let r = vec3.create()
        r[0] = this.x
        r[1] = this.y
        r[2] = this.z 
        return r
    }
}