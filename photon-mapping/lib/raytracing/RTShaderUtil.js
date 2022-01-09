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
            return `            
                struct sRay{\n                vec3 origin;\n                vec3 direction;\n                vec4 color;\n            };\n        ";
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
            return "\n            struct sRayCollisionResult{\n                vec3 colvex;\n                vec3 colnorm;\n                bool collided;\n                vec4 emissionColor;\n                vec4 materialColor;\n                int hitType;\n            };\n        ";
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
            return "\n            vec3 fRayPoint(sRay ray,float t){\n                vec3 ret = ray.origin;\n                ret = ret + t * ray.direction;\n                return ret;\n            }\n        ";
        }
        //Function:PlaneNorm 平面法向量

    }, {
        key: "funcDef_PlaneNorm",
        value: function funcDef_PlaneNorm() {
            return "\n            vec3 fPlaneNorm(sPlane p){\n                vec3 x = p.y-p.x;\n                vec3 y = p.z-p.y;\n                return cross(x,y);\n            }\n        ";
        }
        //Function:RayPlaneIntersection 射线和平面交点

    }, {
        key: "funcDef_RayPlaneIntersection",
        value: function funcDef_RayPlaneIntersection() {
            return "\n            float fRayPlaneIntersection(sRay r,sPlane p){\n                vec3 n = fPlaneNorm(p);\n                vec3 di = r.direction;\n                vec3 or = r.origin;\n                vec3 a = p.y;\n                float rd = n.x*di.x+n.y*di.y+n.z*di.z;\n                float rn = n.x*(a.x-or.x)+n.y*(a.y-or.y)+n.z*(a.z-or.z);\n                return rn/rd;\n            }\n        ";
        }
        //Function:RaySphereIntersection 射线和球体交点

    }, {
        key: "funcDef_RaySphereIntersection",
        value: function funcDef_RaySphereIntersection() {
            return "\n            float fRaySphereIntersection(sRay r,sSphere s){\n                vec3 p = r.origin-s.c;\n                vec3 d = r.direction;\n                float a = d.x*d.x+d.y*d.y+d.z*d.z;\n                float b = 2.0*(d.x*p.x+d.y*p.y+d.z*p.z);\n                float c = p.x*p.x+p.y*p.y+p.z*p.z-s.r*s.r;\n                float delta = b*b-4.0*a*c;\n                if(delta<1e-10){\n                    return -1.0;\n                }else{\n                    float sdelta = sqrt(delta);\n                    float t1 = (-b+sdelta)/(2.0*a);\n                    float t2 = (-b-sdelta)/(2.0*a);\n                    if(t1>0.0&&t2>0.0){\n                        if(t1>t2){\n                            return t2;\n                        }\n                        return t1;\n                    }\n                    if(t1>0.0&&t2<0.0){\n                        return t1;\n                    }\n                    return t2;\n                }\n                return 0.0;\n            }\n        ";
        }

        //Function:InsidePlane 确定点在平面内部

    }, {
        key: "funcDef_InsidePlane",
        value: function funcDef_InsidePlane() {
            return "\n            bool fInsidePlane(sPlane p,vec3 v){\n                vec3 v1 = p.x - v;\n                vec3 v2 = p.y - v;\n                vec3 v3 = p.z - v;\n                float s1 = length(cross(v1,v2));\n                float s2 = length(cross(v2,v3));\n                float s3 = length(cross(v3,v1));\n                float s0 = length(cross(p.y-p.x,p.z-p.x));\n                if(abs(abs(s0)-abs(s1)-abs(s2)-abs(s3))<1e-5){\n                    return true;\n                }\n                return false;\n            }\n        ";
        }

        //Function:SpecularReflection 镜面反射

    }, {
        key: "funcDef_SpecularReflection",
        value: function funcDef_SpecularReflection() {
            return "\n            sRay fSpecularReflection(sRay inr,vec3 p,vec3 norm){\n                vec3 n = norm;\n                n = n/length(n);\n                if(dot(inr.direction,norm)>0.0){\n                    n = -n;\n                }\n                vec3 ix = inr.direction/dot(inr.direction,n);\n                vec3 ox = ix+2.0*n;\n                vec3 o = ox/length(ox);\n                sRay ret = sRay(p,o,inr.color);\n                return ret;\n            }\n        ";
        }

        //Function:RandNoiseV3 随机数
        //By Ian McEwan & Ashima Arts (webgl-noise)
        //Under MIT License

    }, {
        key: "funcDef_RandNoiseV3",
        value: function funcDef_RandNoiseV3() {
            return "\n            vec3 mod289(vec3 x) {\n                return x - floor(x * (1.0 / 289.0)) * 289.0;\n            }\n            \n            vec4 mod289(vec4 x) {\n                return x - floor(x * (1.0 / 289.0)) * 289.0;\n            }\n            \n            vec4 permute(vec4 x) {\n                return mod289(((x*34.0)+10.0)*x);\n            }\n            \n            vec4 taylorInvSqrt(vec4 r)\n            {\n                return 1.79284291400159 - 0.85373472095314 * r;\n            }\n            \n            float snoise(vec3 v)\n                { \n                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n                vec3 i  = floor(v + dot(v, C.yyy) );\n                vec3 x0 =   v - i + dot(i, C.xxx) ;\n            \n                vec3 g = step(x0.yzx, x0.xyz);\n                vec3 l = 1.0 - g;\n                vec3 i1 = min( g.xyz, l.zxy );\n                vec3 i2 = max( g.xyz, l.zxy );\n            \n                vec3 x1 = x0 - i1 + C.xxx;\n                vec3 x2 = x0 - i2 + C.yyy; \n                vec3 x3 = x0 - D.yyy;      \n            \n                i = mod289(i); \n                vec4 p = permute( permute( permute( \n                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n            \n                float n_ = 0.142857142857; // 1.0/7.0\n                vec3  ns = n_ * D.wyz - D.xzx;\n            \n                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n            \n                vec4 x_ = floor(j * ns.z);\n                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n            \n                vec4 x = x_ *ns.x + ns.yyyy;\n                vec4 y = y_ *ns.x + ns.yyyy;\n                vec4 h = 1.0 - abs(x) - abs(y);\n            \n                vec4 b0 = vec4( x.xy, y.xy );\n                vec4 b1 = vec4( x.zw, y.zw );\n            \n                vec4 s0 = floor(b0)*2.0 + 1.0;\n                vec4 s1 = floor(b1)*2.0 + 1.0;\n                vec4 sh = -step(h, vec4(0.0));\n            \n                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n            \n                vec3 p0 = vec3(a0.xy,h.x);\n                vec3 p1 = vec3(a0.zw,h.y);\n                vec3 p2 = vec3(a1.xy,h.z);\n                vec3 p3 = vec3(a1.zw,h.w);\n            \n                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n                p0 *= norm.x;\n                p1 *= norm.y;\n                p2 *= norm.z;\n                p3 *= norm.w;\n            \n\n                vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n                m = m * m;\n                return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                            dot(p2,x2), dot(p3,x3) ) );\n            }\n            float random(vec3 scale, float seed) {\n                return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n            }\n            vec3 uniformlyRandomDirection(float seed) {\n                float u = random(vec3(12.9898, 78.233, 151.7182), seed);\n                float v = random(vec3(63.7264, 10.873, 623.6736), seed);\n                float z = 1.0 - 2.0 * u;\n                float r = sqrt(1.0 - z * z);\n                float angle = 6.283185307179586 * v;\n                return vec3(r * cos(angle), r * sin(angle), z);\n            }\n            float rand(vec2 co){\n                return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);\n            }\n            float fRandNoiseV3(vec3 x){\n                state += snoise(x+vec3(state,state+144.13,151.49))+24.89;\n                state -= random(x,state);\n                float ret = rand(vec2(x.x+x.y+x.z,state));\n                return ret;\n            }\n        ";
        }
        //Function:DiffuseReflection 漫反射

    }, {
        key: "funcDef_DiffuseReflection",
        value: function funcDef_DiffuseReflection() {
            return "\n            sRay fDiffuseReflection(sRay inr,vec3 p,vec3 norm){\n                vec3 n = norm;\n                n = n / length(n);\n                if(dot(inr.direction,norm)>0.0){\n                    n = -n;\n                }\n                float fx = fRandNoiseV3(vec3(n.y+state,n.x+state,n.z+state));\n                float fy = fRandNoiseV3(vec3(fx,state,fx));\n                float dx = sin(fx)*cos(fy);\n                float dy = sin(fx)*sin(fy);\n                float dz = cos(fy);\n                vec3 tn = uniformlyRandomDirection(state);\n                vec3 tp = tn/length(tn);\n                vec3 newdir = tp;\n                if(dot(newdir,n)<0.0){\n                    newdir = -newdir;\n                }\n                vec3 o = newdir / length(newdir);\n                sRay rt = sRay(p,o,inr.color);\n                return rt;\n            }\n        ";
        }
    }, {
        key: "funcDef_RayCollision",
        value: function funcDef_RayCollision() {
            var objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            return "\n            sRayCollisionResult fRayCollision(sRay r){\n                float t = 1e30;\n                vec3 norm = vec3(0.0,0.0,0.0);\n                vec4 emicolor = vec4(1.0,1.0,1.0,1.0);\n                vec4 matcolor = vec4(0.0,0.0,0.0,1.0);\n                bool collided = false;\n                float tc=1e30;\n                int hitType = 0;\n                bool colc = false;\n                " + objects + "\n                vec3 colp = fRayPoint(r,t);\n                sRayCollisionResult ret = sRayCollisionResult(colp,norm,collided,emicolor,matcolor,hitType);\n                return ret;\n            }\n        ";
        }
    }, {
        key: "funcDef_GammaCorrection",
        value: function funcDef_GammaCorrection() {
            return "\n            vec4 fGammaCorrection(vec4 col,float g){\n                return vec4(pow(col.x,g),pow(col.y,g),pow(col.z,g),pow(col.w,g));\n            }\n        ";
        }
    }, {
        key: "funcDef_ShadowLight",
        value: function funcDef_ShadowLight() {
            return "\n            bool fShadowLight(vec3 light,vec3 cp){\n                vec3 d = light - cp;\n                vec3 s = cp;\n                d = d/length(d);\n                s = s + d*0.01;\n                sRay r = sRay(s,d,vec4(1.0,1.0,1.0,1.0));\n                if(fRayCollision(r).collided){\n                    return true;\n                }\n                return false;\n            }\n        ";
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
            return "\n            vec4 fRaytracing(sRay r){\n                sRay rp = r;\n                vec4 accColor = vec4(0.0,0.0,0.0,1.0);\n                vec4 accMaterial = vec4(1.0,1.0,1.0,1.0);\n                vec4 ambient = vec4(0.0,0.0,0.0,1.0);\n                vec4 skylight = vec4(0.0,0.0,0.0,1.0);\n                " + ambientSetting + "\n                for(int i=1;i < 25;i+=1){\n                    sRayCollisionResult hit = fRayCollision(rp);\n                    if(hit.collided == false){\n                        accColor = accColor + accMaterial * skylight; \n                        break;\n                    }\n                    accMaterial = accMaterial * hit.materialColor;\n                    float shadowIntensity = 1.0;\n                    //float shadowIntensity = fShadowTests(hit.colvex);\n                    if(hit.hitType==1){\n                        rp = fDiffuseReflection(rp,hit.colvex,hit.colnorm);\n                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);\n                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert  * shadowIntensity;\n                    }else if(hit.hitType==2){\n                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * shadowIntensity;\n                        rp = fSpecularReflection(rp,hit.colvex,hit.colnorm);\n                    }\n                }\n                return accColor;\n            }\n        ";
        }
    }, {
        key: "funcDef_Main",
        value: function funcDef_Main() {
            return "\n            void main(){\n                state += fRandNoiseV3(vec3(uTime,uTime+212.0,uTime+2.0));\n                float loopsf = 1.0;\n                float randsrng = 0.0000;\n                const int loops = 1;\n\n                vec3 nray = ray / length(ray);\n                vec3 rnd = vec3(1.14+state,5.14+state,1.91+state+uTime);\n                vec4 fragc = vec4(0.0,0.0,0.0,0.0);\n                for(int i=0;i<loops;i++){\n                    rnd = uniformlyRandomDirection(state);\n                    nray = nray + rnd * randsrng;\n                    nray = nray / length(nray);\n\n                    sRay r = sRay(eye,nray,vec4(0.0,0.0,0.0,0.0));\n                    fragc = fRaytracing(r)/loopsf + fragc;\n                }\n                vec4 textc = texture2D(uTexture, vec2(1.0-tex.s,tex.t));\n                fragc = vec4(min(fragc.x,1.0),min(fragc.y,1.0),min(fragc.z,1.0),1.0);\n                fragc = fGammaCorrection(fragc,0.55);\n                gl_FragColor = (textc*float(uSamples) + fragc)/(float(uSamples)+1.0);\n            }\n        ";
        }
        //完成函数输出

    }, {
        key: "funcDefConcat",
        value: function funcDefConcat(funcParam) {
            var lst = [[RTShaderUtil.funcDef_GammaCorrection, null], [RTShaderUtil.funcDef_RandNoiseV3, null], [RTShaderUtil.funcDef_DiffuseReflection, null], [RTShaderUtil.funcDef_InsidePlane, null], [RTShaderUtil.funcDef_PlaneNorm, null], [RTShaderUtil.funcDef_RayPlaneIntersection, null], [RTShaderUtil.funcDef_RaySphereIntersection, null], [RTShaderUtil.funcDef_RayPoint, null], [RTShaderUtil.funcDef_SpecularReflection, null], [RTShaderUtil.funcDef_RayCollision, funcParam.intersection], [RTShaderUtil.funcDef_ShadowLight, null], [RTShaderUtil.funcDef_ShadowTests, funcParam.pointlight], [RTShaderUtil.funcDef_Raytracing, funcParam.ambientSetting], [RTShaderUtil.funcDef_Main, null]];
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
            return "\n            float state = 12.2;\n            varying highp vec3 ray;\n            varying highp vec4 color;\n            varying highp vec2 tex;\n        ";
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
            var ret = "\n            precision highp float;\n        \n";
            ret += RTShaderUtil.uniformDefConcat(shaderMap);
            ret += RTShaderUtil.globalVarDefConcat();
            ret += RTShaderUtil.structDefConcat();
            ret += RTShaderUtil.funcDefConcat(funcParam);
            return ret;
        }
    }]);

    return RTShaderUtil;
}();