import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo2.png'
const Navbar = () => {
    const links = <>
        <a className='font-medium text-base hover:text-blue-600 mr-5'><NavLink to="/pdashboard" className={({ isActive }) =>
            `font-medium hover:text-blue-600 transition-colors duration-300 ${isActive ? 'text-blue-600' : ""
            }`
        }
        >Patient Dashboard</NavLink></a>
        <a className='font-medium text-base hover:text-blue-600 mr-5'><NavLink to="/ddashboard" className={({ isActive }) =>
            `font-medium hover:text-blue-600 transition-colors duration-300 ${isActive ? 'text-blue-600' : ""
            }`
        }>Doctor Dashboard</NavLink></a>
        <a className=' hover:text-blue-600 mr-5'><NavLink
            to="/"
            className={({ isActive }) =>
                `font-medium text-base hover:text-blue-600 transition-colors duration-300 ${isActive ? 'text-blue-600' : ''
                }`
            }
        >
            Login
        </NavLink></a>
        <a className='font-medium text-base hover:text-blue-600 mr-5'><NavLink to="/register" className={({ isActive }) =>
            `font-medium hover:text-blue-600 transition-colors duration-300 ${isActive ? 'text-blue-600' : ""
            }`
        }
        >Register</NavLink></a>
    </>
    return (
        <div className="bg-white sticky top-0 z-50">
            <div className="mx-auto shadow-sm px-4 py-4 flex justify-between items-center -mt-[1px]">
                <div>
                    <img className='md:h-[5vh] md:w-[18vw]' src={logo} alt="" />
                </div>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 shadow">
                        {links}
                    </ul>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;