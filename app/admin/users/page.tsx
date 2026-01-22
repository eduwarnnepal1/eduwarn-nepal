"use client"

import { useState, useEffect, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, CheckCircle, XCircle } from "lucide-react"

interface UserProfile {
  id: string
  full_name: string
  role: "student" | "teacher" | "admin"
  role_approved: boolean
  educoins: number
  email?: string
}

function UsersContent() {
  const supabase = createClient()
  const { t, language } = useLanguage()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<"all" | "student" | "teacher" | "admin">("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, role_approved, educoins")
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveRole = async (userId: string, approved: boolean) => {
    try {
      const { error } = await supabase.from("profiles").update({ role_approved: approved }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((u) => (u.id === userId ? { ...u, role_approved: approved } : u)))
    } catch (error) {
      console.error("[v0] Error updating role approval:", error)
    }
  }

  const updateRole = async (userId: string, newRole: "student" | "teacher" | "admin") => {
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    } catch (error) {
      console.error("[v0] Error updating role:", error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (
      !confirm(t({ en: "Are you sure you want to delete this user?", ne: "के तपाईं यो प्रयोगकर्ता हटाउन निश्चित हुनुहुन्छ?" }))
    )
      return

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error

      setUsers(users.filter((u) => u.id !== userId))
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const translations = {
    title: t({ en: "User Management", ne: "प्रयोगकर्ता व्यवस्थापन" }),
    description: t({
      en: "Manage users, assign roles, and approve role changes",
      ne: "प्रयोगकर्ताहरूलाई व्यवस्थापन गर्नुहोस्, भूमिका तोक्नुहोस् र भूमिका परिवर्तन अनुमोदन गर्नुहोस्",
    }),
    search: t({ en: "Search by name...", ne: "नाम द्वारा खोज्नुहोस्..." }),
    name: t({ en: "Name", ne: "नाम" }),
    role: t({ en: "Role", ne: "भूमिका" }),
    status: t({ en: "Status", ne: "स्थिति" }),
    educoins: t({ en: "EduCoins", ne: "शिक्षा सिक्का" }),
    actions: t({ en: "Actions", ne: "कार्य" }),
    approve: t({ en: "Approve", ne: "अनुमोदन गर्नुहोस्" }),
    reject: t({ en: "Reject", ne: "अस्वीकार गर्नुहोस्" }),
    changeRole: t({ en: "Change Role", ne: "भूमिका परिवर्तन गर्नुहोस्" }),
    delete: t({ en: "Delete", ne: "हटाउनुहोस्" }),
    pending: t({ en: "Pending Approval", ne: "अनुमोदनको लागि प्रतीक्षा" }),
    approved: t({ en: "Approved", ne: "अनुमोदित" }),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{translations.title}</h1>
        <p className="text-muted-foreground mt-2">{translations.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t({ en: "All Users", ne: "सभी प्रयोगकर्ता" })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={translations.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="px-4 py-2 border rounded-lg bg-background"
            >
              <option value="all">{t({ en: "All Roles", ne: "सभी भूमिका" })}</option>
              <option value="student">{t({ en: "Students", ne: "विद्यार्थी" })}</option>
              <option value="teacher">{t({ en: "Teachers", ne: "शिक्षक" })}</option>
              <option value="admin">{t({ en: "Admins", ne: "प्रशासक" })}</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.name}</TableHead>
                  <TableHead>{translations.role}</TableHead>
                  <TableHead>{translations.status}</TableHead>
                  <TableHead>{translations.educoins}</TableHead>
                  <TableHead>{translations.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {t({ en: "Loading...", ne: "लोड हो रहेको छ..." })}
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {t({ en: "No users found", ne: "कोई प्रयोगकर्ता नहीं मिला" })}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {t({
                            en: user.role,
                            ne: user.role === "student" ? "विद्यार्थी" : user.role === "teacher" ? "शिक्षक" : "प्रशासक",
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role_approved ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            {translations.approved}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <XCircle className="w-4 h-4" />
                            {translations.pending}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.educoins}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!user.role_approved && (
                              <>
                                <DropdownMenuItem onClick={() => approveRole(user.id, true)}>
                                  {translations.approve}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => approveRole(user.id, false)}>
                                  {translations.reject}
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                const newRole =
                                  user.role === "student" ? "teacher" : user.role === "teacher" ? "admin" : "student"
                                updateRole(user.id, newRole)
                              }}
                            >
                              {translations.changeRole}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteUser(user.id)} className="text-red-600">
                              {translations.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersContent />
    </Suspense>
  )
}
