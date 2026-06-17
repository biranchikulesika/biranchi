import { ReactNode } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  Lightbulb, 
  BookOpen, 
  Mail, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react'
import { signOut } from '@/app/admin/actions'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Field Notes', href: '/admin/field-notes', icon: PenTool },
  { name: 'Thought Fragments', href: '/admin/thought-fragments', icon: Lightbulb },
  { name: 'Library', href: '/admin/books', icon: BookOpen },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <span className="text-lg font-bold">Admin Portal</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <form action={signOut}>
                <button
                  type="submit"
                  className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 w-full z-10 bg-white border-b border-gray-200 flex items-center h-16 justify-between px-4">
        <span className="text-lg font-bold">Admin Portal</span>
        {/* Simple hamburger placeholder, can add full mobile nav later */}
        <button className="p-2 -mr-2 text-gray-500 hover:text-gray-600">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64 h-screen mt-16 md:mt-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
