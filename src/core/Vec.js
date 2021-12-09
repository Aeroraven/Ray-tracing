import { vec3 } from "gl-matrix"

//三维向量
export class Vec{
    constructor(x,y,z){
        this.x=x
        this.y=y
        this.z=z
    }
    add(vec){
        return new Vec(this.x+vec.x,this.y+vec.y,this.z+vec.z)
    }
    dot(vec){
        return new Vec(this.x*vec.x,this.y*vec.y,this.z*vec.z)
    }
    cross(vec){
        return new Vec(
            y*vec.z-z*vec.y,
            -x*vec.z+z*vec.x,
            x*vec.y-y*vec.x
        )
    }
    neg(){
        return new Vec(
            -this.x,
            -this.y,
            -this.z
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
    dist(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
    }
    norm(){
        let dist = this.dist()
        return new Vec(
            this.x/dist,
            this.y/dist,
            this.z/dist
        )
    }
    magnify(num){
        return new Vec(
            this.x*num,
            this.y*num,
            this.z*num
        )
    }
}