import Link from 'next/link'
import { ModeToggle } from './mode-toggle'

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            云上直播
          </Link>
          <div className="flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

