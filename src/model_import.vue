<template></template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
const scene = new THREE.Scene();
const clock = new THREE.Clock();
// 坐标辅助线
const axesHelper = new THREE.AxesHelper(1001)
scene.add(axesHelper)

// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
camera.position.set(10, 1000, 10)
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// control
const controls = new OrbitControls(camera, renderer.domElement);

// 导入模型
const fbxLoader = new FBXLoader()
fbxLoader.load(
  './models/city.fbx',
  (object) => {
    object.scale.set(0.1, 0.1, 0.1)
    object.position.set(-1000, 0, 1000)
    scene.add(object)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)

// 两个光线：全局光和平行光
const light1 = new THREE.DirectionalLight(0xffffff, 1)
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
light1.position.set(10, 50, 100)
scene.add(light1)

// 渲染
function render() {
  controls.update(clock.getDelta())
  renderer.render(scene, camera);
  requestAnimationFrame(render)
}
render()
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
</style>