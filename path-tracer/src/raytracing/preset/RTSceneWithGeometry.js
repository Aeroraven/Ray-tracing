//Raytracing Preset Scene: Geometry Balls

import { RTScene } from "../../raytracing/RTScene";
import { RTMaterial } from "../../raytracing/components/RTMaterial";
import { RTSphere } from "../../raytracing/components/geometry/RTSphere";
import { RTAmbientLight } from "../../raytracing/components/RTAmbientLight";
import { RTSkyLight } from "../../raytracing/components/RTSkyLight";
import { RTPlane } from "../components/geometry/RTPlane";
import { RTTetrahedron } from "../components/geometry/RTTetrahedron";
import { Vec } from "../../core/Vec";
import { Color } from "../../core/Color";
export default class RTSceneWithGeometry{
    static configure(gl){
        let rtscene = new RTScene(gl)
        let scparams={
            ground_pos:2,
            ground_depth:10,
            ground_height:-1,
            wall_height:1
        }

        let sphere = new RTSphere(
            new Vec(0,-0.5,8),
            0.5,
            new RTMaterial(
                new Color(0.8,0.8,0.0,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "sphere1"
        )

        let sphere2 = new RTSphere(
            new Vec(-0.5,-0.5,6),
            0.5,
            new RTMaterial(
                new Color(1,1,1,1.0),
                new Color(0,0,0,1.0),
                RTMaterial.REFRACTION,
                1.11
            ),
            "sphere2"
        )

        let sphere3 = new RTSphere(
            new Vec(1.5,-0.5,8),
            0.5,
            new RTMaterial(
                new Color(1,1,1,1.0),
                new Color(0,0,0,1.0),
                RTMaterial.SPECULAR,
                1.04
            ),
            "sphere3"
        )

        let sphere4 = new RTSphere(
            new Vec(-1.6,-0.6,8),
            0.4,
            new RTMaterial(
                new Color(1,1,1,1.0),
                new Color(0,0,0,1.0),
                RTMaterial.METAL,
                1.04
            ),
            "sphere4"
        )

        let sphere5 = new RTSphere(
            new Vec(0.35,-0.6,5),
            0.4,
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(0,0,0,1.0),
                RTMaterial.MOSSY,
                1.04
            ),
            "sphere5"
        )

        let sphere6 = new RTSphere(
            new Vec(-0.65,-0.7,4),
            0.3,
            new RTMaterial(
                new Color(0,0.5,1,1.0),
                new Color(0,0,0,1.0),
                RTMaterial.DIFFUSE,
                1.02
            ),
            "sphere6"
        )
        let sphere7 = new RTSphere(
            new Vec(-0.95,-0.8,3),
            0.2,
            new RTMaterial(
                new Color(0,1,0.5,1.0),
                new Color(0,0,0,1.0),
                RTMaterial.DIFFUSE,
                1.02
            ),
            "sphere7"
        )

        let tetra1 = new RTTetrahedron(
            new Vec(0+1.15,-0.2,0+5),
            new Vec(-0.4+1.15,-1,0.4+5),
            new Vec(0.4+1.15,-1,0.4+5),
            new Vec(0+1.15,-1,0+5),
            new RTMaterial(
                new Color(0.3,1,0,1.0),
                new Color(0,0.0,0,1.0),
                RTMaterial.DIFFUSE,
                1.02
            ),
            "tetra1"
        )


        let light1 = new RTSphere(
            new Vec(0.6,-0.7,6.5),
            0.3,
            new RTMaterial(
                new Color(1,1,1,1.0),
                new Color(45,45,45,1),
                RTMaterial.DIFFUSE
            ),
            "light1"
        )


        let plane1 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.ground_height,0),
            new Vec(scparams.ground_pos,scparams.ground_height,0),
            new Vec(scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "ground1"
        )
        let plane2 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new Vec(-scparams.ground_pos,scparams.ground_height,0),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "ground2"
        )

        let wallback1 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new Vec(-scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new RTMaterial(
                new Color(0.5,0.5,1,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "wallback1"
        )
        let wallback2 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new RTMaterial(
                new Color(0.5,0.5,1,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "wallback2"
        )
        let celling1 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.wall_height,0),
            new Vec(scparams.ground_pos,scparams.wall_height,0),
            new Vec(scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "celling1"
        )
        let celling2 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(-scparams.ground_pos,scparams.wall_height,0),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "celling2"
        )


        let wallleft1 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(-scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new Vec(-scparams.ground_pos,scparams.ground_height,0),
            new RTMaterial(
                new Color(0.5,1,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "wallleft1"
        )
        let wallleft2 = new RTPlane(
            new Vec(-scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(-scparams.ground_pos,scparams.ground_height,0),
            new Vec(-scparams.ground_pos,scparams.wall_height,0),
            new RTMaterial(
                new Color(0.5,1,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "wallleft2"
        )


        let wallright1 = new RTPlane(
            new Vec(scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.ground_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.ground_height,0),
            new RTMaterial(
                new Color(0.5,1,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "wallright1"
        )
        let wallright2 = new RTPlane(
            new Vec(scparams.ground_pos,scparams.wall_height,scparams.ground_depth),
            new Vec(scparams.ground_pos,scparams.ground_height,0),
            new Vec(scparams.ground_pos,scparams.wall_height,0),
            new RTMaterial(
                new Color(0.5,1,0.5,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "wallright2"
        )

        let ground = new RTSphere(
            new Vec(0,-100,22),
            100,
            new RTMaterial(
                new Color(0.8,0.0,0.0,1.0),
                new Color(0,0,0,1),
                RTMaterial.DIFFUSE
            ),
            "ground"
        )


        let rectlight1 = new RTPlane(
            new Vec(-1,scparams.wall_height-0.001,9),
            new Vec(-0.8,scparams.wall_height-0.001,9),
            new Vec(-1,scparams.wall_height-0.001,2),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(45,45,45,1),
                RTMaterial.DIFFUSE
            ),
            "rectlight1"
        )

        let rectlight2 = new RTPlane(
            new Vec(-0.8,scparams.wall_height-0.001,2),
            new Vec(-0.8,scparams.wall_height-0.001,9),
            new Vec(-1,scparams.wall_height-0.001,2),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(45,45,45,1),
                RTMaterial.DIFFUSE
            ),
            "rectlight2"
        )

        let rectlight3 = new RTPlane(
            new Vec(1,scparams.wall_height-0.001,9),
            new Vec(0.8,scparams.wall_height-0.001,9),
            new Vec(1,scparams.wall_height-0.001,2),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(45,45,45,1),
                RTMaterial.DIFFUSE
            ),
            "rectlight3"
        )

        let rectlight4 = new RTPlane(
            new Vec(0.8,scparams.wall_height-0.001,2),
            new Vec(0.8,scparams.wall_height-0.001,9),
            new Vec(1,scparams.wall_height-0.001,2),
            new RTMaterial(
                new Color(1,0.5,0.5,1.0),
                new Color(45,45,45,1),
                RTMaterial.DIFFUSE
            ),
            "rectlight4"
        )


        let ambientLight = new RTAmbientLight(
            new Color(0.01,0.01,0.01,1.0)
        )

        let skyLight = new RTSkyLight(
            new Color(0.2,0.5,0.7,1.0)
        )

        rtscene.attach(plane1)
        rtscene.attach(plane2)
        rtscene.attach(wallback1)
        rtscene.attach(wallback2)
        rtscene.attach(celling1)
        rtscene.attach(celling2)
        rtscene.attach(wallleft1)
        rtscene.attach(wallleft2)
        rtscene.attach(wallright1)
        rtscene.attach(wallright2)


        rtscene.attach(rectlight1)
        rtscene.attach(rectlight2)
        rtscene.attach(rectlight3)
        rtscene.attach(rectlight4)

        rtscene.attach(sphere)
        rtscene.attach(sphere2)
        rtscene.attach(sphere3)
        rtscene.attach(sphere4)
        rtscene.attach(sphere5)
        rtscene.attach(sphere6)
        rtscene.attach(sphere7)
        rtscene.attach(tetra1)
        //rtscene.attach(ambientLight)
        //rtscene.attach(skyLight)
        //rtscene.attach(light1)
        return rtscene
    }
}