import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Info, Download } from "lucide-react"

interface TaskCardProps {
  taskNumber: number
  title: string
  description: string
  children: React.ReactNode
  onViewDetails?: () => void
}

export default function TaskCard({ taskNumber, title, description, children, onViewDetails }: TaskCardProps) {
  return (
    <Card className="mb-8 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary bg-gray-800 text-white font-bold text-sm">
            {taskNumber}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="border-t border-gray-200 pt-4 flex justify-between">
        <Button variant="outline" onClick={onViewDetails} size="sm" className="flex items-center gap-2 text-md border-gray-300 hover:cursor-pointer">
          <Info className="h-4 w-4" /> View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

