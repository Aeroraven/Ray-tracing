## Ray Tracing Renderer for WebGL

A clumsy attempt to re-implement ray tracing renderer based on WebGL. 

> NOTE: Before cloning or referring to this repository, read the WARNING section below.
> 
> 注意：在拉取或者参考本仓库前，请阅读本Readme的WARNING小节

### ⚠ WARNING & DISCLAIMER
[2023-09-28] Aeroraven: This repository might stay UNMAINTAINED for it serves as the archive of the course project.

[2023-09-28] Aeroraven: Path tracing (not including photon mapping) implementation details in this repository might be WRONG. Problems include sampling mistakes and incorrect material processing. These problems have already been alleviated in the new repo. For detailed information, visit: [https://github.com/Aeroraven/Aria/blob/main/Active-v2/src/examples/AriaStagePathTracing.ts](https://github.com/Aeroraven/Aria/blob/main/Aria-v2/src/examples/AriaStagePathTracing.ts)

### ⚠ 注意事项
[2025-04-18] Aeroraven: 本仓库的路径追踪（不包括报告和由HugePotatoMonster负责的光子映射部分）的实现存在较大的缺陷，包括的错误包括错误的采样方式和错误的材质处理。这个仓库仅用于存档，其中的致命问题已经在新的仓库中得到缓解，如果需要参考实现，请参阅下面修正后的仓库：
- **软件路径追踪 (片元着色器/WebGL2)**: [https://github.com/Aeroraven/Aria/blob/main/Active-v2/src/examples/AriaStagePathTracing.ts](https://github.com/Aeroraven/Aria/blob/main/Aria-v2/src/examples/AriaStagePathTracing.ts)
- **软件路径追踪 (计算着色器/Vulkan)**: [https://github.com/Aeroraven/Aria/blob/main/Anthem/demo/AD14_ComputeRayTracing.cpp](https://github.com/Aeroraven/Aria/blob/main/Anthem/demo/AD14_ComputeRayTracing.cpp)
- **硬件路径追踪 (硬件管线/Vulkan)**: [https://github.com/Aeroraven/Aria/blob/main/Anthem/demo/AD25B_CornellBox.cpp](https://github.com/Aeroraven/Aria/blob/main/Anthem/demo/AD25B_CornellBox.cpp)
- **软件光线追踪的全局光照 (计划中)**: [https://github.com/Aeroraven/Ifrit-v2/blob/dev/projects/runtime/src/renderer/AyanamiRenderer.cpp](https://github.com/Aeroraven/Ifrit-v2/blob/dev/projects/runtime/src/renderer/AyanamiRenderer.cpp)

---
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



  


### 5. Acknowledgements

Projects we used for reference have already been listed here: https://aeroraven.github.io/2022/02/23/cg-course-1-raytracing/ (In Simplified Chinese)

The document which contains acknowledgement is licensed under CC-BY-NC-SA 4.0 License
