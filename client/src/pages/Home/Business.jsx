import { features } from '../../constants'
import { Link } from 'react-router-dom'
import styles, { layout } from '../../styles'
import Button from '../../components/Button'
import FeatureCard from './FeatureCard'
import { motion } from 'framer-motion'

const Business = () => (
  <motion.section id='features' className={layout.section}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 4, type: 'tween' }}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        You do the business, <br className='hidden sm:block' />we’ll handle your analytics!
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        With our decision-driven data, you can analyze effectively your business by installing our software on your cameras!
      </p>

      <Link to={"/demo"}>
        <Button style='mt-10' title='Try Demo' />

      </Link>
    </div>

    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} index={index} {...feature} />
      ))}
    </div>
  </motion.section>
)


export default Business