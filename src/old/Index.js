import { WGLContextHelper } from "./render/WGLContextHelper";
import { TrivialShader } from "./shader/trivialShader";
import { Vertex } from "./core/Vertex";
import { Vec } from "./core/Vec";
import { WGLScene } from "./render/WGLScene";
import { Color } from "./core/Color";
import { Rect } from "./primitives/Rect";
import { Camera } from "./core/Camera";
import { WGLTexture } from "./render/WGLTexture";
import { RTShader } from "./raytracing/RTShader";
import { RTScene } from "./raytracing/RTScene";
import { RTPlane } from "./raytracing/RTPlane";
import { RTMaterial } from "./raytracing/RTMaterial";

//定义WGL上下文
const gl = new WGLContextHelper("webgl_displayer").getContext()
gl.enable(gl.DEPTH_TEST)

//准备Shader
let shaderSource = new TrivialShader(gl)
let shader = shaderSource.getLocationsInfo()



//准备纹理
let tex = new WGLTexture(gl,512,512,null)
//tex.loadImageAsync('/cubetexture.png')
tex.disableMips()

//准备相机
let cam = new Camera()
cam.setPerspective(90.0/180.0*Math.PI,1,0.9,100)
cam.setCamPosition(new Vec(-3,-2,-9))
cam.setCamCenter(new Vec(0,0,0))
cam.setCamUp(new Vec(0,1,0))

let camStatic = new Camera();
camStatic.setPerspective(45.0/180.0*Math.PI,gl.canvas.clientWidth / gl.canvas.clientHeight,0.1,100)
camStatic.setCamPosition(new Vec(0,0,-6))
camStatic.setCamCenter(new Vec(0,0,0))
camStatic.setCamUp(new Vec(0,1,0))

//定义图元
let front = new Color(1.0,1.0,1.0,1.0);
let back = new Color(1.0,0.0,0.0,1.0);
let left = new Color(1.0,0.0,1.0,1.0);
let right = new Color(0.0,1.0,1.0,1.0);
let top = new Color(0.0,1.0,0.0,1.0);
let bottom = new Color(1.0,1.0,0.0,1.0);

let white = new Color(1.0,1.0,1.0,1.0);

let v1 = new Vec(-1,-1,-1)
let v2 = new Vec(-1,1,-1)
let v3 = new Vec(1,1,-1)
let v4 = new Vec(1,-1,-1)
let v5 = new Vec(-1,-1,1)
let v6 = new Vec(-1,1,1)
let v7 = new Vec(1,1,1)
let v8 = new Vec(1,-1,1)

let t1 = new Vec(0,0)
let t2 = new Vec(0,1)
let t3 = new Vec(1,0)
let t4 = new Vec(1,1)

let ra = new Rect(
    new Vertex(v1,back,t1),
    new Vertex(v2,back,t2),
    new Vertex(v4,back,t3),
    new Vertex(v3,back,t4)
)

let rb = new Rect(
    new Vertex(v5,front,t1),
    new Vertex(v6,front,t2),
    new Vertex(v8,front,t3),
    new Vertex(v7,front,t4)
)

let rc = new Rect(
    new Vertex(v1,left,t1),
    new Vertex(v2,left,t2),
    new Vertex(v5,left,t3),
    new Vertex(v6,left,t4)
)

let rd = new Rect(
    new Vertex(v7,right,t1),
    new Vertex(v8,right,t2),
    new Vertex(v3,right,t3),
    new Vertex(v4,right,t4)
)

let re = new Rect(
    new Vertex(v1,top,t1),
    new Vertex(v4,top,t2),
    new Vertex(v5,top,t3),
    new Vertex(v8,top,t4)
)

let rf = new Rect(
    new Vertex(v2,bottom,t1),
    new Vertex(v3,bottom,t2),
    new Vertex(v6,bottom,t3),
    new Vertex(v7,bottom,t4)
)

//将图形放到场景中
let sc = new WGLScene(gl)
sc.addShape(ra)
sc.addShape(rb)
sc.addShape(rc)
sc.addShape(rd)
sc.addShape(re)
sc.addShape(rf)
sc.usingTex = 1

//定义图元
let fr = new Rect(
    new Vertex(v1,front,t1),
    new Vertex(v2,front,t2),
    new Vertex(v4,front,t3),
    new Vertex(v3,front,t4)
)
let sc2 = new WGLScene(gl)
sc2.addShape(fr)
sc2.usingTex = 1
sc.getFrameBuffer().bindTexture(gl.COLOR_ATTACHMENT0,tex,true)

//渲染
function render(){
    let t = new Date().getTime()*0.00005
    sc.renderToTexture(shader,cam,tex)
    cam.setCamPosition(new Vec(-7*Math.sin(t*3),-7*Math.cos(t*3)*Math.cos(t*7),-7*Math.cos(t*3)*Math.sin(t*7)))
    camStatic.setCamPosition(new Vec(-7*Math.sin(t*3),-7*Math.cos(t*3)*Math.cos(t*7),-7*Math.cos(t*3)*Math.sin(t*7)))
    
    sc2.render(shader,camStatic,tex)
    requestAnimationFrame(render)
}

//==========================================
let tp = new RTScene()
let material = new RTMaterial(new Color(1,1,1,1),new Color(1,1,1,1))
let plane = new RTPlane(v1,v2,v3,material,"test")
tp.attach(plane)
console.log(tp.genFragmentShader())

let rts = new RTShader(gl)
rts.getLocationsInfo(tp)