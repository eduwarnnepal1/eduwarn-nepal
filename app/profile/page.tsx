"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Calendar, Edit2, Globe, BookOpen, Award, Coins, Shield, CheckCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  role: string
  role_approved: boolean
  bio: string | null
  educoins: number
  points: number
  created_at: string
}

interface Enrollment {
  id: string
  progress: number
  completed: boolean
  enrolled_at: string
  courses: {
    id: string
    title_en: string
    title_ne: string
    thumbnail_url: string | null
  }
}

export default function ProfilePage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [userEmail, setUserEmail] = useState("")

  const [editMode, setEditMode] = useState(false)
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserEmail(user.email || "")

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
        setFullName(profileData.full_name || "")
        setBio(profileData.bio || "")
      }

      const { data: enrollmentData } = await supabase
        .from("enrollments")
        .select(`
          *,
          courses:course_id (
            id,
            title_en,
            title_ne,
            thumbnail_url
          )
        `)
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false })

      if (enrollmentData) {
        setEnrollments(enrollmentData)
      }

      setLoading(false)
    }

    fetchProfileData()
  }, [supabase, router])

  const handleSaveProfile = async () => {
    if (!profile) return

    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio: bio,
      })
      .eq("id", profile.id)

    if (!error) {
      setProfile({ ...profile, full_name: fullName, bio: bio })
      setEditMode(false)
    }
    setSaving(false)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground"
      case "teacher":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: { en: "Admin", ne: "व्यवस्थापक" },
      teacher: { en: "Teacher", ne: "शिक्षक" },
      student: { en: "Student", ne: "विद्यार्थी" },
    }
    return labels[role as keyof typeof labels]?.[language as "en" | "ne"] || role
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t({ en: "Loading profile...", ne: "प्रोफाइल लोड गर्दै..." })}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <Card className="mb-8 border-border">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-xl" />
            <CardContent className="p-6 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-12 mb-6">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback className="text-2xl bg-muted">
                      {profile.full_name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-110 transition-transform">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">{profile.full_name || "User"}</h1>
                  <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    <Badge className={getRoleBadgeColor(profile.role)}>
                      <Shield className="mr-1 h-3 w-3" />
                      {getRoleLabel(profile.role)}
                    </Badge>
                    {profile.role_approved ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {t({ en: "Verified", ne: "प्रमाणित" })}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        <Clock className="mr-1 h-3 w-3" />
                        {t({ en: "Pending Approval", ne: "स्वीकृति बाँकी" })}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button className="w-full md:w-auto" onClick={() => setEditMode(!editMode)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  {editMode ? t({ en: "Cancel", ne: "रद्द गर्नुहोस्" }) : t({ en: "Edit Profile", ne: "प्रोफाइल सम्पादन" })}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-border">
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{profile.educoins}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{t({ en: "Educoins", ne: "एडुकोइन" })}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{profile.points}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{t({ en: "Points", ne: "अंक" })}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{enrollments.length}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t({ en: "Courses Enrolled", ne: "नामांकन पाठ्यक्रम" })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t({ en: "Joined", ne: "सामेल" })}{" "}
                  {new Date(profile.created_at).toLocaleDateString(language === "ne" ? "ne-NP" : "en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  eduwarn.com/user/{profile.id.slice(0, 8)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-semibold transition-none shadow-none"
              >
                {t({ en: "Overview", ne: "अवलोकन" })}
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-semibold transition-none shadow-none"
              >
                {t({ en: "My Courses", ne: "मेरा पाठ्यक्रमहरू" })}
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-semibold transition-none shadow-none"
              >
                {t({ en: "Settings", ne: "सेटिङहरू" })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="py-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-3">{t({ en: "About Me", ne: "मेरो बारेमा" })}</h3>
                {profile.bio ? (
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    {t({
                      en: "No bio added yet. Click 'Edit Profile' to add one.",
                      ne: "अहिलेसम्म कुनै विवरण थपिएको छैन। थप्न 'प्रोफाइल सम्पादन' मा क्लिक गर्नुहोस्।",
                    })}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="py-8 space-y-6">
              {enrollments.length > 0 ? (
                <div className="grid gap-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-20 w-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          {enrollment.courses.thumbnail_url ? (
                            <img
                              src={enrollment.courses.thumbnail_url || "/placeholder.svg"}
                              alt={enrollment.courses.title_en}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {language === "ne" ? enrollment.courses.title_ne : enrollment.courses.title_en}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {t({ en: "Progress", ne: "प्रगति" })}: {enrollment.progress}%
                            </span>
                            {enrollment.completed && (
                              <Badge variant="outline" className="border-green-500 text-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                {t({ en: "Completed", ne: "पूरा भयो" })}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {t({ en: "Continue", ne: "जारी राख्नुहोस्" })}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {t({
                        en: "You haven't enrolled in any courses yet.",
                        ne: "तपाईं अहिलेसम्म कुनै पाठ्यक्रममा नामांकन गर्नुभएको छैन।",
                      })}
                    </p>
                    <Button asChild>
                      <a href="/courses">{t({ en: "Browse Courses", ne: "पाठ्यक्रमहरू ब्राउज गर्नुहोस्" })}</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="py-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t({ en: "Account Settings", ne: "खाता सेटिङहरू" })}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t({ en: "Full Name", ne: "पूरा नाम" })}</Label>
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t({ en: "Email Address", ne: "इमेल ठेगाना" })}</Label>
                      <Input id="email" value={userEmail} disabled />
                      <p className="text-xs text-muted-foreground">
                        {t({
                          en: "Email cannot be changed. Contact support if needed.",
                          ne: "इमेल परिवर्तन गर्न सकिँदैन। आवश्यक भएमा समर्थनसँग सम्पर्क गर्नुहोस्।",
                        })}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">{t({ en: "Bio", ne: "विवरण" })}</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={!editMode}
                        placeholder={t({
                          en: "Tell us about yourself...",
                          ne: "आफ्नो बारेमा बताउनुहोस्...",
                        })}
                        rows={4}
                      />
                    </div>
                  </div>
                  {editMode && (
                    <Button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto">
                      {saving
                        ? t({ en: "Saving...", ne: "सुरक्षित गर्दै..." })
                        : t({ en: "Save Changes", ne: "परिवर्तनहरू सुरक्षित गर्नुहोस्" })}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
