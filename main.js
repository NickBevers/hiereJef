import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(1, 0.5, 200, 200);
const material = new THREE.MeshLambertMaterial({ color: 0xa56347 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Load gltf model
let robotModel;
const loader = new GLTFLoader();
loader.load(
  "/models/robot/scene.gltf",
  function (gltf) {
    robotModel = gltf.scene;
    scene.add(robotModel);

    robotModel.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(0x00ff00);
      }
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.log('An error happened');
  }
);

//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add sphere
const sphereTexture = new THREE.TextureLoader().load('/textures/galaxy.webp');
const sphereGeometry = new THREE.SphereGeometry(20, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ map: sphereTexture });
sphereMaterial.side = THREE.BackSide;
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);  
scene.add(sphere);


// add sphere
const sphereTexture2 = new THREE.TextureLoader().load('/textures/earth.png');

const addEarth = (x, y, z) => {
  const sphereGeometry2 = new THREE.SphereGeometry(0.5, 32, 32);
  const sphereMaterial2 = new THREE.MeshLambertMaterial({ map: sphereTexture2 });
  const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
  sphere2.position.set(x, y, z);
  scene.add(sphere2);
}

[...Array(5)].forEach(() => {
  const x = Math.random() * 20 - 10;
  const y = Math.random() * 20 - 10;
  const z = Math.random() * 20 - 10;
  addEarth(x, y, z);
})


camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  camera.position.x += 0.01;
  camera.position.y += 0.01;
  camera.lookAt(cube.position);

  controls.update();

  renderer.render(scene, camera);
};

animate();


document.querySelector(".recolor").addEventListener("click", () => {
  robotModel.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xffffff);
    }
  });
});