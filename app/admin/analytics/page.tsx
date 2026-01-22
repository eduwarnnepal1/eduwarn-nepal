"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface AnalyticsData {
  totalUsers: number
  totalResources: number
  totalEducoinsDistributed: number
  activeUsers: number
  usersByRole: { role: string; count: number }[]
  userActivityTrend: { date: string; users: number }[]
  resourcesByType: { type: string; count: number }[]
}

export default function AnalyticsPage() {
  const supabase = createClient()
  const { t } = useLanguage()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch total users
      const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact" })

      // Fetch total resources
      const { count: totalResources } = await supabase.from("resources").select("*", { count: "exact" })

      // Fetch users by role
      const { data: usersByRole } = await supabase
        .from("profiles")
        .select("role")
        .then(({ data }) => {
          if (!data) return { data: [] }
          const roleCount = {} as Record<string, number>
          data.forEach((u: any) => {
            roleCount[u.role] = (roleCount[u.role] || 0) + 1
          })
          return {
            data: Object.entries(roleCount).map(([role, count]) => ({
              role,
              count,
            })),
          }
        })

      // Fetch resources by type
      const { data: resourcesByType } = await supabase
        .from("resources")
        .select("type")
        .then(({ data }) => {
          if (!data) return { data: [] }
          const typeCount = {} as Record<string, number>
          data.forEach((r: any) => {
            typeCount[r.type] = (typeCount[r.type] || 0) + 1
          })
          return {
            data: Object.entries(typeCount).map(([type, count]) => ({
              type,
              count,
            })),
          }
        })

      // Fetch total EduCoins
      const { data: profiles } = await supabase.from("profiles").select("educoins")
      const totalEducoinsDistributed = profiles?.reduce((sum, p: any) => sum + (p.educoins || 0), 0) || 0

      // Simulate user activity trend (in production, you'd track actual login events)
      const userActivityTrend = [
        { date: "Mon", users: 45 },
        { date: "Tue", users: 52 },
        { date: "Wed", users: 48 },
        { date: "Thu", users: 61 },
        { date: "Fri", users: 55 },
        { date: "Sat", users: 38 },
        { date: "Sun", users: 42 },
      ]

      setAnalytics({
        totalUsers: totalUsers || 0,
        totalResources: totalResources || 0,
        totalEducoinsDistributed,
        activeUsers: 45,
        usersByRole: usersByRole || [],
        userActivityTrend,
        resourcesByType: resourcesByType || [],
      })
    } catch (error) {
      console.error("[v0] Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return <div>Error loading analytics</div>
  }

  const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

  const statCards = [
    {
      title: t({ en: "Total Users", ne: "कुल प्रयोगकर्ता" }),
      value: analytics.totalUsers,
      icon: "👥",
    },
    {
      title: t({ en: "Total Resources", ne: "कुल स्रोतहरू" }),
      value: analytics.totalResources,
      icon: "📚",
    },
    {
      title: t({ en: "EduCoins Distributed", ne: "वितरित शिक्षा सिक्का" }),
      value: analytics.totalEducoinsDistributed,
      icon: "💰",
    },
    {
      title: t({ en: "Active Users", ne: "सक्रिय प्रयोगकर्ता" }),
      value: analytics.activeUsers,
      icon: "✨",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t({ en: "Analytics & Reports", ne: "विश्लेषण र रिपोर्ट" })}</h1>
        <p className="text-muted-foreground mt-2">
          {t({
            en: "Track user activity, resource usage, and platform statistics",
            ne: "प्रयोगकर्ता गतिविधि, स्रोत उपयोग र प्ल्याटफर्म आंकड़े ट्र्याक गर्नुहोस्",
          })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: "User Activity Trend", ne: "प्रयोगकर्ता गतिविधि प्रवृत्ति" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.userActivityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: "Users by Role", ne: "भूमिका द्वारा प्रयोगकर्ता" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={analytics.usersByRole} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={100}>
                  {analytics.usersByRole.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resources by Type */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t({ en: "Resources by Type", ne: "प्रकार द्वारा स्रोत" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.resourcesByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
