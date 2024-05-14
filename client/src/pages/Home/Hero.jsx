import styles from "../../styles"
import { hero } from "../../assets"
import { motion } from "framer-motion"

const Hero = () => (
  <motion.section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}
  initial={{ opacity: 0}}
            whileInView={{ opacity: 1}}
            viewport={{ once: true }}
            transition={{ duration: 4, type: 'tween'}}
            >
    <div className={`flex-1 ${styles.flexStart} flex-col px-6 sm:px-16 xl:px-0`}>

      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] 
        text-white ss:leading-[100px] leading-[75px]">
          The Next
          <br className="sm:block hidden" />{" "}
          <span className="text-gradient">Revolution</span>{" "}
          <br className="sm:block hidden" />
          <span className="">Analysis Method!</span>
        </h1>
      </div>


      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Our advanced AI algorithms and analytics methods will accelerate your business growth and secure it with innovative solutions!
      </p>
    </div>

    <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-19 relative`}>
      <img src={hero} alt="AI Hero Image"
        className='w-[100%] h-[100%] relative z-[5]' />

      <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient"></div>
      <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient"></div>
      <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient"></div>
  
    </div>
    
  </motion.section>
)


export default Hero