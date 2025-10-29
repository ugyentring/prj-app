import React from 'react';
import { motion } from 'framer-motion';

// Icons replaced with simple text/emoji fallbacks for compatibility
const SocialIcon = ({ href, children, label, colorClass = "hover:text-white", viewBox = "0 0 24 24" }) => {
    // Define the style for the social icons to match the image (white outline)
    const SOCIAL_ICON_STYLE = "text-white border-2 border-white rounded-full p-2 transition duration-300 hover:bg-white hover:text-black hover:scale-105";

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`${SOCIAL_ICON_STYLE} ${colorClass} flex items-center justify-center`}
            aria-label={label}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBox}
                fill="currentColor"
                className="w-5 h-5"
            >
                {children}
            </svg>
        </motion.a>
    );
};

// Animation variants for the whole footer container
const footerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.15, // Stagger animation for child elements
        },
    },
};

// Animation variants for individual items (text blocks, icons)
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

/**
 * A professional, animated portfolio footer component matching the design
 * of the "Foolish Developer" style (centered content, dark theme).
 */
export default function Footer() {
    return (
        <motion.footer
            // 🚀 SHORTEST HEIGHT: py-6 for minimum padding
            className="w-full bg-black py-6 text-white"
            initial="hidden"
            // Animate when the footer comes into view
            whileInView="visible"
            variants={footerVariants}
            // Configuration for when to trigger the animation
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-4xl mx-auto px-6 text-center">

                {/* Main Content Area */}
                <div className="flex flex-col items-center">

                    {/* Title / Logo Text */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-center mb-4 gap-3"
                    >
                        <img
                            src="/images/brandlogo.jpg" // replace with your logo path
                            alt="Sapuna Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <h1 className="text-2xl md:text-3xl font-extrabold">
                            Sapuna Mongars
                        </h1>
                    </motion.div>

                    {/* Description Paragraph */}
                    <motion.p
                        variants={itemVariants}
                        // 🚀 SHORTER MARGIN: Reduced to mb-6
                        className="text-gray-400 mb-6 max-w-2xl mx-auto text-base leading-relaxed"
                    >
                        Highlighting projects that demonstrate my capability in web development and problem-solving.
                        You can also find me at:
                    </motion.p>

                    {/* Social Icons */}
                    <motion.div
                        variants={footerVariants}
                        // 🚀 SHORTER MARGIN: Reduced to mb-2 (to make space for copyright)
                        className="flex flex-wrap justify-center gap-5 text-[24px] mb-2"
                    >
                        {/* Facebook */}
                        <motion.a
                            variants={itemVariants}
                            href="https://www.facebook.com/share/1DdhjosA9f/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noreferrer"
                            className="text-white border-2 border-white rounded-full w-[44px] h-[44px] flex items-center justify-center transition duration-300 hover:bg-white hover:text-black hover:scale-105 text-xl font-bold"
                            aria-label="Facebook Profile"
                        >
                            f
                        </motion.a>

                        {/* LinkedIn */}
                        <motion.a
                            variants={itemVariants}
                            href="https://www.linkedin.com/in/sapunamongar"
                            target="_blank"
                            rel="noreferrer"
                            className="text-white border-2 border-white rounded-full w-[44px] h-[44px] flex items-center justify-center transition duration-300 hover:bg-white hover:text-black hover:scale-105 text-xl font-bold"
                            aria-label="LinkedIn Profile"
                        >
                            in
                        </motion.a>

                        {/* Instagram */}
                        <motion.a
                            variants={itemVariants}
                            href="https://www.instagram.com/sapuna_mgr?igsh=MWUzb3dpNXNsaTFodA%3D%3D&utm_source=qr"
                            target="_blank"
                            rel="noreferrer"
                            className="text-white border-2 border-white rounded-full w-[44px] h-[44px] flex items-center justify-center transition duration-300 hover:bg-white hover:text-black hover:scale-105 text-xl font-bold"
                            aria-label="Instagram Profile"
                        >
                            ig
                        </motion.a>

                    </motion.div>

                    {/* Final Copyright Text at the very bottom */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xs font-light text-gray-500 w-full text-center"
                    >
                        @copyrightsapunamongar
                    </motion.p>
                </div>
            </div>
        </motion.footer>
    );
}