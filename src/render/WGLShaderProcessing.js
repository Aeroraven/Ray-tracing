//WGL着色器处理
export class WGLShaderProcessing{
    constructor(gl){
        this.gl=gl
    }
    loadShader(type,src){
        const shader = this.gl.createShader(type)
        this.gl.shaderSource(shader,src)
        this.gl.compileShader(shader)
        if(!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS)){
            console.log("[CGProject] Failed To Compile Shader")
            console.log(this.gl.getShaderInfoLog(shader))
            this.gl.deleteShader(shader)
            return null;
        }
        return shader;
    }
    initShaderProgram(vertexShaderSrc,fragmentShaderSrc){
        const vShader = this.loadShader(this.gl.VERTEX_SHADER,vertexShaderSrc)
        const fShader = this.loadShader(this.gl.FRAGMENT_SHADER,fragmentShaderSrc)
        const shaderProgram = this.gl.createProgram()
        this.gl.attachShader(shaderProgram,vShader)
        this.gl.attachShader(shaderProgram,fShader)
        this.gl.linkProgram(shaderProgram)
        if(!this.gl.getProgramParameter(shaderProgram,this.gl.LINK_STATUS)){
            console.log("[CGProject] Failed to initialize the shader")
            console.log(this.gl.getProgramInfoLog(shaderProgram))
            return null;
        }
        console.log("[CGProject] Shader created")
        return shaderProgram
    }
}