import React from 'react'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Trang mẫu</h2>
        <p className="opacity-90">Trang này dùng làm mẫu để bạn phát triển nhanh giao diện.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Tiện ích</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            <li>HMR nhanh</li>
            <li>Tailwind utility-first</li>
            <li>TypeScript + React</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Mẫu form</h3>
          <form className="mt-3 flex flex-col gap-2">
            <input className="border p-2 rounded" placeholder="Tên" />
            <input className="border p-2 rounded" placeholder="Email" />
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded">Gửi</button>
              <button type="button" className="px-3 py-1 bg-gray-200 rounded">Hủy</button>
            </div>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Thông tin</h3>
          <p className="text-sm text-gray-600 mt-2">Bạn có thể mở rộng các component và layout theo cấu trúc README.</p>
        </div>
      </section>
    </div>
  )
}
