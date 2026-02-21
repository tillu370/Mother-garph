import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Users,
  DollarSign,
  Star,
  Mail,
  Heart,
  Menu,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/onboarding-finder', label: 'Onboarding Finder', icon: Search },
  { path: '/ngo-intelligence', label: 'NGO Intelligence', icon: Users },
  { path: '/funding-scout', label: 'Funding Scout', icon: DollarSign },
  { path: '/priority-targets', label: 'Priority Targets', icon: Star },
  { path: '/outreach', label: 'Outreach Generator', icon: Mail },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'white', borderRight: '1px solid #e2e8f0' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}
          >
            <Heart size={18} color="white" fill="white" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>
              MotherSource AI
            </div>
            <div className="text-xs" style={{ color: '#94a3b8' }}>Maternal Health Platform</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-xs font-semibold mb-3 px-2" style={{ color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Navigation
          </div>
          <ul className="space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      background: active ? '#f0fdfa' : 'transparent',
                      color: active ? '#0d9488' : '#475569',
                    }}
                  >
                    <Icon size={17} />
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight size={14} style={{ color: '#0d9488' }} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* AI Badge */}
          <div
            className="mt-6 mx-2 p-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', border: '1px solid #99f6e4' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} style={{ color: '#0d9488' }} />
              <span className="text-xs font-semibold" style={{ color: '#0d9488' }}>AI Powered</span>
            </div>
            <p className="text-xs" style={{ color: '#475569' }}>
              GPT-4 classification, embeddings search & smart scoring active.
            </p>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid #e2e8f0' }}>
          <div className="text-xs" style={{ color: '#94a3b8' }}>
            Focus: AP & Telangana
          </div>
          <div className="text-xs font-medium" style={{ color: '#475569' }}>
            Maternal Health Intelligence
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center gap-4 px-6 py-4"
          style={{ background: 'white', borderBottom: '1px solid #e2e8f0', minHeight: 65 }}
        >
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: '#475569' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <h1 className="text-base font-semibold" style={{ color: '#0f172a' }}>
              {navItems.find((n) => n.path === location.pathname)?.label || 'MotherSource AI'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              AI Active
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
