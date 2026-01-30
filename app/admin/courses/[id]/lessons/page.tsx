"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { Plus, ArrowLeft, GripVertical, Pencil, Trash2 } from "lucide-react"

interface Lesson {
  id: string
  title_en: string
  title_ne: string
  order_index: number
}

export default function CourseLessonsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const supabase = createClient()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [courseTitle, setCourseTitle] = useState("")

  useEffect(() => {
    fetchCourseAndLessons()
  }, [id])

  const fetchCourseAndLessons = async () => {
    setLoading(true)
    const [courseRes, lessonsRes] = await Promise.all([
      supabase.from("courses").select("title_en").eq("id", id).single(),
      supabase.from("lessons").select("id, title_en, title_ne, order_index").eq("course_id", id).order("order_index"),
    ])

    if (courseRes.data) setCourseTitle(courseRes.data.title_en)
    if (lessonsRes.data) setLessons(lessonsRes.data)
    setLoading(false)
  }

  const handleDelete = async (lessonId: string) => {
    if (confirm(t({ en: "Delete this lesson?", ne: "यो पाठ मेटाउने?" }))) {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId)
      if (!error) {
        setLessons(lessons.filter((l) => l.id !== lessonId))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t({ en: "Manage Lessons", ne: "पाठहरू व्यवस्थापन" })}</h1>
          <p className="text-muted-foreground">{courseTitle}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t({ en: "Lessons List", ne: "पाठहरूको सूची" })}</CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t({ en: "Add Lesson", ne: "पाठ थप्नुहोस्" })}
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{t({ en: "Loading...", ne: "लोड गर्दै..." })}</div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t({ en: "No lessons yet.", ne: "अझै कुनै पाठहरू छैनन्।" })}
              </div>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <p className="font-medium">{lesson.title_en}</p>
                      <p className="text-xs text-muted-foreground">{lesson.title_ne}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
