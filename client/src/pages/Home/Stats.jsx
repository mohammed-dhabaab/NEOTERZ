import { stats } from '../../constants'
import styles from '../../styles'
import { motion } from 'framer-motion'

const Stats = () => (
  <motion.section className={`${styles.flexCenter} flex-row flex-wrap
  mb-6 sm:mb-20 text-white`}
  initial={{ opacity: 0}}
            whileInView={{ opacity: 1}}
            viewport={{ once: true }}
            transition={{ duration: 4, type: 'tween'}}
  >
    {stats.map((stat, i) => (
      <div key={stat.id} 
      className={`flex-1 flex justify-start items-center flex-row m-3`}>
        <h4 className='font-poppins font-semibold text-[30px] xs:text-[40px]
        leading-[43px] xs:leading-[53px] text-white'>{stat.value}</h4>
        <p className='font-poppins font-normal text-[15px] xs:text-[20px]
        leading-[21px] xs:leading-[26px] text-gradient uppercase ml-3'>{stat.title}</p>
      </div>
    ))}
  </motion.section>
)


export default Stats