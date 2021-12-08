import { RTShaderUtil } from "../raytracing/RTShaderUtil"
import { ShaderBase } from "./ShaderBase"

//主着色器
//包含顶点和片段着色器
export class RayTracingShader extends ShaderBase{
    constructor(gl){
        super(gl)
        this.gl=gl
        this.vertexShader=`  `
        this.fragmentShader=`  `
    }
    getFragShader(){
        this.fragmentShader= RTShaderUtil.getFragmentShader()
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


        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
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