"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface BMIData {
  bmi: number;
  heartDisease: string;
}

interface BMIScatterPlotProps {
  data: BMIData[];
}

export default function D3BMIScatterPlot({ data }: BMIScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filter, setFilter] = useState<"Yes" | "No">("Yes");

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Filter data based on the selected filter
    const filtered = data.filter((d) => d.heartDisease === filter && d.bmi > 10);

    // 2. Gom theo BMI (làm tròn đến 1 chữ số sau dấu phẩy)
    const grouped = d3.rollup(
      filtered,
      v => v.length,
      d => +d.bmi.toFixed(1)
    );

    const scatterData = Array.from(grouped, ([bmi, count]) => ({
      bmi,
      count
    }));

    // 3. Tính miền giá trị
    const bmiValues = scatterData.map(d => d.bmi);
    const countValues = scatterData.map(d => d.count);
    const minBMI = Math.min(...bmiValues);
    const maxBMI = Math.max(...bmiValues);
    const maxCount = Math.max(...countValues);

    // 4. D3 Setup
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom - 10; // Reduce height slightly to prevent overflow

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([Math.floor(minBMI), Math.ceil(maxBMI)])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, maxCount + 1])
      .range([height, 0]);

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

    // 5. Trục
    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    chart.append("g")
      .call(d3.axisLeft(y));

    // 6. Vẽ các điểm với interactivity
    const points = chart.selectAll("circle")
      .data(scatterData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.bmi))
      .attr("cy", (d) => y(d.count))
      .attr("r", 6)
      .attr("fill", "#2A9D90")
      .attr("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 1).attr("stroke", "black").attr("stroke-width", 2);
        tooltip
          .style("opacity", 1)
          .html(`BMI: ${d.bmi}<br>Count: ${d.count}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
        points.attr("opacity", 0.3); // Dim other points
        d3.select(this).attr("opacity", 1); // Highlight current point
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.8).attr("stroke", "none");
        tooltip.style("opacity", 0);
        points.attr("opacity", 0.8); // Reset all points
      });


    // 7. Tiêu đề
    chart.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Số người mắc bệnh tim theo từng mức BMI");
  }, [data, filter]);

  return (
    <div>
      <button onClick={() => setFilter(filter === "Yes" ? "No" : "Yes")}>
        Show Heart Disease: {filter === "Yes" ? "No" : "Yes"}
      </button>
      <svg ref={svgRef} width="100%" height="500px"></svg>
    </div>
  );
}
