import { Scene } from "../core/Scene";
import { WGLFrameBuffer } from "./WGLFrameBuffer";

//WGL场景
//该类使用WebGL实现基类Scene的功能
export class WGLScene extends Scene{
    constructor(gl){
        super()
        this.gl = gl
        this.fb = new WGLFrameBuffer(gl)
        this.usingTex = 0
    }
    getFrameBuffer(){
        return this.fb
    }
    getGLVertexArray(){
        //For convenience
        let gl = this.gl
        //Get buffer
        let vlist = []
        let clist = []
        let tlist = []
        let cnt = 0
        for(let i = 0;i< this.vbuf.length;i++){
            let el = this.vbuf[i]
            el.eval()
            vlist = vlist.concat(el.vertices)
            clist = clist.concat(el.colors)
            tlist = tlist.concat(el.texture)
            cnt += el.vertexlist.length
        }
        window.w={
            v:vlist,
            t:tlist,
            c:clist
        }

        //Get WGL vertex buffer
        const glvbuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, glvbuf)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vlist),gl.STATIC_DRAW)
        
        //Get WGL color buffer
        const glcbuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,glcbuf)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(clist),gl.STATIC_DRAW)

        //Get WGL tex buffer
        const gltbuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,gltbuf)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(tlist),gl.STATIC_DRAW)

        let ret = {
            vb: glvbuf,
            cb: glcbuf,
            tb: gltbuf,
            vnum: cnt
        }
        window.r= ret
        return ret
        
    }
    render(shaderInfo,camera,texture){
        //Render preparation
        let gl = this.gl
        gl.clearColor(0,0,0,1)
        gl.clearDepth(1)
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height)
        this.renderInternal(shaderInfo,camera,texture)
    }
    renderInternal(shaderInfo,camera,texture,fbtex){
        let gl = this.gl
        let uniformMatrix = camera.getMatrix()
        let projectionMatrix = uniformMatrix.proj
        let modelViewMat = uniformMatrix.view

        //Get buffer
        const buf = this.getGLVertexArray()

        //Bind Vertex
        gl.bindBuffer(gl.ARRAY_BUFFER,buf.vb)
        gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition,3,gl.FLOAT,false,0,0)
        gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition)

        //Bind Color
        gl.bindBuffer(gl.ARRAY_BUFFER,buf.cb)
        gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor,4,gl.FLOAT,false,0,0)
        gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor)

        //If UseTex
        if(this.usingTex){
            gl.bindBuffer(gl.ARRAY_BUFFER,buf.tb)
            gl.vertexAttribPointer(shaderInfo.attribLocations.vertexTexture,2,gl.FLOAT,false,0,0)
            gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexTexture)
        }
        

        gl.useProgram(shaderInfo.program)
        gl.uniformMatrix4fv(
            shaderInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        )
        gl.uniformMatrix4fv(
            shaderInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMat
        )
        gl.uniform3fv(
            shaderInfo.uniformLocations.ambientLight,
            this.ambientLight.light.getGLMatVec3()
        )
        gl.activeTexture(gl.TEXTURE0)
        if(texture!=null){
            texture.start()
        }
        gl.uniform1i(shaderInfo.uniformLocations.usingTex,this.usingTex)
        gl.uniform1i(shaderInfo.uniformLocations.sampler,0)
        if(fbtex!=null){
            fbtex.end()
        }
        gl.drawArrays(gl.TRIANGLES,0,buf.vnum)
        if(texture!=null){
            texture.end()
        }
    }
    renderToTexture(shaderInfo,camera,texture){
        let gl = this.gl
        this.fb.start()
        texture.start()
        gl.viewport(0,0,texture.getW(),texture.getH())
        gl.clearColor(0,0,0,1)
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        this.renderInternal(shaderInfo,camera,null,texture)
        texture.end()
        this.fb.end()
    }
}