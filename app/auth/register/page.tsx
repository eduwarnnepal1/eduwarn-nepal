"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { Navbar } from "@/components/navbar"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const { language } = useLanguage()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getText = (en: string, ne: string) => (language === 'ne' ? ne : en)

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError(getText("Passwords do not match", "पासवर्डहरू मेल खाँदैनन्"))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(getText("Password must be at least 6 characters", "पासवर्ड कम्तिमा 6 अक्षरको हुनुपर्छ"))
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setLoading(true)
    setError(null)

    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/auth/callback`;

    console.log("[v0] Google OAuth register redirect URL:", redirectUrl)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md border-gray-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {getText("Check Your Email", "आफ्नो इमेल जाँच गर्नुहोस्")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 text-center">
                  {getText(
                    "We sent you a confirmation email. Please check your inbox and click the link to verify your account.",
                    "हामीले तपाईंलाई पुष्टिकरण इमेल पठायौं। कृपया आफ्नो इनबक्स जाँच गर्नुहोस् र आफ्नो खाता प्रमाणित गर्न लिङ्कमा क्लिक गर्नुहोस्।"
                  )}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/auth/login")} className="w-full bg-red-600 hover:bg-red-700 text-white">
                {getText("Go to Login", "लगइनमा जानुहोस्")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              {getText("Create Account", "खाता सिर्जना गर्नुहोस्")}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {getText("Join EduWarn Nepal and start learning", "EduWarn Nepal मा सामेल हुनुहोस् र सिक्न सुरु गर्नुहोस्")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button variant="outline" className="w-full border-gray-300 bg-transparent" onClick={handleGoogleRegister} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {getText("Continue with Google", "Google मार्फत जारी राख्नुहोस्")}
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                {getText("OR", "वा")}
              </span>
            </div>

            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-900">{getText("Full Name", "पूरा नाम")}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={getText("John Doe", "जोन डो")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">{getText("Email", "इमेल")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={getText("you@example.com", "तपाईं@example.com")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900">{getText("Password", "पासवर्ड")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">{getText("At least 6 characters", "कम्तिमा 6 अक्षरहरू")}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900">{getText("Confirm Password", "पासवर्ड पुष्टि गर्नुहोस्")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="border-gray-300"
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading
                  ? getText("Creating account...", "खाता सिर्जना गर्दै...")
                  : getText("Create Account", "खाता सिर्जना गर्नुहोस्")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-gray-200">
            <div className="w-full text-sm text-center text-gray-600">
              {getText("Already have an account?", "पहिले नै खाता छ?")}{" "}
              <Link href="/auth/login" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                {getText("Sign in", "साइन इन गर्नुहोस्")}
              </Link>
            </div>
            <Link href="/" className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
              {getText("Back to home", "होमपेजमा फर्कनुहोस्")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
