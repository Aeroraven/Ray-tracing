import { WGLContextHelper } from "./render/WGLContextHelper";
import { TrivialShader } from "./shader/trivialShader";
import { Vertex } from "./core/Vertex";
import { Vec } from "./core/Vec";
import { WGLScene } from "./render/WGLScene";
import { Color } from "./core/Color";
import { Rect } from "./primitives/Rect";
import { Camera } from "./core/Camera";
import { RTScene } from "./raytracing/RTScene";
import { RTMaterial } from "./raytracing/components/RTMaterial";
import { RTSphere } from "./raytracing/components/RTSphere";
import { RTAmbientLight } from "./raytracing/components/RTAmbientLight";
import { RTSkyLight } from "./raytracing/components/RTSkyLight";
import { RTPointLight } from "./raytracing/components/RTPointLight";
import { RTPlane } from "./raytracing/components/RTPlane";


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
let rtscene = new RTScene(gl)


let sphere = new RTSphere(
    new Vec(0,-0.45,8),
    0.5,
    new RTMaterial(
        new Color(0.8,0.8,0.8,1.0),
        new Color(0,0,0,1),
        RTMaterial.DIFFUSE
    ),
    "sphere1"
)

let sphere2 = new RTSphere(
    new Vec(-0.6,-0.6,7),
    0.5,
    new RTMaterial(
        new Color(0.8,0.8,0.8,1.0),
        new Color(0,0,0,1),
        RTMaterial.DIFFUSE
    ),
    "sphere2"
)

let plane1 = new RTPlane(
    new Vec(-6,0,-6),
    new Vec(-6,0,40),
    new Vec(40,0,-6),
    new RTMaterial(
        new Color(0.75,0.75,0.75,1.0),
        new Color(0,0,0,1),
        RTMaterial.DIFFUSE
    ),
    "ground1"
)

let plane2 = new RTPlane(
    new Vec(2,2,0),
    new Vec(2,3,0),
    new Vec(3,2,0),
    new RTMaterial(
        new Color(0.75,0.75,0.75,1.0),
        new Color(0,0,0,1),
        RTMaterial.DIFFUSE
    ),
    "ground2"
)

let light1 = new RTSphere(
    new Vec(0.6,-0.6,7),
    0.5,
    new RTMaterial(
        new Color(1,1,1,1.0),
        new Color(12,12,12,1),
        RTMaterial.DIFFUSE
    ),
    "light1"
)


let ground = new RTSphere(
    new Vec(0,-100,22),
    100,
    new RTMaterial(
        new Color(0.8,0.8,0.8,1.0),
        new Color(0,0,0,1),
        RTMaterial.DIFFUSE
    ),
    "ground"
)

let ambientLight = new RTAmbientLight(
    new Color(0.1,0.1,0.1,1.0)
)

let skyLight = new RTSkyLight(
    new Color(0.2,0.5,0.7,1.0)
)

rtscene.attach(ground)
rtscene.attach(sphere)
rtscene.attach(sphere2)
//rtscene.attach(ambientLight)
//rtscene.attach(skyLight)
rtscene.attach(light1)

rtscene.compile()
rtscene.render()

let states = 0
let timeStart = Date.now()
function render(){
    states = states+1
    rtscene.render()
    sc.render(shader,cam,rtscene.getRenderOutput())
    //if(states == 10){
    //    window.alert("STOP"+( Date.now()-timeStart))
    //   return 
    //}
    requestAnimationFrame(render)
}
requestAnimationFrame(render)