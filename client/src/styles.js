const styles = {
    boxWidth: "xl:max-w-[1280px] w-full",
  
    linkHoverEffect: "hover:text-secondary transition-all duration-500 ease-in-out",
    iconHoverEffect: "hover:opacity-50 transition duration-500 ease-in-out",
    buttonHoverEffect: "hover:scale-105 transition-all	ease-in-out",
    cardHoverEffect: "",

    transitionEffect: "transition-all transition duration-500 ease-in-out",

    controlButton: "transition-all transition duration-500 ease-in-out cursor-pointer bg-gray-400 py-1 px-3 rounded-xl hover:bg-gray-200",
    
    heading2: "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
    paragraph: "font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px]",
  
    flexCenter: "flex justify-center items-center",
    flexStart: "flex justify-center items-start",
  
    paddingX: "sm:px-16 px-6",
    paddingY: "sm:py-16 py-6",
    padding: "sm:px-16 px-6 sm:py-12 py-4",
  
    marginX: "sm:mx-16 mx-6",
    marginY: "sm:my-16 my-6",
  };
  
  export const layout = {
    section: `flex md:flex-row flex-col ${styles.paddingY}`,
    sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,
  
    sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
    sectionImg: `flex-1 flex md:ml-10 ml-0 md:mt-0 mt-10 relative`,
  
    sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
  };
  
  export default styles;