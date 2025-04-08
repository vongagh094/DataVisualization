import TaskCard from "../components/TaskCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import D3GroupedBarChart from "../components/D3GroupedBarChart"
import * as d3 from "d3"
// import { generateStatsTask7 } from "../lib/tasksPreCalc"
import { useState, useEffect } from "react"

interface DataPoint {
  familyHistory: string
  malePercentage: number
  femalePercentage: number
}


export default function Task7() {
  // Sample data for Task 7: Family History vs. Heart Disease
  // const [familyHistoryData, setFamilyHistoryData] = useState<DataPoint[]>([
  //   { familyHistory: "Yes", malePercentage: 68, femalePercentage: 52 },
  //   { familyHistory: "No", malePercentage: 32, femalePercentage: 48 },
  // ])

  // const fetchData = async () => {
  //   const data = await generateStatsTask7()
  //   if (data) {
  //     setFamilyHistoryData(data)
  //   }
  // }

  const [familyHistoryData, setFamilyHistoryData] = useState<DataPoint[]>([]);

  async function fetchFamilyHistoryData(): Promise<DataPoint[]> {
    const response = await fetch("/project_heart_disease_filled.csv");
    const text = await response.text();
  
    const raw = d3.csvParse(text, (d) => ({
      Family_History: d["Family Heart Disease"],
      Gender: d["Gender"],
      Heart_Disease: d["Heart Disease Status"],
    }));
  
    const grouped = d3.group(raw, d => d.Family_History) as Map<string, typeof raw>;
    
    const result: DataPoint[] = Array.from(grouped, ([history, records]) => {
      const maleRecords = records.filter(d => d.Gender === "Male");
      const femaleRecords = records.filter(d => d.Gender === "Female");
  
      const maleDiseaseCount = maleRecords.filter(d => d.Heart_Disease === "Yes").length;
      const femaleDiseaseCount = femaleRecords.filter(d => d.Heart_Disease === "Yes").length;
  
      const malePercentage = maleRecords.length === 0 ? 0 : +(maleDiseaseCount / maleRecords.length * 100).toFixed(2);
      const femalePercentage = femaleRecords.length === 0 ? 0 : +(femaleDiseaseCount / femaleRecords.length * 100).toFixed(2);


      return {
        familyHistory: history,
        malePercentage,
        femalePercentage,
      };
    });

    return result;
  }
  

  useEffect(() => {
    fetchFamilyHistoryData().then(setFamilyHistoryData);
  }, []);

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
          The data reveals a slight variation in the prevalence of heart disease between males and females, as well as between individuals with and without a family history of the condition.
        </p>
        <ul className="text-muted-foreground">
          <li>
            <strong>Gender Comparison:</strong> Across both categories (with and without a family history), females exhibit a marginally higher percentage of heart disease cases compared to males. Specifically:
            <ul>
              <li>Among individuals without a family history, 21.06% of females are affected compared to 19.55% of males.</li>
              <li>Among those with a family history, 20.32% of females have heart disease, slightly higher than the 19.08% of males.</li>
            </ul>
          </li>
          <li>
            <strong>Impact of Family History:</strong> Interestingly, the presence of a family history of heart disease does not appear to significantly increase the percentage of affected individuals. The rates remain relatively stable, with only minor variations between the groups.
          </li>
          <li>
            <strong>Overall Trend:</strong> The data suggests that while gender may play a small role in heart disease prevalence, family history does not seem to be a major differentiating factor in this particular dataset. However, further analysis with a larger sample size and additional risk factors would be necessary to draw more definitive conclusions.
          </li>
        </ul>
      </div>
    </TaskCard>
  )
}

