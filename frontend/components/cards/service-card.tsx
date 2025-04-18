import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
  tech: string
}

export function ServiceCard({ icon, title, description, tech }: ServiceCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="flex-1">{description}</CardDescription>
        <div className="mt-4 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
          {tech}
        </div>
      </CardContent>
    </Card>
  )
}
