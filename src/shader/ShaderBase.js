import { WebGLShaderProcessing } from "../render/WebGLShaderProcessing"

export class ShaderBase{
    constructor(gl){
        this.gl = gl
        this.vertexShader = ""
        this.fragmentShader = ""
    }
    getShaderProgram(){
        let shaderHelper = new WebGLShaderProcessing(this.gl)
        console.log(this.vertexShader)
        console.log(this.fragmentShader)
        return shaderHelper.initShaderProgram(this.vertexShader,this.fragmentShader)
    }
    
}