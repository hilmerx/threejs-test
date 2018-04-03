import * as THREE from 'three'
import dat from 'dat.gui'
THREE.OrbitControls = require('three-orbit-controls')(THREE)


class Scene {
    constructor () {

        this.settings = {
            cubeRotation: 0,
            light2PositionX: 0.0,
        }

        this.init()
    }

    init () {
        this.initSetup()
        this.init3D()
        this.initHelpers()
        this.initLights()
        this.initLookAtLogic()
    }


    initLookAtLogic() {
        let lookAtVec = new THREE.Vector3(0, 0, 0);

        this.camera.lookAt(lookAtVec)

        let camDistance = this.camera.position.distanceTo(lookAtVec)


        let meshPosWorld = this.mesh.getWorldPosition()

        let meshX = new THREE.Vector3(meshPosWorld.x, lookAtVec.y, lookAtVec.z)
        let meshY = new THREE.Vector3(lookAtVec.x, meshPosWorld.y, lookAtVec.z)

        let meshDistanceX = meshPosWorld.x - lookAtVec.x
        let meshDistanceY = meshPosWorld.y - lookAtVec.y

        let meshWorldPos
        let meshUpVector

        meshWorldPos = this.mesh.getWorldPosition()
        meshWorldPos.y += 1
        meshUpVector = this.mesh.worldToLocal( meshWorldPos.clone() )
        this.mesh.up = meshUpVector

    }

    initSetup () {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
        this.renderer.setClearColor(0x777777)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight-5)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.soft = true

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-5   ), 0.1, 3000)
        this.camera.position.x = 200
        this.camera.position.y = 200
        this.camera.position.z = 200
    }

    init3D () {
        let geometry3 = new THREE.BoxGeometry(10, 10, 10)
        let material3 = new THREE.MeshLambertMaterial( {color: 0xff0000} )
        this.mesh3 = new THREE.Mesh(geometry3, material3)
        this.mesh3.position.set(0, -35, 0)
        this.mesh3.castShadow = true

        this.scene.add(this.mesh3)

        // CONTAINERS OCH INNEHÅLL
        let rotBoxGeo = new THREE.BoxGeometry(20, 40, 20)
        let rotBoxMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, visible: false} )
        this.rotatedContainer = new THREE.Mesh(rotBoxGeo, rotBoxMaterial)

        this.rotatedContainer.position.set(-30, 0, 0)
        this.rotatedContainer.alphaTest = -1
        this.scene.add(this.rotatedContainer)

        // toggla rotationen

        this.rotatedContainer.rotateX(0.5)
        this.rotatedContainer.rotateY(0.5)
        this.rotatedContainer.rotateZ(0.5)

        let geometry = new THREE.BoxGeometry(20, 5, 10)
        let material = new THREE.MeshLambertMaterial( {color: 0x0000ff} )
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(0, 10, 0)
        this.mesh.castShadow = true

        let geometry2 = new THREE.BoxGeometry(10, 20, 5)
        let material2 = new THREE.MeshLambertMaterial( {color: 0xff00ff} )
        this.mesh2 = new THREE.Mesh(geometry2, material2)
        this.mesh2.position.set(0, -10, 0)
        this.mesh2.castShadow = true

        this.rotatedContainer.add(this.mesh)
        this.rotatedContainer.add(this.mesh2)

        let planeGeom = new THREE.PlaneGeometry(200, 200, 200, 200)
        let planeMaterial = new THREE.MeshLambertMaterial( {color: 0x283499} )
        this.plane = new THREE.Mesh(planeGeom, planeMaterial)

        this.plane.position.set(0, -40, 0)
        this.plane.rotation.x = -0.5 * Math.PI
        this.plane.receiveShadow = true  
        this.scene.add(this.plane)
    }

    initLights () {
        this.light1 = new THREE.AmbientLight( 0xffffff, 0.5)
        this.light1.position.set(50, 50, 50)

        this.scene.add(this.light1)

        this.light2 = new THREE.PointLight( 0xffffff, 0.5, 400)
        this.light2.position.set(50, 50, 50)
        this.light2.castShadow = true
        this.scene.add(this.light2)

        this.light3 = new THREE.PointLight( 0xffffff, 0.5, 400)
        this.light3.position.set(0, 50, -50)
        this.light3.castShadow = true
        this.scene.add(this.light3)


        this.light4 = new THREE.DirectionalLight( 0xffffff, 0.3)
        this.light4.position.set(50, 100, 50)
        this.light4.castShadow = true

        this.scene.add(this.light4)
    }

    initHelpers() {
        let axis = new THREE.AxesHelper(10)
        this.scene.add(axis)

        this.controls = new THREE.OrbitControls( this.camera )

        this.gui = new dat.GUI()

        this.meshHelper = new THREE.FaceNormalsHelper( this.mesh, 6, 0xff0000, 1 )
        this.rotatedContainerHelper = new THREE.FaceNormalsHelper( this.rotatedContainer, 6, 0x00ff00, 1 )
        // let box = new THREE.BoxHelper( rotatedContainer, 0x00ff00)
        // meshHelper.matrixAutoUpdate = true
        this.scene.add(this.meshHelper)
        this.scene.add(this.rotatedContainerHelper)

        this.gui.add(this.settings, 'cubeRotation', -0.1, 0.1).onChange( () => {
            console.log(this.settings.cubeRotation);
        })
    }

    update() {

        let perspectiveVec = this.mesh.parent.worldToLocal( this.camera.position.clone() )
        this.mesh.lookAt(perspectiveVec)

        this.mesh3.rotation.y += this.settings.cubeRotation

        this.meshHelper.update()

        this.rotatedContainerHelper.update()
    }
}


let scene = new Scene ()

function render() {

    scene.update()
    scene.renderer.render(scene.scene, scene.camera)
    requestAnimationFrame(render)
}
render()



