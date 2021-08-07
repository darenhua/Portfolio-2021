import './style/main.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import Stats from 'stats.js';
import createMeter from './meter.js'
import {textEnter, reset} from './textAnimation';
function createMachine(stateMachineDefinition) {
    const machine = {
      value: stateMachineDefinition.initialState,
      transition(currentState, event) {
          debugger;
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

let visited_last_page = false;
const machine = createMachine({
initialState: 'hero_page',
hero_page: {
    actions: {
    onEnter() {
        console.log('off: onEnter')
        //SWIPE IN
    },
    onExit() {
        console.log('off: onExit')
        //SWIPE OUT
    },
    },
    transitions: {
    switch: {
        target: 'isec_page',
        action() {
        console.log('transition action for "switch" in "hero_page" state')
        camera.position.copy({x:12.98, y:-6.82, z: -0.83});
        camera.rotation.x = 0.01;
        camera.rotation.y = 1.6;
        camera.rotation.z = 0;
        textEnter(2);
        reset(2);    
        },
    },
    },
},
isec_page: {
    actions: {
    onEnter() {
        console.log('on: onEnter')
        //SWIPE IN

    },
    onExit() {
        console.log('on: onExit')
        //swipe out

    },
    },
    transitions: {
    switch: {
        target: 'aves_page',
        action() {
        console.log('transition action for "switch" in "select-default" state')
        camera.position.copy({x:8.61, y:-14.83, z: -0.24});
        camera.rotation.x = 0.01;
        camera.rotation.y = 1.49;
        camera.rotation.z = 0;
        textEnter(3);
        reset(3);    
        },
    },
    cancel: {
        target: 'hero_page',
        action() {
        console.log('transition action for "cancel" in "select-default" state')
        camera.position.copy({x:5.66, y:0.52, z: 0.84});
        camera.rotation.x = 0;
        camera.rotation.y = 1.47;
        camera.rotation.z = 0;
        const hero_bg = document.querySelector(".hero-enter-bg");
        const hero_text = document.querySelector(".hero-text-content.original");
        const scroll_btn = document.querySelector(".scroll-button");
        const contact_btn = document.querySelector(".contact-button");

        hero_bg.style.width = "0";
        scroll_btn.style.opacity = "1";
        contact_btn.style.opacity = "1";
        hero_text.style.clipPath = "polygon(0 0, 100% 0, 98% 100%, 0 100%)";   
        reset(1);    
        },
    }
    },
},
aves_page: {
    actions: {
    onEnter() {
        console.log('on: onEnter')
        //SWIPE IN

    },
    onExit() {
        console.log('on: onExit')
        //swipe out
    },
    },
    transitions: {
    switch: {
        target: 'cta_page',
        action() {
        console.log('transition action for "switch" in "select-active" state');
        camera.position.copy({x:12.98, y:-20.82, z: -0.83});
        camera.rotation.x = 0.01;
        camera.rotation.y = 1.6;
        camera.rotation.z = 0;
        reset(4);    

        },  
    },
    cancel: {
        target: "isec_page",
        action() {
        console.log('transition action for "cancel" in "select-default" state');
        camera.position.copy({x:12.98, y:-6.82, z: -0.83});
        camera.rotation.x = 0.01;
        camera.rotation.y = 1.6;
        camera.rotation.z = 0;
        textEnter(2);
        reset(2);    
        },

    }

    },
},
cta_page: {
    actions: {
    onEnter() {
        console.log('on: onEnter')
        //SWIPE IN

    },
    onExit() {
        console.log('on: onExit')
        //swipe out
    },
    },
    transitions: {
    // switch: {
    //     target: 'select_entered',
    //     action() {
    //     console.log('transition action for "switch" in "select-active" state')
    //     },  
    // },
    cancel: {
        target: "aves_page",
        action() {
        console.log('transition action for "cancel" in "select-default" state')
        camera.position.copy({x:8.61, y:-14.83, z: -0.24});
        camera.rotation.x = 0.01;
        camera.rotation.y = 1.49;
        camera.rotation.z = 0;
        textEnter(3);
        reset(3);    
        },

    }

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
    let scrollCounter = 0;
    let offset;
    let currentBlob;
    document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", "0%");
    document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", "0%");
    document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", "0%");
    document.querySelector('#gradient4 > #gradientStop2').setAttribute("offset", "0%");

    window.addEventListener('wheel', (event) => {
        // console.log(`${scrollCounter}   ${downscrollCounter}`);
        // console.log(event.deltaY)
        if (event.deltaY > 0) {
            if (scrollCounter < 12) {
                scrollCounter += 1;
            }
        } else if (scrollCounter > 0) {
            scrollCounter -= 1;
        }
        if (scrollCounter === 3) {
            //bug: flickering between 2 and 3 or 5 and 6 or 4 and 3...
            if (state === "hero_page") {
                state = machine.transition(state, 'switch');
            } else if (state === "isec_page") {
                state = machine.transition(state, 'cancel');
            }
        } 
        if (scrollCounter === 6) {
            if (state === "isec_page") {
                state = machine.transition(state, 'switch');
            } else if (state === "aves_page") {
                state = machine.transition(state, 'cancel');
            }
        } 
        if (scrollCounter === 9) {
            if (state === "aves_page") {
                if (!visited_last_page) {
                    textEnter(4);
                    visited_last_page = true;
                } else {
                    const cta_bg = document.querySelector(".cta-text");
                    const cta_content = document.querySelector(".cta-bg");
            
                    cta_bg.style.opacity = "1";
                    cta_bg.style.display = "grid";
                    cta_content.style.transform = "translateY(0px)";
                    
                }
                state = machine.transition(state, 'switch');
            } else if (state === "cta_page") {
                state = machine.transition(state, 'cancel');
            }
        } 
        
        offset = (scrollCounter % 3) * 33.33;
        currentBlob = Math.floor(scrollCounter / 3);
        if (currentBlob == 0) {
            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `${offset}%`);
        } else if (currentBlob == 1) {
            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", `${offset}%`);
        } else if (currentBlob == 2) {
            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", `${offset}%`);
        } else if (currentBlob == 3) {
            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient4 > #gradientStop2').setAttribute("offset", `${offset}%`);
        }
        if (scrollCounter == 12) {
            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient4 > #gradientStop2').setAttribute("offset", `100%`);

        }
        // document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", "0%");
        // document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", "0%");
    

        //  camera.position.y += event.deltaY;
    });

    document.querySelector(".scroll-button").addEventListener("click", () => {
        if (state === "hero_page") {
            state = machine.transition(state, 'switch');
            scrollCounter = 3;
            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
        }
    });

    document.querySelector(".contact-button").addEventListener("click", () => {
        if (state === "hero_page") {
            state = machine.transition(state, 'switch');
            state = machine.transition(state, 'switch');
            state = machine.transition(state, 'switch');

            if (!visited_last_page) {
                textEnter(4);    
                visited_last_page = true;
            } else {
                const cta_bg = document.querySelector(".cta-text");
                const cta_content = document.querySelector(".cta-bg");
                cta_bg.style.opacity = "1";
                cta_bg.style.display = "grid";
                cta_content.style.transform = "translateY(0px)";
                
            }
            scrollCounter = 9;

            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", `100%`);
        }
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

    /**
     * Environnements
     */
    // Scene
    scene = new THREE.Scene()

    // Camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    
    //POSITION 1:
    textEnter(1);
    camera.position.copy({x:5.66, y:0.52, z: 0.84});
    camera.rotation.x = 0;
    camera.rotation.y = 1.47;
    camera.rotation.z = 0;

    //POSITION 2:
    // camera.position.copy({x:12.98, y:-6.82, z: -0.83});
    // camera.rotation.x = 0.01;
    // camera.rotation.y = 1.6;
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
