//Raytracing: Fragment Shader 静态代码生成
export class RTShaderUtil{
    //结构体定义
    //Struct:Ray
    static structDef_Ray(){
        return `
            struct sRay{
                vec3 origin;
                vec3 direction;
                float inrefra;
            };
        `
    }
    //Struct:Plane
    static structDef_Plane(){
        return `
            struct sPlane{
                vec3 x,y,z;
                vec4 emissionColor;
                vec4 materialColor;
                
            };
        `
    }
    //Struct:Sphere
    static structDef_Sphere(){
        return `
            struct sSphere{
                vec3 c;
                float r;
                vec4 emissionColor;
                vec4 materialColor;
                
            };
        `
    }
    //Struct:RayCollisionResult
    static structDef_RayCollisionResult(){
        return `
            struct sRayCollisionResult{
                vec3 colvex;
                vec3 colnorm;
                bool collided;
                vec4 emissionColor;
                vec4 materialColor;
                int hitType;
                float refra;
            };
        `
    }


    //完成结构体定义
    static structDefConcat(){
        let lst = [
            RTShaderUtil.structDef_Plane,
            RTShaderUtil.structDef_Ray,
            RTShaderUtil.structDef_Sphere,
            RTShaderUtil.structDef_RayCollisionResult
        ]
        let ret = ""
        for(let i=0;i<lst.length;i++){
            ret += lst[i]()
        }
        return ret
    }

    //函数定义
    //Function:RayPoint 射线上的点
    static funcDef_RayPoint(){
        return `
            vec3 fRayPoint(sRay ray,float t){
                return  ray.origin+ t * ray.direction;
            }
        `
    }
    //Function:PlaneNorm 平面法向量
    static funcDef_PlaneNorm(){
        return `
            vec3 fPlaneNorm(sPlane p){
                return cross(p.y-p.x,p.z-p.y);
            }
        `
    }
    //Function:RayPlaneIntersection 射线和平面交点
    static funcDef_RayPlaneIntersection(){
        return `
            float fRayPlaneIntersection(sRay r,sPlane p){
                vec3 n = fPlaneNorm(p);
                vec3 di = r.direction;
                vec3 or = r.origin;
                vec3 a = p.y;
                float rd = dot(n,di);
                float rn = n.x*(a.x-or.x)+n.y*(a.y-or.y)+n.z*(a.z-or.z);
                return rn/rd;
            }
        `
    }
    //Function:RaySphereIntersection 射线和球体交点
    static funcDef_RaySphereIntersection(){
        return `
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
        `
    }

    //Function:InsidePlane 确定点在平面内部
    static funcDef_InsidePlane(){
        return`
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
        `
    }

    //Function:SpecularReflection 镜面反射
    static funcDef_SpecularReflection(){
        return `
            sRay fSpecularReflection(sRay inr,vec3 p,vec3 n){
                if(dot(inr.direction,n)>0.0){
                    n = -n;
                }
                vec3 ox = inr.direction/dot(inr.direction,n)+2.0*n;
                sRay ret = sRay(p,ox/length(ox),inr.inrefra);
                return ret;
            }
        `
    }

    // 折射dch
    // sRay inr:入射光线
    // judgeRefract函数注解：
    // vec3 p:入射点
    // vec3 N:入射点法线
    // float NiOverNt:折射率
    // sRay 射入光线
    static funcDef_tellRefract(){
        return `
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
        `
    }

    static funcDef_calRefract(){
        return `
            sRay calRefract(sRay inr,vec3 p,vec3 N,float matfra){
                vec3 UV= inr.direction/length(inr.direction);
                vec3 normvec = N/length(N);
                vec3 fnormvec = normvec;
                float Dt=dot(UV,normvec);
                float colfra=0.0;
                if(Dt<0.0){
                    colfra = 1.0/matfra;
                    fnormvec=normvec;
                }else{
                    colfra = matfra;
                    fnormvec=-fnormvec;
                }
                float Discriminant=colfra*colfra*(1.0-Dt*Dt);
                vec3 rfm = UV+fnormvec*abs(Dt);
                float cos2 = sqrt(1.0-Discriminant);
                float sin2 = sqrt(Discriminant);
                float cos1 = abs(Dt);
                float sin1 = sqrt(1.0-Dt*Dt);
                vec3 rfn = rfm*(sin2/cos2*cos1/sin1)-fnormvec*abs(Dt);
                
                sRay addrefra=sRay(p, rfn, 1.0);
                if(Dt>0.0){
                    addrefra.inrefra = 1.0;
                }else{
                    addrefra.inrefra = matfra;
                }
                return addrefra;
            }
        `
    }

    // 菲涅耳近似公式
    static funcDef_Schlick(){
        return `
            float calSchlick(cos,f0){
                return f0+(1-f0)*(1-cos)*(1-cos)*(1-cos)*(1-cos)*(1-cos);
            }
        `
    }


    //Function:RandNoiseV3 随机数
    static funcDef_RandNoiseV3(){
        return `
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
        `
    }

    // Ocean and Sky

    // math
    static funcDef_transVec(){
        return `
            vec2 transVec(vec3 invec) {
                vec2 outvec=vec2(0.0,0.0);
                outvec.x=1920.0*(atan(invec.x));
                outvec.y=1080.0*(atan(invec.y));
                return outvec;
            }
        `
    }

    static funcDef_fromEuler(){
        return `
            mat3 fromEuler(vec3 ang) {
                vec2 a1 = vec2(sin(ang.x),cos(ang.x));
                vec2 a2 = vec2(sin(ang.y),cos(ang.y));
                vec2 a3 = vec2(sin(ang.z),cos(ang.z));
                mat3 m;
                m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
                m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
                m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
                return m;
            }
        `
    }

    static funcDef_hash(){
        return `
            float hash( vec2 p ) {
                float h = dot(p,vec2(127.1,311.7));	
                return fract(sin(h)*43758.5453123);
            }
        `
    }

    static funcDef_noise(){
        return `
            float noise( vec2 p ) {
                vec2 i = floor( p );
                vec2 f = fract( p );	
                vec2 u = f*f*(3.0-2.0*f);
                return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                        hash( i + vec2(1.0,0.0) ), u.x),
                    mix( hash( i + vec2(0.0,1.0) ), 
                        hash( i + vec2(1.0,1.0) ), u.x), u.y);
            }
        `
    }

    // lighting
    static funcDef_diffuse(){
        return `
            float diffuse( vec3 n,vec3 l,float p ) {
                return pow(dot(n,l) * 0.4 + 0.6,p);
            }
        `
    }

    static funcDef_specular(){
        return `
            float specular( vec3 n,vec3 l,vec3 e,float s ) {
                float nrm = (s + 8.0) / (3.14 * 8.0);
                return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
            }
        `
    }

    // sky 
    static funcDef_getSkyColor(){
        return `
            vec3 getSkyColor( vec3 e ) {
                e.y = (max(e.y,0.0)*0.8+0.2)*0.8;
                return vec3((1.0-e.y)*(1.0-e.y), 1.0-e.y, 0.6+(1.0-e.y)*0.4) * 1.1;
            }
        `
    }

    // sea
    static funcDef_sea_octave(){
        return `
            float sea_octave( vec2 uv, float choppy ) {
                uv += noise(uv);        
                vec2 wv = 1.0-abs(sin(uv));
                vec2 swv = abs(cos(uv));    
                wv = mix(wv,swv,wv);
                return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
            }
        `
    }

    static funcDef_map(){
        return `
            float map( vec3 p ) {
                float freq = 0.16;
                float amp = 0.2;
                float choppy = 4.0;
                // float freq = SEA_FREQ;
                // float amp = SEA_HEIGHT;
                // float choppy = SEA_CHOPPY;
                // const int ITER_GEOMETRY = 3;
                // const int ITER_FRAGMENT = 5;
                // const float SEA_HEIGHT = 0.6;
                // const float SEA_CHOPPY = 4.0;
                // const float SEA_SPEED = 0.8;
                // const float SEA_FREQ = 0.16;

                // const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

                // float SEA_TIME = iGlobalTime * 0.8 + 100000.0;

                vec2 uv = p.xz; uv.x *= 0.75;
                float d, h = 0.0;    
                for(int i = 0; i < 3; i++) {        
                    d = sea_octave((uv)*0.16,4.0);
                    d += sea_octave((uv)*0.16,4.0);
                    h += d * 0.6;        
                    uv *= mat2(1.6,1.2,-1.2,1.6);
                    freq *= 1.9; amp *= 0.22;
                    choppy = mix(choppy,1.0,0.2);
                }
                return p.y - h;

            }
        `
    }

    static funcDef_map_detailed(){
        return `
            float map_detailed( vec3 p ) {
                float freq = 0.16;
                float amp = 0.6;
                float choppy = 4.0;

                vec2 uv = p.xz; uv.x *= 0.75;
                float d, h = 0.0;    
                for(int i = 0; i < 3; i++) {        
                    d = sea_octave((uv)*0.16,4.0);
                    d += sea_octave((uv)*0.16,4.0);
                    h += d * 0.6;        
                    uv *= mat2(1.6,1.2,-1.2,1.6);
                    freq *= 1.9; amp *= 0.22;
                    choppy = mix(choppy,1.0,0.2);
                }
                return p.y - h;

            }
        `
    }

    static funcDef_getSeaColor(){
        return `
            vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {

                float SEA_HEIGHT = 0.6;
                vec3 SEA_BASE = vec3(0.0,0.09,0.18);
                vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6)*0.6;

                float fresnel = clamp(1.0 - dot(n,-eye), 0.0, 1.0);
                fresnel = fresnel * fresnel * fresnel * 0.5;
                    
                vec3 reflected = getSkyColor(reflect(eye,n));    
                vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12; 
                
                vec3 color = mix(refracted,reflected,fresnel);
                
                float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
                color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
                
                color += vec3(specular(n,l,eye,60.0));
                
                return color;

            }
        `
    }

    // tracing
    static funcDef_getNormal(){
        return `
            vec3 getNormal( vec3 p, float eps ) {

                vec3 n;
                n.y = map_detailed(p);    
                n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
                n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
                n.y = eps;
                highp vec3 n_temp=normalize(n);
                return n_temp;

            }
        `
    }

    static funcDef_heightMapTracing(){
        return `
            float heightMapTracing( vec3 ori, vec3 dir, vec3 p ) {

                float tm = 0.0;
                float tx = 1000.0;    
                float hx = map(ori + dir * tx);
                if(hx > 0.0) {
                    p = ori + dir * tx;
                    return tx;   
                }
                float hm = map(ori + dir * tm);    
                float tmid = 0.0;
                for(int i = 0; i < 8; i++) {
                    tmid = mix(tm,tx, hm/(hm-hx));                   
                    p = ori + dir * tmid;                   
                    float hmid = map(p);
                    if(hmid < 0.0) {
                        tx = tmid;
                        hx = hmid;
                    } else {
                        tm = tmid;
                        hm = hmid;
                    }
                }
                return tmid;

            }
        `
    }

    static funcDef_getPixel(){
        return `vec3 getPixel(vec2 coord, float time){

                    vec2 iResolution=vec2(1920,1080);
                    vec2 uv = coord / iResolution.xy;
                    uv = uv * 2.0 - 1.0;
                    uv.x *= iResolution.x / iResolution.y;    
                        
                    // ray
                    vec3 ang = vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);    
                    vec3 ori = vec3(0.0,3.5,time*5.0);
                    vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.14;
                    dir = normalize(dir) * fromEuler(ang);
                    
                    // tracing
                    vec3 p;
                    heightMapTracing(ori,dir,p);
                    vec3 dist = p - ori;
                    vec3 n = getNormal(p, dot(dist,dist) * (0.1 / iResolution.x));
                    //highp vec3 n=n_temp
                    vec3 light = normalize(vec3(0.0,1.0,0.8)); 
                            
                    // color
                    return mix(
                        getSkyColor(dir),
                        getSeaColor(p,n,light,dir,dist),
                        pow(smoothstep(0.0,-0.02,dir.y),0.2));
        }`
    }

    // main函数，显示海洋和天空
    static funcDef_showOceanSky(){
        return`
            void showOceanSky(out vec4 fragColor, in vec2 fragCoord, float uTime){
                //float time = iTime * 0.3 + iMouse.x*0.01;
                float time=uTime*0.3;
                //float time=0.3;
                
                vec3 color = vec3(0.0);
                for(int i = -1; i <= 1; i++) {
                    for(int j = -1; j <= 1; j++) {
                        vec2 uv = fragCoord+vec2(i,j)/3.0;
                        color += getPixel(uv, time);
                    }
                }
                color /= 9.0;
                
                // post
                fragColor = vec4(pow(color,vec3(0.65)), 1.0);
            }
        `
    }

    //Function:DiffuseReflection 漫反射
    static funcDef_DiffuseReflection(){
        return `
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
        `
    }

    static funcDef_RayCollision(objects=""){
        return `
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
                `+objects+`
                vec3 colp = fRayPoint(r,t);
                sRayCollisionResult ret = sRayCollisionResult(colp,norm,collided,emicolor,matcolor,hitType,refra);
                return ret;
            }
        `
    }

    static funcDef_GammaCorrection(){
        return `
            vec4 fGammaCorrection(vec4 col,float g){
                return vec4(pow(col.x,g),pow(col.y,g),pow(col.z,g),pow(col.w,g));
            }
        `
    }

    static funcDef_ShadowLight(){
        return `
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
        `
    }
    static funcDef_ShadowTests(objects=""){
        return `
            float fShadowTests(vec3 cp){
                float intensity = 0.0;
                `+objects+`
                return intensity;
            }
        `
    }
    static funcDef_GlsryReflection(){
        return `
        sRay fGlsryReflection(sRay inr,vec3 p,vec3 norm){
            vec3 n = norm;
            n = n / length(n);
            if(dot(inr.direction,norm)>0.0){
                n = -n;
            }
            vec3 o = uniformlyRandomDirectionNew();
            if(dot(o,n)<0.0){
                o = -o;
            }
            vec3 ox = (inr.direction/dot(inr.direction,n)+2.0*n)+o;
            ox = ox/length(ox);
            sRay rt = sRay(p,ox,inr.inrefra);
            return rt;
        }
        `
    }
    //Function:Raytracing 光线追踪
    static funcDef_Raytracing(ambientSetting){
        return `
            vec4 fRaytracing(sRay r){
                sRay rp = r;
                vec4 accColor = vec4(0.0,0.0,0.0,1.0);
                vec4 accMaterial = vec4(1.0,1.0,1.0,1.0);
                vec4 ambient = vec4(0.0,0.0,0.0,1.0);
                vec4 skylight = vec4(0.0,0.0,0.0,1.0);
                `+ambientSetting+`
                vec2 rp_temp=transVec(rp.origin);
                
                showOceanSky(accColor,rp_temp,uTime);
                
                for(int i=1;i < 30;i+=1){
                    
                    rp.direction = rp.direction / length(rp.direction);
                    sRayCollisionResult hit = fRayCollision(rp);
                    if(hit.collided == false){
                        accColor = accColor + accMaterial * skylight; 
                        break;
                    }
                    accMaterial = accMaterial * hit.materialColor;
                    float rndsample = rng();

                    if(hit.hitType==1 || (rndsample<0.3&&hit.hitType==5)){
                        rp = fDiffuseReflection(rp,hit.colvex,hit.colnorm);
                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert;
                    }else if(hit.hitType==2){
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);
                        rp = fSpecularReflection(rp,hit.colvex,hit.colnorm);
                    }else if(hit.hitType==3 || (hit.hitType==5)){
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient);
                        rp=calRefract(rp,hit.colvex,hit.colnorm,hit.refra);
                    }else if(hit.hitType==0){
                        return accColor;
                    }else if(hit.hitType==4){
                        rp = fGlsryReflection(rp,hit.colvex,hit.colnorm);
                        float lambert = abs(dot(hit.colnorm,rp.direction))/length(hit.colnorm)/length(rp.direction);
                        accColor = accColor + accMaterial * (hit.emissionColor+ambient) * lambert;
                    }
                    rp.origin = rp.origin + rp.direction*0.002;
                    if(i>3&&accMaterial.x<1e-2&&accMaterial.y<1e-2&&accMaterial.z<1e-2){
                        break;
                    }
                }
               
                return accColor;
            }
        `
    }

    static funcDef_Main(){
        return `
            void main(){
                
                float loopsf = 1.0;
                float randsrng = 0.0005;
                const int loops = 1;
                vec3 nray = ray / length(ray);
                vec4 fragc = vec4(0.0,0.0,0.0,0.0);
                for(int i=0;i<loops;i++){
                    float px = float(uSamples)*loopsf+float(i);
                    seeds = uvec2(px, px + 2.0) * uvec2(gl_FragCoord);
                    fragc += fRaytracing(sRay(eye, nray + uniformlyRandomDirectionNew() * randsrng,1.0));
                }
                vec4 textc = texture(uTexture, vec2(1.0-tex.s,tex.t));
                fragc = fGammaCorrection(fragc/loopsf,0.40);
                fragmentColor = (textc*float(uSamples) + fragc)/(float(uSamples)+1.0);
            }
        `
    }
    //完成函数输出
    static funcDefConcat(funcParam){
        let lst = [
            [RTShaderUtil.funcDef_transVec,null],
            [RTShaderUtil.funcDef_fromEuler,null],
            [RTShaderUtil.funcDef_hash,null],
            [RTShaderUtil.funcDef_noise,null],
            [RTShaderUtil.funcDef_diffuse,null],
            [RTShaderUtil.funcDef_specular,null],
            [RTShaderUtil.funcDef_getSkyColor,null],
            [RTShaderUtil.funcDef_sea_octave,null],
            [RTShaderUtil.funcDef_map,null],
            [RTShaderUtil.funcDef_map_detailed,null],
            [RTShaderUtil.funcDef_getSeaColor,null],
            [RTShaderUtil.funcDef_getNormal,null],
            [RTShaderUtil.funcDef_heightMapTracing,null],
            [RTShaderUtil.funcDef_getPixel,null],
            [RTShaderUtil.funcDef_showOceanSky,null],    
            
            [RTShaderUtil.funcDef_GammaCorrection,null],
            [RTShaderUtil.funcDef_RandNoiseV3,null],
            [RTShaderUtil.funcDef_DiffuseReflection,null],
            [RTShaderUtil.funcDef_InsidePlane,null],
            [RTShaderUtil.funcDef_PlaneNorm,null],
            [RTShaderUtil.funcDef_GlsryReflection,null],
            [RTShaderUtil.funcDef_RayPlaneIntersection,null],
            [RTShaderUtil.funcDef_RaySphereIntersection,null],
            [RTShaderUtil.funcDef_RayPoint,null],
            [RTShaderUtil.funcDef_SpecularReflection,null],
            [RTShaderUtil.funcDef_calRefract,null],
            [RTShaderUtil.funcDef_tellRefract,null],
            [RTShaderUtil.funcDef_RayCollision,funcParam.intersection],
            [RTShaderUtil.funcDef_ShadowLight,null],
            [RTShaderUtil.funcDef_ShadowTests,funcParam.pointlight],
            [RTShaderUtil.funcDef_Raytracing,funcParam.ambientSetting],
            [RTShaderUtil.funcDef_Main,null]
        ]
        let ret = ""
        for(let i=0;i<lst.length;i++){
            console.log(lst[i][0])
            if(lst[i][1]===null){
                ret += lst[i][0]()
            }else{

                console.log(lst[i][1])
                ret += lst[i][0](lst[i][1])
            }
            
        }
        return ret
    }
    //变量输出
    static globalVarDefConcat(){
        return `
            uvec2 seeds = uvec2(1.0,1.0);
            in vec3 ray;
            in vec2 tex;
            out vec4 fragmentColor;
        `
    }
    //Uniform
    static uniformDefConcat(shaderMap){
        if(shaderMap==null){
            return ``
        }
        return shaderMap.getSourceFragment()
    }

    static getFragmentShader(funcParam,shaderMap){
        if(funcParam == null){
            funcParam = {
                intersection : ``,
                ambientSetting: ``,
                pointlight:``
            }
        }
        let ret = `#version 300 es
            precision lowp float;
            precision lowp int;
        \n`
        ret += RTShaderUtil.uniformDefConcat(shaderMap)
        ret += RTShaderUtil.globalVarDefConcat()
        ret += RTShaderUtil.structDefConcat();
        ret += RTShaderUtil.funcDefConcat(funcParam);
        return ret;
    }

}