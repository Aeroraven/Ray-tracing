
//顶点(带颜色和位置信息)
//法向量信息在VertexBuffer.js中，由继承VertexBuffer的子类指定顶点法向量

export class Vertex{
    constructor(vec,color,texcoord){
        this.pt = vec
        this.cl = color
        if(texcoord==null){
            this.tx = [0.0,0.0]
        }else{
            this.tx = texcoord
        }
    }
}