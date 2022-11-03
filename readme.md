## Ray Tracing Renderer for WebGL

A clumsy attempt to re-implement ray tracing renderer based on WebGL.

### License
**Project Source Code**: AGPL 3.0
**Project Document**:  CC-BY-NC-SA 4.0


### Dependencies & Environment

- **Foundation**: WebGL
- **Javascript Package Management**: Node.js
- **Shader**: GLSL (OpenGL ES 3)
- **Mathematical Supports**: glMatrix
- **Deployment**: WebPack
- **ES6 Compiler**: Babel



### To Launch The Project

**Prerequisites**

- An appropriate GPU

- WebGL (Based on OpenGL ES 3.0 API)
- Node.js

**Commands**

Just run `npm run deploy`



### Features Supported

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

### Acknowledgements

Projects we used for reference have already been listed here: https://aeroraven.github.io/2022/02/23/cg-course-1-raytracing/ (In Simplified Chinese)
The document which contains acknowledgement is licensed under CC-BY-NC-SA 4.0 License
