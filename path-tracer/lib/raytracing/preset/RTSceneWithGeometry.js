"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //Raytracing Preset Scene: Geometry Balls

var _RTScene = require("../../raytracing/RTScene");

var _RTMaterial = require("../../raytracing/components/RTMaterial");

var _RTSphere = require("../../raytracing/components/geometry/RTSphere");

var _RTAmbientLight = require("../../raytracing/components/RTAmbientLight");

var _RTSkyLight = require("../../raytracing/components/RTSkyLight");

var _RTPlane = require("../components/geometry/RTPlane");

var _RTTetrahedron = require("../components/geometry/RTTetrahedron");

var _Vec = require("../../core/Vec");

var _Color = require("../../core/Color");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RTSceneWithGeometry = function () {
    function RTSceneWithGeometry() {
        _classCallCheck(this, RTSceneWithGeometry);
    }

    _createClass(RTSceneWithGeometry, null, [{
        key: "configure",
        value: function configure(gl) {
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
            return rtscene;
        }
    }]);

    return RTSceneWithGeometry;
}();

exports.default = RTSceneWithGeometry;