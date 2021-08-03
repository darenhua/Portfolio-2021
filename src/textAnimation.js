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
        tl.to(".aves-text-content", {clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1}, "show");
        tl.to(".aves-enter-line", {width: 0, duration: .5}, "line-retract");

    };

}

export default textEnter;
