import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles'
import Button from './Button'
import { logo, close, menu } from '../assets'
import { navLinks } from '../constants'

function Navbar() {
  const [toggle, setToggle] = useState(false)

  return (
    <nav className='w-full flex py-6 justify-between items-center navbar'>
      <Link to="/">
        <img src={logo} alt="Logo"
          className='w-[124px] h-[32px]' />
      </Link>

      <ul className="list-none hidden sm:flex justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] 
            text-white ${styles.linkHoverEffect} mr-10
            `}>
            <Link to={`/${nav.id}`}>
              {nav.title}
            </Link>
          </li>
        ))}
        <Link to={"/demo"}>
          <button type='button' className={`py-2 px-3
  bg-blue-gradient font-poppins font-medium text-[18px] 
  text-primary outline-none rounded-lg 
  ${styles.buttonHoverEffect}`}>
            Try Demo
          </button>
        </Link>
      </ul>


      {/* Mobile navbar */}
      <div className='sm:hidden flex flex-1 justify-end items-center'>
        <img src={toggle ? close : menu}
          alt='Menu'
          className='w-[28px] h-[28px] object-contain cursor-pointer'
          onClick={() => setToggle((prev) => !prev)}
        />

        <div
          className={`${toggle ? 'flex' : 'hidden'} 
        p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 
        min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex flex-col justify-end items-center flex-1">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins
            font-normal cursor-pointer text-[16px] text-white 
            ${styles.linkHoverEffect}
            mb-4
            `}>
                <a href={`${nav.id}`}>
                  {nav.title}
                </a>
              </li>
            ))}
                    <Link to={"/demo"}>
          <button type='button' className={`py-2 px-3
  bg-blue-gradient font-poppins font-medium text-[18px] 
  text-primary outline-none rounded-lg 
  ${styles.buttonHoverEffect}`}>
            Try Demo
          </button>
        </Link>
          </ul>
        </div>

      </div>

    </nav>
  )
}

export default Navbar