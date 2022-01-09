import { mat4 } from "gl-matrix"
import { Vec } from "./Vec"
export class Camera{
    constructor(){
        this.projectionMat = mat4.create()
        this.modelViewMat = mat4.create()
        this.camPositon = new Vec(0,0,0)
        this.camCenter = new Vec(0,0,0)
        this.camUp = new Vec(0,0,0)
        window.r = this.modelViewMat
    }
    setPerspective(fovy,aspect,zNear,zFar){
        mat4.perspective(this.projectionMat,fovy,aspect,zNear,zFar)
    }
    setOrtho(left,right,top,bottom,zNear,zFar){
        mat4.ortho(this.projectionMat,left,right,bottom,top,zNear,zFar)
    }
    setCamPosition(camvec){
        this.camPositon = camvec
    }
    setCamCenter(cenvec){
        this.camCenter = cenvec
    }
    setCamUp(upvec){
        this.camUp= upvec
    }
    translate(deltavec){
        this.camCenter.add(deltavec)
        this.camPositon.add(deltavec)
    }
    generate(){
        mat4.lookAt(
            this.modelViewMat,
            this.camPositon.getGLMatVec3(),
            this.camCenter.getGLMatVec3(),
            this.camUp.getGLMatVec3(),
        )
        window.x = this.modelViewMat
        window.w = this.camPositon
    }
    getMatrix(){
        this.generate()
        return {
            proj:this.projectionMat,
            view:this.modelViewMat
        }
    }
}