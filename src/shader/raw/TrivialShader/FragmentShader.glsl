varying lowp vec4 vColor;
varying vec3 vPosition;

void main() {
    gl_FragColor = vec4(vColor.x,vColor.y,vColor.z,vColor.w);
}