"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface GenderData {
  No: number;
  Yes: number;
}

interface D3GenderPieChartProps {
  data: {
    Male: GenderData;
    Female: GenderData;
  };
  gender: "Male" | "Female";
}

export default function D3GenderPieChart({ data, gender }: D3GenderPieChartProps) {
  const pieChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !pieChartRef.current) return;

    d3.select(pieChartRef.current).selectAll("*").remove();

    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3
      .select(pieChartRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const genderData = data[gender];
    const total = genderData.No + genderData.Yes;
    const pieData = [
      { label: "No Heart Disease", value: genderData.No },
      { label: "Heart Disease", value: genderData.Yes }
    ];

    const color = d3.scaleOrdinal()
      .domain(pieData.map(d => d.label))
      .range(["#4e79a7", "#e15759"]);

    const pie = d3.pie<typeof pieData[0]>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<typeof pieData[0]>>()
      .innerRadius(0)
      .outerRadius(radius)
      .padAngle(0.02);

    const arcs = svg.selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label) as string)
      .attr("stroke", "white")
      .style("stroke-width", "1px")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("transform", "scale(1.05)");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("transform", "scale(1)");
      });

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .text(d => {
        const percentage = ((d.data.value / total) * 100).toFixed(1) + "%";
        return d.data.value > 0 ? `${d.data.value} (${percentage})` : "";
      });

    const legend = svg.append("g")
      .attr("transform", `translate(${radius - 30}, ${radius - 20})`);

    legend.selectAll("rect")
      .data(pieData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 15)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d => color(d.label) as string);

    legend.selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .attr("x", 15)
      .attr("y", (d, i) => i * 15 + 9)
      .style("font-size", "10px")
      .text(d => `${d.label} (${d.value}, ${((d.value / total) * 100).toFixed(1)}%)`);
  }, [data, gender]);

  return (
    <div className="w-full h-full p-2">
      <h3 className="text-sm font-semibold text-center mb-1">
        {gender === "Male" ? "🧑" : "👩"}
      </h3>
      <div 
        ref={pieChartRef}
        className="w-full h-[calc(100%-24px)]"
      />
    </div>
  );
}