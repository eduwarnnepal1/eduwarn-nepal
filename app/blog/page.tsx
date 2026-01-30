"use client"

import { CardTitle } from "@/components/ui/card"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const BLOG_POSTS = [
  {
    id: "1",
    title: "How to Choose the Right Career Path in Nepal",
    title_ne: "नेपालमा सही करियर मार्ग कसरी रोज्ने",
    excerpt: "A comprehensive guide to understanding the Nepali job market and educational landscape.",
    excerpt_ne: "नेपाली रोजगार बजार र शैक्षिक परिदृश्य बुझ्नको लागि एक व्यापक मार्गदर्शिका।",
    image: "/blog-career.jpg",
    author: "Career Desk",
    date: "Jan 15, 2026",
    readingTime: "5 min",
    category: "Career",
  },
  {
    id: "2",
    title: "Top 10 Study Tips for Exam Success",
    title_ne: "परीक्षा सफलताका लागि शीर्ष १० अध्ययन सुझावहरू",
    excerpt: "Boost your productivity and improve your retention with these proven study methods.",
    excerpt_ne: "यी प्रमाणित अध्ययन विधिहरूका साथ आफ्नो उत्पादकता बढाउनुहोस् र स्मरण शक्ति सुधार गर्नुहोस्।",
    image: "/blog-study.jpg",
    author: "EduWarn Team",
    date: "Jan 12, 2026",
    readingTime: "4 min",
    category: "Academics",
  },
  {
    id: "3",
    title: "The Future of Digital Education in Nepal",
    title_ne: "नेपालमा डिजिटल शिक्षाको भविष्य",
    excerpt: "How technology is reshaping the way students learn and interact across the country.",
    excerpt_ne: "प्रविधिले देशैभरि विद्यार्थीहरूले सिक्ने र अन्तरक्रिया गर्ने तरिकालाई कसरी नयाँ रूप दिइरहेको छ।",
    image: "/blog-tech.jpg",
    author: "Tech Corner",
    date: "Jan 10, 2026",
    readingTime: "6 min",
    category: "Technology",
  },
]

export default function BlogPage() {
  const { language, t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{language === "ne" ? "हाम्रो ब्लग" : "Our Blog"}</h1>
          <p className="text-muted-foreground">
            {language === "ne"
              ? "पछिल्लो शैक्षिक समाचार, सुझाव र लेखहरू पढ्नुहोस्"
              : "Read the latest educational news, tips, and insights"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Card
              key={post.id}
              className="flex flex-col h-full hover:shadow-xl transition-all group overflow-hidden border-border"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg?height=400&width=600&query=education-blog"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 hover:bg-primary">{post.category}</Badge>
                </div>
              </div>
              <CardHeader className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readingTime}
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors mb-3">
                  {language === "ne" ? post.title_ne : post.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {language === "ne" ? post.excerpt_ne : post.excerpt}
                </p>
              </CardHeader>
              <CardFooter className="p-6 pt-0 mt-auto">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-[10px] font-bold">
                      {post.author[0]}
                    </div>
                    <span className="text-xs font-medium">{post.author}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-primary text-sm font-semibold flex items-center gap-1 group/btn"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
