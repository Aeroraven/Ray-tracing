import { WebGLContextHelper } from "./core/WebGLContextHelper";
import { WebGLShaderProcessing } from "./core/WebGLShaderProcessing";
import { TrivialShader } from "./shader/trivialShader";

//Preparing WebGL Context
const gl = new WebGLContextHelper("webgl_displayer").getContext()
gl.clearColor(0.0,0.0,0.0,1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

//Preparing Shader
const shaderHelper = new WebGLShaderProcessing(gl)
const shaderSource = new TrivialShader(gl)
const shaderProgram = shaderHelper.initShaderProgram(shaderSource.vertexShader,shaderSource.fragmentShader)
const progrmInfo = shaderSource.getLocationsInfo(shaderProgram)

