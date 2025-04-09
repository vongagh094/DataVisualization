"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"

interface DataPoint {
  familyHistory: string
  diseasePercentage: number
}

interface D3GroupedBarChartProps {
  data: DataPoint[]
}

export default function D3GroupedBarChart({ data }: D3GroupedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!svgRef.current || !data) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const margin = { top: 30, right: 30, bottom: 60, left: 60 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Create tooltip div if it doesn't exist
    if (!tooltipRef.current) {
      tooltipRef.current = d3
        .select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid hsl(var(--border))")
        .style("border-radius", "4px")
        .style("padding", "8px")
        .style("pointer-events", "none")
        .style("opacity", "0")
        .style("z-index", "1000")
        .node() as HTMLDivElement
    }

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.familyHistory))
      .range([0, width])
      .padding(0.2)

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, 100]) // Percentage scale
      .range([height, 0])

    // Color scale: Assign a unique color to each family history category
    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.familyHistory))
      .range(d3.schemeCategory10) // Use D3's built-in color scheme

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")

    // Add X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Family History")
      .style("font-size", "14px")

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y))

    // Add Y axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .text("Percentage with Heart Disease (%)")
      .style("font-size", "14px")

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat("" as any),
      )
      .selectAll("line")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-opacity", 0.3)

    // Add bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.familyHistory) || 0)
      .attr("y", (d) => y(d.diseasePercentage))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.diseasePercentage))
      .attr("fill", (d) => color(d.familyHistory)) // Use the color scale
      .attr("rx", 4)
      .on("mouseover", function (event, d) {
        // Highlight bar
        d3.select(this).attr("opacity", 0.8)

        // Show tooltip
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .style("opacity", "1")
            .html(`<strong>${d.familyHistory} Family History</strong><br>Percentage: ${d.diseasePercentage}%`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
        }
      })
      .on("mouseout", function () {
        // Restore bar opacity
        d3.select(this).attr("opacity", 1)

        // Hide tooltip
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style("opacity", "0")
        }
      })

    // Add percentage labels on bars
    svg
      .selectAll("text.label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.familyHistory) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.diseasePercentage) - 5)
      .attr("text-anchor", "middle")
      .text((d) => `${d.diseasePercentage}%`)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#000")

  }, [data])

  return <svg ref={svgRef} width="100%" height="100%"></svg>
}

