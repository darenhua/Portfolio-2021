import './style/main.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import Stats from 'stats.js';
import createMeter from './meter.js'
import textEnter from './textAnimation';

function createMachine(stateMachineDefinition) {
    const machine = {
      value: stateMachineDefinition.initialState,
      transition(currentState, event) {
        const currentStateDefinition = stateMachineDefinition[currentState]
        const destinationTransition = currentStateDefinition.transitions[event]
        if (!destinationTransition) {
          return
        }
        const destinationState = destinationTransition.target
        const destinationStateDefinition =
          stateMachineDefinition[destinationState]
        destinationTransition.action()
        currentStateDefinition.actions.onExit()
        destinationStateDefinition.actions.onEnter()
        machine.value = destinationState
        return machine.value
      },
    }
    return machine
  }
  
const machine = createMachine({
initialState: 'default',
default: {
    actions: {
    onEnter() {
        console.log('off: onEnter')
    },
    onExit() {
        console.log('off: onExit')
    },
    },
    transitions: {
    switch: {
        target: 'select_default',
        action() {
        console.log('transition action for "switch" in "default" state')

        },
    },
    },
},
select_default: {
    actions: {
    onEnter() {
        console.log('on: onEnter')
    },
    onExit() {
        console.log('on: onExit')
    },
    },
    transitions: {
    switch: {
        target: 'select_active',
        action() {
        console.log('transition action for "switch" in "select-default" state')

        },
    },
    cancel: {
        target: "default",
        action() {
        console.log('transition action for "cancel" in "select-default" state')

        },

    }
    },
},
select_active: {
    actions: {
    onEnter() {
        console.log('on: onEnter')
    },
    onExit() {
        console.log('on: onExit')
    },
    },
    transitions: {
    switch: {
        target: 'select_entered',
        action() {
        console.log('transition action for "switch" in "select-active" state')
        },  
    },
    cancel: {
        target: "default",
        action() {
        console.log('transition action for "cancel" in "select-default" state')

        },

    }

    },
},
select_entered: {
    actions: {
    onEnter() {
        console.log('on: onEnter')
    },
    onExit() {
        console.log('on: onExit')
    },
    },
    transitions: {
    switch: {
        target: 'complete',
        action() {
        console.log('transition action for "switch" in "select-default" state')

        },  
    },
    cancel: {
        target: "default",
        action() {
        console.log('transition action for "cancel" in "select-default" state')

        },

    }

    },
},

complete: {
    actions: {
    onEnter() {
        console.log('on: onEnter')
    },
    onExit() {
        console.log('on: onExit')
    },
    },
    transitions: {
    switch: {
        target: 'default',
        action() {
        console.log('transition action for "switch" in "default" state')
        },
    },
    },
}
})
  
// Globals
let stats = null;
let mixer = null;
let renderer = null;
let scene = null;
let camera = null;

let state = machine.value
console.log(`current state: ${state}`)

function init() {
    /**
     * FPS METER
     */
    stats = new Stats()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

    /**
     * Debug GUI
     */
    const gui = new dat.GUI({
        width: 400
    })

    const canvas = document.querySelector('.webgl');

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    /**
     * Load Models
     */

    const manager = new THREE.LoadingManager(    
        // Loaded
        () =>
        {
            console.log('loaded')
        },

        // Progress
        () =>
        {
            console.log('progress')
        }
    );

    const textureLoader = new THREE.TextureLoader(manager);
    // const matcap = textureLoader.load('matcaps/1.png');

    /**
     * Baked Textures
     */
    const textureScene01 = textureLoader.load('textures/textureScene01.jpg');
    textureScene01.flipY = false;
    textureScene01.encoding = THREE.sRGBEncoding;

    // const basicMaterial = new THREE.MeshMatcapMaterial({ matcap });
    const basicMaterial = new THREE.MeshBasicMaterial({ map: textureScene01 });

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')

    // GLTF loader
    const gltfLoader = new GLTFLoader(manager)
    gltfLoader.setDRACOLoader(dracoLoader)

    gltfLoader.load(
        'models/portfolio-scene.glb',
        (gltf) => {
            gltf.scene.traverse((child) =>
            {
                child.material = basicMaterial;
            })
            scene.add(gltf.scene)
            console.log(gltf);
            // const stage = gltf.scene.children.find((child) => child.name === 'Cube')
            // stage.material.side = THREE.BackSide;        
            
            mixer = new THREE.AnimationMixer(gltf.scene)
            gltf.animations.forEach( ( clip ) => {
            
                mixer.clipAction( clip ).play();
            
            } );

        }
    )

    /**
     * Responsive Canvas
     */
    let upscrollCounter = 0;
    let downscrollCounter = 0;
    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            upscrollCounter += 1;
            downscrollCounter = 0;
        } else {
            downscrollCounter += 1;
            upscrollCounter = 0;
        }
        console.log(`${upscrollCounter}   ${downscrollCounter}`)
        //  camera.position.y += event.deltaY;
    });

    window.addEventListener('resize', () =>
    {
        // Save sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
    })
    window.addEventListener('click', () => {
        textEnter();
    });

    /**
     * Environnements
     */
    // Scene
    scene = new THREE.Scene()

    // Camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    
    //POSITION 1:
    camera.position.copy({x:5.66, y:0.52, z: 0.84});
    camera.rotation.x = 0;
    camera.rotation.y = 1.47;
    camera.rotation.z = 0;

    //POSITION 2:
    // camera.position.copy({x:12.46, y:-6.83, z: -0.24});
    // camera.rotation.x = 0.01;
    // camera.rotation.y = 1.58;
    // camera.rotation.z = 0;

    //POSITION 3:
    // camera.position.copy({x:8.61, y:-14.83, z: -0.24});
    // camera.rotation.x = 0.01;
    // camera.rotation.y = 1.49;
    // camera.rotation.z = 0;

    camera.setFocalLength(50);
    camera.updateProjectionMatrix();
    gui.add(camera.position, 'x').min(-10).max(50).step(0.01);
    gui.add(camera.position, 'y').min(-50).max(10).step(0.01);
    gui.add(camera.position, 'z').min(-50).max(10).step(0.01);
    gui.add(camera.rotation, 'x').min(-Math.PI * 2).max(Math.PI * 2).step(0.01);
    gui.add(camera.rotation, 'y').min(-Math.PI * 2).max(Math.PI * 2).step(0.01);
    gui.add(camera.rotation, 'z').min(-Math.PI * 2).max(Math.PI * 2).step(0.01);

    scene.add(camera)


    // Orbit Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true


    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(sizes.width, sizes.height)

}

const clock = new THREE.Clock()
let oldElapsedTime = 0

function loop() {
    stats.begin()
    createMeter();

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update Models
    if(mixer)
    {
        mixer.update(deltaTime * .5)
    }

    // Update controls
    // controls.update()
    // console.log(camera.position);
    // console.log(camera.rotation);
    // Render
    renderer.render(scene, camera)

    // Keep looping
    window.requestAnimationFrame(loop)
    stats.end()
}
init();
loop();
