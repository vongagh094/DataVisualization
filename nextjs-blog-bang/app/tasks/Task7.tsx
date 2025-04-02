import TaskCard from "../components/TaskCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import D3GroupedBarChart from "../components/D3GroupedBarChart"
// import { generateStatsTask7 } from "../lib/tasksPreCalc"
import { useState, useEffect } from "react"

interface DataPoint {
  familyHistory: string
  malePercentage: number
  femalePercentage: number
}


export default function Task7() {
  // Sample data for Task 7: Family History vs. Heart Disease
  const [familyHistoryData, setFamilyHistoryData] = useState<DataPoint[]>([
    { familyHistory: "Yes", malePercentage: 68, femalePercentage: 52 },
    { familyHistory: "No", malePercentage: 32, femalePercentage: 48 },
  ])

  // const fetchData = async () => {
  //   const data = await generateStatsTask7()
  //   if (data) {
  //     setFamilyHistoryData(data)
  //   }
  // }

  return (
    <TaskCard 
      taskNumber={7}
      title="Task 7: Family History vs. Heart Disease"
      description="Analysis of the relationship between family history and heart disease incidence, with gender comparison."
    >
      <div className="grid grid-cols-1 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chart 7: Bar Chart (Family History vs. Heart Disease)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <D3GroupedBarChart data={familyHistoryData} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <p className="text-muted-foreground">
          This analysis shows a clear correlation between family history and heart disease incidence. Individuals with a
          family history of heart disease show significantly higher rates of heart disease themselves, with males (68%)
          showing a stronger correlation than females (52%). This suggests that genetic factors may play a more
          significant role in male heart disease development, while females might be more influenced by lifestyle and
          environmental factors.
        </p>
      </div>
    </TaskCard>
  )
}

