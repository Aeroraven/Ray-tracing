
//WGL上下文处理
export class WGLContextHelper{
    constructor(canvasID){
        let dom = document.getElementById(canvasID)
        this.context = dom.getContext("webgl");
        if(!this.context){
            window.alert("[CGProject] WGL is not supported!")
            return;
        }
    }
    getContext(){
        return this.context;
    }
}