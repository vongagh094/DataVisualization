"use client";

import { useState, useEffect } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import TaskCard from "../components/TaskCard";
import D3GenderPieChart from "../components/D3GenderPieChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

interface HeartDiseaseData {
  Gender: "Male" | "Female";
  "Heart Disease Status": "Yes" | "No";
}

interface GenderStats {
  Male: {
    Yes: number;
    No: number;
  };
  Female: {
    Yes: number;
    No: number;
  };
}

export default function Task2() {
  const [genderStats, setGenderStats] = useState<GenderStats>({
    Male: { Yes: 0, No: 0 },
    Female: { Yes: 0, No: 0 }
  });
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
            processGenderData(result.data);
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

  const processGenderData = (data: HeartDiseaseData[]) => {
    const stats: GenderStats = {
      Male: { Yes: 0, No: 0 },
      Female: { Yes: 0, No: 0 }
    };

    data.forEach(row => {
      const gender = row.Gender;
      const diseaseStatus = row["Heart Disease Status"];
      
      if (gender === "Male" || gender === "Female") {
        diseaseStatus === "Yes" 
          ? stats[gender].Yes++ 
          : stats[gender].No++;
      }
    });

    setGenderStats(stats);
  };

  if (loading) return <div>Loading data...</div>;
  return (
    <TaskCard
      taskNumber={2}
      title="Task 2"
      description="Analyzing heart disease distribution by gender"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Male Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full flex items-center justify-center p-4">
              <div className="w-full h-full max-w-[700px] mx-auto">
                <D3GenderPieChart data={genderStats} gender="Male" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Female Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full flex items-center justify-center p-4">
              <div className="w-full h-full max-w-[700px] mx-auto">
                <D3GenderPieChart data={genderStats} gender="Female" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    <Card className="mt-4 text-muted-foreground grid grid-row-1 items-center justify-center h-[250px] p-3 border border-gray-200 shadow-sm hover:shadow-md">
      <p>Based on the analysis of the heart disease data, we have the following observations:</p>
      <p>Number of males: 5022</p>
      <p>Number of females: 4978</p>
      <p>Number of males with heart disease: 970</p>
      <p>Number of females with heart disease: 1030</p>
      <p>Percentage of males with heart disease: 19.32%</p>
      <p>Percentage of females with heart disease: 20.69%</p>
      <p>From the above data, it can be observed that the percentage of males with heart disease is 19.32% while the percentage of females with heart disease is 20.69%. This indicates that females have a slightly higher risk of developing heart disease compared to males.</p>
    </Card>
    </TaskCard>
  );
};