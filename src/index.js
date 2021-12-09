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
let v3 = new Vec(1,1,0)
let v4 = new Vec(1,-1,0)
let t1 = new Vec(0,0)
let t2 = new Vec(0,1)
let t3 = new Vec(1,0)
let t4 = new Vec(1,1)
let ra = new Rect(
    new Vertex(v1,white,t1),
    new Vertex(v2,white,t2),
    new Vertex(v4,white,t3),
    new Vertex(v3,white,t4)
)
let sc = new WGLScene(gl)
sc.addShape(ra)
sc.usingTex = 1
gl.enable(gl.DEPTH_TEST)


//Start Raytracing Render
let vx1 = new Vec(-1,-1,10)
let vx2 = new Vec(-1,1,10)
let vx3 = new Vec(1,1,10)
let rtscene = new RTScene(gl)
let material = new RTMaterial(new Color(1,0,0,1),new Color(1,1,1,1))
let plane = new RTPlane(vx1,vx2,vx3,material,"plane1")
rtscene.attach(plane)
rtscene.compile()
rtscene.render()


function render(){
    sc.render(shader,cam,rtscene.renderOutput)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)