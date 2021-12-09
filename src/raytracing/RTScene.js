import { Camera } from "../core/Camera"
import { Vec } from "../core/Vec"
import { WGLFrameBuffer } from "../render/WGLFrameBuffer"
import { WGLTexture } from "../render/WGLTexture"
import { RTObserver } from "./RTObserver"
import { RTShader } from "./RTShader"
import { RTShaderUtil } from "./RTShaderUtil"
import { RTShaderVariableMap } from "./RTShaderVariableMap"

export class RTScene{
    constructor(gl){
        this.gl = gl
        this.shaderVar = new RTShaderVariableMap()
        this.screen = new Camera()
        this.observer = new RTObserver(gl)
        this.shader = new RTShader(gl)
        this.compiledShader = null
        this.geometryList = []

        this.renderOutput = new WGLTexture(gl,1024,1024,null)
        this.renderOutput.disableMips()
        this.frameBuffer = new WGLFrameBuffer(gl)
        this.frameBuffer.bindTexture(gl.COLOR_ATTACHMENT0,this.renderOutput)

        this.sheetRect=[
            -1,-1,0,
            -1,1,0,
            1,-1,0,
            1,1,0
        ]
        this.sheetColor=[
            0,0,1,1,
            1,0,0,1,
            0,1,0,1,
            1,1,1,1
        ]
        this.sheetvb = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sheetvb)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.sheetRect),gl.STATIC_DRAW)

        this.sheetcb = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sheetcb)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.sheetColor),gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.screen.setOrtho(-1,1,1,-1,-1,1)
        this.screen.setCamCenter(new Vec(0,0,-1))
        this.screen.setCamUp(new Vec(0,1,0))
        this.screen.setCamPosition(new Vec(0,0,0))
        
    }
    clear(){
        this.geometryList = []
        this.shaderVar.clear()
    }
    attach(x){
        this.geometryList.push(x)
    }
    updateMap(){
        for(let i = 0;i<this.geometryList.length;i++){
            this.geometryList[i].updateMap(this.shaderVar)
        }
        this.observer.prepareShaderMap(this.shaderVar)
        this.shaderVar.insert('uProjectionMatrix',this.screen.getMatrix().proj,RTShaderVariableMap.MAT4)
        this.shaderVar.insert('uModelViewMatrix',this.screen.getMatrix().view,RTShaderVariableMap.MAT4)
        this.shaderVar.insert('uTime',Date.now()-1639051292614,RTShaderVariableMap.FLOAT)
        
    }
    genIntersectionJudge(){
        let x = ``
        for(let i = 0;i<this.geometryList.length;i++){
            x+=this.geometryList[i].genShaderIntersection()
        }
        return x
    }
    genFragmentShader(){
        this.updateMap()
        let ins = this.genIntersectionJudge()
        let funcParam = {
            intersection: ins
        }

        let ret = RTShaderUtil.getFragmentShader(funcParam,this.shaderVar)
        return ret
    }
    compile(){
        this.compiledShader = this.shader.getShaderProgram(this)
    }
    setTime(){
        this.shaderVar.insert('uTime',new Date().getTime()-16900000000.0,RTShaderVariableMap.FLOAT)
    }
    clear(){
        this.frameBuffer.start()
        this.renderOutput.start()
        gl.viewport(0,0,this.renderOutput.getW(),this.renderOutput.getH())
        gl.clearColor(0,0,0,1)
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        this.renderOutput.end()
        this.frameBuffer.end()

    }
    render(doClear = false){
        let gl = this.gl
        this.frameBuffer.start()
        this.renderOutput.start()
        gl.viewport(0,0,this.renderOutput.getW(),this.renderOutput.getH())
        gl.clearColor(0,0,0,1)
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        gl.useProgram(this.compiledShader)
        this.shaderVar.bindShaderVarible(gl,this.compiledShader)
        this.setTime()
        gl.bindBuffer(gl.ARRAY_BUFFER,this.sheetcb)
        console.log(gl.getAttribLocation(this.compiledShader,'aVertexColor'))
        gl.vertexAttribPointer(gl.getAttribLocation(this.compiledShader,'aVertexColor'),4,gl.FLOAT,false,0,0)
        gl.enableVertexAttribArray(gl.getAttribLocation(this.compiledShader,'aVertexColor'))

        gl.bindBuffer(gl.ARRAY_BUFFER,this.sheetvb)
        gl.vertexAttribPointer(gl.getAttribLocation(this.compiledShader,'aVertexPosition'),3,gl.FLOAT,false,0,0)
        gl.enableVertexAttribArray(gl.getAttribLocation(this.compiledShader,'aVertexPosition'))

        
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
        
        this.renderOutput.end()
        this.frameBuffer.end()
    }

}