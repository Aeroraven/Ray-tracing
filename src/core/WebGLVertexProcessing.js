export class WebGLVertexProcessing{
    constructor(gl){
        this.gl=gl
    }
    initBufferTest(){
        const position = gl.createBuffer()
        this.gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        let vertices = [
            1.0,  1.0,  0.0,
            -1.0, 1.0,  0.0,
            1.0,  -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(vertices),this.gl.STATIC_DRAW)
        return {
            position:positionBuffer
        }
    }
}