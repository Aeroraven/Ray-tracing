import { VertexBuffer } from "../core/VertexBuffer";

//矩形
export class Rect extends VertexBuffer{
    constructor(vertexA,vertexB,vertexC,vertexD){
        super()
        this.set(vertexA,vertexB,vertexC,vertexD)
    }
    set(vertexA,vertexB,vertexC,vertexD){
        this.va = vertexA
        this.vb = vertexB
        this.vc = vertexC
        this.vd = vertexD
        this.addVertex(this.va)
        this.addVertex(this.vb)
        this.addVertex(this.vc)
        this.addVertex(this.vd)
        this.addVertex(this.vc)
        this.addVertex(this.vb)
        this.eval()
    }
    getNormalVector(){
        let v1 = this.va.add(this)
    }
}