import InfoBlock from "./InfoBlock";

const currentRole = [
    "Software Developer",
    "STEMCELL Technologies",
    "R&D Custom Products",
];

function CurrentRole(){
    return <InfoBlock label="Currently" lines={currentRole} />;
}

export default CurrentRole;
