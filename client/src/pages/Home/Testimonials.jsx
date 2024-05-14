import { feedback } from "../../constants"
import styles from '../../styles'
import FeedbackCard from './FeedbackCard'
import { motion } from "framer-motion"
const Testimonials = () => (
  <motion.section id='testimonials' className={`${styles.paddingY} 
  ${styles.flexCenter} flex-col relative`}
  initial={{ opacity: 0}}
            whileInView={{ opacity: 1}}
            viewport={{ once: true }}
            transition={{ duration: 4, type: 'tween'}}
  >


    <div className='w-full flex justify-between items-center 
     flex-col md:flex-row mb-6 sm:mb-16 relative z-[1]'>
      <h2 className={styles.heading2}>What our customers are
        <br className="hidden sm:block" /> saying about us
      </h2>

      <div className='w-full mt-6 md:mt-9'>
        <p className={`${styles.paragraph} text-left max-w-[450px]`}>
          The acceleration you need to grow your business with data-driven decisions!
        </p>
      </div>

    </div>

    <div className='relative w-full flex flex-wrap justify-center sm:justify-start z-[1]'>
      {feedback.map((card, index) => (
        <FeedbackCard key={card.id} index={index} {...card} />
      ))}

    </div>
          <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient bottom-40" />
  </motion.section>
)


export default Testimonials