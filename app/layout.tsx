import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Providers } from './providers'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'PortPro V1',
  description: 'Port Operations Management System',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="w-full bg-gray-900 text-white px-8 py-4 flex gap-8 items-center shadow">
            <span className="font-bold text-lg tracking-wide">PortPro</span>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/vessels" className="hover:underline">Vessels</Link>
            <Link href="/berths" className="hover:underline">Berths</Link>
            <Link href="/operations" className="hover:underline">Operations</Link>
            <Link href="/reports" className="hover:underline">Reports</Link>
          </nav>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
