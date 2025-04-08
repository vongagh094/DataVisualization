"use client";

import { useEffect, useState } from "react";
import * as d3 from "d3";
import TaskCard from "../components/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import D3CholesterolBoxPlot from "../components/D3CholesterolBoxPlot";
import D3CholesterolStackedBarChart from "../components/D3CholesterolStackedBarChart";

type CholesterolHeartDiseaseStats = {
  heartDiseaseStatus: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
};

type CholesterolGroupStats = {
  cholesterolGroup: string;
  heartDiseaseYesPercentage: number;
  heartDiseaseNoPercentage: number;
};

export default function Task5() {
  const [cholesterolHeartDiseaseStats, setCholesterolHeartDiseaseStats] = useState<CholesterolHeartDiseaseStats[]>([]);
  const [cholesterolGroupStats, setCholesterolGroupStats] = useState<CholesterolGroupStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDataFromCSV() {
      try {
        const response = await fetch("/project_heart_disease_filled.csv");
        const text = await response.text();
        const raw = d3.csvParse(text, (d) => ({
          "Cholesterol Level": +d["Cholesterol Level"],
          "Heart Disease Status": d["Heart Disease Status"],
        }));

        // Task 5.1: Box Plot data
        const grouped = d3.group(raw, (d) => d["Heart Disease Status"]) as Map<string, typeof raw>;
        const boxStats: CholesterolHeartDiseaseStats[] = Array.from(grouped, ([status, values]) => {
          const levels = values.map(d => +d["Cholesterol Level"]).sort((a, b) => a - b);
          const q1 = d3.quantile(levels, 0.25)!;
          const median = d3.quantile(levels, 0.5)!;
          const q3 = d3.quantile(levels, 0.75)!;
          const iqr = q3 - q1;
          const lowerBound = q1 - 1.5 * iqr;
          const upperBound = q3 + 1.5 * iqr;
          const outliers = levels.filter(v => v < lowerBound || v > upperBound);

          return {
            heartDiseaseStatus: status,
            min: levels[0],
            q1,
            median,
            q3,
            max: levels[levels.length - 1],
            outliers,
          };
        });

        // Task 5.2: Stacked Bar Chart
        const cholesterolGroups = ["Low", "Medium", "High"];
        const cholesterolRanges = [0, 200, 240, Infinity];

        const barStats: CholesterolGroupStats[] = cholesterolGroups.map((group, i) => {
          const lower = cholesterolRanges[i];
          const upper = cholesterolRanges[i + 1];

          const groupData = raw.filter(d => {
            const level = +d["Cholesterol Level"];
            return level >= lower && level < upper;
          });

          const yesCount = groupData.filter(d => d["Heart Disease Status"] === "Yes").length;
          const noCount = groupData.filter(d => d["Heart Disease Status"] === "No").length;
          const total = yesCount + noCount;

          return {
            cholesterolGroup: group,
            heartDiseaseYesPercentage: total ? +(yesCount / total * 100).toFixed(2) : 0,
            heartDiseaseNoPercentage: total ? +(noCount / total * 100).toFixed(2) : 0,
          };
        });

        setCholesterolHeartDiseaseStats(boxStats);
        setCholesterolGroupStats(barStats);
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
      taskNumber={5}
      title="Task 5: Cholesterol Level and Heart Disease"
      description="Analyze how cholesterol levels vary between individuals with and without heart disease using a Box Plot and a Stacked Bar Chart."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box Plot */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chart 5.1: Box Plot (Cholesterol Levels)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <D3CholesterolBoxPlot
              data={cholesterolHeartDiseaseStats.map(stat => ({
                heartDisease: stat.heartDiseaseStatus,
                min: stat.min,
                q1: stat.q1,
                median: stat.median,
                q3: stat.q3,
                max: stat.max,
                outliers: stat.outliers,
              }))}
            />
          </CardContent>
        </Card>

        {/* Stacked Bar Chart */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chart 5.2: Stacked Bar Chart (Cholesterol Groups)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <D3CholesterolStackedBarChart
              data={cholesterolGroupStats.map(stat => ({
                group: stat.cholesterolGroup,
                heartDiseaseYes: stat.heartDiseaseYesPercentage,
                heartDiseaseNo: stat.heartDiseaseNoPercentage,
              }))}
            />
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <p className="text-muted-foreground">
          <strong>Box Plot</strong><br />
          - <strong>No Heart Disease (No):</strong> Q1 = 187, Median = 225.4, Q3 = 263.<br />
          - <strong>With Heart Disease (Yes):</strong> Q1 = 188, Median = 226, Q3 = 263.<br />

          <strong>Observations:</strong><br />
          The Q1, median, and Q3 values between the two groups are very close, showing almost no significant difference. This suggests that the data may not be strong enough to clearly reflect a relationship between cholesterol and heart disease.<br /><br />

          <strong>Stacked Bar Chart</strong><br />
          - <strong>Low (&lt; 200 cholesterol):</strong> No heart disease (80.27%), with heart disease (19.73%).<br />
          - <strong>Medium (200 - 240 cholesterol):</strong> No heart disease (79.86%), with heart disease (20.14%).<br />
          - <strong>High (&gt; 240 cholesterol):</strong> No heart disease (79.87%), with heart disease (20.13%).<br />

          <strong>Observations:</strong><br />
          The percentages are nearly identical across all three cholesterol groups, clearly indicating that cholesterol levels do not create a significant difference in heart disease prevalence.<br /><br />

          <strong>Conclusion:</strong><br />
          Both visualizations consistently show that cholesterol levels do not have a strong or clear impact on the likelihood of developing heart disease based on the given dataset.
        </p>
      </div>
    </TaskCard>
  );
}