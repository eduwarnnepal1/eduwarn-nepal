"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/context/language-context"
import { Moon, Sun, Menu, X, Globe, UserIcon, Settings, LogOut, Shield, Home, BookOpen, MessageCircle, FileText, BookMarked } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as SupaUser } from "@supabase/supabase-js"

export function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupaUser | null>(null)
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string; role?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return data
    } catch (err) {
      console.error("Unexpected error fetching profile:", err)
      return null
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id)
        setProfile(profileData)
      }

      setLoading(false)
    }

    initAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }

      // Force refresh for server components if needed
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.charAt(0).toUpperCase() || "U"
  }

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/courses", label: t("nav.courses"), icon: BookOpen },
    { href: "/forum", label: t("nav.forum"), icon: MessageCircle },
    { href: "/blog", label: t("nav.blog"), icon: FileText },
    { href: "/resources", label: t("nav.resources"), icon: BookMarked },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.jpg" alt="EduWarn Nepal" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">EduWarn Nepal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Icon className="h-4 w-4 group-hover:text-red-600 transition-colors" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English {language === "en" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ne")}>नेपाली {language === "ne" && "✓"}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light {theme === "light" && "✓"}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark {theme === "dark" && "✓"}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System {theme === "system" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {!loading && (
              <>
                {user ? (
                  // User Avatar Dropdown
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                            {user.email && (
                              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        {(profile?.role === "admin" || profile?.role === "teacher") && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer text-primary font-medium">
                              <Shield className="mr-2 h-4 w-4" />
                              {t({ en: "Admin Panel", ne: "व्यवस्थापक प्यानल" })}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            {t({ en: "Profile", ne: "प्रोफाइल" })}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            {t({ en: "Dashboard", ne: "ड्यासबोर्ड" })}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile?tab=settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            {t({ en: "Settings", ne: "सेटिङहरू" })}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          {t({ en: "Logout", ne: "लगआउट" })}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  // Auth Buttons - Desktop
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="/auth/login">{t("nav.login")}</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/register">{t("nav.signup")}</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 py-2 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            {!loading && (
              <>
                {user ? (
                  <div className="space-y-2 px-4 pt-2 border-t">
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        {profile?.full_name && <p className="text-sm font-medium">{profile.full_name}</p>}
                        {user.email && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
                        )}
                      </div>
                    </div>
                    {(profile?.role === "admin" || profile?.role === "teacher") && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 py-2 text-sm font-medium text-primary hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        {t({ en: "Admin Panel", ne: "व्यवस्थापक प्यानल" })}
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      {t({ en: "Profile", ne: "प्रोफाइल" })}
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      {t({ en: "Dashboard", ne: "ड्यासबोर्ड" })}
                    </Link>
                    <Link
                      href="/profile?tab=settings"
                      className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      {t({ en: "Settings", ne: "सेटिङहरू" })}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-2 py-2 w-full text-sm font-medium text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {t({ en: "Logout", ne: "लगआउट" })}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 px-4 pt-2">
                    <Button variant="ghost" className="flex-1" asChild>
                      <Link href="/auth/login">{t("nav.login")}</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href="/auth/register">{t("nav.signup")}</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
