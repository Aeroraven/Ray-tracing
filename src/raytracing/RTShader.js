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
        this.vertexShader=`
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        attribute vec2 aVertexTex;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform vec3 raylb;
        uniform vec3 raylt;
        uniform vec3 rayrb;
        uniform vec3 rayrt;

        varying highp vec3 ray;
        varying highp vec4 color;
        varying highp vec2 tex;
        void main() {
            float xp = aVertexPosition.x*0.5+0.5;
            float yp = aVertexPosition.y*0.5+0.5;
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            ray = mix(mix(raylb,raylt,yp),mix(rayrb,rayrt,yp),xp);
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