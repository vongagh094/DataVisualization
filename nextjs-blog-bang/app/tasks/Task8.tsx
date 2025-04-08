import TaskCard from "../components/TaskCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Label } from "@/app/components/ui/label"
import D3ViolinPlot from "../components/D3ViolinPlot"
import D3BoxPlot from "../components/D3BoxPlot"
import { useEffect, useState } from "react"
import * as d3 from "d3"
// import { generateStatsTask8 } from "../lib/tasksPreCalc"

interface Task8Props {
  showViolinPlot: boolean
  togglePlotType: (checked: boolean) => void
}


interface CholesterolStats {
  gender: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}



export default function Task8({ showViolinPlot, togglePlotType }: Task8Props) {
  const [cholesterolData, setCholesterolData] = useState<CholesterolStats[]>([])
  // Sample data for Task 8: Cholesterol Levels by Gender
  // const cholesterolData = [
  //   { gender: "Male", min: 120, q1: 180, median: 210, q3: 240, max: 300, outliers: [320, 340] },
  //   { gender: "Female", min: 130, q1: 170, median: 200, q3: 230, max: 280, outliers: [310, 330] },
  // ]


  
  async function fetchCholesterolData(): Promise<CholesterolStats[]> {
    const response = await fetch("/project_heart_disease_filled.csv");
    const text = await response.text();
    
    const raw = d3.csvParse(text, (d) => ({
      Gender: d["Gender"],
      Cholesterol: +d["Cholesterol Level"],
    }));
    console.log(raw);

    const grouped = d3.group(raw, d => d.Gender) as Map<string, typeof raw>;

    const result: CholesterolStats[] = Array.from(grouped, ([gender, records]) => {
      const levels = records.map(d => d.Cholesterol).sort((a, b) => a - b);
      const q1 = d3.quantile(levels, 0.25)!;
      const median = d3.quantile(levels, 0.5)!;
      const q3 = d3.quantile(levels, 0.75)!;
      const iqr = q3 - q1;
      const min = levels[0];
      const max = levels[levels.length - 1];
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      const outliers = levels.filter(v => v < lowerFence || v > upperFence);

      return { gender, min, q1, median, q3, max, outliers };
      });
    return result;
  }

  useEffect(() => {
    fetchCholesterolData().then(setCholesterolData);
  }, []);

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
                  <li>Minimum: {cholesterolData[0]?.min} mg/dL</li>
                  <li>First Quartile (Q1): {cholesterolData[0]?.q1} mg/dL</li>
                  <li>Median: {cholesterolData[0]?.median} mg/dL</li>
                  <li>Third Quartile (Q3): {cholesterolData[0]?.q3} mg/dL</li>
                  <li>Maximum: {cholesterolData[0]?.max} mg/dL</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Female Cholesterol Statistics</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Minimum: {cholesterolData[1]?.min} mg/dL</li>
                  <li>First Quartile (Q1): {cholesterolData[1]?.q1} mg/dL</li>
                  <li>Median: {cholesterolData[1]?.median} mg/dL</li>
                  <li>Third Quartile (Q3): {cholesterolData[1]?.q3} mg/dL</li>
                  <li>Maximum: {cholesterolData[1]?.max} mg/dL</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
      <div className="text-sm text-muted-foreground">
        <h3>Similar Ranges:</h3>
        <ul>
            <li><strong> - Both males and females</strong> have the same minimum (150 mg/dL) and maximum (300 mg/dL) cholesterol levels.</li>
            <li>This indicates that, overall, the cholesterol levels in the dataset fall within the same range for both genders.</li>
        </ul>

        <h3>Central Tendency Differences:</h3>
        <ul>
            <li><strong> - Median cholesterol levels:</strong> The medians are almost identical, suggesting that the central cholesterol levels are quite similar for both genders.</li>
        </ul>

        <ul>
            <li><strong> - First Quartile (Q1):</strong> This suggests that the lower 25% of cholesterol levels are slightly higher for females than for males.</li>
        </ul>

        <ul>
            <li><strong> - Third Quartile (Q3):</strong> This indicates that the upper 25% of cholesterol levels are also slightly higher for females.</li>
        </ul>

        <h3>Distribution Shape and Spread:</h3>
        <ul>
            <li>The <strong>interquartile range (IQR)</strong> is nearly identical for both genders:</li>
            <li> - This means that the middle 50% of the data has the same spread for both groups.</li>
            <li> - Since the <strong>range (Max - Min)</strong> is also identical (150 mg/dL), it suggests that the overall variability in cholesterol levels is the same between genders.</li>
        </ul>

        <h3>Outliers:</h3>
        <ul>
            <li> - The statistics provided do not explicitly state the number of outliers, but if any exist, they might influence the interpretation of cholesterol distributions.</li>
            <li> - If there are extreme outliers, they could be affecting the mean values, but the median would remain a reliable measure of central tendency.</li>
        </ul>

        <h3>Conclusion:</h3>
        <ul>
            <li> - The cholesterol levels of males and females follow a <strong>very similar distribution</strong> in terms of range, median, and spread.</li>
            <li> - There is <strong>no significant difference</strong> in cholesterol levels between genders based on the provided quartile data.</li>
        </ul>
    </div>
    </div>
    </TaskCard>
  )
}

