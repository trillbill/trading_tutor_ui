import React, { useEffect, useRef } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';

const ChartDisplay = ({ data, chartType, lineColor }) => {
  const chartContainerRef = useRef();

  // Helper functions to support both full OHLC and singular-value data.
  const getHigh = d => (d.hasOwnProperty('high') ? d.high : d.value);
  const getLow  = d => (d.hasOwnProperty('low')  ? d.low  : d.value);
  const getClose = d => (d.hasOwnProperty('close') ? d.close : d.value);

  // Helper functions to calculate moving averages
  const calculateMovingAverage = (data, period) => {
    const movingAverages = [];
    for (let i = 0; i <= data.length - period; i++) {
      const slice = data.slice(i, i + period);
      const average = slice.reduce((sum, point) => sum + point.value, 0) / period;
      movingAverages.push({ time: data[i + period - 1].time, value: average });
    }
    return movingAverages;
  };

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

    // Check if the chartType is for moving averages
    if (chartType === 'goldenCross' || chartType === 'movingAverage') {
      // Calculate and add moving averages
      const shortTermPeriod = 5; // Example: 5-period moving average
      const longTermPeriod = 20; // Example: 20-period moving average

      const shortTermMA = calculateMovingAverage(lineData, shortTermPeriod);
      const longTermMA = calculateMovingAverage(lineData, longTermPeriod);

      // Short-term moving average series
      const shortTermSeries = chart.addLineSeries({
        color: 'blue', // Color for short-term moving average
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
      });
      shortTermSeries.setData(shortTermMA);

      // Long-term moving average series
      const longTermSeries = chart.addLineSeries({
        color: 'orange', // Color for long-term moving average
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
      });
      longTermSeries.setData(longTermMA);
    }

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
        case 'headAndShoulders':
          addHeadAndShouldersPattern(chart, data);
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

    const addHeadAndShouldersPattern = (chart, data) => {
      // Find local maxima using our getHigh() helper.
      const peaks = [];
      for (let i = 1; i < data.length - 1; i++) {
        const prev = getHigh(data[i - 1]);
        const curr = getHigh(data[i]);
        const next = getHigh(data[i + 1]);
        if (curr > prev && curr > next) {
          peaks.push(data[i]);
        }
      }

      if (peaks.length < 3) {
        console.warn('Not enough peaks to form a Head and Shoulders pattern.');
        return;
      }

      // Assume first three peaks form the pattern.
      const leftShoulder = peaks[0];
      const head = peaks[1];
      const rightShoulder = peaks[2];

      // Draw a trendline connecting the peaks.
      const trendlineSeries = chart.addLineSeries({
        color: 'purple',
        lineStyle: LineStyle.Solid,
        lineWidth: 2,
        crossHairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      });
      const trendlineData = [
        { time: leftShoulder.time, value: getHigh(leftShoulder) },
        { time: head.time, value: getHigh(head) },
        { time: rightShoulder.time, value: getHigh(rightShoulder) },
      ];
      trendlineSeries.setData(trendlineData);

      // Draw the neckline (using the lows between peaks).
      const neckLow1 = Math.min(
        ...data
          .filter(d => d.time >= leftShoulder.time && d.time <= head.time)
          .map(d => getLow(d))
      );
      const neckLow2 = Math.min(
        ...data
          .filter(d => d.time >= head.time && d.time <= rightShoulder.time)
          .map(d => getLow(d))
      );
      const neckline = (neckLow1 + neckLow2) / 2;

      const necklineSeries = chart.addLineSeries({
        color: 'green',
        lineStyle: LineStyle.Dashed,
        lineWidth: 2,
        priceLineVisible: false,
      });
      necklineSeries.setData([
        { time: leftShoulder.time, value: neckLow1 },
        { time: head.time, value: neckline },
        { time: rightShoulder.time, value: neckLow2 },
      ]);
    };

    // Add overlays.
    addCustomOverlays();

    // Handle chart resizing.
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
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
