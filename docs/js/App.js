import * as THREE from 'three'
import dat from 'dat.gui'
THREE.OrbitControls = require('three-orbit-controls')(THREE)
// THREE.OrbitControls = require('three-orbit-controls')(THREE)


class Scene {
    constructor () {

        this.init()
    }

    init () {
        this.initSetup()
        this.initPoints()
    }

    initPoints () {
        let starsGeometry = new THREE.Geometry();

        for ( let i = 0; i < 10000; i ++ ) {

            let star = new THREE.Vector3();
            star.x = THREE.Math.randFloatSpread( 200 );
            star.y = THREE.Math.randFloatSpread( 200 );
            star.z = THREE.Math.randFloatSpread( 200 );

            starsGeometry.vertices.push( star );

        }

        let starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );

        let starField = new THREE.Points( starsGeometry, starsMaterial );

        this.scene.add( starField );

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

    update(time) {

    }
}


let scene = new Scene ()

function render(time) {

    scene.update(time)
    scene.renderer.render(scene.scene, scene.camera)
    requestAnimationFrame(render)
}
render()



