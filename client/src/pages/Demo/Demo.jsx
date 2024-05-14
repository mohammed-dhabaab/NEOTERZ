import { useState } from "react"
import styles from "../../styles"
import { motion } from "framer-motion"
import Dropzone from "./Dropzone"

function Demo() {
    const [programType, setProgramType] = useState("Visitors Counter")
    const handleProgramType = (programType) => {
        setProgramType(programType)
    }

    return (
        <motion.section id="demo" className={`h-screen bg-primary ${styles.paddingX} ${styles.paddingY} ${styles.flexCenter}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 4, type: 'tween' }}
        >
            <div className={`${styles.boxWidth} h-[80%] ${styles.flexCenter} gap-1 flex-col`}>

                <div className="text-white flex flex-start w-full gap-2">
                    <h3 onClick={() => handleProgramType("Visitors Counter")} className={`cursor-pointer font-poppins py-2 px-4 rounded-xl ${styles.transitionEffect} ${programType === "Visitors Counter" ? "activeCard" : ""}`}>Visitors Counter</h3>
                    <h3 onClick={() => handleProgramType("Theft Detector")} className={`cursor-pointer font-poppins py-2 px-4 rounded-xl ${styles.transitionEffect} ${programType === "Theft Detector" ? "activeCard" : ""}`}>Theft Detector</h3>
                </div>

                <Dropzone programType={programType} />

            </div>
        </motion.section>
    )
}


export default Demo