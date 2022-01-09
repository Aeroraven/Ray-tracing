import { ShaderBase } from "./ShaderBase"

//主着色器
//包含顶点和片段着色器
export class TrivialShader extends ShaderBase{
    constructor(gl){
        super(gl)
        this.gl=gl
        this.vertexShader=`  `
        this.fragmentShader=`  `
    }
    getFragShader(){
        this.fragmentShader=`
        varying lowp vec4 vColor;
        varying highp vec4 vPosition;
        varying highp vec3 vAmbientLight;
        varying highp vec2 vTextureCoord;
        uniform int uUsingTex;

        uniform sampler2D uSampler;
        int temp;
        //Update
        void main() {
            highp vec4 ret;
            if(uUsingTex==0){
                ret = vec4(vColor.xyz * vAmbientLight,vColor.w);
            }else{
                highp vec4 tex = texture2D(uSampler,vec2(vTextureCoord.s,vTextureCoord.t));
                ret = tex;
                
            }
            ret = ret * vec4(vAmbientLight,1.0);
            gl_FragColor = ret;
            
        }
        `
        return this.fragmentShader
    }
    getVertexShader(){
        this.vertexShader=`
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform vec3 uAmbientLight;

        varying lowp vec4 vColor;
        varying highp vec4 vPosition;
        varying highp vec3 vAmbientLight;
        varying highp vec2 vTextureCoord;

        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          vColor = aVertexColor;
          vAmbientLight = uAmbientLight;
          vTextureCoord = aTextureCoord;
          vPosition = aVertexPosition;
        }
        `
        return this.vertexShader
    }
    getShaderProgram(){
        return this.getShaderProgramEx(this.getVertexShader(),this.getFragShader())
    }
    getLocationsInfo(){
        let shaderProgram = this.getShaderProgram()
        return{
            program:shaderProgram,
            attribLocations:{
                vertexPosition: this.gl.getAttribLocation(shaderProgram,'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(shaderProgram,'aVertexColor'),
                vertexTexture: this.gl.getAttribLocation(shaderProgram,'aTextureCoord')
            },
            uniformLocations:{
                projectionMatrix: this.gl.getUniformLocation(shaderProgram,'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram,'uModelViewMatrix'),
                ambientLight: this.gl.getUniformLocation(shaderProgram,'uAmbientLight'),
                usingTex: this.gl.getUniformLocation(shaderProgram,'uUsingTex'),
                sampler: this.gl.getUniformLocation(shaderProgram,'uSampler'),
            }
        }
    }
}