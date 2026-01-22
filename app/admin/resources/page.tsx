"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, Plus, Trash2, Eye, EyeOff } from "lucide-react"

interface Resource {
  id: string
  title_en: string
  title_ne: string
  type: string
  author_id: string
  created_at: string
  is_published: boolean
  author?: { full_name: string }
}

function ResourcesContent() {
  const supabase = createClient()
  const { t, language } = useLanguage()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title_en: "", title_ne: "", type: "article" })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("resources")
        .select("id, title_en, title_ne, type, author_id, created_at, is_published, author:profiles(full_name)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error("[v0] Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const createResource = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user?.id) return

      const { error } = await supabase.from("resources").insert({
        title_en: formData.title_en,
        title_ne: formData.title_ne,
        type: formData.type,
        author_id: user.user.id,
        is_published: true,
      })

      if (error) throw error
      setFormData({ title_en: "", title_ne: "", type: "article" })
      setShowAddForm(false)
      fetchResources()
    } catch (error) {
      console.error("[v0] Error creating resource:", error)
    }
  }

  const deleteResource = async (id: string) => {
    if (!confirm(t({ en: "Are you sure you want to delete this resource?", ne: "के तपाईं यो स्रोत हटाउन निश्चित हुनुहुन्छ?" })))
      return

    try {
      const { error } = await supabase.from("resources").delete().eq("id", id)
      if (error) throw error
      setResources(resources.filter((r) => r.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting resource:", error)
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("resources").update({ is_published: !currentStatus }).eq("id", id)
      if (error) throw error
      setResources(resources.map((r) => (r.id === id ? { ...r, is_published: !currentStatus } : r)))
    } catch (error) {
      console.error("[v0] Error updating resource:", error)
    }
  }

  const filteredResources = resources.filter((resource) => {
    const title = language === "en" ? resource.title_en : resource.title_ne
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || resource.type === selectedType
    return matchesSearch && matchesType
  })

  const translations = {
    title: t({ en: "Content Management", ne: "सामग्री व्यवस्थापन" }),
    description: t({
      en: "Manage resources, articles, and educational content",
      ne: "स्रोतहरू, लेखहरू र शैक्षणिक सामग्री व्यवस्थापन गर्नुहोस्",
    }),
    search: t({ en: "Search resources...", ne: "स्रोतहरू खोज्नुहोस्..." }),
    addNew: t({ en: "Add Resource", ne: "स्रोत थप्नुहोस्" }),
    title_en_label: t({ en: "Title (English)", ne: "शीर्षक (अंग्रेजी)" }),
    title_ne_label: t({ en: "Title (Nepali)", ne: "शीर्षक (नेपाली)" }),
    type_label: t({ en: "Type", ne: "प्रकार" }),
    create: t({ en: "Create", ne: "बनाउनुहोस्" }),
    cancel: t({ en: "Cancel", ne: "रद्द गर्नुहोस्" }),
    delete: t({ en: "Delete", ne: "हटाउनुहोस्" }),
    unpublish: t({ en: "Unpublish", ne: "अप्रकाशित गर्नुहोस्" }),
    publish: t({ en: "Publish", ne: "प्रकाशित गर्नुहोस्" }),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{translations.title}</h1>
          <p className="text-muted-foreground mt-2">{translations.description}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          {translations.addNew}
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>{translations.addNew}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{translations.title_en_label}</label>
                <Input
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{translations.title_ne_label}</label>
                <Input
                  value={formData.title_ne}
                  onChange={(e) => setFormData({ ...formData, title_ne: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{translations.type_label}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{translations.create}</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  {translations.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t({ en: "All Resources", ne: "सभी स्रोतहरू" })}</CardTitle>
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background"
            >
              <option value="all">{t({ en: "All Types", ne: "सभी प्रकार" })}</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t({ en: "Title", ne: "शीर्षक" })}</TableHead>
                  <TableHead>{t({ en: "Type", ne: "प्रकार" })}</TableHead>
                  <TableHead>{t({ en: "Author", ne: "लेखक" })}</TableHead>
                  <TableHead>{t({ en: "Status", ne: "स्थिति" })}</TableHead>
                  <TableHead>{t({ en: "Actions", ne: "कार्य" })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {t({ en: "Loading...", ne: "लोड हो रहेको छ..." })}
                    </TableCell>
                  </TableRow>
                ) : filteredResources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {t({ en: "No resources found", ne: "कोई स्रोत नहीं मिला" })}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {language === "en" ? resource.title_en : resource.title_ne}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {resource.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{resource.author?.full_name || "Unknown"}</TableCell>
                      <TableCell>
                        {resource.is_published ? (
                          <Badge className="bg-green-600">{t({ en: "Published", ne: "प्रकाशित" })}</Badge>
                        ) : (
                          <Badge variant="secondary">{t({ en: "Draft", ne: "मसौदा" })}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => togglePublish(resource.id, resource.is_published)}>
                              {resource.is_published ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  {translations.unpublish}
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  {translations.publish}
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteResource(resource.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
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

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourcesContent />
    </Suspense>
  )
}
