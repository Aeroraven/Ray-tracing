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
                if(delta<1e-4){
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
                if(abs(abs(s0)-abs(s1)-abs(s2)-abs(s3))<1e-2){
                    return true;
                }
                return false;
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
                for(int i=1;i < 10;i+=1){
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
                    }else if(hit.hitType==2 ){
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
                
                float loopsf = 10.0;
                float randsrng = 0.00005;
                const int loops = 10;
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
        `
    }
    //完成函数输出
    static funcDefConcat(funcParam){
        let lst = [
            [RTShaderUtil.funcDef_GammaCorrection,null],
            [RTShaderUtil.funcDef_RandNoiseV3,null],
            [RTShaderUtil.funcDef_DiffuseReflection,null],
            [RTShaderUtil.funcDef_InsidePlane,null],
            [RTShaderUtil.funcDef_PlaneNorm,null],
            [RTShaderUtil.funcDef_calRefract,null],
            [RTShaderUtil.funcDef_tellRefract,null],
            [RTShaderUtil.funcDef_GlsryReflection,null],
            [RTShaderUtil.funcDef_RayPlaneIntersection,null],
            [RTShaderUtil.funcDef_RaySphereIntersection,null],
            [RTShaderUtil.funcDef_RayPoint,null],
            [RTShaderUtil.funcDef_SpecularReflection,null],
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
            precision highp float;
            precision lowp int;
        \n`
        ret += RTShaderUtil.uniformDefConcat(shaderMap)
        ret += RTShaderUtil.globalVarDefConcat()
        ret += RTShaderUtil.structDefConcat();
        ret += RTShaderUtil.funcDefConcat(funcParam);
        return ret;
    }

}