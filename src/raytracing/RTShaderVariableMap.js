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
    getSourceFragment(){
        let x = ''
        for(let el in this.hashmap){
            x+=el.type;
            x+=el.name;
            x+=';\n'
        }
        return x
    }
}

RTShaderVariableMap.VEC3 = 'vec3 '
RTShaderVariableMap.VEC4 = 'vec4 '
RTShaderVariableMap.VEC2 = 'vec2 '
RTShaderVariableMap.INT = 'int '
RTShaderVariableMap.BOOL = 'bool '
RTShaderVariableMap.DOUBLE = 'double '
RTShaderVariableMap.FLOAT = 'float '