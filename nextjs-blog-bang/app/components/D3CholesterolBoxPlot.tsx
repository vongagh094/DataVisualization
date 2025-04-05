"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface CholesterolData {
  heartDisease: string; // "Yes" or "No"
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

interface CholesterolBoxPlotProps {
  data: CholesterolData[];
}

export default function D3CholesterolBoxPlot({ data }: CholesterolBoxPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip setup
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

    // Color scale for "Yes" and "No"
    const color = d3
      .scaleOrdinal<string>()
      .domain(["Yes", "No"])
      .range(["#E76E50", "#2A9D90"]);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.heartDisease))
      .range([0, width])
      .padding(0.2);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([100, 350]) // Cholesterol range
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle");

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Draw box plots
    data.forEach((d) => {
      const xPos = (x(d.heartDisease) || 0) + x.bandwidth() / 2;
      const boxWidth = x.bandwidth() * 0.5;

      // Vertical line from min to max
      svg
        .append("line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", y(d.min))
        .attr("y2", y(d.max))
        .attr("stroke", color(d.heartDisease))
        .on("mouseover", (event) => {
          tooltip
            .style("opacity", 1)
            .html(`Min: ${d.min}<br>Max: ${d.max}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      // Box from Q1 to Q3
      svg
        .append("rect")
        .attr("x", xPos - boxWidth / 2)
        .attr("y", y(d.q3))
        .attr("width", boxWidth)
        .attr("height", y(d.q1) - y(d.q3))
        .attr("fill", color(d.heartDisease))
        .attr("opacity", 0.7)
        .on("mouseover", (event) => {
          tooltip
            .style("opacity", 1)
            .html(`Q1: ${d.q1}<br>Median: ${d.median}<br>Q3: ${d.q3}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      // Median line
      svg
        .append("line")
        .attr("x1", xPos - boxWidth / 2)
        .attr("x2", xPos + boxWidth / 2)
        .attr("y1", y(d.median))
        .attr("y2", y(d.median))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      // Outliers
      d.outliers.forEach((outlier) => {
        svg
          .append("circle")
          .attr("cx", xPos)
          .attr("cy", y(outlier))
          .attr("r", 4)
          .attr("fill", "red")
          .on("mouseover", (event) => {
            tooltip
              .style("opacity", 1)
              .html(`Outlier: ${outlier}`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 20}px`);
          })
          .on("mouseout", () => {
            tooltip.style("opacity", 0);
          });
      });
    });

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(${width - 100}, 10)`);

    const legendData = [
      { key: "Yes", label: "Heart Disease (Yes)" },
      { key: "No", label: "Heart Disease (No)" },
    ];

    legend
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => color(d.key));

    legend
      .selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .text((d) => d.label)
      .style("font-size", "12px");
  }, [data]);

  return <svg ref={svgRef} width="100%" height="100%"></svg>;
}