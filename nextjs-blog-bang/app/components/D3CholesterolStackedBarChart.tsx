"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface CholesterolGroupData {
  group: string; // "Low", "Medium", "High"
  heartDiseaseYes: number;
  heartDiseaseNo: number;
}

interface CholesterolStackedBarChartProps {
  data: CholesterolGroupData[];
}

export default function D3CholesterolStackedBarChart({ data }: CholesterolStackedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom - 10; // Reduce height slightly to prevent overflow

    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.group))
      .range([0, width])
      .padding(0.2);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, 100]) // Percentage scale
      .range([height, 0]);

    // Color scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(["heartDiseaseYes", "heartDiseaseNo"])
      .range(["#E76E50", "#2A9D90"]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y));

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

    // Add stacked bars with labels
    const bars = svg
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${x(d.group)},0)`)
      .selectAll("rect")
      .data((d) => [
        { key: "heartDiseaseYes", value: d.heartDiseaseYes },
        { key: "heartDiseaseNo", value: d.heartDiseaseNo },
      ])
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => y(d3.sum(nodes.slice(0, i).map((n) => d3.select(n).datum().value)) + d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip
          .style("opacity", 1)
          .html(`${d.key}: ${d.value}%`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
        bars.attr("opacity", 0.3); // Dim other bars
        d3.select(this).attr("opacity", 1); // Highlight current bar
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
        bars.attr("opacity", 1); // Reset all bars
      });

    // Add labels above bars
    svg
      .selectAll("text.bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.group) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.heartDiseaseYes + d.heartDiseaseNo))
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => `${d.heartDiseaseYes + d.heartDiseaseNo}%`);
  }, [data]);

  return <svg ref={svgRef} width="100%" height="100%"></svg>;
}