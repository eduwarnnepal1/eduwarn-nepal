"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/context/language-context"
import { Plus, Pencil, Trash2, Search, Layers } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"

interface Course {
  id: string
  title_en: string
  title_ne: string
  category: string
  difficulty: string
  is_published: boolean
  created_at: string
}

export default function AdminCoursesPage() {
  const { t } = useLanguage()
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("courses")
      .select("id, title_en, title_ne, category, difficulty, is_published, created_at")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setCourses(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (
      confirm(
        t({
          en: "Are you sure you want to delete this course?",
          ne: "के तपाईं निश्चित हुनुहुन्छ कि तपाईं यो पाठ्यक्रम मेटाउन चाहनुहुन्छ?",
        }),
      )
    ) {
      const { error } = await supabase.from("courses").delete().eq("id", id)
      if (!error) {
        setCourses(courses.filter((c) => c.id !== id))
      }
    }
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || course.title_ne.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t({ en: "Manage Courses", ne: "पाठ्यक्रमहरू व्यवस्थापन" })}</h1>
          <p className="text-muted-foreground">
            {t({ en: "Create and edit your educational content.", ne: "तपाईंको शैक्षिक सामग्री सिर्जना र सम्पादन गर्नुहोस्।" })}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            {t({ en: "New Course", ne: "नयाँ पाठ्यक्रम" })}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Suspense fallback={<div>Loading...</div>}>
                <Input
                  placeholder={t({ en: "Search courses...", ne: "पाठ्यक्रमहरू खोज्नुहोस्..." })}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Suspense>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t({ en: "Title", ne: "शीर्षक" })}</TableHead>
                <TableHead className="hidden md:table-cell">{t({ en: "Category", ne: "कोटि" })}</TableHead>
                <TableHead className="hidden md:table-cell">{t({ en: "Difficulty", ne: "कठिनाइ" })}</TableHead>
                <TableHead>{t({ en: "Status", ne: "स्थिति" })}</TableHead>
                <TableHead className="text-right">{t({ en: "Actions", ne: "कार्यहरू" })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {t({ en: "Loading courses...", ne: "पाठ्यक्रमहरू लोड गर्दै..." })}
                  </TableCell>
                </TableRow>
              ) : filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {t({ en: "No courses found.", ne: "कुनै पाठ्यक्रम भेटिएन।" })}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{course.title_en}</span>
                        <span className="text-xs text-muted-foreground">{course.title_ne}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{course.category}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{course.difficulty}</TableCell>
                    <TableCell>
                      {course.is_published ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                          {t({ en: "Published", ne: "प्रकाशित" })}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          {t({ en: "Draft", ne: "मस्यौदा" })}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/courses/${course.id}/lessons`}>
                            <Layers className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/courses/${course.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
