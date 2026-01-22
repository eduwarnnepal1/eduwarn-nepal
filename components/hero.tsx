"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Award className="h-4 w-4" />
            <span>Learn | Grow | Decide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance mb-6">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground sm:text-xl text-pretty max-w-2xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/auth/sign-up">
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="/courses">{t("hero.courses")}</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-6 rounded-lg bg-card border border-border">
              <Users className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold text-foreground">10,000+</div>
              <div className="text-sm text-muted-foreground">{t("stats.students")}</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-lg bg-card border border-border">
              <BookOpen className="h-8 w-8 text-secondary" />
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">{t("stats.courses")}</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-lg bg-card border border-border">
              <Award className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold text-foreground">100+</div>
              <div className="text-sm text-muted-foreground">{t("stats.mentors")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
