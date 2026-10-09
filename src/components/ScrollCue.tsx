// Points down into the page: a thin track with a short segment sliding along it, which also links to About
function ScrollCue(){
    return(
        <a
            href="#about"
            className="group flex flex-col items-center gap-3 text-[0.625rem] font-medium tracking-widest text-gray-400 uppercase transition-colors hover:text-black sm:text-xs"
        >
            Scroll
            <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-black/10 sm:h-14">
                <span className="absolute inset-0 bg-black motion-safe:animate-scroll-cue" />
            </span>
        </a>
    );
}

export default ScrollCue;
