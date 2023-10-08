import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Typography, Chip, useMediaQuery } from '@mui/material';
import './App.css'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@emotion/react';

const LinearGraph = ({ weatherData, cityName, timeData }) => {
  const svgRef = useRef();
  const [temperatureChips, setTemperatureChips] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  const theme = useTheme()
  const isMd= useMediaQuery(theme.breakpoints.up('md'));
  
  useEffect(() => {
    const maxTempData = weatherData;

    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = isMd ? 600 : 300 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, maxTempData.length - 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, d3.max(maxTempData)]).nice().range([height, 0]);

    const line = d3.line().x((_, i) => xScale(i)).y(d => yScale(d)).curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(maxTempData)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#FFA500')
      .attr('stroke-width', 3)
      .attr('d', line);

    svg.selectAll('.temp-label')
      .data(maxTempData)
      .enter()
      .append('circle')
      .attr('class', 'temp-label')
      .attr('cx', (_, i) => xScale(i))
      .attr('cy', d => yScale(d))
      .attr('r', 6)
      .attr('fill', "rgba(255, 255, 255, 0.7)");

    const chips = maxTempData.map((temp, index) => (
      <Chip
        key={index}
        label={`${temp}°C`}
        color="primary"
        
        style={{
          position: 'absolute',
          left: `${margin.left + xScale(index) - 25}px`,
          top: `${margin.top + yScale(temp)}px`,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)", 
          border: "none",
          fontWeight: "bold",
          color:"#000"
        }}
      />
    ));

    // Generate time labels
   const timeChips = timeData.map((time, index) => (
      <Chip
        key={index}
        label={time}
        color="primary"
        icon={isMd ? <AccessTimeIcon /> : ''}
        style={{
          position: 'absolute',
          left: `${margin.left + xScale(index) - 25}px`,
          top: `${margin.top + height + 10}px`, // Position below the temperature chips
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)", 
          border: "none",
          fontWeight: "bold",
          color:"#000"
        }}
      />
    ));

    setTemperatureChips(chips);
    setTimeLabels(timeChips);
  }, [weatherData, timeData]);

  return (
    <div className="divCont" style={{ 
      position: 'relative', padding: '20px',
      }}>
      <svg ref={svgRef}></svg>
      {temperatureChips}
      {timeLabels}
    </div>
  );
};

export default LinearGraph;
