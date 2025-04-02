"use client";

import { useEffect, useState } from "react";
import * as d3 from "d3";
import TaskCard from "../components/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import D3BMIScatterPlot from "../components/D3BMIScatterPlot";

type BMIData = {
  bmi: number;
  heartDisease: string;
};

export default function Task6() {
  const [bmiHeartDiseaseStats, setBMIHeartDiseaseStats] = useState<BMIData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDataFromCSV() {
      try {
        const response = await fetch("/project_heart_disease_filled.csv");
        const text = await response.text();
        const raw = d3.csvParse(text, (d) => ({
          BMI: +d["BMI"],
          "Heart Disease Status": d["Heart Disease Status"],
        }));

        // Xử lý dữ liệu cho Scatter Plot
        const scatterData: BMIData[] = raw
          .filter((d) => !isNaN(d.BMI) && (d["Heart Disease Status"] === "Yes" || d["Heart Disease Status"] === "No"))
          .map((d) => ({
            bmi: d.BMI,
            heartDisease: d["Heart Disease Status"],
          }));

        setBMIHeartDiseaseStats(scatterData);
      } catch (err) {
        console.error("Error loading CSV:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDataFromCSV();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <TaskCard
      taskNumber={6}
      title="Task 6: BMI and Heart Disease"
      description="Analyze the relationship between BMI and heart disease using a Scatter Plot."
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Scatter Plot */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chart 6.1: Scatter Plot (BMI vs Heart Disease)</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px]">
            <D3BMIScatterPlot data={bmiHeartDiseaseStats} />
          </CardContent>
        </Card>
        <div className="mt-4">
          <p className="text-muted-foreground">
            This analysis explores the relationship between BMI and heart disease. The scatter plot reveals that individuals 
            with higher BMI values tend to have a higher likelihood of heart disease. However, there is also a significant 
            overlap between individuals with and without heart disease across various BMI ranges. This suggests that while BMI 
            is an important factor, it may not be the sole determinant of heart disease risk, and other factors should also be 
            considered in the analysis.
          </p>
        </div>
      </div>
    </TaskCard>
  );
}