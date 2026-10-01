// A small uppercase label over a few stacked lines of plain text
function InfoBlock({ label, lines }: { label: string; lines: string[] }){
    return(
        <div data-animate>
            <h3 className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                {label}
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-black sm:mt-4 sm:text-lg">
                {lines.map((line) => (
                    <li key={line}>{line}</li>
                ))}
            </ul>
        </div>
    );
}

export default InfoBlock;
