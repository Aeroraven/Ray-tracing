## Ray Tracing Renderer for WebGL

A clumsy attempt to re-implement ray tracing renderer based on WebGL. 

NOTE: Before cloning or referring to this repository, read the WARNING section below.


### 1. License
**Project Source Code**: AGPL 3.0

**Project Document**:  CC-BY-NC-SA 4.0


### 2.Dependencies & Environment

- **Foundation**: WebGL
- **Javascript Package Management**: Node.js 
- **Mathematical Supports**: glMatrix
- **Deployment**: WebPack


### 3. To Launch The Project

**Prerequisites**

- An appropriate GPU

- WebGL2
- Node.js

**Commands**

Just run `npm run deploy`



### 4. Features Supported

- **Algorithms**:
  - Path Tracing Algorithm
  - Photon Mapping Algorithm (By HugePotatoMonster(https://github.com/HugePotatoMonster))

- **Optimization**:
  - Ping Pong Texture
  - Monte Carlo Integration
  
- **Materials**:
  - Ideal Rough Surface (Diffuse Reflection)
  - Metal Surface
  - Ideal Specular Surface
  - Transparent Glass Surface (Lens)
  - Frosted Glass Surface


### WARNING & DISCLAIMER
[2023-09-28] Aeroraven: This repository might stay UNMAINTAINED for it serves as the archive of the course project.

[2023-09-28] Aeroraven: Path tracing (not including photon mapping) implementation details in this repository might be WRONG. Problems include sampling mistakes and incorrect material processing. These problems have already been alleviated in the new repo. For detailed information, visit: https://github.com/Aeroraven/Aria/blob/main/Active-v2/src/examples/AriaStagePathTracing.ts


### 5. Acknowledgements

Projects we used for reference have already been listed here: https://aeroraven.github.io/2022/02/23/cg-course-1-raytracing/ (In Simplified Chinese)

The document which contains acknowledgement is licensed under CC-BY-NC-SA 4.0 License
