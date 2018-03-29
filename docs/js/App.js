import * as THREE from 'three'
THREE.OrbitControls = require('three-orbit-controls')(THREE)

let scene = new THREE.Scene()

let renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
renderer.setClearColor(0x777777)
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
let rotBoxGeo = new THREE.BoxGeometry(20, 40, 20)
let rotBoxMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, visible: false} )
let rotatedContainer = new THREE.Mesh(rotBoxGeo, rotBoxMaterial)

rotatedContainer.position.set(0, 0, 0)
rotatedContainer.alphaTest = -1
scene.add(rotatedContainer)

// toggla rotationen

rotatedContainer.rotateX(0.5)
rotatedContainer.rotateY(0.5)
rotatedContainer.rotateZ(0.5)

let geometry = new THREE.BoxGeometry(20, 5, 10)
let material = new THREE.MeshLambertMaterial( {color: 0x0000ff} )
let mesh = new THREE.Mesh(geometry, material)
// mesh.position.set(0, 10, 0)

let geometry2 = new THREE.BoxGeometry(10, 20, 5)
let material2 = new THREE.MeshLambertMaterial( {color: 0xff00ff} )
let mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.position.set(0, -10, 0)

let unrotatedContainer = new THREE.Object3D()
unrotatedContainer.position.set(0, 10, 0)

unrotatedContainer.add(mesh)
rotatedContainer.add(unrotatedContainer)
rotatedContainer.add(mesh2)

let floorGeo = new THREE.BoxGeometry(200, 3, 200)
let floorMaterial = new THREE.MeshLambertMaterial( {color: 0x283499} )
let floorMesh = new THREE.Mesh(floorGeo, floorMaterial)
floorMesh.position.set(0, -40, 0)
scene.add(floorMesh)

// HELPERS 

let meshHelper = new THREE.FaceNormalsHelper( mesh, 6, 0xff0000, 1 )
let rotatedContainerHelper = new THREE.FaceNormalsHelper( rotatedContainer, 6, 0x00ff00, 1 )
// let box = new THREE.BoxHelper( rotatedContainer, 0x00ff00)
// meshHelper.matrixAutoUpdate = true
scene.add(meshHelper)
scene.add(rotatedContainerHelper)


// BERÄKNINGAR FÖR LOOKAT


// let unrotatedWorldPos = unrotatedContainer.getWorldPosition()
// let unrotatedLookAtTarget = unrotatedWorldPos
// unrotatedLookAtTarget.y += 100
// let unrotatedLookAtVec = unrotatedContainer.parent.worldToLocal( unrotatedLookAtTarget.clone() )

// unrotatedLookAtVec.x = 1
// unrotatedContainer.lookAt(unrotatedLookAtVec)
let meshWorldPos
let meshUpVector

meshWorldPos = mesh.getWorldPosition()
meshWorldPos.y += 1
meshUpVector = mesh.worldToLocal( meshWorldPos.clone() )

// scene.add(box)
let val1 = 0.01
// let val2 = 0.01
// let axis = new mesh.parent.worldToLocal( camera.position.clone() )
let axis = new THREE.Vector3(0,1,1)
function render() {

    let perspectiveVec = mesh.parent.worldToLocal( camera.position.clone() )
    perspectiveVec
    mesh.up = meshUpVector
    mesh.lookAt(perspectiveVec)
    // mesh.rotation.z = val1
    // val1 += 0.01
    meshHelper.update()
    rotatedContainerHelper.update()

    renderer.render(scene, camera)
    requestAnimationFrame(render)

}
render()








