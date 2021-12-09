//Raytracing: Fragment Shader 动态代码生成
export class RTShaderDynanicUtil{

    static colToCode(color){
        return `vec4(`+parseFloat(color.r)+','+parseFloat(color.g)+','+parseFloat(color.b)+','+parseFloat(color.a)+`)`
    }

    static vecToCode(vec){
        return `vec3(`+parseFloat(vec.x)+','+parseFloat(vec.y)+','+parseFloat(vec.z)+`)`
    }

    //生成相交判断的Shader代码
    //judge 相交判定: tc 交点距离; coll 是否碰撞
    //succ 碰撞成功
    static genIntersectionJudge(judge,succ){
        let ret =custom
        ret += `
            if(coll==true && tc < t){
                t = tc;
                `+succ+
                `
            }
        `
    }
}