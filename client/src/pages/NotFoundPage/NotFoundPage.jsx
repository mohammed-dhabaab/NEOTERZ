import React from 'react'
import styles from '../../styles'
import { Button } from '../../components'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
    return (
        <motion.div className={`bg-primary ${styles.flexStart}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 4, type: 'tween' }}>

            <div className={`${styles.boxWidth} flex justify-center items-center flex-col h-screen w-screen gap-6`}>
                <h1 className='text-white  font-poppins font-semibold ss:text-[72px] text-[52px] '>404 Not Found</h1>
                <Link to={"/"}>
                    <button type='button' className={`py-2 px-3
  bg-blue-gradient font-poppins font-medium text-[18px] 
  text-primary outline-none rounded-lg 
  ${styles.buttonHoverEffect}`}>
                        Back to Home Page
                    </button>
                </Link>
            </div>
        </motion.div>
    )
}

export default NotFoundPage