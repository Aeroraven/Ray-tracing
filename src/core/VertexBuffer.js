//顶点缓冲/图元基类(将Vertex和Color对象转换为WGL支持的数组类型)
export class VertexBuffer{
    constructor(){
        //expand buffer
        this.vertices = new Array()
        this.colors = new Array()
        this.texture = new Array()

        //vertex list
        this.vertexlist = new Array()

        //ready state
        this.ready = false
    }
    addVertex(vertex){
        this.vertexlist.push(vertex)
        this.ready = false
    }
    eval(){
        if(this.ready===true){
            return;
        }
        this.vertices = new Array()
        this.colors = new Array()
        this.texture = new Array()
        for(let i = 0;i< this.vertexlist.length;i++){
            let el = this.vertexlist[i]
            this.vertices.push(el.pt.x)
            this.vertices.push(el.pt.y)
            this.vertices.push(el.pt.z)
            this.colors.push(el.cl.r)
            this.colors.push(el.cl.g)
            this.colors.push(el.cl.b)
            this.colors.push(el.cl.a)
            this.texture.push(el.tx.x)
            this.texture.push(el.tx.y)
            
        }
        this.ready = true
    }
    clear(){
        this.vertexlist=[]
        this.ready=false
    }

}