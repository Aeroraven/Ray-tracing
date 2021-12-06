//Scene
export class Scene{
    constructor(){
        this.vbuf = new Array()
    }
    addShape(x){
        this.vbuf.push(x)
    }

}