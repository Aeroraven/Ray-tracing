export class TrivialShader{
    constructor(gl){
        this.gl=gl
        this.vertexShader=`
        attribute vec4 aVertexPosition;
    
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
    
        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
        `
        this.fragmentShader=`
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
        `
    }
    getLocationsInfo(shaderProgram){
        return{
            program:shaderProgram,
            attribLocations:{
                vertexPosition: this.gl.getAttribLocation(shaderProgram,'aVertexPosition')
            },
            uniformLocations:{
                projectionMatrix: this.gl.getUniformLocation(shaderProgram,'uModelViewMatrix'),
                modelViewMatrix: this.gl.getAttribLocation(shaderProgram,'uProjectionMatrix')
            }
        }
    }
}