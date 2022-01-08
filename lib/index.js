"use strict";

var _WGLContextHelper = require("./render/WGLContextHelper");

var _trivialShader = require("./shader/trivialShader");

var _Vertex = require("./core/Vertex");

var _Vec = require("./core/Vec");

var _WGLScene = require("./render/WGLScene");

var _Color = require("./core/Color");

var _Rect = require("./primitives/Rect");

var _Camera = require("./core/Camera");

var _RTScene = require("./raytracing/RTScene");

var _RTMaterial = require("./raytracing/components/RTMaterial");

var _RTSphere = require("./raytracing/components/geometry/RTSphere");

var _RTAmbientLight = require("./raytracing/components/RTAmbientLight");

var _RTSkyLight = require("./raytracing/components/RTSkyLight");

var _RTPointLight = require("./raytracing/components/RTPointLight");

var _RTPlane = require("./raytracing/components/geometry/RTPlane");

var _RTTetrahedron = require("./raytracing/components/geometry/RTTetrahedron");

//Preparing Canvas

var gl = new _WGLContextHelper.WGLContextHelper("webgl_displayer").getContext();
var shader = new _trivialShader.TrivialShader(gl).getLocationsInfo();
var cam = new _Camera.Camera();
cam.setOrtho(-1, 1, 1, -1, -1, 1);
cam.setCamPosition(new _Vec.Vec(0, 0, -1));
cam.setCamCenter(new _Vec.Vec(0, 0, 0));
cam.setCamUp(new _Vec.Vec(0, 1, 0));
var white = new _Color.Color(1.0, 1.0, 1.0, 1.0);
var v1 = new _Vec.Vec(-1, -1, 0);
var v2 = new _Vec.Vec(-1, 1, 0);

var v3 = new _Vec.Vec(1, -1, 0);
var v4 = new _Vec.Vec(1, 1, 0);

var t1 = new _Vec.Vec(1, 0);
var t2 = new _Vec.Vec(1, 1);
var t3 = new _Vec.Vec(0, 0);
var t4 = new _Vec.Vec(0, 1);

var ra = new _Rect.Rect(new _Vertex.Vertex(v1, white, t1), new _Vertex.Vertex(v2, white, t2), new _Vertex.Vertex(v3, white, t3), new _Vertex.Vertex(v4, white, t4));
var sc = new _WGLScene.WGLScene(gl);
sc.addShape(ra);
sc.usingTex = 1;
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);

//Start Raytracing Render
var rtscene = new _RTScene.RTScene(gl);
var scparams = {
    ground_pos: 2,
    ground_depth: 10,
    ground_height: -1,
    wall_height: 1
};

var sphere = new _RTSphere.RTSphere(new _Vec.Vec(0, -0.5, 8), 0.5, new _RTMaterial.RTMaterial(new _Color.Color(0.8, 0.8, 0.0, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "sphere1");

var sphere2 = new _RTSphere.RTSphere(new _Vec.Vec(-0.5, -0.5, 6), 0.5, new _RTMaterial.RTMaterial(new _Color.Color(1, 1, 1, 1.0), new _Color.Color(0, 0, 0, 1.0), _RTMaterial.RTMaterial.REFRACTION, 1.04), "sphere2");

var sphere3 = new _RTSphere.RTSphere(new _Vec.Vec(1.5, -0.5, 8), 0.5, new _RTMaterial.RTMaterial(new _Color.Color(1, 1, 1, 1.0), new _Color.Color(0, 0, 0, 1.0), _RTMaterial.RTMaterial.SPECULAR, 1.04), "sphere3");

var sphere4 = new _RTSphere.RTSphere(new _Vec.Vec(-1.6, -0.6, 8), 0.4, new _RTMaterial.RTMaterial(new _Color.Color(1, 1, 1, 1.0), new _Color.Color(0, 0, 0, 1.0), _RTMaterial.RTMaterial.METAL, 1.04), "sphere4");

var sphere5 = new _RTSphere.RTSphere(new _Vec.Vec(0.35, -0.6, 5), 0.4, new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(0, 0, 0, 1.0), _RTMaterial.RTMaterial.MOSSY, 1.04), "sphere5");

var sphere6 = new _RTSphere.RTSphere(new _Vec.Vec(-0.65, -0.7, 4), 0.3, new _RTMaterial.RTMaterial(new _Color.Color(0, 0.5, 1, 1.0), new _Color.Color(0, 0, 0, 1.0), _RTMaterial.RTMaterial.DIFFUSE, 1.02), "sphere6");
var sphere7 = new _RTSphere.RTSphere(new _Vec.Vec(-0.95, -0.8, 3), 0.2, new _RTMaterial.RTMaterial(new _Color.Color(0, 1, 0.5, 1.0), new _Color.Color(0, 0, 0, 1.0), _RTMaterial.RTMaterial.DIFFUSE, 1.02), "sphere7");

var tetra1 = new _RTTetrahedron.RTTetrahedron(new _Vec.Vec(0 + 1.15, -0.2, 0 + 5), new _Vec.Vec(-0.4 + 1.15, -1, 0.4 + 5), new _Vec.Vec(0.4 + 1.15, -1, 0.4 + 5), new _Vec.Vec(0 + 1.15, -1, 0 + 5), new _RTMaterial.RTMaterial(new _Color.Color(0.3, 1, 0, 1.0), new _Color.Color(0, 0.0, 0, 1.0), _RTMaterial.RTMaterial.DIFFUSE, 1.02), "tetra1");

var light1 = new _RTSphere.RTSphere(new _Vec.Vec(0.6, -0.7, 6.5), 0.3, new _RTMaterial.RTMaterial(new _Color.Color(1, 1, 1, 1.0), new _Color.Color(45, 45, 45, 1), _RTMaterial.RTMaterial.DIFFUSE), "light1");

var plane1 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.ground_height, 0), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, 0), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "ground1");
var plane2 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _Vec.Vec(-scparams.ground_pos, scparams.ground_height, 0), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "ground2");

var wallback1 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _RTMaterial.RTMaterial(new _Color.Color(0.5, 0.5, 1, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "wallback1");
var wallback2 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _RTMaterial.RTMaterial(new _Color.Color(0.5, 0.5, 1, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "wallback2");
var celling1 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, 0), new _Vec.Vec(scparams.ground_pos, scparams.wall_height, 0), new _Vec.Vec(scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "celling1");
var celling2 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, 0), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "celling2");

var wallleft1 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(-scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _Vec.Vec(-scparams.ground_pos, scparams.ground_height, 0), new _RTMaterial.RTMaterial(new _Color.Color(0.5, 1, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "wallleft1");
var wallleft2 = new _RTPlane.RTPlane(new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(-scparams.ground_pos, scparams.ground_height, 0), new _Vec.Vec(-scparams.ground_pos, scparams.wall_height, 0), new _RTMaterial.RTMaterial(new _Color.Color(0.5, 1, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "wallleft2");

var wallright1 = new _RTPlane.RTPlane(new _Vec.Vec(scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, 0), new _RTMaterial.RTMaterial(new _Color.Color(0.5, 1, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "wallright1");
var wallright2 = new _RTPlane.RTPlane(new _Vec.Vec(scparams.ground_pos, scparams.wall_height, scparams.ground_depth), new _Vec.Vec(scparams.ground_pos, scparams.ground_height, 0), new _Vec.Vec(scparams.ground_pos, scparams.wall_height, 0), new _RTMaterial.RTMaterial(new _Color.Color(0.5, 1, 0.5, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "wallright2");

var ground = new _RTSphere.RTSphere(new _Vec.Vec(0, -100, 22), 100, new _RTMaterial.RTMaterial(new _Color.Color(0.8, 0.0, 0.0, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "ground");

var rectlight1 = new _RTPlane.RTPlane(new _Vec.Vec(-1, scparams.wall_height - 0.001, 9), new _Vec.Vec(-0.8, scparams.wall_height - 0.001, 9), new _Vec.Vec(-1, scparams.wall_height - 0.001, 2), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(45, 45, 45, 1), _RTMaterial.RTMaterial.DIFFUSE), "rectlight1");

var rectlight2 = new _RTPlane.RTPlane(new _Vec.Vec(-0.8, scparams.wall_height - 0.001, 2), new _Vec.Vec(-0.8, scparams.wall_height - 0.001, 9), new _Vec.Vec(-1, scparams.wall_height - 0.001, 2), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(45, 45, 45, 1), _RTMaterial.RTMaterial.DIFFUSE), "rectlight2");

var rectlight3 = new _RTPlane.RTPlane(new _Vec.Vec(1, scparams.wall_height - 0.001, 9), new _Vec.Vec(0.8, scparams.wall_height - 0.001, 9), new _Vec.Vec(1, scparams.wall_height - 0.001, 2), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(45, 45, 45, 1), _RTMaterial.RTMaterial.DIFFUSE), "rectlight3");

var rectlight4 = new _RTPlane.RTPlane(new _Vec.Vec(0.8, scparams.wall_height - 0.001, 2), new _Vec.Vec(0.8, scparams.wall_height - 0.001, 9), new _Vec.Vec(1, scparams.wall_height - 0.001, 2), new _RTMaterial.RTMaterial(new _Color.Color(1, 0.5, 0.5, 1.0), new _Color.Color(45, 45, 45, 1), _RTMaterial.RTMaterial.DIFFUSE), "rectlight4");

var ambientLight = new _RTAmbientLight.RTAmbientLight(new _Color.Color(0.01, 0.01, 0.01, 1.0));

var skyLight = new _RTSkyLight.RTSkyLight(new _Color.Color(0.2, 0.5, 0.7, 1.0));

rtscene.attach(plane1);
rtscene.attach(plane2);
rtscene.attach(wallback1);
rtscene.attach(wallback2);
rtscene.attach(celling1);
rtscene.attach(celling2);
rtscene.attach(wallleft1);
rtscene.attach(wallleft2);
rtscene.attach(wallright1);
rtscene.attach(wallright2);

rtscene.attach(rectlight1);
rtscene.attach(rectlight2);
rtscene.attach(rectlight3);
rtscene.attach(rectlight4);

rtscene.attach(sphere);
rtscene.attach(sphere2);
rtscene.attach(sphere3);
rtscene.attach(sphere4);
rtscene.attach(sphere5);
rtscene.attach(sphere6);
rtscene.attach(sphere7);
rtscene.attach(tetra1);
//rtscene.attach(ambientLight)
//rtscene.attach(skyLight)
//rtscene.attach(light1)

rtscene.compile();
rtscene.render(true);

var states = 0;
var dispSample = 0;
var timeStart = Date.now();
var monitor = document.getElementById("sample");
var dispmonitor = document.getElementById("sample641");
var dispInterval = 5;
var disableAnimation = true;
function render() {
    states = states + 1;
    monitor.innerHTML = "RenderedFrames:" + states + ", RenderFPS:" + parseInt(states * 1000 / (Date.now() - timeStart));
    dispmonitor.innerHTML = " DisplayedFrames:" + dispSample + ", DispFPS:" + parseInt(dispSample * 1000 / (Date.now() - timeStart));
    rtscene.render();
    if (disableAnimation) {
        dispSample++;
        sc.render(shader, cam, rtscene.getRenderOutput());
        requestAnimationFrame(render);
    } else if (states % dispInterval == 0) {
        rtscene.resetCounter();
        rtscene.compile();
        dispSample++;
        sphere2.vc.x = Math.sin(states * 0.01) * 0.5 - 0.7;
        sc.render(shader, cam, rtscene.getRenderOutput());
    }
}
requestAnimationFrame(render);

//Injector
window.rtRotateUp = function () {
    rtscene.observer.cam.camPositon.y += 0.1;
    rtscene.resetCounter();
    rtscene.compile();
};
window.rtRotateDown = function () {
    rtscene.observer.cam.camPositon.y -= 0.1;
    rtscene.resetCounter();
    rtscene.compile();
};
window.rtMoveLeft = function () {
    rtscene.observer.cam.camPositon.x += 0.1;
    rtscene.resetCounter();
    rtscene.compile();
};
window.rtMoveRight = function () {
    rtscene.observer.cam.camPositon.x -= 0.1;
    rtscene.resetCounter();
    rtscene.compile();
};
window.rtGoFar = function () {
    rtscene.observer.cam.camPositon.z -= 0.1;
    rtscene.resetCounter();
    rtscene.compile();
};
window.rtGoNear = function () {
    rtscene.observer.cam.camPositon.z += 0.1;
    rtscene.resetCounter();
    rtscene.compile();
};