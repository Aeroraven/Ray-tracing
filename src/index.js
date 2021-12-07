import { WebGLContextHelper } from "./render/WebGLContextHelper";
import { TrivialShader } from "./shader/trivialShader";
import { Vertex } from "./core/Vertex";
import { Vec } from "./core/Vec";
import { Triangle } from "./primitives/Triangle";
import { WebGLScene } from "./render/WebGLScene";
import { Color } from "./core/Color";
import { Rect } from "./primitives/Rect";
import { Camera } from "./core/Camera";

//Preparing WebGL Context
const gl = new WebGLContextHelper("webgl_displayer").getContext()

//Preparing Shader

let shaderSource = new TrivialShader(gl)
let shader = shaderSource.getLocationsInfo()

//Camera
let cam = new Camera()
cam.setPerspective(45.0/180.0*Math.PI,gl.canvas.clientWidth / gl.canvas.clientHeight,0.1,100)
cam.setCamPosition(new Vec(0,0,-6))
cam.setCamCenter(new Vec(0,0,0))
cam.setCamUp(new Vec(0,1,0))

//Render
let front = new Color(1.0,1.0,1.0,1.0);
let back = new Color(1.0,0.0,0.0,1.0);
let left = new Color(1.0,0.0,1.0,1.0);
let right = new Color(0.0,1.0,1.0,1.0);
let top = new Color(0.0,1.0,0.0,1.0);
let bottom = new Color(1.0,1.0,0.0,1.0);

let v1 = new Vec(-1,-1,-1)
let v2 = new Vec(-1,1,-1)
let v3 = new Vec(1,1,-1)
let v4 = new Vec(1,-1,-1)
let v5 = new Vec(-1,-1,1)
let v6 = new Vec(-1,1,1)
let v7 = new Vec(1,1,1)
let v8 = new Vec(1,-1,1)


let ra = new Rect(
    new Vertex(v1,back),
    new Vertex(v2,back),
    new Vertex(v4,back),
    new Vertex(v3,back)
)

let rb = new Rect(
    new Vertex(v5,front),
    new Vertex(v6,front),
    new Vertex(v8,front),
    new Vertex(v7,front)
)

let rc = new Rect(
    new Vertex(v1,left),
    new Vertex(v2,left),
    new Vertex(v5,left),
    new Vertex(v6,left)
)

let rd = new Rect(
    new Vertex(v7,right),
    new Vertex(v8,right),
    new Vertex(v3,right),
    new Vertex(v4,right)
)

let re = new Rect(
    new Vertex(v1,top),
    new Vertex(v4,top),
    new Vertex(v5,top),
    new Vertex(v8,top)
)

let rf = new Rect(
    new Vertex(v2,bottom),
    new Vertex(v3,bottom),
    new Vertex(v6,bottom),
    new Vertex(v7,bottom)
)

let sc = new WebGLScene(gl)
sc.addShape(ra)
sc.addShape(rb)
sc.addShape(rc)
sc.addShape(rd)
sc.addShape(re)
sc.addShape(rf)


function render(){
    sc.render(shader,cam)
    requestAnimationFrame(render)
    let t = new Date().getTime()*0.0005
    cam.setCamPosition(
        new Vec(-7*Math.sin(t*3),-7*Math.cos(t*3)*Math.cos(t*7),-7*Math.cos(t*3)*Math.sin(t*7))
    )
}
requestAnimationFrame(render)