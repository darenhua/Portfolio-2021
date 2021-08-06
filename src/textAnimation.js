import gsap from 'gsap'

let tl1 = gsap.timeline();
let tl2 = gsap.timeline();
let tl3 = gsap.timeline();
let tl4 = gsap.timeline();


function textEnter(number) {
    switch (number) {
        case 1:
            ani1();
            break;
        case 2:
            ani2();
            break;
        case 3:
            ani3();
            break;
    }
    function ani1() {
        // const tl = gsap.timeline();
        tl1.addLabel("line-extend", 0);
        tl1.addLabel("bg-extend", .5);
        tl1.addLabel("bg-retract", 2.3);
        tl1.addLabel("line-retract", 3.3);
    
        tl1.to(".hero-enter-line", {height: 250, duration: .5}, "line-extend");
        tl1.to(".hero-enter-line", {left: 601, duration: 1}, "bg-extend");
        tl1.to(".hero-enter-bg", {width: 600, duration: 1}, "bg-extend");
        tl1.to(".hero-text-content.duplicate", {clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)", duration: 1.2}, "bg-extend");
        tl1.to('.hero-text-content.original', {opacity: 1, duration: .2}, "bg-retract-=.5");
        tl1.fromTo(".hero-text-content.original", {clipPath: "polygon(0 0, 6% 0, 0 100%, 0% 100%)"}, {clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)", duration: 1.2}, "bg-retract");
    
        tl1.to(".hero-enter-line", {left: 0, duration: 1}, "bg-retract");
        tl1.to(".hero-enter-bg", {width: 0, duration: 1}, "bg-retract");
        tl1.to(".hero-enter-line", {height: 0, duration: .5}, "line-retract");    
        tl1.to(".scroll-button", {opacity: 1, duration: 1.5}, "line-retract");    
    }
    function ani2() {
        // const tl = gsap.timeline();
        tl2.addLabel("line-extend", 0);
        tl2.addLabel("show", .5);
        tl2.addLabel("line-retract", 2);

        tl2.to(".isec-enter-line", {height: 6, duration: .5}, "line-extend");
        tl2.to(".isec-enter-line", {top: 550, duration: 1}, "show");
        tl2.to(".isec-logo", {opacity: 1, duration: 1}, "show");
        tl2.to(".isec-work-number", {opacity: .8, duration: .5}, "show");
        tl2.fromTo(".isec-work-number", {x: 10},{x: -35, rotation: -10, duration: .8}, "show");
        tl2.to(".isec-work-number", {x: 0, rotation: 0, duration: .5}, "show+=1.2");
        tl2.to(".isec-work-number", {opacity: 0, duration: .5}, "show+=1.4");
        tl2.to(".isec-text-content", {clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1}, "show");
        tl2.to(".isec-enter-line", {width: 0, duration: .5}, "line-retract");
    };
    function ani3() {
        const tl = gsap.timeline();
        tl3.addLabel("line-extend", 0);
        tl3.addLabel("show", .5);
        tl3.addLabel("line-retract", 2);

        tl3.to(".aves-enter-line", {height: 6, duration: .5}, "line-extend");
        tl3.to(".aves-enter-line", {top: 550, duration: 1}, "show");
        tl3.to(".aves-logo", {opacity: 1, duration: 1}, "show");
        tl3.to(".aves-work-number", {opacity: .8, duration: .5}, "show");
        tl3.fromTo(".aves-work-number", {x: -10},{x: 35, rotation: 10, duration: .8}, "show");
        tl3.to(".aves-work-number", {x: 0, rotation: 0, duration: .5}, "show+=1.2");
        tl3.to(".aves-work-number", {opacity: 0, duration: .5}, "show+=1.4");
        tl3.to(".aves-text-content", {clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1}, "show");
        tl3.to(".aves-enter-line", {width: 0, duration: .5}, "line-retract");

    };
}

function reset(number) {
    //reset clears styles and kills animations
    switch (number) {
        case 1:
            tl2.kill();
            tl2 = gsap.timeline();
            tl3.kill();
            tl3 = gsap.timeline();
            tl4.kill();
            tl4 = gsap.timeline();
            clear2();
            clear3();
            clear4()
            break;
        case 2:
            tl1.kill();
            tl1 = gsap.timeline();
            tl3.kill();
            tl3 = gsap.timeline();
            tl4.kill();
            tl4 = gsap.timeline();
            clear1();
            clear3();
            clear4()
            break;
        case 3:
            tl1.kill();
            tl1 = gsap.timeline();
            tl2.kill();
            tl2 = gsap.timeline();
            tl4.kill();
            tl4 = gsap.timeline();
            clear1();
            clear2();
            clear4()
            break;
        case 4:
            tl1.kill();
            tl1 = gsap.timeline();
            tl2.kill();
            tl2 = gsap.timeline();
            tl3.kill();
            tl3 = gsap.timeline();
            clear1();
            clear2();
            clear3();
    }
    function clear1(){
        const hero_line = document.querySelector(".hero-enter-line");
        const hero_bg = document.querySelector(".hero-enter-bg");
        //two hero texts
        const hero_text = document.querySelectorAll(".hero-text-content");
        const scroll_btn = document.querySelector(".scroll-button");
        
        hero_line.style.height = ""; //unnecessary i believe
        hero_line.style.left = "";
        hero_bg.style.width = "";
        scroll_btn.style.opacity = "";

        hero_text.forEach((obj)=> {
            obj.style.clipPath = "";
        })    
    }
    function clear2(){
        const isec_line = document.querySelector(".isec-enter-line");
        const isec_text = document.querySelector(".isec-text-content");
        const isec_logo = document.querySelector(".isec-logo");
        const isec_work_text = document.querySelector(".isec-work-number");
        
        isec_line.style.height = ""; 
        isec_line.style.width = "";
        isec_line.style.top = "";
        isec_text.style.clipPath = "";
        isec_logo.style.opacity = "";
        isec_work_text.style.opacity = "";    
    }
    function clear3(){
        const aves_line = document.querySelector(".aves-enter-line");
        const aves_text = document.querySelector(".aves-text-content");
        const aves_logo = document.querySelector(".aves-logo");
        const aves_work_text = document.querySelector(".aves-work-number");
    
        aves_line.style.height = ""; 
        aves_line.style.width = "";
        aves_line.style.top = "";
        aves_text.style.clipPath = "";
        aves_logo.style.opacity = "";
        aves_work_text.style.opacity = "";
    
    }
    function clear4(){

    }
}

export {textEnter, reset};
