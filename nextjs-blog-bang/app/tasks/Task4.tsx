// ("use client");

import { useEffect, useState } from "react";
import * as d3 from "d3";
import TaskCard from "../components/TaskCard";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import D3ExerciseHabitGroupedBarChart from "../components/D3ExerciseGroupedBarChart";

interface ExerciseHabitGroupStats {
    exerciseHabitGroup: string;
    heartDiseaseYesPercentage: number;
    heartDiseaseNoPercentage: number;
}

export default function Task4() {
    const [ExerciseHabitGroupStats, setExerciseHabitGroupStats] = useState<
        ExerciseHabitGroupStats[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            async function fetchDataFromCSV() {
                const response = await fetch(
                    "/project_heart_disease_filled.csv"
                );
                const text = await response.text();
                const raw = d3.csvParse(text, (d) => ({
                    "Exercise Habits": d["Exercise Habits"],
                    "Heart Disease Status": d["Heart Disease Status"],
                }));

                const exerciseHabitsGroups = ["Low", "Medium", "High"];

                const barStats: ExerciseHabitGroupStats[] =
                    exerciseHabitsGroups.map((group) => {
                        const groupData = raw.filter(
                            (d) => d["Exercise Habits"] === group
                        );

                        const yesCount = groupData.filter(
                            (d) => d["Heart Disease Status"] === "Yes"
                        ).length;
                        const noCount = groupData.filter(
                            (d) => d["Heart Disease Status"] === "No"
                        ).length;
                        const total = yesCount + noCount;

                        return {
                            exerciseHabitGroup: group,
                            heartDiseaseYesPercentage: total
                                ? +((yesCount / total) * 100).toFixed(2)
                                : 0,
                            heartDiseaseNoPercentage: total
                                ? +((noCount / total) * 100).toFixed(2)
                                : 0,
                        };
                    });
                setExerciseHabitGroupStats(barStats);
            }
            fetchDataFromCSV();
        } catch (error) {
            console.log("Error happens: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <TaskCard
            taskNumber={4}
            title="Task 4"
            description="Analyze the effect of exercise habits on the heart disease likelihood using Grouped Bar Chart."
        >
            {/* Stacked Bar Chart */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                        Chart 4: Grouped Bar Chart (Exercise Habits)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[450px]">
                    <D3ExerciseHabitGroupedBarChart
                        data={ExerciseHabitGroupStats.map((stat) => ({
                            group: stat.exerciseHabitGroup,
                            heartDiseaseYes: stat.heartDiseaseYesPercentage,
                            heartDiseaseNo: stat.heartDiseaseNoPercentage,
                        }))}
                    />
                </CardContent>
            </Card>
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <p>
                    The chart depicts the relationship between exercise habits
                    (Low, Medium, High) and the occurrence of heart disease,
                    using a grouped bar chart format to compare the percentage
                    of individuals with and without heart disease across
                    different exercise levels. It shows that individuals with
                    low exercise habits have the highest prevalence of heart
                    disease at 80.28%, while those with medium and high exercise
                    habits have slightly lower rates at 79.62% and 80.1%,
                    respectively. In contrast, the proportion of individuals
                    without heart disease increases as exercise habits improve,
                    with the highest proportion observed among those with medium
                    exercise habits (19.9%). This pattern suggests that although
                    there is a slight increase in heart disease occurrence among
                    those with lower exercise habits, the difference is not
                    substantial, indicating that exercise habits alone might not
                    be a strong determinant of heart disease risk in this
                    dataset.
                </p>
            </div>
        </TaskCard>
    );
}
