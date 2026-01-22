import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, FileVideo, ImageIcon } from "lucide-react"

interface ResourceCardProps {
  resource: {
    id: string
    title: string
    title_ne: string
    file_type: string
    file_size: number
    category: string
  }
  language: "en" | "ne"
}

export function ResourceCard({ resource, language }: ResourceCardProps) {
  const title = language === "ne" ? resource.title_ne : resource.title

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "doc":
        return <FileText className="h-8 w-8 text-primary" />
      case "video":
        return <FileVideo className="h-8 w-8 text-secondary" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-accent" />
      default:
        return <FileText className="h-8 w-8 text-muted-foreground" />
    }
  }

  return (
    <Card className="hover:bg-muted/50 transition-colors border-border group cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-background border border-border">{getIcon(resource.file_type)}</div>
          <div>
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{title}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase">{resource.file_type}</span>
              <span>•</span>
              <span>{(resource.file_size / (1024 * 1024)).toFixed(2)} MB</span>
              <span>•</span>
              <span>{resource.category}</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-background transition-colors">
          <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </button>
      </CardContent>
    </Card>
  )
}
