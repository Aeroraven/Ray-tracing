import { WebGLContextHelper } from "./render/WebGLContextHelper";
import { WebGLShaderProcessing } from "./render/WebGLShaderProcessing";
import { TrivialShader } from "./shader/trivialShader";
import { Vertex } from "./core/Vertex";
import { Vec } from "./core/Vec";
import { Triangle } from "./primitives/Triangle";
import { WebGLScene } from "./render/WebGLScene";
import { Color } from "./core/Color";

//Preparing WebGL Context
const gl = new WebGLContextHelper("webgl_displayer").getContext()

//Preparing Shader
let shaderHelper = new WebGLShaderProcessing(gl)
let shaderSource = new TrivialShader(gl)
let shaderProgram = shaderHelper.initShaderProgram(shaderSource.vertexShader,shaderSource.fragmentShader)
let programInfo = shaderSource.getLocationsInfo(shaderProgram)

//Render
let va = new Vertex(new Vec(-1,-1,-1),new Color(1.0,1.0,1.0,1.0))
let vb = new Vertex(new Vec(-1,1,-1),new Color(1.0,1.0,1.0,1.0))
let vc = new Vertex(new Vec(1,1,-1),new Color(1.0,1.0,1.0,1.0))
let tr = new Triangle(va,vb,vc)

let va2 = new Vertex(new Vec(-1,-1,-1),new Color(1.0,0.0,0.0,1.0))
let vb2 = new Vertex(new Vec(1,-1,-1),new Color(1.0,0.0,0.0,1.0))
let vc2 = new Vertex(new Vec(1,1,-1),new Color(1.0,0.0,0.0,1.0))
let tr2 = new Triangle(va2,vb2,vc2)

let sc = new WebGLScene(gl)
sc.addShape(tr2)
sc.addShape(tr)

sc.render(programInfo)