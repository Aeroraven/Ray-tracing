//WGL纹理
export class WGLTexture{
    constructor(gl,width,height,pixels){
        this.w = width
        this.h = height
        this.gl = gl
        this.tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.tex)
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this.w,this.h,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels)
        gl.bindTexture(gl.TEXTURE_2D,null)
    }
    disableMips(){
        let gl = this.gl
        gl.bindTexture(gl.TEXTURE_2D,this.tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D,null)
    }
    getTexture(){
        return this.tex
    }
    start(){
        this.gl.bindTexture(this.gl.TEXTURE_2D,this.tex)
    }
    end(){
        this.gl.bindTexture(this.gl.TEXTURE_2D,null)
    }
    getW(){
        return this.w
    }
    getH(){
        return this.h
    }
    updateTexture(pixels){
        window.i=pixels
        let gl = this.gl
        gl.bindTexture(gl.TEXTURE_2D, this.tex)
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,pixels)
        gl.bindTexture(gl.TEXTURE_2D,null)
    }
    loadImageAsync(src){
        const image = new Image();
        const parent = this
        image.onload = function() {
            parent.updateTexture(image)
        }
        image.src = src
    }
}