//Raytracing: Fragment Shader 静态代码生成
export class RTShaderUtil{
    //结构体定义
    //Struct:Ray
    static structDef_Ray(){
        return `
            struct sRay{
                vec3 origin;
                vec3 direction;
                vec3 color;
            };
        `
    }
    static structDef_Photon(){
        let insString = "\n"
        for(let i=0;i<5;i++){
            insString+="sPhoton photons_"+i+"[500];\n";
        }
        return `
            struct sPhoton{
                vec3 position;
                vec3 direction;
                vec3 color;
            };

            //sPhoton photonX[1200];`
            +insString+
            `
            int phItr = 0;
            int pMaxIndex = 1200;
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
            };
        `
    }


    //完成结构体定义
    static structDefConcat(){
        let lst = [
            RTShaderUtil.structDef_Plane,
            RTShaderUtil.structDef_Ray,
            RTShaderUtil.structDef_Photon,
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
                sRay ret = sRay(p,ox/length(ox),inr.color);
                return ret;
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
    //Function:DiffuseReflection 漫反射
    static funcDef_DiffuseReflection(){
        return `
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
                int hitType = 0;
                bool colc = false;
                `+objects+`
                vec3 colp = fRayPoint(r,t);
                sRayCollisionResult ret = sRayCollisionResult(colp,norm,collided,emicolor,matcolor,hitType);
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
        `
    }

    //Function:PhotonMap 光子贴图生成
    static funcDef_PhotonMapGenerate(){
        let insString =""
        for(let i=0;i<5;i++){
            insString+=`
                if(phItr>=`+i*500+`&&phItr<`+(i+1)*500+`){
                    photons_`+i+`[phItr-`+(i*500)+`]=sPhoton(hit.colvex,r.direction,r.color);
                }
            `
        }
        return `
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
                            `+insString+`
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
        `
    }

    static funcDef_Distance(){
        return `
            float fDistance(vec3 a, vec3 b){
                return sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)+(a.z-b.z)*(a.z-b.z));
            }
        `
    }

    static funcDef_Main(){
        let insStr = ""
        for(let i=0;i<5;i++){
            insStr+=`
                if(i>=`+i*500+`&&i<`+(i+1)*500+`){
                    tmp = photons_`+i+`[i-`+i*500+`];
                }
            `
        }
        let insStr2 = ""
        for(let i=0;i<5;i++){
            insStr2+=`
                if(minIndex>=`+i*500+`&&minIndex<`+(i+1)*500+`){
                    tmp2 = photons_`+i+`[minIndex-`+i*500+`];
                }
            `
        }
        return `
            void main(){
                seeds = uvec2(uint(uTime),uint(uTime));
                fPhotonMapGenerate();
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
                            sPhoton tmp = photons_1[0];
                            `+insStr+`
                            dis = length(tmp.position-collidPos);
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
                        sPhoton tmp2 = photons_1[0];
                        `+insStr2+`
                        float flux = dot(normalize(tmp2.direction),collidDir);

                        accColor = accColor + vec4(max(flux,0.0)*tmp2.color,1.0);

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
            [RTShaderUtil.funcDef_RayPlaneIntersection,null],
            [RTShaderUtil.funcDef_RaySphereIntersection,null],
            [RTShaderUtil.funcDef_RayPoint,null],
            [RTShaderUtil.funcDef_SpecularReflection,null],
            [RTShaderUtil.funcDef_RayCollision,funcParam.intersection],
            [RTShaderUtil.funcDef_PhotonMapGenerate,null],
            [RTShaderUtil.funcDef_Distance,null],
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