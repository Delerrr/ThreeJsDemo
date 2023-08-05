<template>
  <div id="container" @click="clickOnBuilding"></div>
</template>
<script setup>
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { gsap } from "gsap";
import { ref, onMounted, reactive } from "vue";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

// 用于射线检测
let models = null;
// 导入模型后坐标放大了100倍,故缩回去
let scaleFactor = 0.01;
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// 坐标辅助线
const axesHelper = new THREE.AxesHelper(1001);
scene.add(axesHelper);

//cube（调试用）
// const cubeGeometry = new THREE.BoxGeometry();
// const cubeMeterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
// cube.scale.set(400, 400, 400);
// scene.add(cube);
// const gui = new dat.GUI();
// gui.add(cube.position, "x").min(-1000);
// gui.add(cube.position, "y").min(-1000);
// gui.add(cube.position, "z").min(-1000);
// gui.add(cube.scale, "x").min(-1000);
// gui.add(cube.scale, "y").min(-1000);
// gui.add(cube.scale, "z").min(-1000);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 后处理(轮廓线)
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);
composer.addPass(outlinePass);
// const textureLoader = new THREE.TextureLoader();
// textureLoader.load("textures/tri_pattern.jpg", function (texture) {
//   outlinePass.patternTexture = texture;
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.wrapT = THREE.RepeatWrapping;
// });
const outputPass = new OutputPass();
composer.addPass(outputPass);

// control
const controls = new OrbitControls(camera, renderer.domElement);

//sky
let rgbLoader = new RGBELoader();
rgbLoader.load("./textures/sky.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 导入模型
const fbxLoader = new FBXLoader();
fbxLoader.load(
  "./models/Demo.fbx",
  (object) => {
    object.position.set(0, 0, 0);
    // 使得模型中的1米等于这里的1米
    object.scale.multiplyScalar(scaleFactor);
    models = object;
    scene.add(object);
  },

  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

// 两个光线：全局光和平行光
const light1 = new THREE.DirectionalLight(0xffffff, 1);
const light = new THREE.AmbientLight(0x404040); // soft white light
light1.position.set(10, 50, 100);
scene.add(light);
scene.add(light1);

// 相机位置切换
let timeLine1 = gsap.timeline();
let timeLine2 = gsap.timeline();
function moveCamera(pos, target) {
  timeLine1.to(camera.position, {
    x: pos.x,
    y: pos.y,
    z: pos.z,
    duration: 1,
    ease: "power2.inOut",
  });

  timeLine2.to(controls.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: "power2.inOut",
  });
}

const raycaster = new THREE.Raycaster();
const mousePoint = new THREE.Vector2();

function clickOnBuilding(event) {
  if (event.button != 2) {
  }

  mousePoint.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePoint.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePoint, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObject(models);
  if (intersects.length != 0) {
    let find = false;
    // 如果找到了,就把模型位置存下来
    let pos = null;
    for (let i = 0; i < intersects.length; ++i) {
      let ob = intersects[i].object;
      while (!find) {
        if (ob == null) {
          break;
        }
        // 是否点击到了模型
        ModelData.forEach((data) => {
          if (ob.name === data.name) {
            find = true;
            // 轮廓线
            outlinePass.selectedObjects = [ob];
          }
          pos = new THREE.Vector3(ob.position.x, ob.position.y, ob.position.z);
          pos.multiplyScalar(scaleFactor);
        });
        ob = ob.parent;
      }
      if (find) {
        break;
      }
    }
    if (pos != null) {
      // 点击到了模型
      let cameraPos = new THREE.Vector3(pos.x, pos.y + 1.5, pos.z + 2);
      moveCamera(cameraPos, pos);
    }
  }
}

// 模型数据
const ModelData = [
  {
    name: "tower1",
  },
  {
    name: "tower2",
  },
  {
    name: "mainHouse",
  },
  {
    name: "smallHouse1",
  },
  {
    name: "smallHouse2",
  },
];

// 渲染
function render() {
  // update the picking ray with the camera and pointer position
  controls.update(clock.getDelta());
  composer.render();
  requestAnimationFrame(render);
}
onMounted(() => {
  const element = document.getElementById("container");
  element.appendChild(renderer.domElement);
  scene.updateMatrixWorld(true);
  render();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

#container {
  width: 100%;
  height: 100%;
}
</style>
