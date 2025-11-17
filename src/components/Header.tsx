import React from 'react'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-cyan-400 rounded flex items-center justify-center text-white font-bold">IT</div>
          <h1 className="text-lg font-semibold">ITS</h1>
        </div>

        <nav className="hidden sm:flex gap-3 text-sm">
          <a href="#" className="px-3 py-1 rounded hover:bg-gray-100">Trang chủ</a>
          <a href="#" className="px-3 py-1 rounded hover:bg-gray-100">Giới thiệu</a>
          <a href="#" className="px-3 py-1 rounded hover:bg-gray-100">Liên hệ</a>
        </nav>
      </div>
    </header>
  )
}
