"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Plus, Trash2, Edit2 } from "lucide-react"

interface Category {
  id: string
  name_en: string
  name_ne: string
  slug: string
  icon: string | null
}

export default function CategoriesPage() {
  const supabase = createClient()
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name_en: "", name_ne: "", icon: "" })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("categories").select("*").order("name_en")

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("[v0] Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (text: string) => text.toLowerCase().replace(/\s+/g, "-")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name_en || !formData.name_ne) {
      alert(t({ en: "Please fill in all fields", ne: "कृपया सभी क्षेत्र भरें" }))
      return
    }

    const slug = generateSlug(formData.name_en)

    try {
      if (editingId) {
        const { error } = await supabase.from("categories").update(formData).eq("id", editingId)

        if (error) throw error
        setCategories(categories.map((c) => (c.id === editingId ? { ...c, ...formData } : c)))
        setEditingId(null)
      } else {
        const { error } = await supabase.from("categories").insert({
          name_en: formData.name_en,
          name_ne: formData.name_ne,
          slug,
          icon: formData.icon || null,
        })

        if (error) throw error
        fetchCategories()
      }

      setFormData({ name_en: "", name_ne: "", icon: "" })
      setShowAddForm(false)
    } catch (error) {
      console.error("[v0] Error saving category:", error)
      alert(t({ en: "Error saving category", ne: "श्रेणी सहेजने में त्रुटि" }))
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm(t({ en: "Are you sure?", ne: "क्या आप निश्चित हैं?" }))) return

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
      setCategories(categories.filter((c) => c.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting category:", error)
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name_en: category.name_en,
      name_ne: category.name_ne,
      icon: category.icon || "",
    })
    setShowAddForm(true)
  }

  const translations = {
    title: t({ en: "Category Management", ne: "श्रेणी व्यवस्थापन" }),
    description: t({
      en: "Create, edit, and manage categories for resources and forum posts",
      ne: "स्रोतहरू र फोरम पोस्टहरूको लागि श्रेणीहरू बनाएं, सम्पादन गरें र व्यवस्थापन गरें",
    }),
    addNew: t({ en: "Add Category", ne: "श्रेणी जोड्नुहोस्" }),
    name_en: t({ en: "Name (English)", ne: "नाम (अंग्रेजी)" }),
    name_ne: t({ en: "Name (Nepali)", ne: "नाम (नेपाली)" }),
    icon: t({ en: "Icon/Emoji", ne: "आइकन/इमोजी" }),
    create: t({ en: "Create", ne: "बनाउनुहोस्" }),
    update: t({ en: "Update", ne: "अपडेट गर्नुहोस्" }),
    cancel: t({ en: "Cancel", ne: "रद्द गर्नुहोस्" }),
    delete: t({ en: "Delete", ne: "हटाउनुहोस्" }),
    edit: t({ en: "Edit", ne: "सम्पादन गर्नुहोस्" }),
    slug: t({ en: "Slug", ne: "स्लग" }),
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
            <CardTitle>{editingId ? translations.update : translations.addNew}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{translations.name_en}</label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="e.g., Science, Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{translations.name_ne}</label>
                <Input
                  value={formData.name_ne}
                  onChange={(e) => setFormData({ ...formData, name_ne: e.target.value })}
                  placeholder="जस्तै, विज्ञान, गणित"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{translations.icon}</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., 📚, 🔬, 📐"
                  maxLength={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? translations.update : translations.create}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingId(null)
                    setFormData({ name_en: "", name_ne: "", icon: "" })
                  }}
                >
                  {translations.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t({ en: "All Categories", ne: "सभी श्रेणीहरू" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t({ en: "Icon", ne: "आइकन" })}</TableHead>
                  <TableHead>{translations.name_en}</TableHead>
                  <TableHead>{translations.name_ne}</TableHead>
                  <TableHead>{translations.slug}</TableHead>
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
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {t({ en: "No categories found", ne: "कोई श्रेणी नहीं मिली" })}
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="text-2xl">{category.icon || "📁"}</TableCell>
                      <TableCell>{category.name_en}</TableCell>
                      <TableCell>{category.name_ne}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.slug}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEdit(category)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              {translations.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteCategory(category.id)} className="text-red-600">
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
