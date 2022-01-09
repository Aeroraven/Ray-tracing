
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