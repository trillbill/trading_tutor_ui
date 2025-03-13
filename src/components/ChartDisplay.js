import React, { useEffect, useRef } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';

const ChartDisplay = ({ data, chartType, lineColor }) => {
  const chartContainerRef = useRef();

  // Helper functions to support both full OHLC and singular-value data.
  const getHigh = d => (d.hasOwnProperty('high') ? d.high : d.value);
  const getLow  = d => (d.hasOwnProperty('low')  ? d.low  : d.value);
  const getClose = d => (d.hasOwnProperty('close') ? d.close : d.value);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
      grid: {
        vertLines: { color: '#e0e0e0' },
        horzLines: { color: '#e0e0e0' },
      },
      crossHair: { mode: 1 },
      priceScale: { borderColor: '#cccccc' },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        minBarSpacing: 5,
        borderColor: '#cccccc',
      },
      handleScroll: false,
      handleScale: false,
    });

    
    // Use a line series.
    // Map each data point to { time, value } using our helper for close if available.
    const lineSeries = chart.addLineSeries({
      color: lineColor === 'red' ? '#ca0e0e' : '#26a69a',
      lineWidth: 2,
    });
    const lineData = data.map(d => ({
      time: d.time,
      value: getClose(d)
    }));
    lineSeries.setData(lineData);

    // Fit the time scale.
    chart.timeScale().fitContent();

    // Custom overlay functions use our helper functions.
    const addCustomOverlays = () => {
      switch (chartType) {
        case 'support':
          addSupportLine(chart, data);
          break;
        case 'resistance':
          addResistanceLine(chart, data);
          break;
        case 'fallingWedge':
          addFallingWedge(chart, data);
          break;
        case 'risingWedge':
          addRisingWedge(chart, data);
          break;
        // Add more cases as needed.
        default:
          break;
      }
    };

    const addSupportLine = (chart, data) => {
      // Use getLow() to get the price for each point.
      const lows = data.map(d => getLow(d));
      const supportLevel = Math.min(...lows);

      const supportSeries = chart.addLineSeries({
        color: 'blue',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      supportSeries.setData([
        { time: data[0].time, value: supportLevel },
        { time: data[data.length - 1].time, value: supportLevel },
      ]);
    };

    const addResistanceLine = (chart, data) => {
      // Use getHigh() to get the price for each point.
      const highs = data.map(d => getHigh(d));
      const resistanceLevel = Math.max(...highs);

      const resistanceSeries = chart.addLineSeries({
        color: 'red',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      resistanceSeries.setData([
        { time: data[0].time, value: resistanceLevel },
        { time: data[data.length - 1].time, value: resistanceLevel },
      ]);
    };

    const addFallingWedge = (chart, data) => {
      const lows = data.map(d => getLow(d));
      const highs = data.map(d => getHigh(d));

      // Create the lower trendline
      const lowerTrendlineSeries = chart.addLineSeries({
        color: 'blue',
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
      });
      lowerTrendlineSeries.setData([
        { time: data[2].time, value: data[2].value }, // Start with the lowest low
        { time: data[data.length - 1].time, value: Math.min(...lows) }, // End with the lowest low
      ]);

      // Create the upper trendline
      const upperTrendlineSeries = chart.addLineSeries({
        color: 'red',
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
      });
      upperTrendlineSeries.setData([
        { time: data[1].time, value: Math.max(...highs) }, // Start with the highest high
        { time: data[data.length - 1].time, value: Math.min(...highs) }, // End with the highest high
      ]);
    };

    const addRisingWedge = (chart, data) => {
      const lows = data.map(d => getLow(d));
      const highs = data.map(d => getHigh(d));

      // Create the upper trendline
      const upperTrendlineSeries = chart.addLineSeries({
        color: 'red',
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
      });
      upperTrendlineSeries.setData([
        { time: data[4].time, value: data[4].value }, // Start with the highest high
        { time: data[data.length - 1].time, value: 60 }, // End with the highest high
      ]);

      // Create the lower trendline
      const lowerTrendlineSeries = chart.addLineSeries({
        color: 'blue',
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
      });
      lowerTrendlineSeries.setData([
        { time: data[3].time, value: Math.min(...lows) }, // Start with the lowest low
        { time: data[data.length - 1].time, value: 60 }, // End with the lowest low
      ]);
    };

    // Add overlays.
    addCustomOverlays();

    // Handle chart resizing.
    const handleResize = () => {
      if (chartContainerRef && chartContainerRef.current && chartContainerRef.current.clientWidth) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
      chart.timeScale().fitContent();
      addCustomOverlays();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, chartType]);

  return (
    <div
      ref={chartContainerRef}
      className="chart-container"
      style={{ width: '100%', height: '300px' }}
    />
  );
};

export default ChartDisplay;
