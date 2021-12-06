import { Scene } from "../core/Scene";
import { mat4 } from "gl-matrix";

export class WebGLScene extends Scene{
    constructor(gl){
        super()
        this.gl = gl
    }
    getGLVertexArray(){
        //For convenience
        let gl = this.gl

        //Get buffer
        let vlist = []
        let clist = []
        let cnt = 0
        for(let i = 0;i< this.vbuf.length;i++){
            let el = this.vbuf[i]
            el.eval()
            vlist = vlist.concat(el.vertices)
            clist = clist.concat(el.colors)
            cnt += el.vertexlist.length
        }
        console.log(vlist)
        console.log(clist)
        console.log(cnt)
        //Get WebGL vertex buffer
        const glvbuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, glvbuf)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vlist),gl.STATIC_DRAW)
        
        //Get WebGL color buffer
        const glcbuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,glcbuf)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(clist),gl.STATIC_DRAW)

        return{
            vb: glvbuf,
            cb: glcbuf,
            vnum: cnt
        }
        
    }
    render(shaderInfo){
        //Render preparation
        let gl = this.gl
        gl.clearColor(0,0,0,1)
        gl.clearDepth(1)
        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

        const fov = 45 * Math.PI / 180
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const zNear = 0.1
        const zFar = 100.0
        const projectionMatrix = mat4.create()
        mat4.perspective(projectionMatrix,fov,aspect,zNear,zFar)
        const modelViewMat = mat4.create()
        mat4.translate(modelViewMat,modelViewMat,[-0.0,0.0,-6.0])

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
        gl.drawArrays(gl.TRIANGLES,0,buf.vnum)
    }

}