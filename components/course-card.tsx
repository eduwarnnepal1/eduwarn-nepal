import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, BarChart } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    title_ne: string
    description: string
    description_ne: string
    thumbnail_url: string
    difficulty_level: string
    category: string
    estimated_duration: number
    points_reward: number
  }
  language: "en" | "ne"
}

export function CourseCard({ course, language }: CourseCardProps) {
  const title = language === "ne" ? course.title_ne : course.title
  const description = language === "ne" ? course.description_ne : course.description

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow border-border">
      <div className="relative aspect-video w-full">
        <Image
          src={course.thumbnail_url || "/placeholder.svg?height=200&width=400&query=education-course"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {course.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4">
        <h3 className="text-lg font-bold line-clamp-2 text-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="px-4 pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.estimated_duration}m</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-3 w-3" />
            <span className="capitalize">{course.difficulty_level}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>+{course.points_reward} pts</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/courses/${course.id}`} className="w-full">
          <button className="w-full h-9 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            {language === "ne" ? "सुरु गर्नुहोस्" : "Start Learning"}
          </button>
        </Link>
      </CardFooter>
    </Card>
  )
}
