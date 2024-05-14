import styles from "../../styles"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const CTA = () => (
  <motion.section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding}
  flex-col sm:flex-row bg-black-gradient-2 rounded-[20px] box-shadow`}
  initial={{ opacity: 0}}
            whileInView={{ opacity: 1}}
            viewport={{ once: true }}
            transition={{ duration: 4, type: 'tween'}}>
    <div className="flex-1 flex flex-col">

    <h2 className={styles.heading2}>Let’s try our service now!</h2>
    <p className={`${styles.paragraph} max-w-[470px] mt-5`}>The acceleration you need to grow your business with data-driven decisions!</p>
    </div>

    <div className={`${styles.flexCenter} ml-0 sm:ml-10 mt-10 sm:mt-0`}>
      <Link to={"/demo"}>
        <Button title={"Try Demo"} />
      </Link>
    </div>
  </motion.section>
)


export default CTA