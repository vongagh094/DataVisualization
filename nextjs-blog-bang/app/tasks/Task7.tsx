import TaskCard from "../components/TaskCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import D3GroupedBarChart from "../components/D3GroupedBarChart"
import * as d3 from "d3"
// import { generateStatsTask7 } from "../lib/tasksPreCalc"
import { useState, useEffect } from "react"

interface DataPoint {
  familyHistory: string
  diseasePercentage: number
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
    const totalDiseaseCount = d3.count(raw, d => d.Heart_Disease === "Yes");
    const result: DataPoint[] = Array.from(grouped, ([history, records]) => {
      const diseasedRecords = d3.count(records, d => d.Heart_Disease === "Yes");
      
      // round by 2 decimals 
      const diseasePercentage = Math.round((diseasedRecords / totalDiseaseCount) * 10000) / 100;


      return {
        familyHistory: history,
        diseasePercentage,
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
        <div className="p-4 rounded-xl shadow-md bg-white text-base leading-relaxed">
          <p><strong>Chart Overview:</strong></p>
          <p>
            The y-axis represents the percentage of individuals with heart disease.
            The x-axis shows two categories for Family History: <strong>Yes</strong> (has family history) and <strong>No</strong> (no family history).
          </p>
          <p className="mt-2">
            The percentage of individuals with heart disease is:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li><strong>49.75%</strong> for those with a family history.</li>
            <li><strong>50.25%</strong> for those without a family history.</li>
          </ul>

          <p className="mt-4"><strong>Interpretation:</strong></p>
          <p>
            The difference between the two groups is minimal: only <strong>0.5%</strong> more individuals without a family history have heart disease.
          </p>
          <p className="mt-2">
            This contradicts the common assumption that having a family history increases the risk.
            Statistically speaking, this very small difference suggests that family history, in this dataset, is not a significant factor in heart disease risk.
          </p>

          <p className="mt-4"><strong>Conclusion:</strong></p>
          <p>
            No, a family history of heart disease does <strong>not</strong> appear to increase the risk based on this chart.
            In fact, the data shows a slightly higher rate of heart disease among those without a family history, although the difference is likely not meaningful and could be due to chance or other confounding factors.
          </p>
        </div>
      </div>
    </TaskCard>
  )
}

