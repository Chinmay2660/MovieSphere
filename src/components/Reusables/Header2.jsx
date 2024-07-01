import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { navigation } from "../../utils/constants";

const Header2 = () => {
    const [searchInput, setSearchInput] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        navigate(`/search?q=${searchInput}`)
    }, [searchInput])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <header className="fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75">
            <div className="container mx-auto px-3 flex items-center h-full">
                <Link to={"/"}>
                    <img
                        src="https://www.floatui.com/logo.svg"
                        width={120}
                        height={50}
                        alt="Float UI logo"
                    />
                </Link>
                <nav className="hidden lg:flex items-center gap-4 ml-2" onSubmit={handleSubmit}>
                    {navigation.map((nav, index) => (
                        <div key={index}>
                            <NavLink
                                to={nav.path}
                                className={({ isActive }) => `px-2 hover:text-neutral-100 ${isActive ? 'text-neutral-100' : ''}`}
                            >
                                {nav.title}
                            </NavLink>
                        </div>
                    ))}
                </nav>
                <div className="ml-auto flex items-center gap-5">
                    <form className="flex items-center gap-2">
                        <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} type='text' placeholder="Search..." className="bg-transparent px-4 py-1 outline-none border-none hidden lg:block" />
                        <button className="text-2xl text-white">
                            <IoSearchOutline />
                        </button>
                    </form>
                    <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all">
                        <img src='' className='w-full h-full' />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header2;
