#### Ray Tracing
A ray tracing demo using WebGL & ECMAScript2015(ES6)



##### 运行
使用 `npm run serve` 在  http://localhost:1551 上查看结果



##### 使用的工具
- Webpack

- WebGL

- Babel

- glMatrix

- glNoise

  

##### 组件

- Lights

  - RTAmbientLight 环境光照
  - RTPointLight 点光源：就是点光源
  - RTSkyLight 天空光照：在反射光线无法碰到物体时，使用天空光照定义的光线样式

- Geometry

  - RTPlane 平面
  - RTSphere 球体

  

##### 机制

- Ping-pong Scheme / Ping-pong 机制

  - https://en.wikipedia.org/wiki/Ping-pong_scheme
  
- Lambert's Model  / Lambert 漫反射光照模型
  - https://en.wikipedia.org/wiki/Lambert%27s_cosine_law
  
- Gamma Correction / Gamma 修正

- Whitted's Ray Tracing Algorithm 

  - https://courses.cs.washington.edu/courses/cse457/21au/assets/lectures/

  

