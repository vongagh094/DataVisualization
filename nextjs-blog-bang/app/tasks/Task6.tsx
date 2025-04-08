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
            <strong>BMI Analysis</strong><br />
            The data is widely distributed across BMI levels. However, there is no clear trend indicating a linear relationship between BMI and the number of people with heart disease (or heart disease status). Some low BMI ranges (e.g., 18-22) show points with high numbers of heart disease cases (over 10), while some points in higher BMI ranges (35-40) show lower numbers, indicating randomness and strong dispersion.<br /><br />

            BMI levels between 24-30 appear to have higher point density, but the number of heart disease cases at each point doesn't show consistent growth or superiority compared to other BMI levels. There are no clear "high point clusters" in higher BMI ranges, which would typically be expected if the hypothesis "high BMI → higher heart disease risk" were true.<br /><br />

            This suggests that BMI does not clearly demonstrate correlation with heart disease status (Heart Disease Status).
          </p>
        </div>
      </div>
    </TaskCard>
  );
}