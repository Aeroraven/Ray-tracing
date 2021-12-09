import { WGLContextHelper } from "./render/WGLContextHelper";
import { TrivialShader } from "./shader/trivialShader";
import { Vertex } from "./core/Vertex";
import { Vec } from "./core/Vec";
import { WGLScene } from "./render/WGLScene";
import { Color } from "./core/Color";
import { Rect } from "./primitives/Rect";
import { Camera } from "./core/Camera";
import { RTScene } from "./raytracing/RTScene";
import { RTMaterial } from "./raytracing/RTMaterial";
import { RTPlane } from "./raytracing/RTPlane";
import { RTSphere } from "./raytracing/RTSphere";


//Preparing Canvas

const gl = new WGLContextHelper("webgl_displayer").getContext()
let shader = new TrivialShader(gl).getLocationsInfo()
let cam = new Camera()
cam.setOrtho(-1,1,1,-1,-1,1)
cam.setCamPosition(new Vec(0,0,-1))
cam.setCamCenter(new Vec(0,0,0))
cam.setCamUp(new Vec(0,1,0))
let white = new Color(1.0,1.0,1.0,1.0);
let v1 = new Vec(-1,-1,0)
let v2 = new Vec(-1,1,0)

let v3 = new Vec(1,-1,0)
let v4 = new Vec(1,1,0)

let t1 = new Vec(1,0)
let t2 = new Vec(1,1)
let t3 = new Vec(0,0)
let t4 = new Vec(0,1)

let ra = new Rect(
    new Vertex(v1,white,t1),
    new Vertex(v2,white,t2),
    new Vertex(v3,white,t3),
    new Vertex(v4,white,t4),
    
)
let sc = new WGLScene(gl)
sc.addShape(ra)
sc.usingTex = 1
gl.enable(gl.DEPTH_TEST)


//Start Raytracing Render
let vx1 = new Vec(0,-2,30)
let vx2 = new Vec(-2,0,20)
let vx3 = new Vec(2,0,20)
let vx4 = new Vec(0,0.5,10)
let vx5 = new Vec(0,-100,22)
let vx6 = new Vec(-2,90,5)

let rtscene = new RTScene(gl)
let material = new RTMaterial(new Color(0.1,0.1,0.1,1),new Color(0.25,0.25,0.25,1))
let material2 = new RTMaterial(new Color(1,1,1,1),new Color(0,0,0,1))
let material3 = new RTMaterial(new Color(1,1,1,1),new Color(19,19,19,1))


let plane = new RTPlane(vx1,vx2,vx3,material,"plane1")
let sphere = new RTSphere(vx4,1,material2,"sphere1")
let sphere2 = new RTSphere(vx5,100,material,"sphere2")
let sphere3 = new RTSphere(vx6,10,material3,"light")

//rtscene.attach(plane)
rtscene.attach(sphere)
rtscene.attach(sphere2)
rtscene.attach(sphere3)
rtscene.compile()
rtscene.render()


function render(){
    sc.render(shader,cam,rtscene.renderOutput)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)