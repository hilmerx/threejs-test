import * as THREE from 'three'
import dat from 'dat.gui'
THREE.OrbitControls = require('three-orbit-controls')(THREE)
// THREE.OrbitControls = require('three-orbit-controls')(THREE)


class Scene {
    constructor () {

        this.dirLightSettings = {
            intensity: 0.2,
            dirLightHelper: true,
            position: new THREE.Vector3(0, 250, -250),
            color: [255, 255, 255],
            shadow: {
                near: 280,
                far: 710,
                left: -450,
                right: 200,
                top: 330,
                bottom: -50
            }
        }

        this.campfireLightSettings = {
            intensity: 1,
            baseLineIntensity: 0.5,
            campfireLightHelper: true,
            position: new THREE.Vector3(-102, 16, 55),
            color: [255, 45, 0],
            decay: 0.5,
            distance: 106,
            shadow: {
                near: 280,
                far: 710,
                left: -1150,
                right: 200,
                top: 330,
                bottom: -350
            }
        }

        this.init()
    }

    init () {
        this.initSetup()
        this.initLocalMeshes()
        this.initSceneImports()
        this.initLights()
        this.initHelpers()

        this.updateLights()
        // this.toggleDirLightHelper()
        this.initLookAtLogic()
    }




    initSetup () {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
        this.renderer.setClearColor(0x180f2a)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight-5)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
,

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-5   ), 0.1, 3000)
        this.camera.position.x = -270
        this.camera.position.y = 50
        this.camera.position.z = 35
    }

    initLocalMeshes () {
        let geometry3 = new THREE.BoxGeometry(10, 10, 10)
        let material3 = new THREE.MeshLambertMaterial( {color: 0xff0000} )
        this.mesh3 = new THREE.Mesh(geometry3, material3)
        this.mesh3.position.set(0, -35, 0)
        this.mesh3.castShadow = true

        // this.scene.add(this.mesh3)

        // CONTAINERS OCH INNEHÅLL
        let rotBoxGeo = new THREE.BoxGeometry(20, 40, 20)
        let rotBoxMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true, visible: false} )
        this.rotatedContainer = new THREE.Mesh(rotBoxGeo, rotBoxMaterial)

        this.rotatedContainer.position.set(0, 0, 0)
        this.rotatedContainer.alphaTest = -1

        let geometry = new THREE.BoxGeometry(20, 5, 10)
        let material = new THREE.MeshLambertMaterial( {color: 0x0000ff} )
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(50, 10, 0)
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
        // this.scene.add(this.plane)
    }

    initSceneImports () {
        let texture = new THREE.TextureLoader()
            .load('models/lowpoly_tex.png')

        let loader = new THREE.ObjectLoader()
            .load('models/lowpolyscene.json', (obj) => {
                obj.traverse( child => {
                    child.material = new THREE.MeshLambertMaterial()
                    child.material.map = texture
                })
                obj.scale.multiplyScalar(20)
                this.scene.add(obj)
            })
    }

    initLights () {
        this.light1 = new THREE.AmbientLight( 0x180f2a, 0.1)
        this.light1.position.set(50, 50, 50)

        this.scene.add(this.light1)

        this.light2 = new THREE.PointLight( 0xffffff, 0.5, 400)
        this.light2.position.set(50, 50, 50)
        this.light2.castShadow = true
        // this.scene.add(this.light2)

        this.campfireLight = new THREE.PointLight( 0xffffff, 0, 400)
        this.campfireLight.position.set(0, 50, -50)
        this.campfireLight.castShadow = true
        this.scene.add(this.campfireLight)

        this.dirLight = new THREE.DirectionalLight()
        this.dirLight.castShadow = true
        // this.dirLight.shadow.mapSize.width = 512;  // default
        // this.dirLight.shadow.mapSize.height = 512; // default


        this.scene.add(this.dirLight)


        // this.light4 = new THREE.DirectionalLight( 0xffffff, 0.3)
        // this.light4.position.set(50, 100, 50)
        // this.light4.castShadow = true

        // this.scene.add(this.light4)
    }

    initHelpers() {
        this.controls = new THREE.OrbitControls( this.camera )

        this.gui = new dat.GUI()
        let guiEl = document.getElementsByClassName('dg main a')
        guiEl[0].addEventListener('mousedown', event  => {
            event.stopPropagation()
        })

        // this.campfireLightHelper = new THREE.PointLightHelper(this.campfireLight)
        // this.scene.add(this.campfireLightHelper)


        this.dirLightFolder = this.gui.addFolder('DirectionalLight')
        this.dirLightFolder.open()

        this.dirLightFolder.add(this.dirLightSettings, 'intensity', 0, 1).onChange( val => {
            this.updateLights()
        })
        this.dirLightFolder.addColor(this.dirLightSettings, 'color').onChange( val => {
            this.updateLights()
        })
        this.dirLightFolder.add(this.dirLightSettings, 'dirLightHelper').onChange( () => {
            this.toggleDirLightHelper()
        })

        this.dirLightPosFolder = this.dirLightFolder.addFolder('Position')
        this.dirLightPosFolder.open()

        this.dirLightPosFolder.add(this.dirLightSettings.position, 'x').onChange(() => {
            this.updateLights()
        })
        this.dirLightPosFolder.add(this.dirLightSettings.position, 'y').onChange( () => {
            this.updateLights()
        })
        this.dirLightPosFolder.add(this.dirLightSettings.position, 'z').onChange( () => {
            this.updateLights()
        })

        this.dirLightShadowFolder = this.dirLightFolder.addFolder('Shadows')
        this.dirLightShadowFolder.open()

        for (let key in this.dirLightSettings.shadow) {
            this.dirLightShadowFolder.add(this.dirLightSettings.shadow, key).onChange( () => {
                this.updateLights()
            })
        }


        this.campfireLightFolder = this.gui.addFolder('Campfire Light')
        this.campfireLightFolder.open()

        this.campfireLightFolder.add(this.campfireLightSettings, 'intensity', 0, 1).onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.addColor(this.campfireLightSettings, 'color').onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.add(this.campfireLightSettings, 'decay', 0, 1).onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.add(this.campfireLightSettings, 'distance', 0, 1000).onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.add(this.campfireLightSettings, 'campfireLightHelper').onChange( () => {
            // this.toggleDirLightHelper()
        })


        this.campfireLightPosFolder = this.campfireLightFolder.addFolder('Position')
        this.campfireLightPosFolder.open()

        this.campfireLightPosFolder.add(this.campfireLightSettings.position, 'x').onChange(() => {
            this.updateLights()
        })
        this.campfireLightPosFolder.add(this.campfireLightSettings.position, 'y').onChange( () => {
            this.updateLights()
        })
        this.campfireLightPosFolder.add(this.campfireLightSettings.position, 'z').onChange( () => {
            this.updateLights()
        })

        this.campfireLightShadowFolder = this.campfireLightFolder.addFolder('Shadows')
        this.campfireLightShadowFolder.open()

        for (let key in this.campfireLightSettings.shadow) {
            this.campfireLightShadowFolder.add(this.campfireLightSettings.shadow, key).onChange( () => {
                this.updateLights()
            })
        }

    }

    updateLights () {
        this.updateDirLights()
        this.updateCampfireLights()
    }

    updateDirLights () {
        let light = this.dirLight
        let settings = this.dirLightSettings
        light.position.copy(settings.position)
        light.intensity = settings.intensity
        light.shadow.camera.near = settings.shadow.near
        light.shadow.camera.far = settings.shadow.far
        light.shadow.camera.left = settings.shadow.left
        light.shadow.camera.right = settings.shadow.right
        light.shadow.camera.top = settings.shadow.top
        light.shadow.camera.bottom = settings.shadow.bottom

        light.color.setRGB(settings.color[0]/256, settings.color[1]/256, settings.color[2]/256)

        light.shadow.camera.updateProjectionMatrix()

    }

    updateCampfireLights () {
        let light = this.campfireLight
        let settings = this.campfireLightSettings
        light.position.copy(settings.position)
        light.intensity = settings.intensity
        light.decay = settings.decay
        light.distance = settings.distance
        light.shadow.camera.near = settings.shadow.near
        light.shadow.camera.far = settings.shadow.far
        light.shadow.camera.left = settings.shadow.left
        light.shadow.camera.right = settings.shadow.right
        light.shadow.camera.top = settings.shadow.top
        light.shadow.camera.bottom = settings.shadow.bottom

        light.color.setRGB(settings.color[0]/256, settings.color[1]/256, settings.color[2]/256)

        light.shadow.camera.updateProjectionMatrix()

    }

    toggleDirLightHelper () {
        if (!this.dirLightHelper) {
            this.dirLightHelper = new THREE.DirectionalLightHelper(this.dirLight)
            this.scene.add(this.dirLightHelper)

            this.dirLightShadowHelper = new THREE.CameraHelper( this.dirLight.shadow.camera )
            this.scene.add( this.dirLightShadowHelper )

        } else {
            this.scene.remove(this.dirLightHelper)
            this.dirLightHelper = undefined

            this.scene.remove( this.dirLightShadowHelper )
            this.dirLightShadowHelper = undefined
        }
    }

    initLookAtLogic () {
        let lookAtVec = new THREE.Vector3(0, 0, 0);


        let meshCloneGeo = new THREE.BoxGeometry(10, 20, 5)
        let meshCloneMat = new THREE.MeshLambertMaterial( {color: 0xff00ff} )
        this.meshCloneMesh = new THREE.Mesh(meshCloneGeo, meshCloneMat)
        this.meshCloneMesh.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z)

        this.camera.add(this.meshCloneMesh)

        this.camera.getWorldPosition()
        this.meshCloneMesh.getWorldPosition()
        


        let perspectiveVecClone = this.mesh.parent.worldToLocal( this.meshCloneMesh.getWorldPosition() )
        let perspectiveVecCamera = this.mesh.parent.worldToLocal( this.camera.position.clone() )

        this.mesh.lookAt(perspectiveVecClone )
        // let meshX = new THREE.Vector3(meshPosWorld.x, lookAtVec.y, lookAtVec.z)
        // let meshY = new THREE.Vector3(lookAtVec.x, meshPosWorld.y, lookAtVec.z)

        // let meshDistanceX = meshPosWorld.x - lookAtVec.x
        // let meshDistanceY = meshPosWorld.y - lookAtVec.y

        let meshWorldPos
        let meshUpVector

        meshWorldPos = this.mesh.getWorldPosition()
        meshWorldPos.y += 1
        meshUpVector = this.mesh.worldToLocal( meshWorldPos.clone() )
        this.mesh.up = meshUpVector

    }

    animateCampfire (time) {
        if (time >= 0) {
            let deltaTime1 = (time%1000)/(1000/2)
            let deltaTime2 = (time%400)/(400/2)
            let deltaTime3 = (time%2456)/(2456/2)
            let deltaTime4 = (time%1200)/(1000/2)
            this.campfireLight.intensity = deltaTime1 + deltaTime2 + deltaTime3 + deltaTime4 + this.campfireLightSettings.baseLineIntensity

        }
    }


    update(time) {
        this.animateCampfire(time)
    }
}


let scene = new Scene ()

function render(time) {

    scene.update(time)
    scene.renderer.render(scene.scene, scene.camera)
    requestAnimationFrame(render)
}
render()



