import { Log } from "../core/Log"

//Raytracing: Uniform 常量映射表
export class RTShaderVariableMap{
    constructor(){
        this.hashmap = {}
    }
    insert(varName,initValue,type){
        this.hashmap[varName] = {}
        this.hashmap[varName].type = type
        this.hashmap[varName].initValue = initValue
        this.hashmap[varName].name = varName
    }
    clear(){
        this.hashmap = {}
    }
    getSourceFragment(){
        let x = ''
        for(let el in this.hashmap){
            let e = this.hashmap[el]
            x+="uniform "
            x+=e.type;
            x+=e.name;
            x+=';\n'
        }
        return x
    }
    bindShaderVarible(gl,shaderProgram){
        for(let el in this.hashmap){
            let e = this.hashmap[el]
            let u = gl.getUniformLocation(shaderProgram,e.name)
            Log.log("Binding uniform variable:"+el+"( "+e.type+")")
            Log.log(e.initValue)
            if(e.type==RTShaderVariableMap.MAT4){
                gl.uniformMatrix4fv(u,false,e.initValue)
            }
            if(e.type==RTShaderVariableMap.VEC3){
                gl.uniform3fv(u,e.initValue)
            }
            if(e.type==RTShaderVariableMap.VEC4){
                gl.uniform4fv(u,e.initValue)
            }
            if(e.type==RTShaderVariableMap.VEC2){
                gl.uniform2fv(u,e.initValue)
            }
            if(e.type==RTShaderVariableMap.INT){
                gl.uniform1i(u,e.initValue)
            }
            if(e.type==RTShaderVariableMap.FLOAT){
                gl.uniform1f(u,e.initValue)
            }
            
        }
    }
}

RTShaderVariableMap.MAT4 = 'mat4 '
RTShaderVariableMap.VEC3 = 'vec3 '
RTShaderVariableMap.VEC4 = 'vec4 '
RTShaderVariableMap.VEC2 = 'vec2 '
RTShaderVariableMap.INT = 'int '
RTShaderVariableMap.BOOL = 'bool '
RTShaderVariableMap.FLOAT = 'float '