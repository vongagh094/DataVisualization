"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Heart } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Download } from "lucide-react"
import { ScrollArea } from "@/app/components/ui/scroll-area"

// Import task components
import Task1 from "@/app/tasks/Task1"
import Task2 from "@/app/tasks/Task2"
import Task3 from "@/app/tasks/Task3"
import Task4 from "@/app/tasks/Task4"
import Task5 from "@/app/tasks/Task5"
import Task6 from "@/app/tasks/Task6"
import Task7 from "@/app/tasks/Task7"
import Task8 from "@/app/tasks/Task8"

export default function Dashboard() {
  const [ageFilter, setAgeFilter] = useState("all")
  const [showViolinPlot, setShowViolinPlot] = useState(true)

  // Toggle function for violin/box plot
  const togglePlotType = (checked: boolean) => {
    setShowViolinPlot(checked)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Heart className="h-6 w-6 text-red-500 " />
          <h1 className="text-xl font-semibold">Heart Disease Data Analysis Dashboard</h1>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="text-md hover:cursor-pointer">All Tasks</TabsTrigger>
              {Array.from({ length: 8 }, (_, i) => (
                <TabsTrigger className="hover:cursor-pointer text-md" key={i} value={`task-${i + 1}`}>
                  Task {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>

  
          </div>

          <TabsContent value="all" className="space-y-8">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <Task1 />
              <Task2 />
              <Task3 />
              <Task4 />
              <Task5 />
              <Task6 />
              <Task7 />
              <Task8 showViolinPlot={showViolinPlot} togglePlotType={togglePlotType} />
            </ScrollArea>
          </TabsContent>

          {/* Individual task tabs */}
          <TabsContent value="task-1">
            <Task1 />
          </TabsContent>
          <TabsContent value="task-2">
            <Task2 />
          </TabsContent>
          <TabsContent value="task-3">
            <Task3 />
          </TabsContent>
          <TabsContent value="task-4">
            <Task4 />
          </TabsContent>
          <TabsContent value="task-5">
            <Task5 />
          </TabsContent>
          <TabsContent value="task-6">
            <Task6 />
          </TabsContent>
          <TabsContent value="task-7">
            <Task7 />
          </TabsContent>
          <TabsContent value="task-8">
            <Task8 showViolinPlot={showViolinPlot} togglePlotType={togglePlotType} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

