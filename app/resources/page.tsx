"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ResourceCard } from "@/components/resource-card"
import { useLanguage } from "@/context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MOCK_RESOURCES = [
  {
    id: "1",
    title: "Class 10 Math Formula Sheet",
    title_ne: "कक्षा १० गणित सूत्र पाना",
    file_type: "pdf",
    file_size: 2 * 1024 * 1024,
    category: "Math",
  },
  {
    id: "2",
    title: "SEE Science Model Questions 2081",
    title_ne: "SEE विज्ञान नमूना प्रश्नहरू २०८१",
    file_type: "pdf",
    file_size: 5 * 1024 * 1024,
    category: "Science",
  },
  {
    id: "3",
    title: "Interview Preparation Guide",
    title_ne: "अन्तर्वार्ता तयारी मार्गदर्शिका",
    file_type: "pdf",
    file_size: 1.5 * 1024 * 1024,
    category: "Career",
  },
]

export default function ResourcesPage() {
  const { language } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {language === "ne" ? "अध्ययन सामग्रीहरू" : "Learning Resources"}
        </h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">{language === "ne" ? "सबै" : "All"}</TabsTrigger>
            <TabsTrigger value="academic">{language === "ne" ? "शैक्षिक" : "Academic"}</TabsTrigger>
            <TabsTrigger value="career">{language === "ne" ? "करियर" : "Career"}</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {MOCK_RESOURCES.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} language={language} />
            ))}
          </TabsContent>
          <TabsContent value="academic" className="space-y-4">
            {MOCK_RESOURCES.filter((r) => r.category !== "Career").map((resource) => (
              <ResourceCard key={resource.id} resource={resource} language={language} />
            ))}
          </TabsContent>
          <TabsContent value="career" className="space-y-4">
            {MOCK_RESOURCES.filter((r) => r.category === "Career").map((resource) => (
              <ResourceCard key={resource.id} resource={resource} language={language} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
