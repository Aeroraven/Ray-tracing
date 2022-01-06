export class RTSRayCollisionResult{
    constructor(colvex,colnorm,collided,emissionColor,materialColor,hitType){
            this.colvex=colvex
            this.colnorm=colnorm
            this.collided=collided
            this.emissionColor=emissionColor
            this.materialColor=materialColor
            this.hitType=hitType
    }
}