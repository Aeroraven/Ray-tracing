"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Raytracing: Fragment Shader 静态代码生成
var RTShaderUtil = exports.RTShaderUtil = function () {
    function RTShaderUtil() {
        _classCallCheck(this, RTShaderUtil);
    }

    _createClass(RTShaderUtil, null, [{
        key: "structDef_Ray",

        //结构体定义
        //Struct:Ray
        value: function structDef_Ray() {
            return "\n            struct sRay{\n                vec3 origin;\n                vec3 direction;\n                float inrefra;\n            };\n        ";
        }
        //Struct:Plane

    }, {
        key: "structDef_Plane",
        value: function structDef_Plane() {
            return "\n            struct sPlane{\n                vec3 x,y,z;\n                vec4 emissionColor;\n                vec4 materialColor;\n                \n            };\n        ";
        }
        //Struct:Sphere

    }, {
        key: "structDef_Sphere",
        value: function structDef_Sphere() {
            return "\n            struct sSphere{\n                vec3 c;\n                float r;\n                vec4 emissionColor;\n                vec4 materialColor;\n                \n            };\n        ";
        }
        //Struct:RayCollisionResult

    }, {
        key: "structDef_RayCollisionResult",
        value: function structDef_RayCollisionResult() {
            return "\n            struct sRayCollisionResult{\n                vec3 colvex;\n                vec3 colnorm;\n                bool collided;\n                vec4 emissionColor;\n                vec4 materialColor;\n                int hitType;\n                float refra;\n            };\n        ";
        }

        //完成结构体定义

    }, {
        key: "structDefConcat",
        value: function structDefConcat() {
            var lst = [RTShaderUtil.structDef_Plane, RTShaderUtil.structDef_Ray, RTShaderUtil.structDef_Sphere, RTShaderUtil.structDef_RayCollisionResult];
            var ret = "";
            for (var i = 0; i < lst.length; i++) {
                ret += lst[i]();
            }
            return ret;
        }

        //函数定义
        //Function:RayPoint 射线上的点

    }, {
        key: "funcDef_RayPoint",
        value: function funcDef_RayPoint() {
            return "\n            vec3 fRayPoint(sRay ray,float t){\n                return  ray.origin+ t * ray.direction;\n            }\n        ";
        }
        //Function:PlaneNorm 平面法向量

    }, {
        key: "funcDef_PlaneNorm",
        value: function funcDef_PlaneNorm() {
            return "\n            vec3 fPlaneNorm(sPlane p){\n                return cross(p.y-p.x,p.z-p.y);\n            }\n        ";
        }
        //Function:RayPlaneIntersection 射线和平面交点

    }, {
        key: "funcDef_RayPlaneIntersection",
        value: function funcDef_RayPlaneIntersection() {
            return "\n            float fRayPlaneIntersection(sRay r,sPlane p){\n                vec3 n = fPlaneNorm(p);\n                vec3 di = r.direction;\n                vec3 or = r.origin;\n                vec3 a = p.y;\n                float rd = dot(n,di);\n                float rn = n.x*(a.x-or.x)+n.y*(a.y-or.y)+n.z*(a.z-or.z);\n                return rn/rd;\n            }\n        ";
        }
        //Function:RaySphereIntersection 射线和球体交点

    }, {
        key: "funcDef_RaySphereIntersection",
        value: function funcDef_RaySphereIntersection() {
            return "\n            float fRaySphereIntersection(sRay r,sSphere s){\n                vec3 p = r.origin-s.c;\n                float a = dot(r.direction,r.direction);\n                float b = 2.0*(dot(r.direction,p));\n                float delta = b*b-4.0*a*(dot(p,p)-s.r*s.r);\n                if(delta<1e-4){\n                    return -1.0;\n                }else{\n                    float sdelta = sqrt(delta);\n                    float t1 = (-b+sdelta)/(2.0*a);\n                    float t2 = (-b-sdelta)/(2.0*a);\n                    if(t1>0.0&&t2>0.0){\n                        if(t1>t2){\n                            return t2;\n                        }\n                        return t1;\n                    }\n                    if(t1>0.0&&t2<0.0){\n                        return t1;\n                    }\n                    return t2;\n                }\n                return 0.0;\n            }\n        ";
        }

        //Function:InsidePlane 确定点在平面内部

    }, {
        key: "funcDef_InsidePlane",
        value: function funcDef_InsidePlane() {
            return "\n            bool fInsidePlane(sPlane p,vec3 v){\n                vec3 v1 = p.x - v;\n                vec3 v2 = p.y - v;\n                vec3 v3 = p.z - v;\n                float s1 = length(cross(v1,v2));\n                float s2 = length(cross(v2,v3));\n                float s3 = length(cross(v3,v1));\n                float s0 = length(cross(p.y-p.x,p.z-p.x));\n                if(abs(abs(s0)-abs(s1)-abs(s2)-abs(s3))<1e-2){\n                    return true;\n                }\n                return false;\n            }\n        ";
        }

        // 折射dch
        // sRay inr:入射光线
        // judgeRefract函数注解：
        // vec3 p:入射点
        // vec3 N:入射点法线
        // float NiOverNt:折射率
        // sRay 射入光线

    }, {
        key: "funcDef_tellRefract",
        value: function funcDef_tellRefract() {
            return "\n            bool judgeRefract(sRay inr,vec3 p,vec3 N,float NiOverNt){\n                vec3 UV= inr.direction/length(inr.direction);\n                float Dt=dot(UV,N);\n                N = N/length(N);\n                float Discriminant=1.0-NiOverNt*NiOverNt*(1.0-Dt*Dt);\n                if(Discriminant>0.0){\n                    return true;\n                }\n                else\n                  return false;\n            }\n        ";
        }
    }, {
        key: "funcDef_calRefract",
        value: function funcDef_calRefract() {
            return "\n            sRay calRefract(sRay inr,vec3 p,vec3 N,float matfra){\n                vec3 UV= inr.direction/length(inr.direction);\n                vec3 normvec = N/length(N);\n                vec3 fnormvec = normvec;\n                float Dt=dot(UV,normvec);\n                float colfra=0.0;\n                if(Dt<0.0){\n                    colfra = 1.0/matfra;\n                    fnormvec=normvec;\n                }else{\n                    colfra = matfra;\n                    fnormvec=-fnormvec;\n                }\n                float Discriminant=colfra*colfra*(1.0-Dt*Dt);\n                vec3 rfm = UV+fnormvec*abs(Dt);\n                float cos2 = sqrt(1.0-Discriminant);\n                float sin2 = sqrt(Discriminant);\n                float cos1 = abs(Dt);\n                float sin1 = sqrt(1.0-Dt*Dt);\n                vec3 rfn = rfm*(sin2/cos2*cos1/sin1)-fnormvec*abs(Dt);\n                bool cond = judgeRefract(inr,p,N,colfra);\n                sRay addrefra=sRay(p, rfn, 1.0);\n                if(cond!=cond){\n                    addrefra = fSpecularReflection(inr,p,N);\n                }else{\n                    if(Dt>0.0){\n                        addrefra.inrefra = 1.0;\n                    }else{\n                        addrefra.inrefra = matfra;\n                    }\n                }\n                return addrefra;\n            }\n        ";
        }

        // 菲涅耳近似公式

    }, {
        key: "funcDef_Schlick",
        value: function funcDef_Schlick() {
            return "\n            float calSchlick(cos,f0){\n                return f0+(1-f0)*(1-cos)*(1-cos)*(1-cos)*(1-cos)*(1-cos);\n            }\n        ";
        }

        //Function:RandNoiseV3 随机数

    }, {
        key: "funcDef_RandNoiseV3",
        value: function funcDef_RandNoiseV3() {
            return "\n            float rng()\n            {\n                seeds += uvec2(1);\n                uvec2 q = 1103515245U * ( (seeds >> 1U) ^ (seeds.yx) );\n                uint  n = 1103515245U * ( (q.x) ^ (q.y >> 3U) );\n                return float(n) * (1.0 / float(0xffffffffU));\n            }\n            vec3 uniformlyRandomDirectionNew() {\n                float up = rng() * 2.0 - 1.0; \n                float over = sqrt( max(0.0, 1.0 - up * up) );\n                float around = rng() * 6.28318530717;\n                return normalize(vec3(cos(around) * over, up, sin(around) * over));\t\n            }\n        ";
        }

        //Function:SpecularReflection 镜面反射

    }, {
        key: "funcDef_SpecularReflection",
        value: function funcDef_SpecularReflection() {
            return "\n            sRay fSpecularReflection(sRay inr,vec3 p,vec3 n){\n                if(dot(inr.direction,n)>0.0){\n                    n = -n;\n                }\n                vec3 ox = inr.direction/dot(inr.direction,n)+2.0*n;\n                sRay ret = sRay(p,ox/length(ox),inr.inrefra);\n                return ret;\n            }\n        ";
        }
        //Function:DiffuseReflection 漫反射

    }, {
        key: "funcDef_DiffuseReflection",
        value: function funcDef_DiffuseReflection() {
            return "\n            sRay fDiffuseReflection(sRay inr,vec3 p,vec3 norm){\n                vec3 n = norm;\n                n = n / length(n);\n                if(dot(inr.direction,norm)>0.0){\n                    n = -n;\n                }\n                vec3 o = uniformlyRandomDirectionNew();\n                if(dot(o,n)<0.0){\n                    o = -o;\n                }\n                sRay rt = sRay(p,o,inr.inrefra);\n                return rt;\n            }\n        ";
        }
    }, {
        key: "funcDef_GlsryReflection",
        value: function funcDef_GlsryReflection() {
            return "\n            sRay fGlsryReflection(sRay inr,vec3 p,vec3 norm){\n                vec3 n = norm;\n                n = n / length(n);\n                if(dot(inr.direction,norm)>0.0){\n                    n = -n;\n                }\n                vec3 o = uniformlyRandomDirectionNew();\n                if(dot(o,n)<0.0){\n                    o = -o;\n                }\n                vec3 ox = (inr.direction/dot(inr.direction,n)+2.0*n)+o;\n                ox = ox/length(ox);\n                sRay rt = sRay(p,ox,inr.inrefra);\n                return rt;\n            }\n        ";
        }
    }, {
        key: "funcDef_RayCollision",
        value: function funcDef_RayCollision() {
            var objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            return "\n            sRayCollisionResult fRayCollision(sRay r){\n                float t = 1e30;\n                vec3 norm = vec3(0.0,0.0,0.0);\n                vec4 emicolor = vec4(1.0,1.0,1.0,1.0);\n                vec4 matcolor = vec4(0.0,0.0,0.0,1.0);\n                bool collided = false;\n                float tc=1e30;\n                float refra = 1.0;\n                int hitType = 0;\n                bool colc = false;\n                " + objects + "\n                vec3 colp = fRayPoint(r,t);\n                sRayCollisionResult ret = sRayCollisionResult(colp,norm,collided,emicolor,matcolor,hitType,refra);\n                return ret;\n            }\n        ";
        }
    }, {
        key: "funcDef_GammaCorrection",
        value: function funcDef_GammaCorrection() {
            return "\n            vec4 fGammaCorrection(vec4 col,float g){\n                return vec4(pow(col.x,g),pow(col.y,g),pow(col.z,g),pow(col.w,g));\n            }\n        ";
        }
    }, {
        key: "funcDef_ShadowLight",
        value: function funcDef_ShadowLight() {
            return "\n            bool fShadowLight(vec3 light,vec3 cp){\n                vec3 d = light - cp;\n                vec3 s = cp;\n                d = d/length(d);\n                s = s + d*0.01;\n                sRay r = sRay(s,d,1.0);\n                if(fRayCollision(r).collided){\n                    return true;\n                }\n                return false;\n            }\n        ";
        }
    }, {
        key: "funcDef_ShadowTests",
        value: function funcDef_ShadowTests() {
            var objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            return "\n            float fShadowTests(vec3 cp){\n                float intensity = 0.0;\n                " + objects + "\n                return intensity;\n            }\n        ";
        }

        //Function:Raytracing 光线追踪

    }, {
        key: "funcDef_Raytracing",
        value: function funcDef_Raytracing(ambientSetting) {
            return "\n            vec4 fRaytracing(sRay r){\n                sRay rp = r;\n                vec4 accColor = vec4(0.0,0.0,0.0,1.0);\n                vec4 accMaterial = vec4(1.0,1.0,1.0,1.0);\n                vec4 ambient = vec4(0.0,0.0,0.0,1.0);\n                vec4 skylight = vec4(0.0,0.0,0.0,1.0);\n                " + ambientSetting + "\n                for(int i=1;i < 10;i+=1){\n                    rp.direction = rp.direction / length(rp.direction);\n                    sRayCollisionResult hit = fRayCollision(rp);\n                    if(hit.collided == false){\n                        accColor = accColor + accMaterial * skylight; \n                        break;\n                    }\n                    accMaterial = accMaterial * hit.materialColor;\n                    float rndsample = rng();\n\n                    if(hit.hitType==1 || (rndsample<0.3&&hit.hitType==5)){\n                        rp = fDiffuseReflection(rp,hit.colvex,hit.colnorm);\n                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);\n                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert;\n                    }else if(hit.hitType==2 ){\n                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);\n                        rp = fSpecularReflection(rp,hit.colvex,hit.colnorm);\n                    }else if(hit.hitType==3 || (hit.hitType==5)){\n                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);\n                        rp=calRefract(rp,hit.colvex,hit.colnorm,hit.refra);\n                    }else if(hit.hitType==0){\n                        return accColor;\n                    }else if(hit.hitType==4){\n                        rp = fGlsryReflection(rp,hit.colvex,hit.colnorm);\n                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);\n                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert;\n                    }\n                    rp.origin = rp.origin + rp.direction*0.002;\n                    if(i>3&&accMaterial.x<1e-2&&accMaterial.y<1e-2&&accMaterial.z<1e-2){\n                        break;\n                    }\n                }\n                return accColor;\n            }\n        ";
        }
    }, {
        key: "funcDef_Main",
        value: function funcDef_Main() {
            return "\n            void main(){\n                \n                float loopsf = 10.0;\n                float randsrng = 0.00005;\n                const int loops = 10;\n                vec3 nray = ray / length(ray);\n                vec4 fragc = vec4(0.0,0.0,0.0,0.0);\n                for(int i=0;i<loops;i++){\n                    float px = float(uSamples)*loopsf+float(i);\n                    seeds = uvec2(px, px + 2.0) * uvec2(gl_FragCoord);\n                    fragc += fRaytracing(sRay(eye, nray + uniformlyRandomDirectionNew() * randsrng,1.0));\n                }\n                vec4 textc = texture(uTexture, vec2(1.0-tex.s,tex.t));\n                fragc = fGammaCorrection(fragc/loopsf,0.40);\n                fragmentColor = (textc*float(uSamples) + fragc)/(float(uSamples)+1.0);\n            }\n        ";
        }
        //完成函数输出

    }, {
        key: "funcDefConcat",
        value: function funcDefConcat(funcParam) {
            var lst = [[RTShaderUtil.funcDef_GammaCorrection, null], [RTShaderUtil.funcDef_RandNoiseV3, null], [RTShaderUtil.funcDef_DiffuseReflection, null], [RTShaderUtil.funcDef_InsidePlane, null], [RTShaderUtil.funcDef_PlaneNorm, null], [RTShaderUtil.funcDef_GlsryReflection, null], [RTShaderUtil.funcDef_RayPlaneIntersection, null], [RTShaderUtil.funcDef_RaySphereIntersection, null], [RTShaderUtil.funcDef_RayPoint, null], [RTShaderUtil.funcDef_SpecularReflection, null], [RTShaderUtil.funcDef_tellRefract, null], [RTShaderUtil.funcDef_calRefract, null], [RTShaderUtil.funcDef_RayCollision, funcParam.intersection], [RTShaderUtil.funcDef_ShadowLight, null], [RTShaderUtil.funcDef_ShadowTests, funcParam.pointlight], [RTShaderUtil.funcDef_Raytracing, funcParam.ambientSetting], [RTShaderUtil.funcDef_Main, null]];
            var ret = "";
            for (var i = 0; i < lst.length; i++) {
                console.log(lst[i][0]);
                if (lst[i][1] === null) {
                    ret += lst[i][0]();
                } else {

                    console.log(lst[i][1]);
                    ret += lst[i][0](lst[i][1]);
                }
            }
            return ret;
        }
        //变量输出

    }, {
        key: "globalVarDefConcat",
        value: function globalVarDefConcat() {
            return "\n            uvec2 seeds = uvec2(1.0,1.0);\n            in vec3 ray;\n            in vec2 tex;\n            out vec4 fragmentColor;\n        ";
        }
        //Uniform

    }, {
        key: "uniformDefConcat",
        value: function uniformDefConcat(shaderMap) {
            if (shaderMap == null) {
                return "";
            }
            return shaderMap.getSourceFragment();
        }
    }, {
        key: "getFragmentShader",
        value: function getFragmentShader(funcParam, shaderMap) {
            if (funcParam == null) {
                funcParam = {
                    intersection: "",
                    ambientSetting: "",
                    pointlight: ""
                };
            }
            var ret = "#version 300 es\n            precision lowp float;\n            precision lowp int;\n        \n";
            ret += RTShaderUtil.uniformDefConcat(shaderMap);
            ret += RTShaderUtil.globalVarDefConcat();
            ret += RTShaderUtil.structDefConcat();
            ret += RTShaderUtil.funcDefConcat(funcParam);
            return ret;
        }
    }]);

    return RTShaderUtil;
}();