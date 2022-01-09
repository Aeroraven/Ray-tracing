import { WGLContextHelper } from "./render/WGLContextHelper";
import { TrivialShader } from "./shader/trivialShader";
import { Vertex } from "./core/Vertex";
import { Vec } from "./core/Vec";
import { WGLScene } from "./render/WGLScene";
import { Color } from "./core/Color";
import { Rect } from "./primitives/Rect";
import { Camera } from "./core/Camera";

import RTSceneWithGeometry from "./raytracing/preset/RTSceneWithGeometry";
import RTSceneWithGeometryOutdoors from "./raytracing/preset/RTSceneWithGeometryOutdoors";
import RTGlassTest from "./raytracing/preset/RTGlassTest";
import RTLiquidTest from "./raytracing/preset/RTLiquidTest";


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
gl.depthFunc(gl.LEQUAL)



//Start Raytracing Render
let rtscene = RTGlassTest.configure(gl)


rtscene.compile()
rtscene.render(true)

let states = 0
let dispSample = 0
let timeStart = Date.now()
let monitor = document.getElementById("sample")
let dispmonitor = document.getElementById("sample641")
let dispInterval = 5
let disableAnimation = true
function render(){
    /*rtscene.compile()
    rtscene.sampleCount=0
    states = 0*/
    states = states+1
    monitor.innerHTML = "RenderedFrames:"+states+", RenderFPS:"+parseInt(states*1000/(Date.now()-timeStart))
    dispmonitor.innerHTML = " DisplayedFrames:"+dispSample+", DispFPS:"+parseInt(dispSample*1000/(Date.now()-timeStart))
    rtscene.render()
    if(disableAnimation){
        dispSample ++;
        sc.render(shader,cam,rtscene.getRenderOutput())
        requestAnimationFrame(render)
    }else if(states%dispInterval==0){
        rtscene.resetCounter()
        rtscene.compile()
        dispSample ++;
        sphere2.vc.x = Math.sin(states*0.01)*0.5-0.7
        sc.render(shader,cam,rtscene.getRenderOutput())
    }
        
    
}
requestAnimationFrame(render)

//Injector
window.rtRotateUp = ()=>{
    rtscene.observer.cam.camPositon.y+=0.1
    rtscene.resetCounter()
    rtscene.compile()
}
window.rtRotateDown = ()=>{
    rtscene.observer.cam.camPositon.y-=0.1
    rtscene.resetCounter()
    rtscene.compile()
}
window.rtMoveLeft = ()=>{
    rtscene.observer.cam.camPositon.x+=0.1
    rtscene.resetCounter()
    rtscene.compile()
}
window.rtMoveRight = ()=>{
    rtscene.observer.cam.camPositon.x-=0.1
    rtscene.resetCounter()
    rtscene.compile()
}
window.rtGoFar = ()=>{
    rtscene.observer.cam.camPositon.z-=0.1
    rtscene.resetCounter()
    rtscene.compile()
}
window.rtGoNear = ()=>{
    rtscene.observer.cam.camPositon.z+=0.1
    rtscene.resetCounter()
    rtscene.compile()
}