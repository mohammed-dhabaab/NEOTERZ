import styles from "../styles"
import { logo } from "../assets"
import { socialMedia } from "../constants"

const Footer = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
    <div className={`flex justify-between items-center flex-col sm:flex-row mb-8 w-full`}>

      <div className="flex-1 flex flex-col justify-start mr-10">
        <a href="#home">
          <img src={logo} alt="NEOTERZ"
            className="w-[266px] h-[72px] object-contain" />
        </a>

        <p className={`${styles.paragraph} mt-4 ml-5 max-w-[310px]`}>
          A new ways of data driven decision, reliable and secure!</p>
      </div>

    </div>

    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
        Copyright Ⓒ 2022 NEOTERZ. All Rights Reserved.
      </p>

      <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          <img
            key={social.id}
            src={social.icon}
            alt={social.id}
            className={`w-[21px] h-[21px] object-contain cursor-pointer 
            ${styles.iconHoverEffect}
            ${index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
              }`}
            onClick={() => window.open(social.link)}
          />
        ))}
      </div>
    </div>
  </section>
)


export default Footer