import React from 'react'
import Header from '../components/Header'

type Props = { children: React.ReactNode }

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-8 flex-1">{children}</main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-4 text-sm text-gray-600">© 2025 ITS_FE</div>
      </footer>
    </div>
  )
}
