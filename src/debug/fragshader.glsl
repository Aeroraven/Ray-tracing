#version 300 es
            precision lowp float;
            precision lowp int;
        
uniform vec3 RTSphereground_VC;
uniform float RTSphereground_RA;
uniform vec4 RTSphereground_EM;
uniform float RTSphereground_RF;
uniform vec4 RTSphereground_CL;
uniform vec3 RTSpheresphere1_VC;
uniform float RTSpheresphere1_RA;
uniform vec4 RTSpheresphere1_EM;
uniform float RTSpheresphere1_RF;
uniform vec4 RTSpheresphere1_CL;
uniform vec3 RTSpheresphere2_VC;
uniform float RTSpheresphere2_RA;
uniform vec4 RTSpheresphere2_EM;
uniform float RTSpheresphere2_RF;
uniform vec4 RTSpheresphere2_CL;
uniform vec3 RTSpherelight1_VC;
uniform float RTSpherelight1_RA;
uniform vec4 RTSpherelight1_EM;
uniform float RTSpherelight1_RF;
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

            uvec2 seeds = uvec2(1.0,1.0);
            in vec3 ray;
            in vec2 tex;
            out vec4 fragmentColor;
        
            struct sPlane{
                vec3 x,y,z;
                vec4 emissionColor;
                vec4 materialColor;
                
            };
        
            struct sRay{
                vec3 origin;
                vec3 direction;
                float inrefra;
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
                float refra;
            };
        
            vec4 fGammaCorrection(vec4 col,float g){
                return vec4(pow(col.x,g),pow(col.y,g),pow(col.z,g),pow(col.w,g));
            }
        
            float rng()
            {
                seeds += uvec2(1);
                uvec2 q = 1103515245U * ( (seeds >> 1U) ^ (seeds.yx) );
                uint  n = 1103515245U * ( (q.x) ^ (q.y >> 3U) );
                return float(n) * (1.0 / float(0xffffffffU));
            }
            vec3 uniformlyRandomDirectionNew() {
                float up = rng() * 2.0 - 1.0; 
                float over = sqrt( max(0.0, 1.0 - up * up) );
                float around = rng() * 6.28318530717;
                return normalize(vec3(cos(around) * over, up, sin(around) * over));	
            }
        
            sRay fDiffuseReflection(sRay inr,vec3 p,vec3 norm){
                vec3 n = norm;
                n = n / length(n);
                if(dot(inr.direction,norm)>0.0){
                    n = -n;
                }
                vec3 o = uniformlyRandomDirectionNew();
                if(dot(o,n)<0.0){
                    o = -o;
                }
                sRay rt = sRay(p,o,inr.inrefra);
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
        
            sRay calRefract(sRay inr,vec3 p,vec3 N,float NiOverNt){
                vec3 UV= inr.direction/length(inr.direction);
                N = N/length(N);
                float Dt=dot(UV,N);
                if(Dt>0.0){
                    NiOverNt = 1.0/NiOverNt;
                }
                float Discriminant=1.0-NiOverNt*NiOverNt*(1.0-Dt*Dt);

                vec3 refta_direction=NiOverNt*(UV-N*Dt)-N*sqrt(Discriminant);
                
                vec3 rfm = UV+N*Dt;
                float cos2 = sqrt(1.0-Discriminant);
                float sin2 = sqrt(Discriminant);
                float cos1 = Dt;
                float sin1 = sqrt(1-Dt*Dt);
                vec3 rfn = rfm*(sin2/cos2*cos1/sin1)-N*Dt;

                sRay addrefra=sRay(p, rfn, 1.0);
                if(Dt>0.0){
                    addrefra.inrefra = 1.0;
                }else{
                    addrefra.inrefra = NiOverNt;
                }
                return addrefra;
            }
        
            bool judgeRefract(sRay inr,vec3 p,vec3 N,float NiOverNt){
                vec3 UV= inr.direction/length(inr.direction);
                float Dt=dot(UV,N);
                N = N/length(N);
                float Discriminant=1.0-NiOverNt*NiOverNt*(1.0-Dt*Dt);
                if(Discriminant>0.0){
                    return true;
                }
                else
                  return false;
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
                sRay ret = sRay(p,ox/length(ox),inr.inrefra);
                return ret;
            }
        
            sRayCollisionResult fRayCollision(sRay r){
                float t = 1e30;
                vec3 norm = vec3(0.0,0.0,0.0);
                vec4 emicolor = vec4(1.0,1.0,1.0,1.0);
                vec4 matcolor = vec4(0.0,0.0,0.0,1.0);
                bool collided = false;
                float tc=1e30;
                float refra = 1.0;
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
                        refra = RTSphereground_RF;
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
                        refra = RTSpheresphere1_RF;
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
                        hitType = 3;
                        refra = RTSpheresphere2_RF;
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
                        refra = RTSpherelight1_RF;
                        collided=true;
                    }
                }
        
                vec3 colp = fRayPoint(r,t);
                sRayCollisionResult ret = sRayCollisionResult(colp,norm,collided,emicolor,matcolor,hitType,refra);
                return ret;
            }
        
            bool fShadowLight(vec3 light,vec3 cp){
                vec3 d = light - cp;
                vec3 s = cp;
                d = d/length(d);
                s = s + d*0.01;
                sRay r = sRay(s,d,1.0);
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
                    float NiOverNt= rp.inrefra;
            
                    //bool judge_refract=judgeRefract(rp,hit.colvex,hit.colnorm,NiOverNt);
                    bool judge_refract=false;
                    if(judge_refract==true){
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);
                        rp = calRefract(r,hit.colvex,hit.colnorm,NiOverNt);
                        continue;
                    }

                    if(hit.hitType==1){
                        rp = fDiffuseReflection(rp,hit.colvex,hit.colnorm);
                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert;
                    }else if(hit.hitType==2){
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);
                        rp = fSpecularReflection(rp,hit.colvex,hit.colnorm);
                    }else if(hit.hitType==3){
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);
                        rp = calRefract(r,hit.colvex,hit.colnorm,rp.inrefra/hit.refra);
                        continue;
                    }

                    if(i>5&&accMaterial.x<1e-2&&accMaterial.y<1e-2&&accMaterial.z<1e-2){
                        break;
                    }
                }
                return accColor;
            }
        
            void main(){
                
                float loopsf = 60.0;
                float randsrng = 0.00005;
                const int loops = 60;
                vec3 nray = ray / length(ray);
                vec4 fragc = vec4(0.0,0.0,0.0,0.0);
                for(int i=0;i<loops;i++){
                    float px = float(uSamples)*loopsf+float(i);
                    seeds = uvec2(px, px + 2.0) * uvec2(gl_FragCoord);
                    fragc += fRaytracing(sRay(eye, nray + uniformlyRandomDirectionNew() * randsrng,1.0));
                }
                vec4 textc = texture(uTexture, vec2(1.0-tex.s,tex.t));
                fragc = fGammaCorrection(fragc/loopsf,0.45);
                fragmentColor = (textc*float(uSamples) + fragc)/(float(uSamples)+1.0);
            }
        