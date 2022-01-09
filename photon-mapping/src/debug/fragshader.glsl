#version 300 es
            precision lowp float;
            precision lowp int;
        
uniform vec3 RTSphereground_VC;
uniform float RTSphereground_RA;
uniform vec4 RTSphereground_EM;
uniform vec4 RTSphereground_CL;
uniform vec3 RTSpheresphere1_VC;
uniform float RTSpheresphere1_RA;
uniform vec4 RTSpheresphere1_EM;
uniform vec4 RTSpheresphere1_CL;
uniform vec3 RTSpheresphere2_VC;
uniform float RTSpheresphere2_RA;
uniform vec4 RTSpheresphere2_EM;
uniform vec4 RTSpheresphere2_CL;
uniform vec3 RTSpherelight1_VC;
uniform float RTSpherelight1_RA;
uniform vec4 RTSpherelight1_EM;
uniform vec4 RTSpherelight1_CL;
uniform vec3 raylt;
uniform vec3 raylb;
uniform vec3 rayrb;
uniform vec3 rayrt;
uniform vec3 eye;
uniform vec4 RTAmbientLightundefined_CL;
uniform vec4 RTSkyLightundefined_CL;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform float uTime;
uniform int uSamples;
uniform sampler2D uTexture;

            float state = 12.2;
            in vec3 ray;
            in vec2 tex;
        
            struct sPlane{
                vec3 x,y,z;
                vec4 emissionColor;
                vec4 materialColor;
                
            };
        
            struct sRay{
                vec3 origin;
                vec3 direction;
            };
        
            struct sSphere{
                vec3 c;
                float r;
                vec4 emissionColor;
                vec4 materialColor;
                
            };
        
            struct sRayCollisionResult{
                vec3 colvex;
                vec3 colnorm;
                bool collided;
                vec4 emissionColor;
                vec4 materialColor;
                int hitType;
            };
        
            vec4 fGammaCorrection(vec4 col,float g){
                return vec4(pow(col.x,g),pow(col.y,g),pow(col.z,g),pow(col.w,g));
            }
        
            uvec2 seeds = uvec2(1);
            float rng()
            {
                seeds += uvec2(1);
                    uvec2 q = 1103515245U * ( (seeds >> 1U) ^ (seeds.yx) );
                    uint  n = 1103515245U * ( (q.x) ^ (q.y >> 3U) );
                return float(n) * (1.0 / float(0xffffffffU));
            }

            float random(vec3 scale, float seed) {
                return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) *  seed);
            }
            vec3 uniformlyRandomDirection() {
                float up = rng() * 2.0 - 1.0; // range: -1 to +1
                float over = sqrt( max(0.0, 1.0 - up * up) );
                float around = rng() * 6.28318530717;
                return normalize(vec3(cos(around) * over, up, sin(around) * over));	
            }
            float rand(vec2 co){
                return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
            }
            float fRandNoiseV3(vec3 x){
                float ret = rand(vec2(x.x+x.y+x.z,state));
                state += ret;
                return ret;
            }
        
            sRay fDiffuseReflection(sRay inr,vec3 p,vec3 norm){
                vec3 n = norm;
                n = n / length(n);
                if(dot(inr.direction,norm)>0.0){
                    n = -n;
                }
                vec3 o = uniformlyRandomDirection();
                if(dot(o,n)<0.0){
                    o = -o;
                }
                sRay rt = sRay(p,o);
                return rt;
            }
        
            bool fInsidePlane(sPlane p,vec3 v){
                vec3 v1 = p.x - v;
                vec3 v2 = p.y - v;
                vec3 v3 = p.z - v;
                float s1 = length(cross(v1,v2));
                float s2 = length(cross(v2,v3));
                float s3 = length(cross(v3,v1));
                float s0 = length(cross(p.y-p.x,p.z-p.x));
                if(abs(abs(s0)-abs(s1)-abs(s2)-abs(s3))<1e-5){
                    return true;
                }
                return false;
            }
        
            vec3 fPlaneNorm(sPlane p){
                return cross(p.y-p.x,p.z-p.y);
            }
        
            float fRayPlaneIntersection(sRay r,sPlane p){
                vec3 n = fPlaneNorm(p);
                vec3 di = r.direction;
                vec3 or = r.origin;
                vec3 a = p.y;
                float rd = dot(n,di);
                float rn = n.x*(a.x-or.x)+n.y*(a.y-or.y)+n.z*(a.z-or.z);
                return rn/rd;
            }
        
            float fRaySphereIntersection(sRay r,sSphere s){
                vec3 p = r.origin-s.c;
                float a = dot(r.direction,r.direction);
                float b = 2.0*(dot(r.direction,p));
                float delta = b*b-4.0*a*(dot(p,p)-s.r*s.r);
                if(delta<1e-10){
                    return -1.0;
                }else{
                    float sdelta = sqrt(delta);
                    float t1 = (-b+sdelta)/(2.0*a);
                    float t2 = (-b-sdelta)/(2.0*a);
                    if(t1>0.0&&t2>0.0){
                        if(t1>t2){
                            return t2;
                        }
                        return t1;
                    }
                    if(t1>0.0&&t2<0.0){
                        return t1;
                    }
                    return t2;
                }
                return 0.0;
            }
        
            vec3 fRayPoint(sRay ray,float t){
                return  ray.origin+ t * ray.direction;
            }
        
            sRay fSpecularReflection(sRay inr,vec3 p,vec3 n){
                if(dot(inr.direction,n)>0.0){
                    n = -n;
                }
                vec3 ox = inr.direction/dot(inr.direction,n)+2.0*n;
                sRay ret = sRay(p,ox/length(ox));
                return ret;
            }
        
            sRayCollisionResult fRayCollision(sRay r){
                float t = 1e30;
                vec3 norm = vec3(0.0,0.0,0.0);
                vec4 emicolor = vec4(1.0,1.0,1.0,1.0);
                vec4 matcolor = vec4(0.0,0.0,0.0,1.0);
                bool collided = false;
                float tc=1e30;
                int hitType = 0;
                bool colc = false;
                

                if(true){
                    sSphere sp = sSphere(RTSphereground_VC,RTSphereground_RA,RTSphereground_EM,RTSphereground_CL);
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0 && tc<t){
                        t=tc;
                        norm = fRayPoint(r,tc) - RTSphereground_VC;
                        emicolor = vec4(RTSphereground_EM);
                        matcolor = vec4(RTSphereground_CL);
                        hitType = 1;
                        collided=true;
                    }
                }
        

                if(true){
                    sSphere sp = sSphere(RTSpheresphere1_VC,RTSpheresphere1_RA,RTSpheresphere1_EM,RTSpheresphere1_CL);
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0 && tc<t){
                        t=tc;
                        norm = fRayPoint(r,tc) - RTSpheresphere1_VC;
                        emicolor = vec4(RTSpheresphere1_EM);
                        matcolor = vec4(RTSpheresphere1_CL);
                        hitType = 1;
                        collided=true;
                    }
                }
        

                if(true){
                    sSphere sp = sSphere(RTSpheresphere2_VC,RTSpheresphere2_RA,RTSpheresphere2_EM,RTSpheresphere2_CL);
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0 && tc<t){
                        t=tc;
                        norm = fRayPoint(r,tc) - RTSpheresphere2_VC;
                        emicolor = vec4(RTSpheresphere2_EM);
                        matcolor = vec4(RTSpheresphere2_CL);
                        hitType = 1;
                        collided=true;
                    }
                }
        

                if(true){
                    sSphere sp = sSphere(RTSpherelight1_VC,RTSpherelight1_RA,RTSpherelight1_EM,RTSpherelight1_CL);
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0 && tc<t){
                        t=tc;
                        norm = fRayPoint(r,tc) - RTSpherelight1_VC;
                        emicolor = vec4(RTSpherelight1_EM);
                        matcolor = vec4(RTSpherelight1_CL);
                        hitType = 1;
                        collided=true;
                    }
                }
        
                vec3 colp = fRayPoint(r,t);
                sRayCollisionResult ret = sRayCollisionResult(colp,norm,collided,emicolor,matcolor,hitType);
                return ret;
            }
        
            bool fShadowLight(vec3 light,vec3 cp){
                vec3 d = light - cp;
                vec3 s = cp;
                d = d/length(d);
                s = s + d*0.01;
                sRay r = sRay(s,d);
                if(fRayCollision(r).collided){
                    return true;
                }
                return false;
            }
        
            float fShadowTests(vec3 cp){
                float intensity = 0.0;
                
                return intensity;
            }
        
            vec4 fRaytracing(sRay r){
                sRay rp = r;
                vec4 accColor = vec4(0.0,0.0,0.0,1.0);
                vec4 accMaterial = vec4(1.0,1.0,1.0,1.0);
                vec4 ambient = vec4(0.0,0.0,0.0,1.0);
                vec4 skylight = vec4(0.0,0.0,0.0,1.0);
                
        ambient = vec4(RTAmbientLightundefined_CL);
        
        skylight = vec4(RTSkyLightundefined_CL);
        
                for(int i=1;i < 30;i+=1){
                    rp.direction = rp.direction / length(rp.direction);
                    sRayCollisionResult hit = fRayCollision(rp);
                    if(hit.collided == false){
                        accColor = accColor + accMaterial * skylight; 
                        break;
                    }
                    accMaterial = accMaterial * hit.materialColor;
                    if(hit.hitType==1){
                        rp = fDiffuseReflection(rp,hit.colvex,hit.colnorm);
                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert;
                    }else if(hit.hitType==2){
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);
                        rp = fSpecularReflection(rp,hit.colvex,hit.colnorm);
                    }
                    if(i>5&&accMaterial.x<1e-2&&accMaterial.y<1e-2&&accMaterial.z<1e-2){
                        break;
                    }
                }
                return accColor;
            }
        
            void main(){
                float loopsf = 1.0/20.0;
                float randsrng = 0.0001;
                const int loops = 20;
                vec3 nray = ray / length(ray);
                vec4 fragc = vec4(0.0,0.0,0.0,0.0);
                for(int i=0;i<loops;i++){
                    state += fRandNoiseV3(vec3(uTime,uTime+212.0,uTime+2.0));
                    fragc += fRaytracing(sRay(eye, nray + uniformlyRandomDirection() * randsrng));
                }
                vec4 textc = texture(uTexture, vec2(1.0-tex.s,tex.t));
                fragc = fGammaCorrection(fragc*loopsf,0.45);
                gl_FragColor = (textc*float(uSamples) + fragc)/(float(uSamples)+1.0);
            }
        