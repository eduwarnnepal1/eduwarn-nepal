"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Trophy, Star, Zap, Flame, BookOpen, MessageSquare, Award, Clock } from "lucide-react"

export default function DashboardPage() {
  const { language } = useLanguage()

  const userStats = {
    points: 1250,
    level: 5,
    experience: 75, // percentage to next level
    streak: 12,
    coursesCompleted: 3,
    forumPosts: 15,
  }

  const badges = [
    { id: "1", name: "Welcome Aboard", icon: "👋", rarity: "common" },
    { id: "2", name: "First Steps", icon: "👟", rarity: "common" },
    { id: "3", name: "Knowledge Seeker", icon: "📚", rarity: "common" },
    { id: "4", name: "On Fire!", icon: "🔥", rarity: "rare" },
  ]

  const recentActivity = [
    { id: "1", type: "course", title: "Intro to Computer Science", action: "Completed Lesson 3", time: "2h ago" },
    { id: "2", type: "forum", title: "SEE Exam Tips", action: "Replied to thread", time: "5h ago" },
    { id: "3", type: "achievement", title: "Earned Badge", action: "Knowledge Seeker", time: "1d ago" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {language === "ne" ? "तपाईंको ड्यासबोर्ड" : "User Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ne" ? "तपाईंको प्रगति र उपलब्धिहरू यहाँ हेर्नुहोस्" : "Track your progress and achievements"}
            </p>
          </div>
        </div>

        {/* Gamification Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Points</p>
                <p className="text-2xl font-bold text-foreground">{userStats.points}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Current Level</p>
                <p className="text-2xl font-bold text-foreground">Level {userStats.level}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-full">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Day Streak</p>
                <p className="text-2xl font-bold text-foreground">{userStats.streak} Days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Star className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Badges Earned</p>
                <p className="text-2xl font-bold text-foreground">{badges.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-secondary" />
                  {language === "ne" ? "स्तर प्रगति" : "Level Progress"}
                </CardTitle>
                <CardDescription>
                  {language === "ne" ? "अर्को स्तरमा पुग्न थप २५० अंक आवश्यक छ" : "You need 250 more points to reach Level 6"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Level {userStats.level}</span>
                    <span className="font-medium">Level {userStats.level + 1}</span>
                  </div>
                  <Progress value={userStats.experience} className="h-3" />
                  <p className="text-xs text-muted-foreground text-center italic">
                    Keep learning to unlock new rewards!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Badges Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {language === "ne" ? "तपाईंका ब्याजहरू" : "Your Badges"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <Card key={badge.id} className="text-center group hover:border-primary transition-all">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{badge.icon}</div>
                      <p className="text-xs font-bold text-foreground mb-1">{badge.name}</p>
                      <UIBadge variant="outline" className="text-[10px] uppercase">
                        {badge.rarity}
                      </UIBadge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "ne" ? "तथ्याङ्क" : "Quick Stats"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Courses Done</span>
                  </div>
                  <span className="font-bold">{userStats.coursesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Forum Posts</span>
                  </div>
                  <span className="font-bold">{userStats.forumPosts}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {language === "ne" ? "हालैको गतिविधि" : "Recent Activity"}
              </h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mb-1">{activity.action}</p>
                        <p className="text-[10px] text-muted-foreground/60">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
