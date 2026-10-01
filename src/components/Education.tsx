import InfoBlock from "./InfoBlock";

const education = [
    "University of Victoria",
    "BSc. Computer Science",
    "Software Systems · Business Minor",
];

function Education(){
    return <InfoBlock label="Education" lines={education} />;
}

export default Education;
