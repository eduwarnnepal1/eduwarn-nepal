"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ResourceCard } from "@/components/resource-card"
import { useLanguage } from "@/context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Loader } from "lucide-react"

interface Resource {
  id: string
  title_en: string
  title_ne: string
  file_type: string
  file_size: number
  category_en: string
  category_ne: string
}

export default function ResourcesPage() {
  const { language } = useLanguage()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await supabase
          .from('resources')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        setResources(data || [])
      } catch (error) {
        console.error('Error fetching resources:', error)
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [supabase])

  const categories = [
    { value: "all", label: language === "ne" ? "सबै" : "All" },
    { value: "academic", label: language === "ne" ? "शैक्षिक" : "Academic" },
    { value: "career", label: language === "ne" ? "करियर" : "Career" },
  ]

  const getFilteredResources = (category: string) => {
    if (category === "all") return resources
    if (category === "academic") return resources.filter((r) => r.category_en?.toLowerCase() !== "career")
    if (category === "career") return resources.filter((r) => r.category_en?.toLowerCase() === "career")
    return resources
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {language === "ne" ? "अध्ययन सामग्रीहरू" : "Learning Resources"}
        </h1>
        <p className="text-gray-600 mb-8">
          {language === "ne" ? "आपनो शिक्षा को लागि आवश्यक सबै संसाधनहरू यहाँ पाउनुहोस्" : "Find all the resources you need for your studies"}
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
              ))}
            </TabsList>
            {categories.map((cat) => (
              <TabsContent key={cat.value} value={cat.value} className="space-y-4">
                {getFilteredResources(cat.value).length > 0 ? (
                  getFilteredResources(cat.value).map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} language={language} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {language === "ne" ? "कोई संसाधन उपलब्ध नहीं है" : "No resources available"}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  )
}
