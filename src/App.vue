<template>
  <div id="container" @click="clickOnBuilding"></div>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { gsap } from "gsap";
import { ref, onMounted, reactive } from "vue";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { WindShader } from "./shaders/windShader";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { MirrorShader } from "./shaders/MirrorShader";

//import vShader from "./scripts/wind_vertex.glsl";
//import fShader from "./scripts/wind.glsl";

let mousePos = { x: 0, y: 0 };
document.onmousemove = (e) => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
};

// 用于射线检测
let models = null;
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// 坐标辅助线
const axesHelper = new THREE.AxesHelper(1001);
scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

// var tobject = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), mat);
// tobject.position.y = 30;
//scene.add(tobject);
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

// 风暴
var tuniform = {
  iTime: { value: 0.1 },
  tDiffuse: { value: null },
};

var mat = new THREE.ShaderMaterial({
  uniforms: tuniform,
  vertexShader: WindShader.vertexShader,
  fragmentShader: WindShader.fragmentShader,
  side: THREE.DoubleSide,
});

composer.addPass(new ShaderPass(mat));
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

const loader = new GLTFLoader();

//Load a glTF resource
loader.load(
  // resource URL
  "models/substations.glb",
  // called when the resource is loaded
  function (gltf) {
    models = gltf.scene;
    scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
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
            pos = new THREE.Vector3(ob.position.x, ob.position.y, ob.position.z);
            //pos.multiplyScalar(scaleFactor);
            // 轮廓线
            outlinePass.selectedObjects = [ob];
          }
        });
        ob = ob.parent;
      }
      if (find) {
        break;
      }
    }
    if (pos != null) {
      // 点击到了模型
      let cameraPos = new THREE.Vector3(pos.x, pos.y + 20, pos.z + 20);
      moveCamera(cameraPos, pos);
    }
  }
}
// 模型数据
const ModelData = [
  {
    name: "House1",
  },
  {
    name: "House2",
  },
  {
    name: "House3",
  },
  {
    name: "House4",
  },
  {
    name: "Transformer1",
  },
  {
    name: "Transformer2",
  },
  {
    name: "breaker1",
  },
  {
    name: "breaker2",
  },
  {
    name: "breaker3",
  },
  {
    name: "breaker4",
  },
  {
    name: "breaker5",
  },
  {
    name: "breaker6",
  },
  {
    name: "breaker7",
  },
  {
    name: "breaker8",
  },
  {
    name: "breaker9",
  },
  {
    name: "breaker10",
  },
  {
    name: "breaker11",
  },
  {
    name: "breaker12",
  },
  {
    name: "breaker13",
  },
  {
    name: "breaker14",
  },
  {
    name: "breaker15",
  },
  {
    name: "breaker16",
  },
  {
    name: "breaker17",
  },
  {
    name: "breaker18",
  },
  {
    name: "CT1",
  },
  {
    name: "CT2",
  },
  {
    name: "CT3",
  },
  {
    name: "CT4",
  },
  {
    name: "CT5",
  },
  {
    name: "CT6",
  },
  {
    name: "CT7",
  },
  {
    name: "CT8",
  },
  {
    name: "CT9",
  },
];

// 渲染
function render() {
  // update the picking ray with the camera and pointer position
  controls.update(clock.getDelta());
  tuniform.iTime.value += clock.getDelta() * 1000;
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
