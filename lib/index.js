"use strict";

var _WGLContextHelper = require("./render/WGLContextHelper");

var _trivialShader = require("./shader/trivialShader");

var _Vertex = require("./core/Vertex");

var _Vec = require("./core/Vec");

var _WGLScene = require("./render/WGLScene");

var _Color = require("./core/Color");

var _Rect = require("./primitives/Rect");

var _Camera = require("./core/Camera");

var _RTSceneWithGeometry = require("./raytracing/preset/RTSceneWithGeometry");

var _RTSceneWithGeometry2 = _interopRequireDefault(_RTSceneWithGeometry);

var _RTGlassTest = require("./raytracing/preset/RTGlassTest");

var _RTGlassTest2 = _interopRequireDefault(_RTGlassTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var rtscene = _RTGlassTest2.default.configure(gl);

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