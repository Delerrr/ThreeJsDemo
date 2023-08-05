<template>
  <div id="container" @click="clickOnBuilding"></div>
</template>
<script setup>
import * as THREE from "three";
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { gsap } from "gsap"
import { ref, onMounted, reactive } from 'vue'

const scene = new THREE.Scene();
const clock = new THREE.Clock();

// 坐标辅助线
const axesHelper = new THREE.AxesHelper(1001)
scene.add(axesHelper)

//cube（调试用）
const cubeGeometry = new THREE.BoxGeometry()
const cubeMeterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
const cube = new THREE.Mesh(cubeGeometry, cubeMeterial)
// cube.scale.set(400, 400, 400);


scene.add(cube)
const gui = new dat.GUI()
gui.add(cube.position, "x").min(-1000)
gui.add(cube.position, "y").min(-1000)
gui.add(cube.position, "z").min(-1000)
gui.add(cube.scale, "x").min(-1000)
gui.add(cube.scale, "y").min(-1000)
gui.add(cube.scale, "z").min(-1000)


// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10)
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)


// control
const controls = new OrbitControls(camera, renderer.domElement);

//sky 
let rgbLoader = new RGBELoader()
rgbLoader.load('./textures/sky.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

// 导入模型
const fbxLoader = new FBXLoader()
fbxLoader.load(
  './models/Demo.fbx',
  (object) => {
    // 使得模型中的1米等于这里的1米
    //object.scale.set(0.005, 0.005, 0.005)
    scene.add(object)
    // 遍历所有子对象并打印坐标
    object.children.forEach((child) => {
      console.log(child.position);
    });
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

// 相机位置切换
let timeLine1 = gsap.timeline()
let timeLine2 = gsap.timeline()
function moveCamera(pos, target) {
  console.log("position:")
  console.log(pos)
  timeLine1.to(camera.position, {
    x: pos.x,
    y: pos.y,
    z: pos.z,
    duration: 1,
    ease: "power2.inOut"
  })

  timeLine2.to(controls.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: "power2.inOut"
  })
}

const raycaster = new THREE.Raycaster();
const mousePoint = new THREE.Vector2();

function clickOnBuilding(event) {
  if (event.button != 2) {
    // console.log("button : " + event.button)
    // return
  }

  mousePoint.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePoint.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePoint, camera)

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects == null) {
    console.log("interset  null!")
  }
  if (intersects.length != 0) {
    console.log("intersects:")
    console.log(intersects)
    console.log("Each:")
    intersects.forEach((e) => console.log(e.point))
    // moveCamera(intersects[0].point, intersects[0].point)
  }
  // showPanel.value = true
  // console.log("positions length: " + ModelPositions.length)
  // console.log("modelIndex: " + modelIndex.value)
  // modelIndex.value++;
  // if (modelIndex.value >= ModelPositions.length) {
  //   modelIndex.value = 0
  // }
  // moveCamera(ModelPositions[modelIndex.value].cpos, ModelPositions[modelIndex.value].pos)
}

// 模型位置
const ModelData = [
  {
    pos: {
      x: 7.3008, y: 2.6361, z: 2.0999
    },
    name: "tower1"
  },
  {
    pos: {
      x: 11.863, y: 2.5937, z: 2.1228
    },
    name: "tower2"
  },
  {
    pos: {
      x: 10, y: 0, z: 0
    },
    name: "mainHouse"
  },
  {
    pos: {
      x: 7, y: -3, z: 0
    },
    name: "smallHouse1"
  },
  {
    pos: {
      x: 10, y: -3, z: 0
    },
    name: "smallHouse2"
  },
]


// 渲染
function render() {
  // update the picking ray with the camera and pointer position
  controls.update(clock.getDelta())
  renderer.render(scene, camera);
  requestAnimationFrame(render)
}
onMounted(() => {
  const element = document.getElementById("container")
  element.appendChild(renderer.domElement)
  render()
})
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