import gsap from 'gsap'

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
        const tl = gsap.timeline();
        tl.addLabel("line-extend", 0);
        tl.addLabel("bg-extend", .5);
        tl.addLabel("bg-retract", 2.3);
        tl.addLabel("line-retract", 3.3);
    
        tl.to(".hero-enter-line", {height: 250, duration: .5}, "line-extend");
        tl.to(".hero-enter-line", {left: 601, duration: 1}, "bg-extend");
        tl.to(".hero-enter-bg", {width: 600, duration: 1}, "bg-extend");
        tl.to(".hero-text-content.duplicate", {clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)", duration: 1.2}, "bg-extend");
        tl.to('.hero-text-content.original', {opacity: 1, duration: .2}, "bg-retract-=.5");
        tl.fromTo(".hero-text-content.original", {clipPath: "polygon(0 0, 6% 0, 0 100%, 0% 100%)"}, {clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)", duration: 1.2}, "bg-retract");
    
        tl.to(".hero-enter-line", {left: 0, duration: 1}, "bg-retract");
        tl.to(".hero-enter-bg", {width: 0, duration: 1}, "bg-retract");
        tl.to(".hero-enter-line", {height: 0, duration: .5}, "line-retract");    
    }
    function ani2() {
        const tl = gsap.timeline();
        tl.addLabel("line-extend", 0);
        tl.addLabel("show", .5);
        tl.addLabel("line-retract", 2);

        tl.to(".isec-enter-line", {height: 6, duration: .5}, "line-extend");
        tl.to(".isec-enter-line", {top: 550, duration: 1}, "show");
        tl.to(".isec-logo", {opacity: 1, duration: 1}, "show");
        tl.to(".isec-work-number", {opacity: .8, duration: .5}, "show");
        tl.fromTo(".isec-work-number", {x: 10},{x: -35, rotation: -10, duration: .8}, "show");
        tl.to(".isec-work-number", {x: 0, rotation: 0, duration: .5}, "show+=1.2");
        tl.to(".isec-work-number", {opacity: 0, duration: .5}, "show+=1.4");
        tl.to(".isec-text-content", {clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1}, "show");
        tl.to(".isec-enter-line", {width: 0, duration: .5}, "line-retract");
    };
    function ani3() {
        const tl = gsap.timeline();
        tl.addLabel("line-extend", 0);
        tl.addLabel("show", .5);
        tl.addLabel("line-retract", 2);

        tl.to(".aves-enter-line", {height: 6, duration: .5}, "line-extend");
        tl.to(".aves-enter-line", {top: 550, duration: 1}, "show");
        tl.to(".aves-logo", {opacity: 1, duration: 1}, "show");
        tl.to(".aves-work-number", {opacity: .8, duration: .5}, "show");
        tl.fromTo(".aves-work-number", {x: -10},{x: 35, rotation: 10, duration: .8}, "show");
        tl.to(".aves-work-number", {x: 0, rotation: 0, duration: .5}, "show+=1.2");
        tl.to(".aves-text-content", {clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1}, "show");
        tl.to(".aves-enter-line", {width: 0, duration: .5}, "line-retract");

    };
}

function reset() {
    const hero_line = document.querySelector(".hero-enter-line");
    const hero_bg = document.querySelector(".hero-enter-bg");
    //two hero texts
    const hero_text = document.querySelectorAll(".hero-text-content");

    hero_line.style.height = ""; //unnecessary i believe
    hero_line.style.left = "";
    hero_bg.style.width = "";
    
    hero_text.forEach((obj)=> {
        obj.style.clipPath = "";
    })

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

export {textEnter, reset};
