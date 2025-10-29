import '../styles/global.css'
import Navbar from '../components/Navbar'
import { AuthProvider } from '../context/AuthContext'
import React from 'react'; // Required for React components in Next.js

export const metadata = {
  title: 'My Portfolio',
  description: 'Modern, professional portfolio built with Next.js and Tailwind CSS',

  // FAVICON CONFIGURATION (to use your public/images/favicon-16x16.png file)
  icons: {
    icon: [
      {
        url: '/images/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* The body ensures:
        - min-h-screen for full height
        - w-full to prevent overflow (using overflow-x-hidden)
        - flex-col layout for header, main content, and footer alignment
      */}
      <body className="bg-gray-50 text-gray-900 min-h-screen w-full m-0 p-0 flex flex-col overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          {/* main uses flex-grow to ensure it takes up all available vertical space 
            between the Navbar and any potential footer, keeping the footer at the bottom.
          */}
          <main className="flex-grow w-full m-0 p-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
