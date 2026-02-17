"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageCircle,
  Mail,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
} from "lucide-react";

interface MemberData {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  isOnline: boolean;
}

interface CommunityContextType {
  member: MemberData | null;
  refreshMember: () => void;
}

const CommunityContext = createContext<CommunityContextType>({
  member: null,
  refreshMember: () => {},
});

export function useCommunity() {
  return useContext(CommunityContext);
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadDMs, setUnreadDMs] = useState(0);
  const [unreadRooms, setUnreadRooms] = useState(0);

  const isAuthPage =
    pathname === "/community/login" || pathname === "/community/register";

  const fetchMember = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/member/me");
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else {
        setMember(null);
        if (!isAuthPage) {
          router.push("/community/login");
        }
      }
    } catch {
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthPage, router]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  // Fetch unread counts
  useEffect(() => {
    if (!member) return;
    const fetchUnread = async () => {
      try {
        const [roomsRes, dmRes] = await Promise.all([
          fetch("/api/chat/rooms"),
          fetch("/api/chat/dm"),
        ]);
        if (roomsRes.ok) {
          const rooms = await roomsRes.json();
          const total = rooms.reduce(
            (sum: number, r: { unreadCount: number }) => sum + (r.unreadCount || 0),
            0
          );
          setUnreadRooms(total);
        }
        if (dmRes.ok) {
          const dms = await dmRes.json();
          const total = dms.reduce(
            (sum: number, d: { unreadCount: number }) => sum + (d.unreadCount || 0),
            0
          );
          setUnreadDMs(total);
        }
      } catch { /* silent */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [member]);

  const handleLogout = async () => {
    await fetch("/api/auth/member/logout", { method: "POST" });
    setMember(null);
    router.push("/community/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ewc-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-ewc-burgundy border-t-transparent rounded-full animate-spin" />
          <p className="text-ewc-silver text-sm">Loading Community...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <CommunityContext.Provider value={{ member, refreshMember: fetchMember }}>
        <div className="min-h-screen bg-gradient-to-br from-ewc-navy via-ewc-navy-light to-ewc-navy">
          {children}
        </div>
      </CommunityContext.Provider>
    );
  }

  if (!member) return null;

  const navItems = [
    {
      href: "/community",
      label: "Hub",
      icon: Home,
      badge: 0,
    },
    {
      href: "/community/chat",
      label: "Chats",
      icon: MessageCircle,
      badge: unreadRooms,
    },
    {
      href: "/community/dm",
      label: "DMs",
      icon: Mail,
      badge: unreadDMs,
    },
    {
      href: "/community/members",
      label: "Members",
      icon: Users,
      badge: 0,
    },
    {
      href: "/community/profile",
      label: "Profile",
      icon: User,
      badge: 0,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/community") return pathname === "/community";
    return pathname.startsWith(href);
  };

  return (
    <CommunityContext.Provider value={{ member, refreshMember: fetchMember }}>
      <div className="min-h-screen bg-ewc-navy flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 bg-ewc-navy-light border-r border-white/10 flex-col h-screen fixed left-0 top-0 z-40">
          {/* Logo / brand */}
          <div className="p-4 border-b border-white/10">
            <Link href="/community" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-ewc-burgundy rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-heading font-bold text-sm">
                  EWC Community
                </h1>
                <p className="text-ewc-silver text-[11px]">Stay connected</p>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-ewc-burgundy/20 text-ewc-burgundy-light"
                      : "text-ewc-silver hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Member info */}
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-ewc-burgundy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {member.displayName?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {member.displayName}
                </p>
                <p className="text-ewc-silver text-[11px] truncate">
                  {member.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-ewc-silver hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 mt-1 text-[11px] text-ewc-silver hover:text-white transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-ewc-navy-light border-b border-white/10 px-4 h-14 flex items-center justify-between">
          <Link href="/community" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ewc-burgundy rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-heading font-bold text-sm">
              EWC Community
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="text-ewc-silver hover:text-white p-1.5 relative">
              <Bell className="w-5 h-5" />
              {(unreadDMs + unreadRooms > 0) && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-ewc-burgundy rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                  {unreadDMs + unreadRooms > 9 ? "9+" : unreadDMs + unreadRooms}
                </span>
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-ewc-silver hover:text-white p-1"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="md:hidden fixed top-14 right-0 bottom-0 w-64 bg-ewc-navy-light z-50 border-l border-white/10 p-4 overflow-y-auto">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-ewc-burgundy/20 text-ewc-burgundy-light"
                          : "text-ewc-silver hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-ewc-burgundy flex items-center justify-center text-white text-xs font-bold">
                    {member.displayName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {member.displayName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 mt-1 text-red-400 text-sm hover:bg-red-400/10 rounded-lg w-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 mt-1 text-ewc-silver text-sm hover:text-white transition-colors"
                >
                  ← Back to Website
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-64 min-h-screen">
          <div className="pt-14 md:pt-0">{children}</div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ewc-navy-light border-t border-white/10 z-40 safe-area-bottom">
          <div className="flex justify-around items-center h-14">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 relative ${
                    active ? "text-ewc-burgundy-light" : "text-ewc-silver"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-ewc-burgundy rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </CommunityContext.Provider>
  );
}
