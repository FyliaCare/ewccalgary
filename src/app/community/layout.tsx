"use client";

import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
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
  ArrowLeft,
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
  const sidebarRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const isAuthPage =
    pathname === "/community/login" || pathname === "/community/register";

  // Detect sub-pages (chat room, DM conversation) — hide bottom nav for full-screen chat
  const isChatRoom = /^\/community\/chat\/.+$/.test(pathname);
  const isDMConversation = /^\/community\/dm\/.+$/.test(pathname);
  const isSubPage = isChatRoom || isDMConversation;

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
            (sum: number, r: { unread?: number }) => sum + (r.unread || 0),
            0
          );
          setUnreadRooms(total);
        }
        if (dmRes.ok) {
          const dms = await dmRes.json();
          const total = dms.reduce(
            (sum: number, d: { unread?: number }) => sum + (d.unread || 0),
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

  // Swipe to close sidebar (touch gesture)
  useEffect(() => {
    if (!sidebarOpen) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      // Sidebar is on the right — swipe right (positive delta) to push it offscreen
      if (deltaX > 60) {
        setSidebarOpen(false);
      }
    };

    sidebar.addEventListener("touchstart", handleTouchStart, { passive: true });
    sidebar.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      sidebar.removeEventListener("touchstart", handleTouchStart);
      sidebar.removeEventListener("touchend", handleTouchEnd);
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/member/logout", { method: "POST" });
    setMember(null);
    router.push("/community/login");
  };

  // Loading — app splash screen
  if (loading) {
    return (
      <div className="h-screen bg-ewc-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 fade-in">
          <div className="w-16 h-16 bg-ewc-burgundy rounded-2xl flex items-center justify-center shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-white font-heading font-bold text-lg">EWC Community</h2>
            <div className="w-8 h-8 border-2 border-ewc-burgundy border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Auth pages — immersive
  if (isAuthPage) {
    return (
      <CommunityContext.Provider value={{ member, refreshMember: fetchMember }}>
        <div className="h-screen bg-ewc-navy overflow-auto">
          {children}
        </div>
      </CommunityContext.Provider>
    );
  }

  if (!member) return null;

  const navItems = [
    { href: "/community", label: "Hub", icon: Home, badge: 0 },
    { href: "/community/chat", label: "Chats", icon: MessageCircle, badge: unreadRooms },
    { href: "/community/dm", label: "DMs", icon: Mail, badge: unreadDMs },
    { href: "/community/members", label: "Members", icon: Users, badge: 0 },
    { href: "/community/profile", label: "Profile", icon: User, badge: 0 },
  ];

  const isActive = (href: string) => {
    if (href === "/community") return pathname === "/community";
    return pathname.startsWith(href);
  };

  const totalUnread = unreadDMs + unreadRooms;

  return (
    <CommunityContext.Provider value={{ member, refreshMember: fetchMember }}>
      <div className="h-screen bg-ewc-navy flex overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 bg-ewc-navy-light border-r border-white/10 flex-col h-screen fixed left-0 top-0 z-40">
          <div className="p-4 border-b border-white/10">
            <Link href="/community" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-ewc-burgundy rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-heading font-bold text-sm">EWC Community</h1>
                <p className="text-ewc-silver text-[11px]">Stay connected</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? "bg-ewc-burgundy/20 text-ewc-burgundy-light" : "text-ewc-silver hover:text-white hover:bg-white/5"
                  }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center badge-pulse">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-ewc-burgundy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {member.avatar ? (
                  <img src={member.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (member.displayName?.charAt(0).toUpperCase() || "?")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{member.displayName}</p>
                <p className="text-ewc-silver text-[11px] truncate">{member.email}</p>
              </div>
              <button onClick={handleLogout} className="text-ewc-silver hover:text-red-400 transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <Link href="/" className="flex items-center gap-2 px-3 py-1.5 mt-1 text-[11px] text-ewc-silver hover:text-white transition-colors">
              ← Back to Website
            </Link>
          </div>
        </aside>

        {/* ======== MOBILE SHELL ======== */}

        {/* Mobile header — frosted glass, hidden on sub-pages */}
        {!isSubPage && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 safe-area-top">
            <div className="bg-ewc-navy-light/95 backdrop-blur-xl border-b border-white/10 px-4 h-14 flex items-center justify-between">
              <Link href="/community" className="flex items-center gap-2 press-effect">
                <div className="w-8 h-8 bg-ewc-burgundy rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-heading font-bold text-sm">EWC Community</span>
              </Link>
              <div className="flex items-center gap-1">
                <button className="text-ewc-silver hover:text-white p-2 relative press-effect rounded-xl">
                  <Bell className="w-5 h-5" />
                  {totalUnread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-ewc-burgundy rounded-full text-[8px] text-white flex items-center justify-center font-bold badge-pulse">
                      {totalUnread > 9 ? "9+" : totalUnread}
                    </span>
                  )}
                </button>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-ewc-silver hover:text-white p-2 press-effect rounded-xl">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile sidebar overlay — slide-in + swipe-to-close */}
        {sidebarOpen && (
          <>
            <div className="md:hidden fixed inset-0 bg-black/60 z-[60] fade-in" onClick={() => setSidebarOpen(false)} />
            <div ref={sidebarRef} className="md:hidden fixed top-0 right-0 bottom-0 w-72 bg-ewc-navy-light z-[70] border-l border-white/10 overflow-y-auto slide-in-right safe-area-top">
              <div className="p-4 pt-5 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-white font-heading font-semibold text-sm">Menu</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-ewc-silver hover:text-white p-1.5 rounded-lg hover:bg-white/5 press-effect">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-ewc-burgundy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {member.avatar ? (
                      <img src={member.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (member.displayName?.charAt(0).toUpperCase() || "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{member.displayName}</p>
                    <p className="text-ewc-silver text-xs truncate">{member.email}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-green-400 text-[11px]">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              <nav className="p-3 space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all press-effect ${
                        active ? "bg-ewc-burgundy/20 text-ewc-burgundy-light" : "text-ewc-silver hover:text-white hover:bg-white/5"
                      }`}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="bg-ewc-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center badge-pulse">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 mt-auto border-t border-white/10 space-y-0.5">
                <Link href="/" onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-ewc-silver text-sm hover:text-white hover:bg-white/5 rounded-xl transition-colors press-effect">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Website</span>
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-400 text-sm hover:bg-red-400/10 rounded-xl w-full transition-colors press-effect">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-64 h-screen flex flex-col overflow-hidden">
          <div className={`flex-1 overflow-auto community-scroll ${
            !isSubPage ? "pt-14 md:pt-0 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:pb-0" : "md:pt-0"
          }`}>
            {children}
          </div>
        </main>

        {/* Mobile bottom nav — iOS tab bar */}
        {!isSubPage && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-ewc-navy-light/95 backdrop-blur-xl border-t border-white/10">
              <div className="flex justify-around items-end h-14 px-1 safe-area-bottom">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className={`tab-press flex flex-col items-center justify-center gap-0.5 py-1 px-3 relative flex-1 min-w-0 ${
                        active ? "text-ewc-burgundy-light" : "text-ewc-silver/70"
                      }`}>
                      {active && (
                        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-5 h-[3px] bg-ewc-burgundy rounded-full" />
                      )}
                      <div className="relative">
                        <Icon className={`w-[22px] h-[22px] transition-all duration-200 ${active ? "scale-110" : ""}`} />
                        {item.badge > 0 && (
                          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-ewc-burgundy rounded-full text-[9px] text-white flex items-center justify-center font-bold px-1 badge-pulse">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] leading-tight transition-all duration-200 ${
                        active ? "font-semibold" : "font-normal"
                      }`}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        )}
      </div>
    </CommunityContext.Provider>
  );
}
