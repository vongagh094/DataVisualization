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
import D3SmokingStackedBarChart from "../components/D3SmokingStackedBarChart";

interface SmokingGroupStats {
    smokingGroup: string;
    heartDiseaseYesPercentage: number;
    heartDiseaseNoPercentage: number;
}

export default function Task3() {
    const [SmokingGroupStats, setSmokingGroupStats] = useState<
        SmokingGroupStats[]
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
                    "Smoking Status": d["Smoking"],
                    "Heart Disease Status": d["Heart Disease Status"],
                }));

                const smokingGroups = ["Yes", "No"];

                const barStats: SmokingGroupStats[] = smokingGroups.map(
                    (group) => {
                        const groupData = raw.filter(
                            (d) => d["Smoking Status"] === group
                        );

                        const yesCount = groupData.filter(
                            (d) => d["Heart Disease Status"] === "Yes"
                        ).length;
                        const noCount = groupData.filter(
                            (d) => d["Heart Disease Status"] === "No"
                        ).length;
                        const total = yesCount + noCount;

                        return {
                            smokingGroup: group,
                            heartDiseaseYesPercentage: total
                                ? +((yesCount / total) * 100).toFixed(2)
                                : 0,
                            heartDiseaseNoPercentage: total
                                ? +((noCount / total) * 100).toFixed(2)
                                : 0,
                        };
                    }
                );
                setSmokingGroupStats(barStats);
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
            taskNumber={3}
            title="Task 3"
            description="Analyze the relationship between smoking status and heart disease occurrence using Stacked Bar Chart."
        >
            {/* Stacked Bar Chart */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                        Chart 3: Stacked Bar Chart (Smoking Status)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[450px]">
                    <D3SmokingStackedBarChart
                        data={SmokingGroupStats.map((stat) => ({
                            group: stat.smokingGroup,
                            heartDiseaseYes: stat.heartDiseaseYesPercentage,
                            heartDiseaseNo: stat.heartDiseaseNoPercentage,
                        }))}
                    />
                </CardContent>
            </Card>
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <p>
                    The chart illustrates the relationship between smoking
                    status and the occurrence of heart disease, using a stacked
                    bar chart format to compare smokers and non-smokers. Among
                    smokers, approximately 20.1% have heart disease, while 79.9%
                    do not, whereas among non-smokers, around 19.9% have heart
                    disease, with 80.1% remaining unaffected. The proportions of
                    heart disease between the two groups are nearly identical,
                    with only a slight difference of 0.2%, indicating that, in
                    this dataset, smoking status does not appear to
                    significantly influence the occurrence of heart disease.
                </p>
            </div>
        </TaskCard>
    );
}
