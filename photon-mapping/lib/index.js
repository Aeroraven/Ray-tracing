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

var _RTSphere = require("./raytracing/components/RTSphere");

var _RTAmbientLight = require("./raytracing/components/RTAmbientLight");

var _RTSkyLight = require("./raytracing/components/RTSkyLight");

var _RTPointLight = require("./raytracing/components/RTPointLight");

var _RTPlane = require("./raytracing/components/RTPlane");

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

//Start Raytracing Render
var rtscene = new _RTScene.RTScene(gl);

var sphere = new _RTSphere.RTSphere(new _Vec.Vec(0, -0.45, 8), 0.5, new _RTMaterial.RTMaterial(new _Color.Color(0.8, 0.8, 0.8, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "sphere1");

var sphere2 = new _RTSphere.RTSphere(new _Vec.Vec(-0.6, -0.6, 7), 0.5, new _RTMaterial.RTMaterial(new _Color.Color(0.8, 0.8, 0.8, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "sphere2");

var plane1 = new _RTPlane.RTPlane(new _Vec.Vec(-6, 0, -6), new _Vec.Vec(-6, 0, 40), new _Vec.Vec(40, 0, -6), new _RTMaterial.RTMaterial(new _Color.Color(0.75, 0.75, 0.75, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "ground1");

var plane2 = new _RTPlane.RTPlane(new _Vec.Vec(2, 2, 0), new _Vec.Vec(2, 3, 0), new _Vec.Vec(3, 2, 0), new _RTMaterial.RTMaterial(new _Color.Color(0.75, 0.75, 0.75, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "ground2");

var light1 = new _RTSphere.RTSphere(new _Vec.Vec(0.6, -0.6, 7), 0.5, new _RTMaterial.RTMaterial(new _Color.Color(1, 1, 1, 1.0), new _Color.Color(1, 1, 1, 1), _RTMaterial.RTMaterial.DIFFUSE), "light1");

var ground = new _RTSphere.RTSphere(new _Vec.Vec(0, -100, 22), 100, new _RTMaterial.RTMaterial(new _Color.Color(0.75, 0.75, 0.55, 1.0), new _Color.Color(0, 0, 0, 1), _RTMaterial.RTMaterial.DIFFUSE), "ground");

var ambientLight = new _RTAmbientLight.RTAmbientLight(new _Color.Color(0.1, 0.1, 0.1, 1.0));

var skyLight = new _RTSkyLight.RTSkyLight(new _Color.Color(0.2, 0.5, 0.7, 1.0));

rtscene.attach(ground);
rtscene.attach(sphere);
rtscene.attach(sphere2);
rtscene.attach(ambientLight);
rtscene.attach(skyLight);
rtscene.attach(light1);

rtscene.compile();
rtscene.render();

function render() {
    rtscene.render();
    sc.render(shader, cam, rtscene.getRenderOutput());
    requestAnimationFrame(render);
}
requestAnimationFrame(render);