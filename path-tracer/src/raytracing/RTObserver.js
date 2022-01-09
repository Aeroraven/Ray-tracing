import { mat4, vec3 } from "gl-matrix";
import { Camera } from "../core/Camera";
import { Vec } from "../core/Vec";
import { RTShaderVariableMap } from "./RTShaderVariableMap";

export class RTObserver{
    constructor(gl){
        this.cam = new Camera()
        this.cam.setPerspective(55*Math.PI/180,gl.canvas.height/gl.canvas.width,-5,100)
        this.cam.setCamPosition(new Vec(0,0,-3))
        this.cam.setCamUp(new Vec(0,1,0))
        this.cam.setCamCenter(new Vec(0,0,0))
        this.screenPos = new Vec(0,0,0)
        this.dist = 3
    }
    getCameraMatrix(){
        let x= mat4.create()
        mat4.mul(x,this.cam.getMatrix().proj,this.cam.getMatrix().view)
        return x
    }
    getEye(){
        return this.screenPos
    }
    getRay(x,y,z=0){
        let orgvec = new Vec(x,y,z)
        let orgvecm = mat4.create()
        mat4.set(orgvecm,
            orgvec.x,0,0,0,
            orgvec.y,0,0,0,
            orgvec.z,0,0,0,
            1,0,0,0)
        let projvecm = mat4.create()
        mat4.mul(projvecm,this.getCameraMatrix(),orgvecm)
        let projvec = new Vec(projvecm[0]/projvecm[12],projvecm[4]/projvecm[12],projvecm[8]/projvecm[12])
        let ray = projvec.add(this.getEye().neg())
        return ray.getGLMatVec3()
    }
    prepareShaderMap(shaderMap){
        shaderMap.insert('raylt',this.getRay(-1,1,this.dist+this.screenPos.z),RTShaderVariableMap.VEC3)
        shaderMap.insert('raylb',this.getRay(-1,-1,this.dist+this.screenPos.z),RTShaderVariableMap.VEC3)
        shaderMap.insert('rayrb',this.getRay(1,-1,this.dist+this.screenPos.z),RTShaderVariableMap.VEC3)
        shaderMap.insert('rayrt',this.getRay(1,1,this.dist+this.screenPos.z),RTShaderVariableMap.VEC3)
        shaderMap.insert('eye',this.getEye().getGLMatVec3(),RTShaderVariableMap.VEC3)
        
    }
}