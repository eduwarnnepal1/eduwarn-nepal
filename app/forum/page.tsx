"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, MessageCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

const FORUM_CATEGORIES = [
  { id: "1", name: "General Discussion", name_ne: "सामान्य छलफल", threads: 120, posts: 450, icon: "💬" },
  { id: "2", name: "Career Guidance", name_ne: "करियर मार्गदर्शन", threads: 85, posts: 320, icon: "💼" },
  { id: "3", name: "Study Resources", name_ne: "अध्ययन स्रोतहरू", threads: 210, posts: 890, icon: "📚" },
  { id: "4", name: "Exam Preparation", name_ne: "परीक्षा तयारी", threads: 150, posts: 640, icon: "📝" },
]

const RECENT_THREADS = [
  { id: "1", title: "Best resources for SEE Science?", author: "Student_01", replies: 12, time: "2h ago" },
  { id: "2", title: "Looking for a study group in Kathmandu", author: "Prabin_K", replies: 5, time: "4h ago" },
  { id: "3", title: "How to prepare for Lok Sewa?", author: "Suman_N", replies: 28, time: "1d ago" },
]

export default function ForumPage() {
  const { language, t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === "ne" ? "सामुदायिक फोरम" : "Community Forum"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ne" ? "छलफलमा भाग लिनुहोस् र अरूलाई मद्दत गर्नुहोस्" : "Join discussions and help others grow"}
            </p>
          </div>
          <Button size="lg" className="shadow-md">
            <MessageCircle className="mr-2 h-5 w-5" />
            {language === "ne" ? "नयाँ थ्रेड सुरु गर्नुहोस्" : "Start New Thread"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {language === "ne" ? "कोटिहरू" : "Categories"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FORUM_CATEGORIES.map((cat) => (
                <Link key={cat.id} href={`/forum/category/${cat.id}`}>
                  <Card className="hover:border-primary transition-all group h-full">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="text-3xl p-3 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                        {cat.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {language === "ne" ? cat.name_ne : cat.name}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {cat.threads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {cat.posts}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{language === "ne" ? "हालैका छलफलहरू" : "Recent Threads"}</h2>
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {RECENT_THREADS.map((thread) => (
                    <div key={thread.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors mb-2">
                        {thread.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-semibold text-primary/80">@{thread.author}</span>
                        <div className="flex items-center gap-2">
                          <span>{thread.replies} replies</span>
                          <span>•</span>
                          <span>{thread.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
