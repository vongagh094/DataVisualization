import TaskCard from "../components/TaskCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Label } from "@/app/components/ui/label"
import D3ViolinPlot from "../components/D3ViolinPlot"
import D3BoxPlot from "../components/D3BoxPlot"
import { useEffect, useState } from "react"
// import { generateStatsTask8 } from "../lib/tasksPreCalc"

interface Task8Props {
  showViolinPlot: boolean
  togglePlotType: (checked: boolean) => void
}

export default function Task8({ showViolinPlot, togglePlotType }: Task8Props) {
  const [_, setCholesterolData] = useState<any[]>([])
  // Sample data for Task 8: Cholesterol Levels by Gender
  const cholesterolData = [
    { gender: "Male", min: 120, q1: 180, median: 210, q3: 240, max: 300, outliers: [320, 340] },
    { gender: "Female", min: 130, q1: 170, median: 200, q3: 230, max: 280, outliers: [310, 330] },
  ]

  // const fetchData = async () => {
  //   // Simulate fetching data from an API or CSV file
  //   const data = await generateStatsTask8()
  //   if (data) {
  //     setCholesterolData(data)
  //   }
  //   return
  // }

  return (
    <TaskCard
      taskNumber={8}
      title="Task 8: Cholesterol Levels by Gender"
      description="Analysis of cholesterol level distributions across genders using violin and box plots."
    >
      <div className="flex items-center gap-2 mb-4">
        <Checkbox className="hover:cursor-pointer " id="toggle-plot" checked={showViolinPlot} onCheckedChange={togglePlotType} />
        <Label htmlFor="toggle-plot">{showViolinPlot ? "Show Violin Plot" : "Show Box Plot"}</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base border border-gray-200 rounded-md p-2 bg-gray-50">
              Chart 8.1: {showViolinPlot ? "Violin" : "Box"} Plot (Cholesterol Levels by Gender)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {showViolinPlot ? <D3ViolinPlot data={cholesterolData} /> : <D3BoxPlot data={cholesterolData} />}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chart 8.2: Cholesterol Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Male Cholesterol Statistics</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Minimum: {cholesterolData[0].min} mg/dL</li>
                  <li>First Quartile (Q1): {cholesterolData[0].q1} mg/dL</li>
                  <li>Median: {cholesterolData[0].median} mg/dL</li>
                  <li>Third Quartile (Q3): {cholesterolData[0].q3} mg/dL</li>
                  <li>Maximum: {cholesterolData[0].max} mg/dL</li>
                  <li>Outliers: {cholesterolData[0].outliers.join(", ")} mg/dL</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Female Cholesterol Statistics</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Minimum: {cholesterolData[1].min} mg/dL</li>
                  <li>First Quartile (Q1): {cholesterolData[1].q1} mg/dL</li>
                  <li>Median: {cholesterolData[1].median} mg/dL</li>
                  <li>Third Quartile (Q3): {cholesterolData[1].q3} mg/dL</li>
                  <li>Maximum: {cholesterolData[1].max} mg/dL</li>
                  <li>Outliers: {cholesterolData[1].outliers.join(", ")} mg/dL</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <p className="text-muted-foreground">
          The analysis of cholesterol levels by gender reveals that males tend to have slightly higher median
          cholesterol levels (210 mg/dL) compared to females (200 mg/dL). However, the distribution patterns differ,
          with males showing a wider range and more extreme outliers. This suggests that while both genders are
          susceptible to cholesterol issues, the risk factors and manifestations may vary by gender, which could inform
          gender-specific prevention strategies.
        </p>
      </div>
    </TaskCard>
  )
}

