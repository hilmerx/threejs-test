import * as THREE from 'three'
import dat from 'dat.gui'
THREE.OrbitControls = require('three-orbit-controls')(THREE)
// THREE.OrbitControls = require('three-orbit-controls')(THREE)


class Scene {
    constructor () {

        this.init()
        this.color1 = [255, 255, 0]
        this.color2 = [255, 0, 0]
    }

    init () {
        this.initSetup()
        this.initPoints()
    }

    initPoints () {
        let starsGeometry = new THREE.Geometry()

        for ( let i = 0; i < 10; i ++ ) {

            let star = this.createStar(60)
            starsGeometry.vertices.push( star )

        }

        let starsMaterial = new THREE.PointsMaterial({
            color: 0xffff00, 
            map: new THREE.TextureLoader().load( 'assets/particle.png' ),
            size: 5,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })

        this.starField = new THREE.Points( starsGeometry, starsMaterial )
        this.scene.add( this.starField )
    }

    initSetup () {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
        this.renderer.setClearColor(0x180f2a)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight-5)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-5   ), 0.1, 3000)
        this.camera.position.x = 0
        this.camera.position.y = 40
        this.camera.position.z = 200

        this.controls = new THREE.OrbitControls( this.camera )

        this.gui = new dat.GUI()
        let guiEl = document.getElementsByClassName('dg main a')
        guiEl[0].addEventListener('mousedown', event  => {
            event.stopPropagation()
        })
    }
    updateStarField () {
        let stars = this.starField.geometry.vertices
        let goal = 60
        for (let i = stars.length-1; i >= 0; i--) {
            let diff = goal - stars[i].y
            stars[i].y += diff/10 * stars[i].speed
            stars[i].x += Math.sin(stars[i].y) * (diff/50)
            stars[i].z += Math.sin(stars[i].y) * (diff/50)



            if (stars[i].y > goal-1) {
                stars.splice(i, 1)
                let newStar = this.createStar(6)
                this.starField.geometry.vertices.push(newStar)
            }
        }    
        this.starField.geometry.verticesNeedUpdate = true
    }

    createStar (y) {
        let star = new THREE.Vector3()
        star.x = THREE.Math.randFloatSpread( 20 )
        star.y = THREE.Math.randFloatSpread( y )
        star.z = THREE.Math.randFloatSpread( 20 )
        star.speed = ((Math.random()*2)+1)/3

        return star
    }

    update(time) {
        this.updateStarField()
    }
}


let scene = new Scene ()

function render(time) {

    scene.update(time)
    scene.renderer.render(scene.scene, scene.camera)
    requestAnimationFrame(render)
}
render()



