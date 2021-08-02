import gsap from 'gsap'

function textEnter() {
    const tl = gsap.timeline();
    tl.addLabel("line-extend", 0);
    tl.addLabel("bg-extend", .5);
    tl.addLabel("bg-retract", 2.3);
    tl.addLabel("line-retract", 3.3);

    tl.to(".enter-line", {height: 250, duration: .5}, "line-extend");
    tl.to(".enter-line", {left: 601, duration: 1}, "bg-extend");
    tl.to(".enter-bg", {width: 600, duration: 1}, "bg-extend");
    tl.to(".text-content", {clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)", duration: 1.2}, "bg-extend");
    // tl.to(".text-content.original", {clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)", duration: 1.2}, "bg-extend");
    tl.to('.text-content.original', {opacity: 1, duration: .2}, "bg-retract-=.5");
    tl.to(".text-content.duplicate", {clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", duration: 1.2}, "bg-retract");
    tl.to(".enter-line", {left: 0, duration: 1}, "bg-retract");
    tl.to(".enter-bg", {width: 0, duration: 1}, "bg-retract");
    tl.to(".enter-line", {height: 0, duration: .5}, "line-retract");

    // tl.to(".enter-bg", {width: 500, duration: 3})
    // tl.to(".enter-line", {left: 500, duration: 3}, "-=3");
    // tl.to(".enter-line", {height: 0, duration: 1.5})

}

export default textEnter;
