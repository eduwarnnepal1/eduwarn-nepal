"use client"

import { useState, useEffect, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, Pin, Trash2 } from "lucide-react"

interface ForumPost {
  id: string
  title: string
  author_id: string
  is_pinned: boolean
  created_at: string
  author?: { full_name: string }
}

function ForumContent() {
  const supabase = createClient()
  const { t, language } = useLanguage()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchForumPosts()
  }, [])

  const fetchForumPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("forum_posts")
        .select("id, title, author_id, is_pinned, created_at, author:profiles(full_name)")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("[v0] Error fetching forum posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm(t({ en: "Are you sure?", ne: "के तपाईं निश्चित हुनुहुन्छ?" }))) return

    try {
      const { error } = await supabase.from("forum_posts").delete().eq("id", id)
      if (error) throw error
      setPosts(posts.filter((p) => p.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting post:", error)
    }
  }

  const togglePin = async (id: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase.from("forum_posts").update({ is_pinned: !currentPinned }).eq("id", id)
      if (error) throw error
      setPosts(posts.map((p) => (p.id === id ? { ...p, is_pinned: !currentPinned } : p)))
    } catch (error) {
      console.error("[v0] Error updating post:", error)
    }
  }

  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const translations = {
    title: t({ en: "Forum Moderation", ne: "फोरम संयोजन" }),
    description: t({
      en: "Manage forum posts, pin important discussions, and moderate content",
      ne: "फोरम पोस्ट व्यवस्थापन गर्नुहोस्, महत्वपूर्ण छलफल पिन गर्नुहोस्",
    }),
    search: t({ en: "Search posts...", ne: "पोस्ट खोज्नुहोस्..." }),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{translations.title}</h1>
        <p className="text-muted-foreground mt-2">{translations.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t({ en: "Forum Posts", ne: "फोरम पोस्टहरू" })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={translations.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t({ en: "Title", ne: "शीर्षक" })}</TableHead>
                  <TableHead>{t({ en: "Author", ne: "लेखक" })}</TableHead>
                  <TableHead>{t({ en: "Status", ne: "स्थिति" })}</TableHead>
                  <TableHead>{t({ en: "Date", ne: "मिति" })}</TableHead>
                  <TableHead>{t({ en: "Actions", ne: "कार्य" })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                      <TableCell>{post.author?.full_name || "Unknown"}</TableCell>
                      <TableCell>{post.is_pinned && <Badge className="bg-blue-600">Pinned</Badge>}</TableCell>
                      <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => togglePin(post.id, post.is_pinned)}>
                              <Pin className="w-4 h-4 mr-2" />
                              {post.is_pinned ? "Unpin" : "Pin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deletePost(post.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
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

export default function ForumPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForumContent />
    </Suspense>
  )
}
