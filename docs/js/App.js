import * as THREE from 'three'
THREE.OrbitControls = require('three-orbit-controls')(THREE)

let scene = new THREE.Scene()

let renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
renderer.setClearColor(0xeefff999)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight-5)

let camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-5   ), 0.1, 3000)
camera.position.z = 200


let controls = new THREE.OrbitControls( camera )

let light1 = new THREE.AmbientLight( 0x888888, 0.5)
light1.position.set(50, 50, 50)
scene.add(light1)

let light2 = new THREE.PointLight( 0xffffff)
light2.position.set(50, 50, 50)
scene.add(light2)

let light3 = new THREE.PointLight( 0xffffff, 0.5)
light3.position.set(-50, -50, 50)
scene.add(light3)

// CONTAINERS OCH INNEHÅLL

let rotatedContainer = new THREE.Object3D()

rotatedContainer.position.set(0, 0, 0)
scene.add(rotatedContainer)

// toggla rotationen

// rotatedContainer.rotateX(0.5)
// rotatedContainer.rotateY(0.5)
// rotatedContainer.rotateZ(0.5)

let geometry = new THREE.BoxGeometry(20, 5, 10)
let material = new THREE.MeshLambertMaterial( {color: 0x0000ff} )
let mesh = new THREE.Mesh(geometry, material)

let geometry2 = new THREE.BoxGeometry(10, 20, 5)
let material2 = new THREE.MeshLambertMaterial( {color: 0xff00ff} )
let mesh2 = new THREE.Mesh(geometry2, material2)

mesh2.position.set(0, -20, 0)
rotatedContainer.add(mesh)
rotatedContainer.add(mesh2)


// BERÄKNINGAR FÖR LOOKAT

renderer.render(scene, camera)

let perspectiveVec = mesh.parent.worldToLocal( camera.position.clone() )
mesh.lookAt(perspectiveVec)

renderer.render(scene, camera)


// console.log(compRotation);
// console.log(mesh.quaternion);

function render() {
    let perspectiveVec = mesh.parent.worldToLocal( camera.position.clone() )
    mesh.lookAt(perspectiveVec)

    renderer.render(scene, camera)
    requestAnimationFrame(render)

}
render()








