//WGL帧缓冲处理
//该类辅助重定向渲染结果到贴图上
export class WGLFrameBuffer{
    constructor(gl){
        this.gl = gl
        this.fb = gl.createFramebuffer()
        this.depBuf = gl.createRenderbuffer()
        this.depth = false
    }
    bindTexture(attachment,texture,depth){
        let gl = this.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)
        gl.bindTexture(gl.TEXTURE_2D,texture.getTexture())
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment,gl.TEXTURE_2D, texture.getTexture(), texture, 0)
        this.depth = depth
        if(depth){
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.depBuf)
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture.getW(), texture.getH())
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depBuf)
        }
        gl.bindTexture(gl.TEXTURE_2D,null)
        gl.bindFramebuffer(gl.FRAMEBUFFER,null)
    }
    bindTexturePingPong(attachment,textureA,textureB){
        let gl = this.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)
        gl.bindTexture(gl.TEXTURE_2D,textureA.getTexture())
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment,gl.TEXTURE_2D, textureB.getTexture(), 0)
        gl.bindTexture(gl.TEXTURE_2D,null)
        gl.bindFramebuffer(gl.FRAMEBUFFER,null)
    }
    start(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.fb)
    }
    end(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null)
    }
}