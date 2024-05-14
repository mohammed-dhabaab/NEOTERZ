import styles from "../styles"

const Button = ({style, title}) => (
  <button type='button' className={`${style} py-4 px-6 
  bg-blue-gradient font-poppins font-medium text-[18px] 
  text-primary outline-none rounded-lg 
  ${styles.buttonHoverEffect}`}>
    {title}
  </button>
)

export default Button