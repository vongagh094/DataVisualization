"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface ExerciseHabitGroupData {
    group: string; // "Yes", "No" (for family history)
    heartDiseaseYes: number;
    heartDiseaseNo: number;
}

interface ExerciseHabitGroupedBarChartProps {
    data: ExerciseHabitGroupData[];
}

export default function D3ExerciseHabitGroupedBarChart({
    data,
}: ExerciseHabitGroupedBarChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data || !containerRef.current) return;

        // Clean entire elements in this svg tag
        d3.select(svgRef.current).selectAll("*").remove();

        // Get the actual container width
        const containerWidth = containerRef.current.clientWidth;

        // Adjust margins to fit better
        const margin = { top: 80, right: 120, bottom: 60, left: 60 };
        const width = containerWidth - margin.left - margin.right;
        const height = 300; // Reduced fixed height

        // Set the SVG dimensions
        d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const svg = d3
            .select(svgRef.current)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Prepare data for grouped bars
        const groups = data.map((d) => d.group);
        const subgroups = ["heartDiseaseYes", "heartDiseaseNo"];

        // X scale for groups
        const x0 = d3.scaleBand().domain(groups).range([0, width]).padding(0.3);

        // X scale for subgroups (within each group)
        const x1 = d3
            .scaleBand()
            .domain(subgroups)
            .range([0, x0.bandwidth()])
            .padding(0.1);

        // Y scale
        const y = d3
            .scaleLinear()
            .domain([0, 100]) // Percentage scale
            .range([height, 0]);

        // Color scale - using teal and coral colors to match the image
        const color = d3
            .scaleOrdinal<string>()
            .domain(subgroups)
            .range(["#2A9D8F", "#E76F51"]);

        // Add X axis with better styling
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .style("font-size", "12px")
            .style("font-weight", "bold");

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 15)
            .style("font-size", "14px")
            .text("Exercise Habit");

        // Add Y axis with better styling
        svg.append("g")
            .call(
                d3
                    .axisLeft(y)
                    .ticks(5)
                    .tickFormat((d) => `${d}%`)
            )
            .selectAll("text")
            .style("font-size", "11px");

        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 15)
            .attr("x", -height / 2)
            .style("font-size", "14px")
            .text("Percentage");

        // Add a title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2 + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Heart Disease by Exercise Habit");

        // Better tooltip with more styling
        const tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "rgba(255, 255, 255, 0.9)")
            .style("border", "1px solid #333")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("box-shadow", "2px 2px 6px rgba(0, 0, 0, 0.3)")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("font-size", "12px");

        // Create the grouped bars
        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${x0(d.group)},0)`)
            .selectAll("rect")
            .data((d) => {
                return subgroups.map((key) => {
                    return {
                        key: key,
                        value: d[key],
                        group: d.group,
                    };
                });
            })
            .enter()
            .append("rect")
            .attr("x", (d) => x1(d.key))
            .attr("y", (d) => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", (d) => height - y(d.value))
            .attr("fill", (d) => color(d.key))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
                // Determine if this is "Yes" or "No" segment
                const segmentType =
                    d.key === "heartDiseaseYes"
                        ? "Heart Disease"
                        : "No Heart Disease";

                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 0.8)
                    .attr("stroke-width", 2);

                tooltip.transition().duration(200).style("opacity", 1);

                tooltip
                    .html(
                        `<strong>Exercise Habit: ${d.group}</strong><br>
                           <span style="color:${
                               d.key === "heartDiseaseYes"
                                   ? "#2A9D8F"
                                   : "#E76F51"
                           }">
                           ${segmentType}: ${d.value.toFixed(1)}%</span>`
                    )
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 1)
                    .attr("stroke-width", 1);

                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Add percentage labels above the bars
        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${x0(d.group)},0)`)
            .selectAll("text")
            .data((d) => {
                return subgroups.map((key) => {
                    return {
                        key: key,
                        value: d[key],
                        group: d.group,
                    };
                });
            })
            .enter()
            .append("text")
            .attr("x", (d) => x1(d.key) + x1.bandwidth() / 2)
            .attr("y", (d) => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .style("fill", (d) =>
                d.key === "heartDiseaseYes" ? "#2A9D8F" : "#E76F51"
            )
            .text((d) => {
                return `${d.value}%`;
            });

        // Add a legend for Heart Disease status
        const legend = svg
            .append("g")
            .attr("transform", `translate(${width}, 0)`);

        const legendItems = [
            { key: "heartDiseaseYes", label: "Heart Disease: Yes" },
            { key: "heartDiseaseNo", label: "Heart Disease: No" },
        ];

        legendItems.forEach((item, i) => {
            const legendGroup = legend
                .append("g")
                .attr("transform", `translate(0, ${i * 20})`);

            legendGroup
                .append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color(item.key));

            legendGroup
                .append("text")
                .attr("x", 20)
                .attr("y", 7.5)
                .attr("dy", ".35em")
                .style("font-size", "12px")
                .text(item.label);
        });

        // Make chart responsive
        const resizeChart = () => {
            if (!containerRef.current || !svgRef.current) return;

            // Get new container width
            const newWidth = containerRef.current.clientWidth;

            // Update SVG dimensions
            d3.select(svgRef.current)
                .attr("width", newWidth)
                .attr("height", height + margin.top + margin.bottom);
        };

        // Add resize listener
        window.addEventListener("resize", resizeChart);

        // Clean up on unmount
        return () => {
            tooltip.remove();
            window.removeEventListener("resize", resizeChart);
        };
    }, [data]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "380px", position: "relative" }}
        >
            <svg ref={svgRef} style={{ maxWidth: "100%" }}></svg>
        </div>
    );
}
