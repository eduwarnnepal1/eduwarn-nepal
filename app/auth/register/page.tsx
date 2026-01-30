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

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError(t({ en: "Passwords do not match", ne: "पासवर्डहरू मेल खाँदैनन्" }))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t({ en: "Password must be at least 6 characters", ne: "पासवर्ड कम्तिमा 6 अक्षरको हुनुपर्छ" }))
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
        : `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/auth/callback`

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">
              {t({ en: "Check Your Email", ne: "आफ्नो इमेल जाँच गर्नुहोस्" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-center">
                {t({
                  en: "We sent you a confirmation email. Please check your inbox and click the link to verify your account.",
                  ne: "हामीले तपाईंलाई पुष्टिकरण इमेल पठायौं। कृपया आफ्नो इनबक्स जाँच गर्नुहोस् र आफ्नो खाता प्रमाणित गर्न लिङ्कमा क्लिक गर्नुहोस्।",
                })}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/auth/login")} className="w-full">
              {t({ en: "Go to Login", ne: "लगइनमा जानुहोस्" })}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t({ en: "Create Account", ne: "खाता सिर्जना गर्नुहोस्" })}
          </CardTitle>
          <CardDescription className="text-center">
            {t({ en: "Join EduWarn Nepal and start learning", ne: "EduWarn Nepal मा सामेल हुनुहोस् र सिक्न सुरु गर्नुहोस्" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleRegister} disabled={loading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t({ en: "Continue with Google", ne: "Google मार्फत जारी राख्नुहोस्" })}
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              {t({ en: "OR", ne: "वा" })}
            </span>
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t({ en: "Full Name", ne: "पूरा नाम" })}</Label>
              <Input
                id="fullName"
                type="text"
                placeholder={t({ en: "John Doe", ne: "जोन डो" })}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t({ en: "Email", ne: "इमेल" })}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t({ en: "you@example.com", ne: "तपाईं@example.com" })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t({ en: "Password", ne: "पासवर्ड" })}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t({ en: "Confirm Password", ne: "पासवर्ड पुष्टि गर्नुहोस्" })}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? t({ en: "Creating account...", ne: "खाता सिर्जना गर्दै..." })
                : t({ en: "Create Account", ne: "खाता सिर्जना गर्नुहोस्" })}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {t({ en: "Already have an account?", ne: "पहिले नै खाता छ?" })}{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              {t({ en: "Sign in", ne: "साइन इन गर्नुहोस्" })}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
