import { Camera } from "../core/Camera"
import { Color } from "../core/Color"
import { Vec } from "../core/Vec"
import { WGLFrameBuffer } from "../render/WGLFrameBuffer"
import { WGLTexture } from "../render/WGLTexture"
import { RTAmbientLight } from "./components/RTAmbientLight"
import { RTSkyLight } from "./components/RTSkyLight"
import { RTPointLight } from "./components/RTPointLight"
import { RTObserver } from "./RTObserver"
import { RTShader } from "./RTShader"
import { RTShaderUtil } from "./RTShaderUtil"
import { RTShaderVariableMap } from "./RTShaderVariableMap"
import { vec3 } from "gl-matrix"

export class RTScene{
    constructor(gl){
        this.gl = gl
        this.shaderVar = new RTShaderVariableMap()
        this.screen = new Camera()
        this.observer = new RTObserver(gl)
        this.shader = new RTShader(gl)
        this.compiledShader = null
        this.geometryList = []

        this.renderOutput = [ new WGLTexture(gl,512,512,null),new WGLTexture(gl,512,512,null)]
        this.renderOutput[0].disableMips()
        this.renderOutput[1].disableMips()
        this.frameBuffer = new WGLFrameBuffer(gl)
        this.frameBuffer.bindTexturePingPong(gl.COLOR_ATTACHMENT0,this.renderOutput[0],this.renderOutput[0])

        this.startTimestamp = Date.now()
    
        this.sampleCount = 0

        this.sheetRect=[
            -1,-1,0,
            -1,1,0,
            1,-1,0,
            1,1,0
        ]
        this.sheetTex=[
            0,0,
            0,1,
            1,0,
            1,1,
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

        this.sheettb = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sheettb)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.sheetTex),gl.STATIC_DRAW)

        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.screen.setOrtho(-1,1,1,-1,-1,1)
        this.screen.setCamCenter(new Vec(0,0,-1))
        this.screen.setCamUp(new Vec(0,1,0))
        this.screen.setCamPosition(new Vec(0,0,0))
        //Spotlights
        this.pointlights = new Array()

        //Optional
        this.ambientLight = new RTAmbientLight(new Color(0,0,0,1))
        this.skylight = new RTSkyLight(new Color(0,0,0,1))
        
    }
    clear(){
        this.geometryList = []
        this.shaderVar.clear()
        this.pointlights = []
    }
    attach(x){
        if(x instanceof RTAmbientLight){
            this.ambientLight = x
        }else if(x instanceof RTSkyLight){
            this.skylight = x
        }else if(x instanceof RTPointLight){
            this.pointlights.push(x)
        }
        else{
            this.geometryList.push(x)
        }
    }
    getRenderOutput(){
        return this.renderOutput[0]
    }
    loadAlternativeTexture(){
        this.shaderVar.insert('uTexture',0,RTShaderVariableMap.SAMPLER2D,this.renderOutput[1].getTexture())
    }
    updateMap(){
        for(let i = 0;i<this.geometryList.length;i++){
            this.geometryList[i].updateMap(this.shaderVar)
        }
        for(let i = 0;i<this.pointlights.length;i++){
            this.pointlights[i].updateMap(this.shaderVar)
        }
        this.observer.prepareShaderMap(this.shaderVar)
        this.ambientLight.updateMap(this.shaderVar)
        this.skylight.updateMap(this.shaderVar)
        this.shaderVar.insert('uProjectionMatrix',this.screen.getMatrix().proj,RTShaderVariableMap.MAT4)
        this.shaderVar.insert('uModelViewMatrix',this.screen.getMatrix().view,RTShaderVariableMap.MAT4)
        this.shaderVar.insert('uTime',Date.now()-this.startTimestamp,RTShaderVariableMap.FLOAT)
        this.shaderVar.insert('uSamples',this.sampleCount,RTShaderVariableMap.INT)
        this.loadAlternativeTexture()
    }
    genIntersectionJudge(){
        let x = ``
        for(let i = 0;i<this.geometryList.length;i++){
            x+=this.geometryList[i].genShaderIntersection()
        }
        return x
    }
    genSpotlightJudge(){
        let x = ``
        for(let i = 0;i<this.pointlights.length;i++){
            x+=this.pointlights[i].genShaderTest()
        }

        return x
    }
    genFragmentShader(){
        this.updateMap()
        let ins = this.genIntersectionJudge()
        let amb = this.ambientLight.genCode()+this.skylight.genCode()
        let spl = this.genSpotlightJudge()
        let funcParam = {
            intersection: ins,
            ambientSetting:amb,
            pointlight:spl
        }

        let ret = RTShaderUtil.getFragmentShader(funcParam,this.shaderVar)
        return ret
    }
    resetCounter(){
        this.sampleCount = 0
    }
    compile(){
        this.compiledShader = this.shader.getShaderProgram(this)
    }
    updateUniform(){
        this.shaderVar.insert('uTime',new Date().getTime()-this.startTimestamp,RTShaderVariableMap.FLOAT)
        this.shaderVar.insert('uSamples',this.sampleCount,RTShaderVariableMap.INT)
    }
    clear(){
        this.frameBuffer.start()
        this.renderOutput[0].start()
        gl.viewport(0,0,this.getRenderOutput().getW(),this.getRenderOutput().getH())
        gl.clearColor(0,0,0,1)
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        this.renderOutput[0].end()
        this.frameBuffer.end()

    }
    genPhotonMap(){
        let nEmittedPhotons = 30;
        let initCoe = 12.56;
        let reflectRate = 0.5;
        let N = 1.0;
        let attenCoe = reflectRate/N;
        let  maxLoop = 60;
        let reflectRadio = 0.05;
        for(let i=0 ; i<nEmittedPhotons;i++){
            let random= new Vec()
        }

    }
    render(firstRender=true,doClear = false){
        //Draw To Tex0 & Using Tex1 to Render
        let gl = this.gl
        
        this.frameBuffer.bindTexturePingPong(gl.COLOR_ATTACHMENT0,this.renderOutput[0],this.renderOutput[1])
        this.frameBuffer.start()
        this.renderOutput[0].start()
        this.renderOutput[0].disableMips()
        this.renderOutput[1].disableMips()
        gl.viewport(0,0,this.getRenderOutput().getW(),this.getRenderOutput().getH())
        gl.clearColor(0,0,0,1)

        if(firstRender){
            gl.useProgram(this.compiledShader)
            this.shaderVar.bindShaderVarible(gl,this.compiledShader)
            this.updateUniform()
            this.loadAlternativeTexture()
            gl.bindBuffer(gl.ARRAY_BUFFER,this.sheetcb)
            gl.vertexAttribPointer(gl.getAttribLocation(this.compiledShader,'aVertexColor'),4,gl.FLOAT,false,0,0)
            gl.enableVertexAttribArray(gl.getAttribLocation(this.compiledShader,'aVertexColor'))

            gl.bindBuffer(gl.ARRAY_BUFFER,this.sheetvb)
            gl.vertexAttribPointer(gl.getAttribLocation(this.compiledShader,'aVertexPosition'),3,gl.FLOAT,false,0,0)
            gl.enableVertexAttribArray(gl.getAttribLocation(this.compiledShader,'aVertexPosition'))
        }

        gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
        this.sampleCount++;
        this.renderOutput[0].end()
        this.frameBuffer.end()
        this.renderOutput.reverse()
    }

}