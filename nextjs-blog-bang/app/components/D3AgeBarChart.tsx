"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface AgeGroupStats {
  ageGroup: string;
  heartDiseaseYes: number;
}

interface AnalysisAgeProps {
  data: AgeGroupStats[];
}

export default function AnalysisAge({ data }: AnalysisAgeProps) {
  const barChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !barChartRef.current) return;

    d3.select(barChartRef.current).selectAll("*").remove();

    const width = 500;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(barChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(barChartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("box-shadow", "2px 2px 5px rgba(0,0,0,0.1)");

    const ageGroups = data.map(d => d.ageGroup);
    const heartDiseaseCases = data.map(d => d.heartDiseaseYes);

    const xScale = d3
      .scaleBand()
      .domain(ageGroups)
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(heartDiseaseCases) || 0])
      .nice()
      .range([innerHeight, 0]);

    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.ageGroup) || 0)
      .attr("y", d => yScale(d.heartDiseaseYes))
      .attr("height", d => innerHeight - yScale(d.heartDiseaseYes))
      .attr("width", xScale.bandwidth())
      .attr("fill", "#e15759")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#c03d3d"); 
        
        tooltip
          .style("visibility", "visible")
          .html(`
            <div><strong>Age Group:</strong> ${d.ageGroup}</div>
            <div><strong>Number:</strong> ${d.heartDiseaseYes}</div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#e15759");
        tooltip.style("visibility", "hidden");
      });

    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("Number of Cases");

    svg.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Heart Disease Cases by Age Group");

    svg.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Age Group");

  }, [data]);

  return (
    <div 
      ref={barChartRef} 
      style={{ 
        width: "100%", 
        height: "400px",
        position: "relative"
      }} 
    />
  );
}