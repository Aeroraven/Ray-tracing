export class TrivialShader{
    constructor(gl){
        this.gl=gl
        this.vertexShader=`
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying lowp vec4 vColor;
        varying vec3 vPosition;
        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          vColor = aVertexColor;
        }
        `
        this.fragmentShader=`
        varying lowp vec4 vColor;
        varying vec3 vPosition;
        
        void main() {
            gl_FragColor = vec4(vColor.x,vColor.y,vColor.z,vColor.w);
        }
        `
    }
    getLocationsInfo(shaderProgram){
        return{
            program:shaderProgram,
            attribLocations:{
                vertexPosition: this.gl.getAttribLocation(shaderProgram,'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(shaderProgram,'aVertexColor')
            },
            uniformLocations:{
                projectionMatrix: this.gl.getUniformLocation(shaderProgram,'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram,'uModelViewMatrix')
            }
        }
    }
}