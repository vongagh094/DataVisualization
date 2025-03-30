"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import Analysis from "./Analysis";

export default function Charts() {
    const [data, setData] = useState(null);
    const barChartRef = useRef();
    const pieChartMaleRef = useRef();
    const pieChartFemaleRef = useRef();

    useEffect(() => {
        fetch("/project_heart_disease_filled.csv")
            .then((response) => response.text())
            .then((csvText) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: (result) => setData(result.data),
                });
            });
    }, []);

    useEffect(() => {
        if (!data) return;

        const ageBins = [18, 22, 30, 40, 50, 60, 70, 80];
        const ageLabels = [
            "18-22",
            "22-30",
            "30-40",
            "40-50",
            "50-60",
            "60-70",
            "70-80",
        ];
        const ageGroups = ageLabels.map(() => ({ No: 0, Yes: 0 }));

        data.forEach((row) => {
            const age = row.Age;
            const disease = row["Heart Disease Status"];
            for (let i = 0; i < ageBins.length - 1; i++) {
                if (age >= ageBins[i] && age < ageBins[i + 1]) {
                    ageGroups[i][disease]++;
                    break;
                }
            }
        });

        d3.select(barChartRef.current).selectAll("*").remove();
        const svg = d3
            .select(barChartRef.current)
            .append("svg")
            .attr("width", 500)
            .attr("height", 300);

        const xScale = d3
            .scaleBand()
            .domain(ageLabels)
            .range([0, 400])
            .padding(0.2);
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(ageGroups.map((g) => g.Yes + g.No))])
            .range([200, 0]);

        svg.append("g")
            .attr("transform", "translate(50, 200)")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", "translate(50, 0)")
            .call(d3.axisLeft(yScale));

        svg.selectAll(".bar-no")
            .data(ageGroups)
            .enter()
            .append("rect")
            .attr("x", (_, i) => xScale(ageLabels[i]) + 50)
            .attr("y", (d) => yScale(d.No))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", (d) => 200 - yScale(d.No))
            .attr("fill", "blue");

        svg.selectAll(".bar-yes")
            .data(ageGroups)
            .enter()
            .append("rect")
            .attr(
                "x",
                (_, i) => xScale(ageLabels[i]) + 50 + xScale.bandwidth() / 2
            )
            .attr("y", (d) => yScale(d.Yes))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", (d) => 200 - yScale(d.Yes))
            .attr("fill", "red");

        const genderData = {
            Male: { No: 0, Yes: 0 },
            Female: { No: 0, Yes: 0 },
        };
        data.forEach((row) => {
            const gender = row.Gender;
            const disease = row["Heart Disease Status"];
            if (genderData[gender]) {
                genderData[gender][disease]++;
            }
        });

        d3.select(pieChartMaleRef.current).selectAll("*").remove();
        d3.select(pieChartFemaleRef.current).selectAll("*").remove();

        const drawPieChart = (ref, data) => {
            const width = 200;
            const height = 200;
            const radius = Math.min(width, height) / 2;
            const svg = d3
                .select(ref)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            const color = d3.scaleOrdinal(["blue", "red"]);
            const pie = d3.pie().value((d) => d[1]);
            const dataReady = pie(Object.entries(data));

            const arc = d3.arc().innerRadius(0).outerRadius(radius);
            svg.selectAll("path")
                .data(dataReady)
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", (d) => color(d.index));
        };

        drawPieChart(pieChartMaleRef.current, genderData.Male);
        drawPieChart(pieChartFemaleRef.current, genderData.Female);
    }, [data]);

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                📊 Thống kê bệnh tim
            </h2>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    🔹 Phân bố bệnh tim theo độ tuổi
                </h3>
                <div ref={barChartRef}></div>
                <Analysis type="age" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        🧑 Nam giới
                    </h3>
                    <div ref={pieChartMaleRef}></div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        👩 Nữ giới
                    </h3>
                    <div ref={pieChartFemaleRef}></div>
                </div>
            </div>
            <Analysis type="gender" />
        </div>
    );
}
