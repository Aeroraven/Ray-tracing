import { WGLShaderProcessing } from "../render/WGLShaderProcessing"

//着色器基类
export class ShaderBase{
    constructor(gl){
        this.gl = gl
        this.vertexShader = ""
        this.fragmentShader = ""
    }
    getVertexShader(){

    }
    getFragmentShader(){
        
    }
    getShaderProgramEx(vert,frag){
        let shaderHelper = new WGLShaderProcessing(this.gl)
        console.log(this.vertexShader)
        console.log(this.fragmentShader)
        return shaderHelper.initShaderProgram(vert,frag)
    }
    
}