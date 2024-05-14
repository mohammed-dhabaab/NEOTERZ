import styles from "../../styles";
import Hero from "./Hero";
import Business from "./Business";
import Stats from "./Stats";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import { Footer } from "../../components";

const Home = () => (
    <>
        <div className={`bg-primary ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
                <Hero />
            </div>
        </div>

        <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
                <Stats />
                <Business />
                <Testimonials />
                <CTA />
                <Footer />
            </div>
        </div>
    </>
)


export default Home