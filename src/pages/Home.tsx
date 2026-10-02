import { HeroTitle } from "../components";

function Home({ introActive }: { introActive: boolean }){
    return(
        <>
            <HeroTitle introActive={introActive} />
        </>
    );
}

export default Home;
