import React, { useState } from 'react'
import { motion } from 'framer-motion';
import styles from '../../styles';

function Contact() {
    return (
        <motion.section id="demo" className={`h-screen bg-primary ${styles.paddingX} ${styles.paddingY} ${styles.flexCenter}`}
        initial={{ opacity: 0}}
            whileInView={{ opacity: 1}}
            viewport={{ once: true }}
            transition={{ duration: 4, type: 'tween'}}
            >
            <div className={`${styles.boxWidth} h-[80%] ${styles.flexCenter} gap-1 flex-col`}>
                
                <div className='flex justify-center items-center flex-col my-5 h-full sm:h-[7-vh] max-w-[1200px] sm:max-w-[600px] mx-auto'>
                <h1 className='text-4xl sm:text-5xl text-gradient text-center'>
                    Contact Us
                </h1>

                <form action='https://getform.io/f/pbgxznea' method='post'
                    className=' w-[90%] sm:w-[100%]  p-6 mt-5 flex flex-col justify-center gap-2 max-w-[700px] bg-gray-700/20 rounded-3xl'>
                    <div className='flex gap-2 flex-col sm:flex-row'>
                        <input type='name' name='name' id='name' placeholder='Full Name'
                            className='flex-grow p-3 rounded-3xl bg-gray-800 border border-gray-700 text-white' />

                        <input type='email' name='email' id='email' placeholder='Email'
                            className='flex-grow p-3 rounded-3xl bg-gray-800 border border-gray-700 text-white' />
                    </div>

                    <textarea name='message' id='message' placeholder='Your Message' cols="20" rows="6"
                        className='w-full p-3 rounded-3xl bg-gray-800 border border-gray-700 text-white'></textarea>

                    <div className='relative inline-flex group my-3'>
                        <div className='bg-glow  absolute transition-all duration-1000 opacity-70 -inset-px
                            rounded-xl blur-lg group-hover:opacity-100
                            group-hover:-inset-1 group-hover:duration-200 animate-tilt'>
                        </div>
                        <button type='submit' className='w-full relative font-poppins bg-blue-gradient font-semibold	 text-black font-wei py-3 px-6 rounded-3xl
                            transition-all duration-200 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'>
                            Contact
                        </button>
                    </div>
                </form>
            </div>
            </div>

        </motion.section>
    )
}

export default Contact