import { Vertex } from "../core/Vertex";
import { VertexBuffer } from "../core/VertexBuffer";

//三角形
export class Triangle extends VertexBuffer{
    constructor(vertexA,vertexB,vertexC){
        super()
        if(vertexA!=null){
            this.set(vertexA,vertexB,vertexC)
        }
    }
    set(vertexA,vertexB,vertexC){
        this.clear()
        this.va = vertexA
        this.vb = vertexB
        this.vc = vertexC
        this.addVertex(this.va)
        this.addVertex(this.vb)
        this.addVertex(this.vc)
        this.eval()
    }
    getNormalVector(){
        let v1 = this.va.pt.add(this.vb.pt.neg())
        let v2 = this.vb.pt.add(this.vc.pt.neg())
        let vNorm = v1.cross(v2).norm()
        return vNorm
    }
    setp(vecA,vecB,vecC,col){
        this.va = new Vertex(vecA,col)
        this.vb = new Vertex(vecB,col)
        this.vc = new Vertex(vecC,col)
        this.clear()
        this.addVertex(this.va)
        this.addVertex(this.vb)
        this.addVertex(this.vc)
        this.eval()
    }
}