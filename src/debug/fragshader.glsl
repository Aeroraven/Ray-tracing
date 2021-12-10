
            precision highp float;
        
uniform vec3 RTSpheresphere1_VC;
uniform float RTSpheresphere1_RA;
uniform vec4 RTSpheresphere1_EM;
uniform vec4 RTSpheresphere1_CL;
uniform vec3 RTSpheresphere2_VC;
uniform float RTSpheresphere2_RA;
uniform vec4 RTSpheresphere2_EM;
uniform vec4 RTSpheresphere2_CL;
uniform vec3 RTSpheresphere4_VC;
uniform float RTSpheresphere4_RA;
uniform vec4 RTSpheresphere4_EM;
uniform vec4 RTSpheresphere4_CL;
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
            varying highp vec3 ray;
            varying highp vec4 color;
            varying highp vec2 tex;
        
            struct sPlane{
                vec3 x,y,z;
                vec4 emissionColor;
                vec4 materialColor;
                
            };
        
            struct sRay{
                vec3 origin;
                vec3 direction;
                vec4 color;
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
        
            vec3 mod289(vec3 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
            
            vec4 mod289(vec4 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
            
            vec4 permute(vec4 x) {
                return mod289(((x*34.0)+10.0)*x);
            }
            
            vec4 taylorInvSqrt(vec4 r)
            {
                return 1.79284291400159 - 0.85373472095314 * r;
            }
            
            float snoise(vec3 v)
                { 
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 =   v - i + dot(i, C.xxx) ;
            
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
            
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy; 
                vec3 x3 = x0 - D.yyy;      
            
                i = mod289(i); 
                vec4 p = permute( permute( permute( 
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            
                float n_ = 0.142857142857; // 1.0/7.0
                vec3  ns = n_ * D.wyz - D.xzx;
            
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
            
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
            
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
            
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
            
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
            
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
            
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
            

                vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                            dot(p2,x2), dot(p3,x3) ) );
            }
            float fRandNoiseV3(vec3 x){
                state += snoise(x+vec3(state,state+144.13,151.49))+24.89;
                return snoise(x+vec3(state+613.5,state+644.11,state+593.4));
            }
        
            sRay fDiffuseReflection(sRay inr,vec3 p,vec3 norm){
                vec3 n = norm;
                n = n / length(n);
                if(dot(inr.direction,norm)>0.0){
                    n = -n;
                }
                float fx = fRandNoiseV3(vec3(n.y+state,n.x+state,n.z+state));
                float fy = fRandNoiseV3(vec3(fx,state,fx));
                float dx = sin(fx)*cos(fy);
                float dy = sin(fx)*sin(fy);
                float dz = cos(fy);
                vec3 tp = vec3(dx,dy,dz)/length(vec3(dx,dy,dz));
                vec3 newdir = tp;
                if(dot(newdir,n)<0.0){
                    newdir = -newdir;
                }
                vec3 o = newdir / length(newdir);
                sRay rt = sRay(p,o,inr.color);
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
                vec3 x = p.y-p.x;
                vec3 y = p.z-p.y;
                return cross(x,y);
            }
        
            float fRayPlaneIntersection(sRay r,sPlane p){
                vec3 n = fPlaneNorm(p);
                vec3 di = r.direction;
                vec3 or = r.origin;
                vec3 a = p.y;
                float rd = n.x*di.x+n.y*di.y+n.z*di.z;
                float rn = n.x*(a.x-or.x)+n.y*(a.y-or.y)+n.z*(a.z-or.z);
                return rn/rd;
            }
        
            float fRaySphereIntersection(sRay r,sSphere s){
                vec3 p = r.origin-s.c;
                vec3 d = r.direction;
                float a = d.x*d.x+d.y*d.y+d.z*d.z;
                float b = 2.0*(d.x*p.x+d.y*p.y+d.z*p.z);
                float c = p.x*p.x+p.y*p.y+p.z*p.z-s.r*s.r;
                float delta = b*b-4.0*a*c;
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
                vec3 ret = ray.origin;
                ret = ret + t * ray.direction;
                return ret;
            }
        
            sRay fSpecularReflection(sRay inr,vec3 p,vec3 norm){
                vec3 n = norm;
                n = n/length(n);
                if(dot(inr.direction,norm)>0.0){
                    n = -n;
                }
                vec3 ix = inr.direction/dot(inr.direction,n);
                vec3 ox = ix+2.0*n;
                vec3 o = ox/length(ox);
                sRay ret = sRay(p,o,inr.color);
                return ret;



            }
        
            sRayCollisionResult fRayCollision(sRay r){
                float t = 1e30;
                vec3 norm = vec3(0.0,0.0,0.0);
                vec4 emicolor = vec4(1.0,0.0,0.0,1.0);
                vec4 matcolor = vec4(0.0,0.0,0.0,1.0);
                bool collided = false;
                float tc=1e30;
                int hitType = 0;
                bool colc = false;
                

                if(true){
                    sSphere sp = sSphere(RTSpheresphere1_VC,RTSpheresphere1_RA,RTSpheresphere1_EM,RTSpheresphere1_CL);
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0){
                        vec3 ip = fRayPoint(r,tc);
                        if(tc<t){
                            t=tc;
                            norm = ip - RTSpheresphere1_VC;
                            emicolor = vec4(RTSpheresphere1_EM);
                            matcolor = vec4(RTSpheresphere1_CL);
                            hitType = 1;
                            collided=true;
                        }
                        
                    }
                }
        

                if(true){
                    sSphere sp = sSphere(RTSpheresphere2_VC,RTSpheresphere2_RA,RTSpheresphere2_EM,RTSpheresphere2_CL);
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0){
                        vec3 ip = fRayPoint(r,tc);
                        if(tc<t){
                            t=tc;
                            norm = ip - RTSpheresphere2_VC;
                            emicolor = vec4(RTSpheresphere2_EM);
                            matcolor = vec4(RTSpheresphere2_CL);
                            hitType = 1;
                            collided=true;
                        }
                        
                    }
                }
        

                if(true){
                    sSphere sp = sSphere(RTSpheresphere4_VC,RTSpheresphere4_RA,RTSpheresphere4_EM,RTSpheresphere4_CL);
                    tc = fRaySphereIntersection(r,sp);
                    if(tc>0.0){
                        vec3 ip = fRayPoint(r,tc);
                        if(tc<t){
                            t=tc;
                            norm = ip - RTSpheresphere4_VC;
                            emicolor = vec4(RTSpheresphere4_EM);
                            matcolor = vec4(RTSpheresphere4_CL);
                            hitType = 1;
                            collided=true;
                        }
                        
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
                vec4 accMaterial = vec4(0.99,0.99,0.99,1.0);
                vec4 ambient = vec4(0.0,0.0,0.0,1.0);
                vec4 skylight = vec4(0.0,0.0,0.0,1.0);
                
        ambient = vec4(RTAmbientLightundefined_CL);
        
        skylight = vec4(RTSkyLightundefined_CL);
        
                for(int i=1;i < 25;i+=1){
                    sRayCollisionResult hit = fRayCollision(rp);
                    if(hit.collided == false){
                        accColor = accColor + accMaterial * skylight; 
                        break;
                    }
                    accMaterial = accMaterial * hit.materialColor;
                    float shadowIntensity = fShadowTests(hit.colvex);
                    if(hit.hitType==1){
                        rp = fDiffuseReflection(rp,hit.colvex,hit.colnorm);
                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert * lambert;
                    }else if(hit.hitType==2){
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);
                        rp = fSpecularReflection(rp,hit.colvex,hit.colnorm);
                    }
                }
                return accColor;
            }
        
            void main(){
                state += fRandNoiseV3(vec3(uTime,uTime+212.0,uTime+2.0));
                float loopsf = 1.0;
                float randsrng = 0.0005;
                const int loops = 1;

                vec3 nray = ray / length(ray);
                vec3 rnd = vec3(1.14+state,5.14+state,1.91+state+uTime);
                vec4 fragc = vec4(0.0,0.0,0.0,0.0);
                for(int i=0;i<loops;i++){
                    float r1 = fRandNoiseV3(rnd);
                    rnd = vec3(rnd.y,rnd.z,r1);
                    float r2 = fRandNoiseV3(rnd);
                    rnd = vec3(rnd.y,rnd.z,r2);
                    float r3 = fRandNoiseV3(rnd);
                    rnd = vec3(rnd.y,rnd.z,r3);
                    nray = nray + rnd * randsrng;
                    nray = nray / length(nray);

                    sRay r = sRay(eye,nray,vec4(0.0,0.0,0.0,0.0));
                    fragc = fRaytracing(r)/loopsf + fragc;
                }
                vec4 textc = texture2D(uTexture, vec2(1.0-tex.s,tex.t));
                fragc = vec4(min(fragc.x,1.0),min(fragc.y,1.0),min(fragc.z,1.0),1.0);
                fragc = fGammaCorrection(fragc,0.62);
                gl_FragColor = (textc*float(uSamples) + fragc)/(float(uSamples)+1.0);
            }
        