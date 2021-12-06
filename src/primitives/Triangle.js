import { VertexBuffer } from "../core/VertexBuffer";

export class Triangle extends VertexBuffer{
    constructor(vertexA,vertexB,vertexC){
        super()
        this.set(vertexA,vertexB,vertexC)
        
    }
    set(vertexA,vertexB,vertexC){
        this.va = vertexA
        this.vb = vertexB
        this.vc = vertexC
        this.addVertex(this.va)
        this.addVertex(this.vb)
        this.addVertex(this.vc)
        this.eval()
    }
}