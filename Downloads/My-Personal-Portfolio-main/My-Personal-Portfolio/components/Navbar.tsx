// 'use client'

// import { useEffect, useState, useMemo } from 'react';
// import { motion, useAnimation } from 'framer-motion';
// import Image from 'next/image';

// // --- STUBBED DEPENDENCIES for Single File Execution ---
// const Link = ({ href, onClick, className, children, download }) => (
//     <a href={href} onClick={onClick} className={className} download={download}>{children}</a>
// );
// const usePathname = () => '/';
// const useAuth = () => ({ user: null, logout: () => console.log("Logout stubbed") });
// // --------------------------------------------------------

// export default function Navbar() {
//     const pathname = usePathname();
//     const { user, logout } = useAuth();
//     const [currentHash, setCurrentHash] = useState('');
//     const [menuOpen, setMenuOpen] = useState(false);

//     // Map all relevant section IDs from the main component
//     const sectionIds = ['hero', 'skills', 'resume', 'projects', 'contact'];

//     useEffect(() => {
//         if (pathname !== '/') {
//             setCurrentHash('');
//             return;
//         }

//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     // Determine if the top of the section is visible
//                     if (entry.isIntersecting) {
//                         const hash = entry.target.id === 'hero' ? '' : `#${entry.target.id}`;
//                         setCurrentHash(hash);
//                     }
//                 });
//             },
//             { root: null, rootMargin: '0px 0px -70% 0px', threshold: 0 } // Active when section is in upper 30% of viewport
//         );

//         sectionIds.forEach((id) => {
//             const el = document.getElementById(id);
//             if (el) observer.observe(el);
//         });

//         return () => observer.disconnect();
//     }, [pathname, sectionIds]);

//     const isActive = (hash) => pathname === '/' && (currentHash === hash || (hash === '' && currentHash === ''));

//     // MODIFIED: Renamed nav items to better reflect content sections
//     const navItems = [
//         { name: 'Home', href: '/#hero', hash: '' },
//         { name: 'Skills & Values', href: '/#skills', hash: '#skills' }, // Combines Core Values & Tech Skills
//         { name: 'Timeline', href: '/#resume', hash: '#resume' }, // Renamed from Resume
//         { name: 'Projects', href: '/#projects', hash: '#projects' },
//     ];

//     const cacheBuster = useMemo(() => `?v=${Date.now()}`, [user]);

//     const actionLinks = [
//         { name: 'Contact', href: '/#contact', hash: '#contact' },
//         { name: 'Download CV', href: `/cv/CV_Sapuna_Mongar.pdf${cacheBuster}`, hash: '/cv', isDownload: true },
//     ];

//     const handleLinkClick = () => setMenuOpen(false);

//     const BRAND_RED = '#BA1B1B';
//     const BRAND_RED_LIGHT = '#D54444';

//     return (
//         <div className="sticky top-0 z-50 bg-black shadow-xl w-full border-b border-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
//             <div className="container mx-auto flex justify-between items-center py-4 px-6 max-w-7xl">

//                 {/* Logo/Name - Left Side */}
//                 <Link href="/#hero" onClick={handleLinkClick} className="flex items-center">
//                     <Image
//                         src="/images/brandlogo.jpg"
//                         alt="Brand Logo"
//                         width={40}
//                         height={40}
//                         className="mr-2 rounded-full" // Ensure logo is round
//                     />
//                     <span className="text-[#F1F1F1] font-extrabold text-xl sm:text-2xl select-none"></span>
//                 </Link>

//                 {/* Hamburger menu button - Right Side (Mobile) */}
//                 <button
//                     className="relative z-50 w-8 h-8 md:hidden flex flex-col justify-between items-center group"
//                     aria-label="Toggle menu"
//                     onClick={() => setMenuOpen(!menuOpen)}
//                     type="button"
//                 >
//                     <span className={`block h-1 w-8 bg-[#F1F1F1] rounded-lg transform transition duration-500 ease-in-out ${menuOpen ? 'rotate-45 translate-y-3.5 bg-[#BA1B1B]' : 'bg-[#F1F1F1]'}`} />
//                     <span className={`block h-1 w-8 bg-[#F1F1F1] rounded-lg transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
//                     <span className={`block h-1 w-8 bg-[#F1F1F1] rounded-lg transform transition duration-500 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-3.5 bg-[#BA1B1B]' : 'bg-[#F1F1F1]'}`} />
//                 </button>

//                 {/* Desktop Nav & Action Links - Right Side (Desktop) */}
//                 <nav className={`fixed top-[68px] left-0 right-0 bg-black md:bg-transparent md:static md:flex md:items-center md:gap-8 overflow-hidden transition-[max-height] duration-500 ease-in-out ${menuOpen ? 'max-h-screen shadow-2xl' : 'max-h-0 md:max-h-full'}`}>
//                     <div className="flex flex-col items-start md:items-center md:flex-row md:gap-8 px-6 py-4 md:p-0">

//                         {/* Main Nav Items */}
//                         {navItems.map((item) => {
//                             const condition = isActive(item.hash);
//                             return (
//                                 <Link
//                                     key={item.name}
//                                     href={item.href}
//                                     onClick={handleLinkClick}
//                                     className={`relative font-semibold text-base transition-colors duration-200 mb-4 md:mb-0
//                                         ${condition
//                                             ? `text-[#BA1B1B] underline underline-offset-4 decoration-2 decoration-[#BA1B1B] hover:text-[#BA1B1B]`
//                                             : `text-gray-300 hover:text-white`
//                                         }
//                                     `}
//                                 >
//                                     {item.name}
//                                 </Link>
//                             )
//                         })}

//                         {/* Contact link - desktop (regular link style) */}
//                         <Link
//                             key={actionLinks[0].name}
//                             href={actionLinks[0].href}
//                             onClick={handleLinkClick}
//                             className={`relative font-semibold text-base transition-colors duration-200 mb-4 md:mb-0
//                                 ${isActive(actionLinks[0].hash)
//                                     ? `text-[#BA1B1B] underline underline-offset-4 decoration-2 decoration-[#BA1B1B] hover:text-[#BA1B1B]`
//                                     : `text-gray-300 hover:text-white`
//                                 }
//                                 hidden md:block
//                             `}
//                         >
//                             {actionLinks[0].name}
//                         </Link>

//                         {/* Mobile Action Links (Contact & Download CV) */}
//                         <div className="flex flex-col md:hidden w-full">
//                             <Link
//                                 href={actionLinks[0].href}
//                                 onClick={handleLinkClick}
//                                 className="block px-5 py-2 rounded-xl text-lg font-bold border-2 border-[#BA1B1B] bg-transparent text-[#BA1B1B] transition-all duration-300 hover:bg-[#D54444] hover:text-white hover:shadow-lg mt-2"
//                             >
//                                 {actionLinks[0].name}
//                             </Link>
//                             <Link
//                                 href={actionLinks[1].href}
//                                 onClick={handleLinkClick}
//                                 className="block px-5 py-2 rounded-xl text-lg font-bold border border-[#BA1B1B] bg-[#BA1B1B] text-white transition-all duration-300 hover:bg-[#D54444] hover:shadow-lg mt-4"
//                                 download
//                             >
//                                 {actionLinks[1].name}
//                             </Link>
//                         </div>

//                     </div>

//                     {/* Desktop Download CV (Styled as button) */}
//                     <Link
//                         href={actionLinks[1].href}
//                         className="hidden md:block relative px-5 py-2 rounded-xl text-sm font-bold border-2 border-[#BA1B1B] text-[#F1F1F1] bg-[#BA1B1B] transition-all duration-300 hover:bg-[#D54444] hover:shadow-lg ml-8"
//                         download
//                     >
//                         {actionLinks[1].name}
//                     </Link>
//                 </nav>
//             </div>
//         </div>
//     );
// }


'use client'

import React, { useEffect, useState, useMemo, ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';

// --- LINK TYPES ---
interface LinkProps {
    href: string;
    onClick?: () => void;
    className?: string;
    children: ReactNode;
    download?: boolean; // Used to trigger the HTML download attribute
}

// --- STUBBED DEPENDENCIES for Single File Execution ---
// FIX: Applied LinkProps interface to resolve implicit 'any' type error
const Link = ({ href, onClick, className, children, download }: LinkProps) => (
    <a href={href} onClick={onClick} className={className} download={download ? 'download' : undefined}>{children}</a>
);
const usePathname = () => '/';
// Added explicit type for useAuth return value for cleaner TS structure
const useAuth = () => ({ user: null, logout: () => console.log("Logout stubbed") });
// --------------------------------------------------------

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [currentHash, setCurrentHash] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    // Map all relevant section IDs from the main component
    const sectionIds = ['hero', 'skills', 'resume', 'projects', 'contact'];

    useEffect(() => {
        if (pathname !== '/') {
            setCurrentHash('');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Determine if the top of the section is visible
                    if (entry.isIntersecting) {
                        const hash = entry.target.id === 'hero' ? '' : `#${entry.target.id}`;
                        setCurrentHash(hash);
                    }
                });
            },
            { root: null, rootMargin: '0px 0px -70% 0px', threshold: 0 } // Active when section is in upper 30% of viewport
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [pathname, sectionIds]);

    const isActive = (hash: string) => pathname === '/' && (currentHash === hash || (hash === '' && currentHash === ''));

    // MODIFIED: Renamed nav items to better reflect content sections
    const navItems = [
        { name: 'Home', href: '/#hero', hash: '' },
        { name: 'Skills & Values', href: '/#skills', hash: '#skills' }, // Combines Core Values & Tech Skills
        { name: 'Timeline', href: '/#resume', hash: '#resume' }, // Renamed from Resume
        { name: 'Projects', href: '/#projects', hash: '#projects' },
    ];

    const cacheBuster = useMemo(() => `?v=${Date.now()}`, [user]);

    const actionLinks = [
        { name: 'Contact', href: '/#contact', hash: '#contact' },
        { name: 'Download CV', href: `/cv/CV_Sapuna_Mongar.pdf${cacheBuster}`, hash: '/cv', isDownload: true },
    ];

    const handleLinkClick = () => setMenuOpen(false);

    const BRAND_RED = '#BA1B1B';
    const BRAND_RED_LIGHT = '#D54444';

    return (
        <div className="sticky top-0 z-50 bg-black shadow-xl w-full border-b border-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="container mx-auto flex justify-between items-center py-4 px-6 max-w-7xl">

                {/* Logo/Name - Left Side */}
                <Link href="/#hero" onClick={handleLinkClick} className="flex items-center">
                    <Image
                        src="/images/brandlogo.jpg"
                        alt="Brand Logo"
                        width={40}
                        height={40}
                        className="mr-2 rounded-full" // Ensure logo is round
                    />
                    <span className="text-[#F1F1F1] font-extrabold text-xl sm:text-2xl select-none"></span>
                </Link>

                {/* Hamburger menu button - Right Side (Mobile) */}
                <button
                    className="relative z-50 w-8 h-8 md:hidden flex flex-col justify-between items-center group"
                    aria-label="Toggle menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                    type="button"
                >
                    <span className={`block h-1 w-8 bg-[#F1F1F1] rounded-lg transform transition duration-500 ease-in-out ${menuOpen ? 'rotate-45 translate-y-3.5 bg-[#BA1B1B]' : 'bg-[#F1F1F1]'}`} />
                    <span className={`block h-1 w-8 bg-[#F1F1F1] rounded-lg transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`block h-1 w-8 bg-[#F1F1F1] rounded-lg transform transition duration-500 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-3.5 bg-[#BA1B1B]' : 'bg-[#F1F1F1]'}`} />
                </button>

                {/* Desktop Nav & Action Links - Right Side (Desktop) */}
                <nav className={`fixed top-[68px] left-0 right-0 bg-black md:bg-transparent md:static md:flex md:items-center md:gap-8 overflow-hidden transition-[max-height] duration-500 ease-in-out ${menuOpen ? 'max-h-screen shadow-2xl' : 'max-h-0 md:max-h-full'}`}>
                    <div className="flex flex-col items-start md:items-center md:flex-row md:gap-8 px-6 py-4 md:p-0">

                        {/* Main Nav Items */}
                        {navItems.map((item) => {
                            const condition = isActive(item.hash);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={`relative font-semibold text-base transition-colors duration-200 mb-4 md:mb-0
                                        ${condition
                                            ? `text-[#BA1B1B] underline underline-offset-4 decoration-2 decoration-[#BA1B1B] hover:text-[#BA1B1B]`
                                            : `text-gray-300 hover:text-white`
                                        }
                                    `}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}

                        {/* Contact link - desktop (regular link style) */}
                        <Link
                            key={actionLinks[0].name}
                            href={actionLinks[0].href}
                            onClick={handleLinkClick}
                            className={`relative font-semibold text-base transition-colors duration-200 mb-4 md:mb-0
                                ${isActive(actionLinks[0].hash)
                                    ? `text-[#BA1B1B] underline underline-offset-4 decoration-2 decoration-[#BA1B1B] hover:text-[#BA1B1B]`
                                    : `text-gray-300 hover:text-white`
                                }
                                hidden md:block
                            `}
                        >
                            {actionLinks[0].name}
                        </Link>

                        {/* Mobile Action Links (Contact & Download CV) */}
                        <div className="flex flex-col md:hidden w-full">
                            <Link
                                href={actionLinks[0].href}
                                onClick={handleLinkClick}
                                className="block px-5 py-2 rounded-xl text-lg font-bold border-2 border-[#BA1B1B] bg-transparent text-[#BA1B1B] transition-all duration-300 hover:bg-[#D54444] hover:text-white hover:shadow-lg mt-2"
                            >
                                {actionLinks[0].name}
                            </Link>
                            <Link
                                href={actionLinks[1].href}
                                onClick={handleLinkClick}
                                className="block px-5 py-2 rounded-xl text-lg font-bold border border-[#BA1B1B] bg-[#BA1B1B] text-white transition-all duration-300 hover:bg-[#D54444] hover:shadow-lg mt-4"
                                download
                            >
                                {actionLinks[1].name}
                            </Link>
                        </div>

                    </div>

                    {/* Desktop Download CV (Styled as button) */}
                    <Link
                        href={actionLinks[1].href}
                        className="hidden md:block relative px-5 py-2 rounded-xl text-sm font-bold border-2 border-[#BA1B1B] text-[#F1F1F1] bg-[#BA1B1B] transition-all duration-300 hover:bg-[#D54444] hover:shadow-lg ml-8"
                        download
                    >
                        {actionLinks[1].name}
                    </Link>
                </nav>
            </div>
        </div>
    );
}
