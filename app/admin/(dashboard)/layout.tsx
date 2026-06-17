import { ReactNode } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/admin/actions'
import { 
  Home, 
  Plus, 
  Library, 
  Globe,
  Menu,
  Settings2,
  LogOut
} from 'lucide-react'

const navGroups = [
  {
    name: 'WORKSPACE',
    items: [
      { name: 'Home', href: '/admin', icon: Home }
    ]
  },
  {
    name: 'CREATE',
    items: [
      { name: 'New Article', href: '/admin/compose', icon: Plus }
    ]
  },
  {
    name: 'CONTENT',
    items: [
      { name: 'Posts', href: '/admin/posts', icon: Library }
    ]
  },
  {
    name: 'SYSTEM',
    items: [
      { name: 'View Website', href: '/', icon: Globe }
    ]
  }
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#8a8a8a] overflow-hidden sm:flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-[260px] md:flex-col border-r border-[#1a1a1a] bg-[#0a0a0a] h-full">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          
          <div className="p-4 py-6">
            {navGroups.map((group, idx) => (
              <div key={group.name} className={idx > 0 ? "mt-8" : ""}>
                <h3 className="px-3 text-[10px] font-semibold tracking-[0.2em] text-[#444] uppercase mb-3">
                  {group.name}
                </h3>
                <nav className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-[#888] hover:bg-[#111] hover:text-[#dedede] transition-colors"
                    >
                      <item.icon
                        className="mr-3 h-[18px] w-[18px] text-[#666] group-hover:text-[#dedede]"
                        aria-hidden="true"
                        strokeWidth={1.5}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1a1a1a] mt-auto flex items-center justify-between">
            <Link href="/admin/settings" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#111] text-[#666] transition-colors">
              <Settings2 size={18} />
            </Link>
            <form action={signOut}>
              <button type="submit" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#111] text-[#666] hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </form>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex-shrink-0 w-full z-10 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center h-16 justify-between px-4">
        <span className="text-sm font-medium text-[#dedede]">Admin Portal</span>
        <button className="p-2 -mr-2 text-[#888] hover:text-[#dedede]">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col h-full bg-[#0a0a0a] overflow-hidden">
        {children}
      </div>
    </div>
  )
}
