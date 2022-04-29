## Ray Tracing Renderer for WebGL

A clumsy attempt to re-implement ray tracing renderer based on WebGL & ES6.



#### Dependencies & Environment

- **Foundation**: WebGL & ECMAScript 2015
- **Javascript Package Management**: Node.js
- **Shader**: GLSL (OpenGL ES 3)
- **Mathematical Supports**: glMatrix
- **Deployment**: WebPack
- **ES6 Compiler**: Babel



#### To Launch The Project

**Prerequisites**

- An appropriate GPU

- WebGL (Based on OpenGL ES 3.0 API)
- Node.js

**Commands**

Just run `npm run deploy`



#### Features Supported

- **Algorithms**:
  - Path Tracing Algorithm
  - Photon Mapping Algorithm (By HugePotatoMonster(https://github.com/HugePotatoMonster))
- **Geometry**:
  - Sphere
  - Planar Composites (Triangle, Tetrahedron)
- **Optimization**:
  - Ping Pong Texture
  - Monte Carlo Integration
- **Materials**:
  - Ideal Rough Surface (Diffuse Reflection)
  - Metal Surface
  - Ideal Specular Surface
  - Transparent Glass Surface (Lens)
  - Frosted Glass Surface

- **Miscellaneous Features**:
  - Encapsulated Camera
  - Customized Light Configuration

