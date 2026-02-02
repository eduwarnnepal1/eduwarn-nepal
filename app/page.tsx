"use client"

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { CourseCard } from "@/components/course-card"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// MOCK data for the home page preview
const FEATURED_COURSES = [
  {
    id: "e39ab846-6202-4c8a-b4f9-61db5075035c",
    title: "Introduction to Computer Science",
    title_ne: "कम्प्युटर विज्ञानको परिचय",
    description: "Learn the fundamentals of computing and algorithms.",
    description_ne: "कम्प्युटिङ र एल्गोरिदमको आधारभूत कुराहरू सिक्नुहोस्।",
    thumbnail_url: "/computer-science.jpg",
    difficulty_level: "beginner",
    category: "Technology",
    estimated_duration: 120,
    points_reward: 200,
  },
  {
    id: "2",
    title: "Mastering Mathematics for SEE",
    title_ne: "SEE का लागि गणितमा महारत",
    description: "Key concepts for the Secondary Education Examination.",
    description_ne: "माध्यमिक शिक्षा परीक्षाका लागि प्रमुख अवधारणाहरू।",
    thumbnail_url: "/math-symbols.png",
    difficulty_level: "intermediate",
    category: "Academics",
    estimated_duration: 180,
    points_reward: 300,
  },
]

export default function Home() {
  const { language } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Featured Courses section */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {language === "ne" ? "मुख्य कोर्सहरू" : "Featured Courses"}
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/courses">{language === "ne" ? "सबै हेर्नुहोस्" : "View All"}</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} language={language} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
