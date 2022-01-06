#version 300 es
            precision lowp float;
            precision lowp int;
        

            struct sPlane{
                vec3 x,y,z;
                vec4 emissionColor;
                vec4 materialColor;
                
            };
        
            struct sRay{
                vec3 origin;
                vec3 direction;
                vec3 color;
            };
        
            struct sPhoton{
                vec3 position;
                vec3 direction;
                vec3 color;
            };

            //sPhoton photons[1200];

            //int phItr = 0;
            int pMaxIndex = 1200;
        
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
uniform sPhoton photons[1000];
uniform int phItr;

            uvec2 seeds = uvec2(1.0,1.0);
            in vec3 ray;
            in vec2 tex;
            out vec4 fragmentColor;
        
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
        
            sRay fDiffuseReflection(sRay inr,vec3 p,vec3 norm,float attenCoe){
                vec3 n = norm;
                n = n / length(n);
                if(dot(inr.direction,norm)>0.0){
                    n = -n;
                }
                vec3 o = uniformlyRandomDirectionNew();
                if(dot(o,n)<0.0){
                    o = -o;
                }
                sRay rt = sRay(p,o,inr.color*attenCoe);
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
                sRay ret = sRay(p,ox/length(ox),inr.color);
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
        
            void fPhotonMapGenerate(){
                int nEmittedPhotons = 30;
                float initCoe = 12.56;
                float reflectRate = 0.5;
                float N = 1.0;
                float attenCoe = reflectRate/N;
                int maxLoop = 60;
                float reflectRadio = 0.05;
                for(int i=0 ; i<nEmittedPhotons;i++){
                    vec3 random = uniformlyRandomDirectionNew();
                    if (random.y>0.0){
                        random = -random;
                    }
                    sRay r = sRay(vec3(0.6,0.5,7),random,vec3(1.0,1.0,1.0));
                    for(int j=0 ; j<maxLoop ; j++){
                        sRayCollisionResult hit = fRayCollision(r);
                        if(hit.collided == false){ 
                            break;
                        }
                        if(hit.hitType==1){
                            vec3 oldColor = r.color;
                            r = fDiffuseReflection(r,hit.colvex,hit.colnorm,attenCoe); 
                            r.color = r.color*hit.materialColor.xyz;
                            photons[phItr] = sPhoton(hit.colvex,r.direction,r.color);
                            phItr++;
                            if(phItr==pMaxIndex){
                                break;
                            }
                            // if(rng()<reflectRadio){
                            //     break;
                            // }
                        }
                        else if(hit.hitType==2){
                            r = fSpecularReflection(r,hit.colvex,hit.colnorm);
                        }
                    }
                    
                }
               
            }
        
            float fDistance(vec3 a, vec3 b){
                return sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)+(a.z-b.z)*(a.z-b.z));
            }
        
            void main(){
                seeds = uvec2(uint(uTime),uint(uTime));
                //fPhotonMapGenerate();
                const int loops = 10;
                vec3 nray = ray / length(ray);
                bool isDiffuse = false;
                sRay r = sRay(eye,nray,vec3(0,0,0));
                vec3 collidPos = vec3(0,0,0);
                vec3 collidDir = vec3(0,0,0);
                for(int i=0 ; i<loops ; i++){
                    sRayCollisionResult hit = fRayCollision(r);
                    if(hit.collided==false){
                        fragmentColor = vec4(0,0.5,0,1.0);
                        return;
                    }
                    if(hit.hitType==1){
                        isDiffuse = true;
                        collidPos = hit.colvex;
                        collidDir = r.direction;
                        break;
                    }
                    else if(hit.hitType==2){
                        r = fSpecularReflection(r,hit.colvex,hit.colnorm);
                    }
                }
                if(isDiffuse){
                    int nMin = 50;
                    int index[50];
                    for(int j=0;j<nMin;j++){
                        index[j] = -1;
                    }
                    float maxMinDis = -999999.0;

                    vec4 accColor = vec4(0.0,0.0,0.0,1.0);

                    for(int j=0;j<nMin;j++){

                        float minDis = 999999.0;
                        int minIndex = -1;
                        vec3 pos = vec3(0,0,0);
                        float dis = 0.0;
                        bool flag = true;
                        for(int i=0;i<phItr;i++){
                            dis = length(photons[i].position-collidPos);
                            if(dis<minDis){
                                for(int k=0;k<j;k++){
                                    if(index[k]==i){
                                        flag = false;
                                    }
                                }
                                if(flag){
                                    minDis = dis;
                                    minIndex = i;
                                }
                            }
                        }
                        if(minDis>maxMinDis){
                            maxMinDis = minDis;
                        }

                        float flux = dot(normalize(photons[minIndex].direction),collidDir);

                        accColor = accColor + vec4(max(flux,0.0)*photons[minIndex].color,1.0);

                    }

                    accColor = accColor/(maxMinDis*maxMinDis*3.14*float(phItr));

                    vec4 textc = texture(uTexture, vec2(1.0-tex.s,tex.t));
                    vec4 fragc = accColor;
                    // if(accColor.x<0.0 || accColor.y<0.0 || accColor.z<0.0 ){
                    //     fragmentColor = vec4(1.0,0.0,0.0,1.0);
                    //     return;
                    // }
                    fragmentColor = (textc*float(uSamples) + fragc)/(float(uSamples)+1.0);
                    fragmentColor.x = min(1.0,fragmentColor.x);
                    fragmentColor.y = min(1.0,fragmentColor.y);
                    fragmentColor.z = min(1.0,fragmentColor.z);
                    return;
                }

                

                vec4 textc = texture(uTexture, vec2(1.0-tex.s,tex.t));
                fragmentColor = (textc*float(uSamples))/(float(uSamples));
                return;
                // fragmentColor = vec4(1.0,0.0,0.0,1.0);
            }
        