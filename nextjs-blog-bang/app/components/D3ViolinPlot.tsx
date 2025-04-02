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

interface D3ViolinPlotProps {
  data: CholesterolData[]
}

export default function D3ViolinPlot({ data }: D3ViolinPlotProps) {
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
      .range(["#2A9D90", "#E76E50"]) // Blue for male, orange for female
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

    // Generate violin shapes
    data.forEach((d, i) => {
      const xPos = (x(d.gender) || 0) + x.bandwidth() / 2

      // Generate kernel density estimation points
      const kdePoints = []
      const step = (d.max - d.min) / 30

      for (let j = d.min; j <= d.max; j += step) {
        // Simulate a normal distribution
        const density = Math.exp(-0.5 * Math.pow((j - d.median) / ((d.q3 - d.q1) / 1.34), 2))
        kdePoints.push({ y: j, density })
      }

      // Scale density to fit in the chart
      const maxWidth = x.bandwidth() * 0.4
      const densityScale = d3
        .scaleLinear()
        .domain([0, d3.max(kdePoints, (p) => p.density) || 1])
        .range([0, maxWidth])

      // Create violin path
      const violinPath = d3
        .area<{ y: number; density: number }>()
        .x0((d) => xPos - densityScale(d.density))
        .x1((d) => xPos + densityScale(d.density))
        .y((d) => y(d.y))
        .curve(d3.curveCatmullRom)

      // Add violin shape
      svg
        .append("path")
        .datum(kdePoints)
        .attr("d", violinPath)
        .attr("fill", color(d.gender))
        .attr("opacity", 0.7)
        .attr("stroke", "none")

      // Add median line
      svg
        .append("line")
        .attr("x1", xPos - maxWidth)
        .attr("x2", xPos + maxWidth)
        .attr("y1", y(d.median))
        .attr("y2", y(d.median))
        .attr("stroke", "white")
        .attr("stroke-width", 2)

      // Add quartile lines
      svg
        .append("line")
        .attr("x1", xPos - maxWidth * 0.8)
        .attr("x2", xPos + maxWidth * 0.8)
        .attr("y1", y(d.q1))
        .attr("y2", y(d.q1))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3,3")

      svg
        .append("line")
        .attr("x1", xPos - maxWidth * 0.8)
        .attr("x2", xPos + maxWidth * 0.8)
        .attr("y1", y(d.q3))
        .attr("y2", y(d.q3))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3,3")

      // Add outliers
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
        .attr("x", xPos - maxWidth)
        .attr("y", y(d.max))
        .attr("width", maxWidth * 2)
        .attr("height", y(d.min) - y(d.max))
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

