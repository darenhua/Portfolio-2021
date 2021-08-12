import './style/main.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import screenVertexShader from './shaders/screen/vertex.glsl';
import screenFragmentShader from './shaders/screen/fragment.glsl';

import createMeter from './meter.js'
import {textEnter, reset} from './textAnimation';

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

let visited_last_page = false;
const machine = createMachine({
initialState: 'hero_page',
hero_page: {
    actions: {
    onEnter() {
        // console.log('off: onEnter')
        //SWIPE IN
    },
    onExit() {
        // console.log('off: onExit')
        //SWIPE OUT
    },
    },
    transitions: {
    switch: {
        target: 'isec_page',
        action() {
        // console.log('transition action for "switch" in "hero_page" state')
        camera.position.copy({x:11.23, y:-5.1, z: -1.05});
        orbit_const.x = -1.35;
        orbit_const.y = -6;
        camera_target.set(3.64, -6.4, -0.76);   
        // camera_target.set();
        textEnter(2);
        reset(2);    
        },
    },
    },
},
isec_page: {
    actions: {
    onEnter() {
        // console.log('on: onEnter')
        //SWIPE IN
    },
    onExit() {
        // console.log('on: onExit')
        //swipe out
    },
    },
    transitions: {
    switch: {
        target: 'aves_page',
        action() {
        // console.log('transition action for "switch" in "select-default" state')
        camera.position.copy({x:10.0, y:-13.23, z: -1.16});
        orbit_const.x = -0.76;
        orbit_const.y = -13.83;
        // camera.rotation.x = 0.01;
        // camera.rotation.y = 1.49;
        // camera.rotation.z = 0;
        camera_target.set(1.83, -14.35, -0.78);

        textEnter(3);
        reset(3);    
        },
    },
    cancel: {
        target: 'hero_page',
        action() {
        // console.log('transition action for "cancel" in "select-default" state')
        camera.position.copy({x:6.63, y:1.12, z: 0.84});
        orbit_const.x = 0;
        orbit_const.y = 0;

        // camera.rotation.x = 0;
        // camera.rotation.y = 1.47;
        // camera.rotation.z = 0;
        camera_target.set(-0.82, 0.55, 0.39);

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
        // console.log('on: onEnter')
        //SWIPE IN

    },
    onExit() {
        // console.log('on: onExit')
        //swipe out
    },
    },
    transitions: {
    switch: {
        target: 'cta_page',
        action() {
        // console.log('transition action for "switch" in "select-active" state');
        camera.position.copy({x:12.98, y:-20.82, z: -0.83});
        camera_target.set(100, 100, 100);
        orbit_const.x = -0.83;
        orbit_const.y = -20.82;

        reset(4);    

        },  
    },
    cancel: {
        target: "isec_page",
        action() {
        // console.log('transition action for "cancel" in "select-default" state');
        camera.position.copy({x:11.23, y:-5.1, z: -1.05});
        orbit_const.x = -1.05;
        orbit_const.y = -5.5;

        // camera.rotation.x = 0.01;
        // camera.rotation.y = 1.6;
        // camera.rotation.z = 0;
        camera_target.set(3.64, -6.4, -0.76);
        textEnter(2);
        reset(2);    
        },

    }

    },
},
cta_page: {
    actions: {
    onEnter() {
        // console.log('on: onEnter')
        //SWIPE IN

    },
    onExit() {
        // console.log('on: onExit')
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
        // console.log('transition action for "cancel" in "select-default" state')
        camera.position.copy({x:10.0, y:-13.23, z: -1.16});
        orbit_const.x = -0.76;
        orbit_const.y = -13.83;

        // camera.rotation.x = 0.01;
        // camera.rotation.y = 1.49;
        // camera.rotation.z = 0;
        camera_target.set(1.83, -14.35, -0.78);
        textEnter(3);
        reset(3);    
        },

    }

    },
}
})
  
// Globals
let mixer = null;
let renderer = null;
let scene = null;
let camera = null;
let camera_target = new THREE.Vector3();
let mouse = {x: 0, y: 0};

const target = new THREE.Vector2();
let orbit_const = {x: 0, y: 0};

let state = machine.value
// console.log(`current state: ${state}`)

function init() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.querySelector('#overlay').style.display = 'block';
    }
    
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
            // console.log('loaded')
        },

        // Progress
        () =>
        {
            // console.log('progress')
        }
    );

    const textureLoader = new THREE.TextureLoader(manager);
    const matcaps = [
        textureLoader.load('matcaps/1.png'),
        textureLoader.load('matcaps/2.png'),
        textureLoader.load('matcaps/3.png'),
        textureLoader.load('matcaps/4.png'),
        textureLoader.load('matcaps/5.png'),
        textureLoader.load('matcaps/6.png'),
        textureLoader.load('matcaps/7.png'),
        textureLoader.load('matcaps/8.png')  
    ];

    const aves_video = document.createElement('video');
    aves_video.autoplay = true;
    aves_video.loop = true;
    aves_video.muted = true;
    aves_video.src = "textures/aves_trailer.mp4";
    aves_video.play();

    const isec_video = document.createElement('video');
    isec_video.autoplay = true;
    isec_video.loop = true;
    isec_video.muted = true;
    isec_video.src = "textures/simulation_demo.mp4";
    isec_video.play();

    // const videoTexture = textureLoader.load('matcaps/5.png');
    const avesVideoTexture = new THREE.VideoTexture(aves_video);
    const isecVideoTexture = new THREE.VideoTexture(isec_video);
    avesVideoTexture.flipY = false;
    isecVideoTexture.flipY = false;

    
    const basicMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[0]});
    const haloMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[1]});
    const metalMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[2]});
    const baseMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[4]});
    const basicAltMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[5], morphTargets: true});
    const neonMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[6]});
    const displayMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[7]});
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 'white' });

    const isecVideoMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            uTexture: { value: isecVideoTexture},
            uAdjustUv: { value: new THREE.Vector2(1, 9/16)},
            uScale: { value: 1.6 }
        },
        vertexShader: screenVertexShader,
        fragmentShader: screenFragmentShader
      } );

    const avesVideoMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            uTexture: { value: avesVideoTexture},
            uAdjustUv: { value: new THREE.Vector2(1, 9/16)},
            uScale: { value: 1.05 }
    
        },
        vertexShader: screenVertexShader,
        fragmentShader: screenFragmentShader
      } );

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')

    // GLTF loader
    const gltfLoader = new GLTFLoader(manager)
    gltfLoader.setDRACOLoader(dracoLoader)

    gltfLoader.load(
        'models/portfolio_scene.glb',
        (gltf) => {
            gltf.scene.traverse((child) =>
            {
                if (child.name.includes('retainer')) {
                    child.material = metalMaterial;
                } else if (child.name.includes('astronaut') || child.name.includes('building') ) {
                    child.material = metalMaterial;
                } else if (child.name.includes('tree')) {
                    child.material = basicAltMaterial;
                } else {
                    child.material = neonMaterial;
                }

            })
            scene.add(gltf.scene)
            // const stage = gltf.scene.children.find((child) => child.name === 'Cube')
            // stage.material.side = THREE.BackSide;        
            const display_sceen01 = gltf.scene.children.find(child => child.name === 'Plane001');
            const display_sceen02 = gltf.scene.children.find(child => child.name === 'Plane003');

            const halo01 = gltf.scene.children.find(child => child.name === 'Torus001');
            const halo02 = gltf.scene.children.find(child => child.name === 'Torus002');
            const aves_backlight = gltf.scene.children.find(child => child.name === 'Plane006');

            const hero_obj01 = gltf.scene.children.find(child => child.name === 'Cube001');
            const hero_obj02 = gltf.scene.children.find(child => child.name === 'Cube002');
            const hero_obj03 = gltf.scene.children.find(child => child.name === 'Car');

            const hero_funnel = gltf.scene.children.find(child => child.name === 'Cylinder');
            const hero_backdrop = gltf.scene.children.find(child => child.name === 'Cube');


            const display_frame01 = gltf.scene.children.find(child => child.name === 'Plane');
            const display_frame02 = gltf.scene.children.find(child => child.name === 'Plane002');
            const display_stand01 = gltf.scene.children.find(child => child.name === 'Cylinder001');
            const display_stand02 = gltf.scene.children.find(child => child.name === 'Cylinder003');

            const track01 = gltf.scene.children.find(child => child.name === 'Plane004');
            const track02 = gltf.scene.children.find(child => child.name === 'Plane005');
            const isec_backdrop = gltf.scene.children.find(child => child.name === 'Cube003');
            const aves_backdrop = gltf.scene.children.find(child => child.name === 'Cube004');
            const river = gltf.scene.children.find(child => child.name === 'BezierCurve');

            display_sceen01.material = isecVideoMaterial;
            display_sceen02.material = avesVideoMaterial;
            
            halo01.material = haloMaterial;
            halo02.material = haloMaterial;
            aves_backlight.material = whiteMaterial;

            hero_obj01.material = metalMaterial;
            hero_obj02.material = metalMaterial;
            hero_obj03.material = metalMaterial;

            hero_funnel.material = neonMaterial;
            hero_backdrop.material = basicMaterial;

            display_frame01.material = displayMaterial;
            display_frame02.material = displayMaterial;
            display_stand01.material = baseMaterial;
            display_stand02.material = baseMaterial;

            track01.material = basicAltMaterial;
            track02.material = basicAltMaterial;

            isec_backdrop.material = basicAltMaterial;
            aves_backdrop.material = basicMaterial;
            river.material = haloMaterial;

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
    const factor = 5;
    document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", "0%");
    document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", "0%");
    document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", "0%");
    document.querySelector('#gradient4 > #gradientStop2').setAttribute("offset", "0%");

    window.addEventListener('wheel', (event) => {
        // console.log(`${scrollCounter}   ${downscrollCounter}`);
        // console.log(event.deltaY)
        if (event.deltaY > 0) {
            if (scrollCounter < 12 * factor) {
                scrollCounter += 1;
            }
        } else if (scrollCounter > 0) {
            scrollCounter -= 1;
        }
        if (scrollCounter === 3 * factor) {
            //bug: flickering between 2 and 3 or 5 and 6 or 4 and 3...
            if (state === "hero_page") {
                state = machine.transition(state, 'switch');
            } else if (state === "isec_page") {
                state = machine.transition(state, 'cancel');
            }
        } 
        if (scrollCounter === 6 * factor) {
            if (state === "isec_page") {
                state = machine.transition(state, 'switch');
            } else if (state === "aves_page") {
                state = machine.transition(state, 'cancel');
            }
        } 
        if (scrollCounter === 9 * factor) {
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
        
        offset = (scrollCounter % (3 * factor)) * 33.33 / factor;
        currentBlob = Math.floor(scrollCounter / (3 * factor));
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
        if (scrollCounter == 12 * factor) {
            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient4 > #gradientStop2').setAttribute("offset", `100%`);

        }
        // document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", "0%");
        // document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", "0%");
    

        //  camera.position.y += event.deltaY;
    });

    document.addEventListener("mousemove", (event) => {
        // mouse.x = event.clientX / sizes.width - 0.5;
        // mouse.y = - (event.clientY / sizes.height - 0.5);
        mouse.x = ( event.clientX - sizes.width/2 );
        mouse.y = ( event.clientY - sizes.width/2 );
    
    });
    
    document.querySelector(".scroll-button").addEventListener("click", () => {
        if (state === "hero_page") {
            state = machine.transition(state, 'switch');
            scrollCounter = 3 * factor;
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
            scrollCounter = 9 * factor;

            document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", `100%`);
            document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", `100%`);
        }
    });

    // document.querySelectorAll(".meter").forEach((meter, index) => {

    // });

    window.addEventListener('resize', () =>
    {
        // Save sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(sizes.width, sizes.height)
    })

    /**
     * Environnements
     */
    // Scene
    scene = new THREE.Scene()

    // Camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    
    textEnter(1);
    camera.position.copy({x:6.63, y:1.12, z: 0.84});
    camera_target.set(-0.82, 0.55, 0.39);

    camera.setFocalLength(50);
    camera.updateProjectionMatrix();
    scene.add(camera)

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true

    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(sizes.width, sizes.height)

}

const clock = new THREE.Clock()
let oldElapsedTime = 0

function loop() {
    createMeter();

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    // Update Models
	target.x = ( 1 - mouse.x ) * 0.002;
    target.y = ( 1 - mouse.y ) * 0.002;
    camera.position.y += 0.01 * (orbit_const.y + target.y - camera.position.y );
    camera.position.z += 0.01 * (orbit_const.x + target.x - camera.position.z);



    camera.lookAt(camera_target);
    if(mixer)
    {
        mixer.update(deltaTime * .5)
    }

    renderer.render(scene, camera)

    // Keep looping
    window.requestAnimationFrame(loop)
}
init();
loop();
