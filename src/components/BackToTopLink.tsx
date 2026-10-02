// Returns to the hero; the arrow lifts slightly on hover
function BackToTopLink(){
    return(
        <a
            href="#top"
            className="group inline-flex items-center gap-2 transition-colors hover:text-black"
        >
            Back to top
            <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
            >
                ↑
            </span>
        </a>
    );
}

export default BackToTopLink;
