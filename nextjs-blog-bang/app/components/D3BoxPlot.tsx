"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"

interface CholesterolData {
  gender: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: number[]
}

interface D3BoxPlotProps {
  data: CholesterolData[]
}

export default function D3BoxPlot({ data }: D3BoxPlotProps) {
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
      .domain(data.map((d) => d.gender))
      .range([0, width])
      .padding(0.2)

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([100, 350]) // Cholesterol range
      .range([height, 0])

    // Color scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(["Male", "Female"])
      .range(["#2A9D90", "#E76E50"])

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
      .text("Gender")
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
      .text("Cholesterol Level (mg/dL)")
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

    // Draw box plots
    data.forEach((d, i) => {
      const xPos = (x(d.gender) || 0) + x.bandwidth() / 2
      const boxWidth = x.bandwidth() * 0.5

      // Vertical line from min to max
      svg
        .append("line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", y(d.min))
        .attr("y2", y(d.max))
        .attr("stroke", color(d.gender))
        .attr("stroke-width", 1)

      // Horizontal line at min
      svg
        .append("line")
        .attr("x1", xPos - boxWidth / 3)
        .attr("x2", xPos + boxWidth / 3)
        .attr("y1", y(d.min))
        .attr("y2", y(d.min))
        .attr("stroke", color(d.gender))
        .attr("stroke-width", 1)

      // Horizontal line at max
      svg
        .append("line")
        .attr("x1", xPos - boxWidth / 3)
        .attr("x2", xPos + boxWidth / 3)
        .attr("y1", y(d.max))
        .attr("y2", y(d.max))
        .attr("stroke", color(d.gender))
        .attr("stroke-width", 1)

      // Box from Q1 to Q3
      svg
        .append("rect")
        .attr("x", xPos - boxWidth / 2)
        .attr("y", y(d.q3))
        .attr("width", boxWidth)
        .attr("height", y(d.q1) - y(d.q3))
        .attr("fill", color(d.gender))
        .attr("opacity", 0.7)
        .attr("stroke", color(d.gender))
        .attr("stroke-width", 1)

      // Median line
      svg
        .append("line")
        .attr("x1", xPos - boxWidth / 2)
        .attr("x2", xPos + boxWidth / 2)
        .attr("y1", y(d.median))
        .attr("y2", y(d.median))
        .attr("stroke", "white")
        .attr("stroke-width", 2)

      // Outliers
      d.outliers.forEach((outlier) => {
        svg
          .append("circle")
          .attr("cx", xPos)
          .attr("cy", y(outlier))
          .attr("r", 4)
          .attr("fill", color(d.gender))
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .on("mouseover", (event) => {
            // Show tooltip
            if (tooltipRef.current) {
              d3.select(tooltipRef.current)
                .style("opacity", "1")
                .html(`<strong>${d.gender}</strong><br>Outlier: ${outlier} mg/dL`)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 28 + "px")
            }
          })
          .on("mouseout", () => {
            // Hide tooltip
            if (tooltipRef.current) {
              d3.select(tooltipRef.current).style("opacity", "0")
            }
          })
      })

      // Add interactive area
      svg
        .append("rect")
        .attr("x", xPos - boxWidth / 2)
        .attr("y", y(d.q3))
        .attr("width", boxWidth)
        .attr("height", y(d.q1) - y(d.q3))
        .attr("fill", "transparent")
        .on("mouseover", (event) => {
          // Show tooltip
          if (tooltipRef.current) {
            d3.select(tooltipRef.current)
              .style("opacity", "1")
              .html(`<strong>${d.gender}</strong><br>
                   Min: ${d.min} mg/dL<br>
                   Q1: ${d.q1} mg/dL<br>
                   Median: ${d.median} mg/dL<br>
                   Q3: ${d.q3} mg/dL<br>
                   Max: ${d.max} mg/dL`)
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px")
          }
        })
        .on("mouseout", () => {
          // Hide tooltip
          if (tooltipRef.current) {
            d3.select(tooltipRef.current).style("opacity", "0")
          }
        })
    })
  }, [data])

  return <svg ref={svgRef} width="100%" height="100%"></svg>
}

