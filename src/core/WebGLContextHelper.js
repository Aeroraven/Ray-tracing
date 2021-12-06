export class WebGLContextHelper{
    constructor(canvasID){
        let dom = document.getElementById(canvasID)
        this.context = dom.getContext("webgl");
        if(!this.context){
            window.alert("[CGProject] WebGL is not supported!")
            return;
        }
    }
    getContext(){
        return this.context;
    }
}