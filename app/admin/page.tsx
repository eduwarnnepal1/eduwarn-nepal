"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
  const { t } = useLanguage()

  const stats = [
    {
      title: t({ en: "Total Students", ne: "कुल विद्यार्थीहरू" }),
      value: "1,234",
      icon: Users,
      description: "+12% from last month",
    },
    {
      title: t({ en: "Active Courses", ne: "सक्रिय पाठ्यक्रमहरू" }),
      value: "42",
      icon: BookOpen,
      description: "3 new this week",
    },
    {
      title: t({ en: "Course Enrolments", ne: "पाठ्यक्रम नामांकन" }),
      value: "5,678",
      icon: GraduationCap,
      description: "+18% from last month",
    },
    {
      title: t({ en: "Educoins Distributed", ne: "एडुकोइन वितरण" }),
      value: "250K",
      icon: TrendingUp,
      description: "Across all users",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t({ en: "Dashboard Overview", ne: "ड्यासबोर्ड अवलोकन" })}</h1>
        <p className="text-muted-foreground">
          {t({
            en: "Welcome to the EduWarn Nepal administrative panel.",
            ne: "EduWarn Nepal प्रशासनिक प्यानलमा स्वागत छ।",
          })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t({ en: "Recent Activity", ne: "भर्खरको गतिविधि" })}</CardTitle>
            <CardDescription>
              {t({ en: "Monitor what's happening across the platform.", ne: "प्लेटफर्ममा के भइरहेको छ निगरानी गर्नुहोस्।" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Activity placeholders */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-muted" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">New student registered</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t({ en: "Quick Actions", ne: "द्रुत कार्यहरू" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full justify-start text-sm font-medium hover:underline text-primary">
              Add new course
            </button>
            <button className="w-full justify-start text-sm font-medium hover:underline text-primary">
              Approve teacher applications
            </button>
            <button className="w-full justify-start text-sm font-medium hover:underline text-primary">
              Upload resources
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
