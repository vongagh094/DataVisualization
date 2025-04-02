"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface SmokingGroupData {
    group: string; // "Smoking", "Non-Smoking"
    heartDiseaseYes: number;
    heartDiseaseNo: number;
}

interface SmokingStackedBarChartProps {
    data: SmokingGroupData[];
}

export default function D3SmokingStackedBarChart({
    data,
}: SmokingStackedBarChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data || !containerRef.current) return;

        // Clean entire elements in this svg tag
        d3.select(svgRef.current).selectAll("*").remove();

        // Get the actual container width
        const containerWidth = containerRef.current.clientWidth;

        // Adjust margins to fit better
        const margin = { top: 80, right: 120, bottom: 50, left: 60 };
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

        // Prepare data for stacking
        const stackedData = d3
            .stack()
            .keys(["heartDiseaseYes", "heartDiseaseNo"])
            .value((d, key) => d[key])(data);

        // X scale
        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.group))
            .range([0, width])
            .padding(0.3);

        // Y scale
        const y = d3
            .scaleLinear()
            .domain([0, 100]) // Percentage scale
            .range([height, 0]);

        // Color scale - using more distinct colors
        const color = d3
            .scaleOrdinal<string>()
            .domain(["heartDiseaseYes", "heartDiseaseNo"])
            .range(["#FF6B6B", "#4ECDC4"]);

        // Add X axis with better styling
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "12px")
            .style("font-weight", "bold");

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .style("font-size", "14px")
            .text("Smoking Status");

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
            .text("Heart Disease by Smoking Status");

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

        // Create the stacked bars with better hover effects
        const barGroups = svg
            .selectAll(".bar-group")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("fill", (d) => color(d.key));

        barGroups
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.data.group))
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
                // Determine if this is "Yes" or "No" segment
                const segmentType =
                    d[1] - d[0] === d.data.heartDiseaseYes
                        ? "Heart Disease"
                        : "No Heart Disease";
                const percentage = d[1] - d[0];

                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 0.8)
                    .attr("stroke-width", 2);

                tooltip.transition().duration(200).style("opacity", 1);

                tooltip
                    .html(
                        `<strong>${d.data.group}</strong><br>
                           <span style="color:${
                               segmentType === "Heart Disease"
                                   ? "#FF6B6B"
                                   : "#4ECDC4"
                           }">
                           ${segmentType}: ${percentage}%</span>`
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

        // Add percentage labels inside the bars
        barGroups
            .selectAll("text")
            .data((d) => d)
            .enter()
            .append("text")
            .attr("x", (d) => x(d.data.group) + x.bandwidth() / 2)
            .attr("y", (d) => y((d[0] + d[1]) / 2))
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text((d) => {
                const value = d[1] - d[0];
                return value > 5 ? `${value.toFixed(1)}%` : ""; // Only show if there's enough space
            });

        // Add a legend - moved to the top right
        const legend = svg
            .append("g")
            .attr("transform", `translate(${width + 10}, 0)`);

        const legendItems = [
            { key: "heartDiseaseYes", label: "Heart Disease" },
            { key: "heartDiseaseNo", label: "No Heart Disease" },
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

            // This is a simplified approach - for a complete resize,
            // you would need to recalculate scales and reposition elements
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
