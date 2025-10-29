'use client'
// Import the correct, external Footer component
// New corrected import
import Footer from '../components/Footer.tsx';
import { FaPhone, FaEnvelope, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';
import { useEffect, useState, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';


// --- BRAND COLORS ---
const BRAND_RED = '#BA1B1B';
const BRAND_BLACK = '#000000';
const BRAND_WHITE = '#F1F1F1';

// --- ICON TYPES ---
interface IconProps {
  // FIX: Made 'path' optional with '?' to satisfy dynamic component rendering (Error: 308)
  path?: string;
  className?: string;
  color?: string;
  size?: string;
}

// --- GAUGE TYPES ---
interface CircleGaugeProps {
  size?: number;
  strokeWidth?: number;
  percent: number; // Fix for implicit 'any' error
  color: string;
  label: string;
}

// --- ICON COMPONENTS ---
const Icon = ({ path, className = 'w-6 h-6', color = BRAND_RED, size = '24' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Only render path if it exists, though in wrapper components it always will */}
    {path && <path d={path} />}
  </svg>
);

// Wrapper icons: Uses the Rest Operator ({ path, ...rest }) to prevent 'path' being passed twice.
const UserIcon = ({ path, ...rest }: IconProps) => <Icon path="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" {...rest} />;
const ZapIcon = ({ path, ...rest }: IconProps) => <Icon path="M13 2L3 14h9l-1 8 10-12h-9l1-8z" {...rest} />;
const TargetIcon = ({ path, ...rest }: IconProps) => <Icon path="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 10a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 2v2M22 12h-2M12 22v-2M2 12h2" {...rest} />;
const CodeIcon = ({ path, ...rest }: IconProps) => <Icon path="M16 18l4-4-4-4M8 6l-4 4 4 4M21 12H3" {...rest} />;
const PhoneIcon = ({ path, ...rest }: IconProps) => <Icon path="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-8.15-8.15 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.74A17.47 17.47 0 0 0 8.58 6 2 2 0 0 1 8 7.5c0 .77-.42 1.34-.67 1.76a4.05 4.05 0 0 0-.29.43 2 2 0 0 1-2 2.11H4a2 2 0 0 1-2-2 16 16 0 0 1 1.5-4.5 2 2 0 0 1 1.7-1.42A19.89 19.89 0 0 1 18 3.5a2 2 0 0 1 1.7-1.42 16 16 0 0 1 4.5 1.5 2 2 0 0 1 2 2z" {...rest} />;
const MailIcon = ({ path, ...rest }: IconProps) => <Icon path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" {...rest} />;
const MapPinIcon = ({ path, ...rest }: IconProps) => <Icon path="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" {...rest} />;
const LinkedInIcon = ({ path, ...rest }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
);

// --- CV DATA ---
const sapunaData = {
  name: "Sapuna Mongar",
  heroText: "Tech Visionary. Strategic Leader.",
  summary: "Driving innovation as a Computer Science graduate specializing in Blockchain, UI/UX, full-stack development, and cybersecurity fundamentals. Principled, disciplined, and resilient, focused on building decentralized solutions and impactful projects that create value for organizations and communities.",
  contact: {
    phone: "+975 77436029",
    email: "sapunablockchain@gmail.com",
    linkedin: "https://www.linkedin.com/in/sapuna-mongar-758422295",
    location: "Thimphu, Kabjisa, 11005",
  },
  technicalSkills: [
    { name: 'Blockchain Development', percent: 95 },
    { name: 'UI/UX (Figma)', percent: 90 },
    { name: 'React js / Next.js', percent: 85 },
    { name: 'Html Css and js', percent: 80 },
    { name: 'Cybersecurity Basics', percent: 85 },
    { name: 'Public Speaking / Presentations', percent: 80 },
  ],
  coreSoftSkills: [
    { icon: TargetIcon, title: 'Purpose-Driven', description: 'Guided by strong values and a vision to empower communities through technology.' },
    { icon: ZapIcon, title: 'Discipline & Resilience', description: 'Committed to hard work, consistency, and overcoming challenges with strength.' },
    { icon: UserIcon, title: 'Leadership & Altruism', description: 'Coordinator for Red Cross Society and Class Representative, prioritizing the needs of others.' },
    { icon: CodeIcon, title: 'Innovation & Problem Solving', description: 'Finding creative solutions, backed by hackathon experience and numerical analysis.' },
  ],
  softSkillsGauges: [
    { name: 'Curiosity', percent: 90, color: '#3B82F6' },
    { name: 'Discipline', percent: 95, color: BRAND_RED },
    { name: 'Time Management', percent: 85, color: '#F59E0B' },
    { name: 'Team Work', percent: 90, color: '#10B981' },
    { name: 'Cooperation', percent: 88, color: '#EC4899' },
    { name: 'Respect', percent: 94, color: '#6366F1' },
  ],
  experienceEducation: [
    { type: 'Experience', title: 'GCIT RedCross Society Coordinator', period: 'Aug 2025', institution: 'Organized Blood Donation Campaign (98 units collected)' },
    { type: 'Experience', title: 'Blockchain Developer (Internship)', period: 'July 2025 - August 2025', institution: 'GovTech Agency, Thimphu' },
    { type: 'Experience', title: 'Class Representative', period: 'Feb 2023 - Aug 2024', institution: 'Gyalpozhing College of Information Technology' },
    { type: 'Education', title: 'B.C.S. in Blockchain Technology', period: '2022 - 2026', institution: 'Gyalpozhing College of Information Technology' },
    { type: 'Education', title: 'Higher Secondary School (Class 12)', period: '2021-2022', institution: 'Yonten Kuenjung Academy' },
  ],
  projects: [
    { title: 'DrukAgriChain (GovTech)', role: 'Frontend & Blockchain Dev', tech: 'Hyperledger Fabric, Golang, HTML/CSS/JS', description: 'Developed a Permissionless Blockchain Supply Chain system for organic food traceability and certification during my internship.' },
    { title: 'TERA (Capstone)', role: 'UI/UX & Frontend Dev', tech: 'React js, Figma, Canva', description: 'Designed the UI/UX and frontend for a Transparent E-state Registry and Authentication system using a permissionless blockchain.' },
    { title: 'ChainScholar (DApp)', role: 'UI/UX, Frontend, Smart Contract', tech: 'React.js, Blockchain, DApp', description: 'Decentralized Application connecting academic staff and students for community interaction and contribution evaluation.' },
    { title: 'Leave Record System', role: 'Backend Developer', tech: 'Node.js, Express, MongoDB', description: 'Developed the backend for a Fullstack system to track and manage college students’ weekend leave requests securely.' },
    { title: 'NorbNode', role: 'UI/UX & Smart Contract', tech: 'Cryptocurrency ETH', description: 'Blockchain Social Media platform where users control governance and monetization.' },
    { title: 'GCIT No Due System', role: 'UI/UX & Frontend Developer', tech: 'HTML, CSS, JS, Figma', description: 'Designed and developed the frontend for a simple No Due System for students to clear pending dues across departments.' },
  ]
};

const statsData = [
  { value: "3+", label: "Years of experience" },
  { value: "6+", label: "Projects completed" },
  { value: "5+", label: "Technologies certificates" },
  { value: "16+", label: "Years of Education" },
];

// --- CIRCLE GAUGE COMPONENT ---
const CircleGauge = ({ size = 80, strokeWidth = 8, percent, color, label }: CircleGaugeProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start({
      strokeDashoffset: circumference * (1 - percent / 100),
      transition: { duration: 1.5, ease: 'easeInOut' },
    });
  }, [circumference, percent, animationControls]);

  return (
    <div className="flex flex-col items-center relative w-1/3 px-1 min-w-[80px] mb-6">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={animationControls}
        />
      </svg>
      <div
        className="absolute text-white font-semibold text-lg select-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {percent}%
      </div>
      <span className="mt-4 text-gray-300 font-medium text-center text-xs sm:text-sm leading-tight">{label}</span>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const fadeInClass = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';
  const [typedText, setTypedText] = useState('');
  const fullText = sapunaData.heroText;

  useEffect(() => {
    setIsVisible(true);
    if (fullText.length > 0) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setTypedText(fullText.substring(0, i + 1));
          i++;
        } else clearInterval(typingInterval);
      }, 70);
      return () => clearInterval(typingInterval);
    } else setTypedText(fullText);
  }, [fullText]);

  const sortedExperienceEducation = useMemo(() => {
    return [...sapunaData.experienceEducation].sort((a, b) => {
      const periodA = a.period.split(' - ')[1] || a.period.split(' - ')[0];
      const periodB = b.period.split(' - ')[1] || b.period.split(' - ')[0];
      return periodB.localeCompare(periodA);
    });
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center py-20 bg-black w-full overflow-hidden"
      >
        <div className="relative z-10 w-full max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">

            {/* 1. Profile Image Column (Round, Softly Faded/Blurred) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              // MODIFIED: Opacity changed to 0.8 for subtle fade/blend
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              className="w-full md:w-2/5 flex justify-center order-2 md:order-1"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 overflow-hidden rounded-full">
                <img
                  src="/images/meee.jpeg" // Path: /public/images/profileimage.png
                  alt="Sapuna Mongar Profile"
                  // MODIFIED: Added a small blur filter via inline style
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>

            {/* 2. Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="text-center md:text-left w-full md:w-3/5 order-1 md:order-2"
            >
              <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BA1B1B] to-white tracking-tight min-h-[4rem] mb-6">
                {typedText}
                {typedText.length < fullText.length && (
                  <span className="text-[#BA1B1B] blinking-cursor">|</span>
                )}
              </h1>
              <h2 className={`text-4xl sm:text-5xl font-extrabold text-white mb-8`}>
                Sapuna Mongar
              </h2>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-3xl md:max-w-full md:mx-0 mx-auto">
                {sapunaData.summary}
              </p>
              <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6">
                <a
                  href="#contact"
                  className="px-8 py-3 bg-[#BA1B1B] text-white rounded-xl font-semibold shadow-lg hover:bg-white hover:text-black hover:scale-105 transition-transform duration-300 border-2 border-[#BA1B1B]"
                >
                  Hire me
                </a>
                <a
                  href="#projects"
                  className="px-8 py-3 border-2 border-[#BA1B1B] text-[#BA1B1B] rounded-xl font-semibold hover:bg-[#BA1B1B] hover:text-white transition-colors duration-300"
                >
                  View Projects
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values/Personality Section */}
      <section id="skills" className="pt-16 pb-20 bg-gray-900 text-white w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 text-center px-6 max-w-4xl mx-auto text-[#BA1B1B]"
        >
          Core Values & Brand Personality
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6 max-w-7xl mx-auto"
        >
          {sapunaData.coreSoftSkills.map(({ icon: IconComponent, title, description }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center border border-gray-700 border-t-4 border-t-[#BA1B1B] bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:ring-2 hover:ring-[#BA1B1B] transition-transform duration-300 group relative overflow-hidden"
            >
              <div className="mb-4 z-10">
                {/* FIX: IconComponent can now be rendered without explicitly passing the 'path' prop here */}
                <IconComponent color={BRAND_RED} size="36" className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center z-10 text-white">{title}</h3>
              <p className="text-center text-sm text-gray-300 z-10">{description}</p>
              {/* Glow Effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl blur-lg"
                style={{ backgroundColor: BRAND_RED }}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Technical Skills & Resume Section */}
      <section id="resume" className={`pt-16 pb-20 bg-black text-white w-full ${fadeInClass}`}>
        <div className="text-center mb-10 px-6 max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white">Skills & Experience Snapshot</h2>
          <p className="text-md text-gray-400 mt-2 max-w-3xl mx-auto">
            My commitment to technology, innovation, and continuous improvement.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">

          {/* Row 1 / Column 1: Technical Skills */}
          <div className="lg:border-r lg:border-gray-700 pr-4">
            <h3 className="text-xl font-semibold mb-4 text-[#BA1B1B]">Technical Skills</h3>
            <div className="space-y-5">
              {sapunaData.technicalSkills.map(({ name, percent }) => (
                <div key={name}>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span className="text-white">{name}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                      className="h-3 rounded-full"
                      style={{ backgroundColor: BRAND_RED }}
                    />
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Row 1 & 2 / Column 2: Soft Skills Gauges (2 rows of 3 columns) */}
          <div className="lg:border-r lg:border-gray-700 px-4 flex flex-col items-center justify-start">
            <h3 className="text-xl font-semibold mb-6 text-[#BA1B1B]">Soft Skills</h3>

            {/* Soft Skills Gauges: Row 1 (3 cols) */}
            <div className="flex justify-center w-full">
              {sapunaData.softSkillsGauges.slice(0, 3).map(({ name, percent, color }) => (
                <CircleGauge key={name} percent={percent} color={color} label={name} />
              ))}
            </div>
            {/* Soft Skills Gauges: Row 2 (3 cols) */}
            <div className="flex justify-center w-full">
              {sapunaData.softSkillsGauges.slice(3, 6).map(({ name, percent, color }) => (
                <CircleGauge key={name} percent={percent} color={color} label={name} />
              ))}
            </div>
          </div>

          {/* Row 1 / Column 3: Timeline */}
          <div className="pl-4">
            <h3 className="text-xl font-semibold mb-6 text-[#BA1B1B]">Timeline</h3>
            <div className="space-y-6 text-sm">
              {sortedExperienceEducation.map((item, index) => (
                <div key={index} className="border-l-2 border-[#BA1B1B] pl-3 relative">
                  <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-[#BA1B1B]" />
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-gray-400 text-xs italic">{item.institution}</p>
                  <p className="text-xs text-gray-500">{item.period}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section (New Section from the image) */}
      <section id="stats" className="bg-gray-950 py-12 text-white w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center text-center p-2 border-r md:border-r border-gray-700 last:border-r-0 md:last:border-r-0"
            >
              <span className="text-5xl lg:text-6xl font-extrabold text-white leading-none">
                {stat.value}
              </span>
              <p className="text-base font-medium text-gray-300 mt-2 whitespace-nowrap">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* End of Stats Section */}

      {/* Projects Section */}
      <section id="projects" className="pt-16 pb-20 bg-gray-900 text-white w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 text-center px-6 max-w-4xl mx-auto text-[#BA1B1B]"
        >
          Key Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
          {sapunaData.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:ring-2 hover:ring-[#BA1B1B] transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                <p className="text-sm font-medium text-[#BA1B1B] mb-3">{project.role}</p>
                <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-black text-xs font-semibold px-3 py-1 rounded-full text-gray-400 border border-gray-700">
                  Tech Stack: {project.tech}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-black text-white py-16 w-full">
        <div className="flex flex-col md:flex-row w-full gap-8 px-6 max-w-7xl mx-auto">
          <div className="flex-1 p-8 bg-gray-900 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-[#BA1B1B]">Contact Me</h2>
            <p className="mb-8 text-gray-400">
              Let’s collaborate on projects that drive positive change.
              I am guided by discipline and a vision for innovation.
            </p>
            <ul className="space-y-5 text-sm text-gray-300">
              <li className="flex items-center gap-4">
                <FaPhone className="w-5 h-5 text-[#BA1B1B]" />
                <span className="font-medium">{sapunaData.contact.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <FaEnvelope className="w-5 h-5 text-[#BA1B1B]" />
                <span className="font-medium">{sapunaData.contact.email}</span>
              </li>
              <li className="flex items-center gap-4">
                <FaLinkedin className="w-5 h-5 text-[#BA1B1B]" />
                <a href={sapunaData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn Profile
                </a>
              </li>
              <li className="flex items-center gap-4">
                <FaMapMarkerAlt className="w-5 h-5 text-[#BA1B1B]" />
                <span>{sapunaData.contact.location}</span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="flex-1 p-8 bg-gray-900 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-5 text-white">Send a Message</h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA1B1B] transition"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA1B1B] transition"
              />
              <textarea
                placeholder="Your Message (Focus on collaboration)"
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA1B1B] transition"
                rows={4}
              />
              <button
                type="submit"
                className="bg-[#BA1B1B] text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition duration-300 shadow-md hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer - Now calling the component imported from './components/Footer' */}
      <Footer />

      <style jsx>{`
        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default App;