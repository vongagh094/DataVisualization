"use client";

import { useState, useEffect } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import TaskCard from "../components/TaskCard";
import AnalysisAge from "../components/D3AgeBarChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

interface HeartDiseaseData {
  Age: number;
  "Heart Disease Status": "Yes" | "No";
  Gender: string;
  // Add other relevant fields from your CSV
}

interface AgeGroupStats {
  ageGroup: string;
  heartDiseaseYes: number;
  heartDiseaseNo: number;
}

export default function Task1() {
  const [ageStats, setAgeStats] = useState<AgeGroupStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/project_heart_disease_filled.csv");
        const csvText = await response.text();
        
        Papa.parse<HeartDiseaseData>(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            processAgeData(result.data);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const processAgeData = (data: HeartDiseaseData[]) => {
    const ageBins = [18, 22, 30, 40, 50, 60, 70, 80];
    const ageLabels = ["18-22", "22-30", "30-40", "40-50", "50-60", "60-70", "70-80"];
    
    const ageGroupStats: AgeGroupStats[] = ageLabels.map(label => ({
      ageGroup: label,
      heartDiseaseYes: 0,
      heartDiseaseNo: 0
    }));

    data.forEach(row => {
      const age = row.Age;
      const disease = row["Heart Disease Status"];
      for (let i = 0; i < ageBins.length - 1; i++) {
        if (age >= ageBins[i] && age < ageBins[i + 1]) {
          disease === "Yes" 
            ? ageGroupStats[i].heartDiseaseYes++ 
            : ageGroupStats[i].heartDiseaseNo++;
          break;
        }
      }
    });

    setAgeStats(ageGroupStats);
  };

  if (loading) return <div>Loading data...</div>;

  return (
    <TaskCard
      taskNumber={1}
      title="Task 1"
      description="Analyzing heart disease distribution across different age groups"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Age Group Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-gray-50 rounded flex items-center justify-center">
              <AnalysisAge data={ageStats} />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out p-3">
          <li>The first observation when surveying the data is that the age range surveyed is from 18 to 80 years old.</li>
          <li>Students (18-22 years old) have a very low risk of heart disease.</li>
          <li> People in the working age group (22-40) show a gradual increase in risk, reflecting the impact of work on health concerns. Notably, the age group (30-40) records the highest number of heart disease cases.</li>
          <li>In the middle-aged group (40-60), the incidence of heart disease decreases, reflecting the impact of time on health and the financial stability of this age group, which allows them to pay more attention to their health.</li>
          <li>After this period, the rate increases again because aging makes diseases inevitable.</li>
        </Card>
      </div>
    </TaskCard>
  );
};