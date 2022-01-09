import { ShaderBase } from "../shader/ShaderBase"


export class RTShader extends ShaderBase{
    constructor(gl){
        super(gl)
        this.gl=gl
        this.vertexShader=`  `
        this.fragmentShader=`  `
    }
    getFragShader(scene){
        this.fragmentShader= scene.genFragmentShader()
        return this.fragmentShader
    }
    getVertexShader(){
        this.vertexShader=`#version 300 es
        in vec4 aVertexPosition;
        in vec4 aVertexColor;
        in vec2 aVertexTex;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform vec3 raylb;
        uniform vec3 raylt;
        uniform vec3 rayrb;
        uniform vec3 rayrt;

        out highp vec3 ray;
        out highp vec4 color;
        out highp vec2 tex;
        void main() {
            float yp = aVertexPosition.y*0.5+0.5;
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            ray = mix(mix(raylb,raylt,yp),mix(rayrb,rayrt,yp),aVertexPosition.x*0.5+0.5);
            color = aVertexColor;
            tex = aVertexTex;
        }
        `
        return this.vertexShader
    }
    getFragShaderTest(scene){
        this.fragmentShader = `precision highp float;
            varying highp vec3 ray;
            void main(){
                gl_FragColor = vec4(color);
            }
        `
        return this.fragmentShader
    }
    getShaderProgram(scene){
        return this.getShaderProgramEx(this.getVertexShader(),this.getFragShader(scene))
    }
    getLocationsInfo(scene){
        let shaderProgram = this.getShaderProgram(scene)
        return shaderProgram
    }
}