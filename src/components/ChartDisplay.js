import React, { useEffect, useRef } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';

const ChartDisplay = ({ data, chartType, lineColor, height = 300 }) => {
  const chartContainerRef = useRef();

  // Helper functions to support both full OHLC and singular-value data.
  const getHigh = d => (d.hasOwnProperty('high') ? d.high : d.value);
  const getLow  = d => (d.hasOwnProperty('low')  ? d.low  : d.value);
  const getClose = d => (d.hasOwnProperty('close') ? d.close : d.value);
  const getOpen = d => (d.hasOwnProperty('open') ? d.open : d.value);

  // List of chart types that should be rendered as candlesticks
  const candlestickPatterns = [
    'candle', 'doji', 'engulfing', 'morningStar', 'eveningStar', 
    'hammer', 'piercingLine', 'threeWhiteSoldiers', 'spinningTop', 
    'threeBlackCrows'
  ];

  // Check if the current chart type should be rendered as candlesticks
  const shouldRenderCandlesticks = candlestickPatterns.includes(chartType);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
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

    // Check if we should render candlesticks or a line chart
    if (shouldRenderCandlesticks) {
      // For candlestick charts, we need OHLC data
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
      
      // Transform data to OHLC format if it's not already
      const candleData = data.map((d, index) => {
        // If the data already has OHLC properties, use them
        if (d.hasOwnProperty('open') && d.hasOwnProperty('high') && 
            d.hasOwnProperty('low') && d.hasOwnProperty('close')) {
          return {
            time: d.time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close
          };
        }
        
        // Otherwise, create synthetic OHLC data from the value
        const value = d.value;
        const range = value * 0.02; // 2% range for candle
        
        // Create pattern-specific candles for key dates
        // The 7th day (index 6) is typically where we show the pattern
        if (index === 6) {
          switch (chartType) {
            case 'doji':
              return {
                time: d.time,
                open: value,
                high: value + range * 0.5,
                low: value - range * 0.5,
                close: value
              };
            case 'spinningTop':
              return {
                time: d.time,
                open: value - range * 0.1,
                high: value + range,
                low: value - range,
                close: value + range * 0.1
              };
            case 'hammer':
              return {
                time: d.time,
                open: value - range * 0.1,
                high: value + range * 0.2,
                low: value - range * 2,
                close: value
              };
            case 'engulfing':
              // For engulfing pattern, make a large bullish candle
              return {
                time: d.time,
                open: value - range * 1.5,
                high: value + range * 0.5,
                low: value - range * 1.5,
                close: value + range * 1.5
              };
            case 'piercingLine':
              // For piercing line, make a bullish candle that pierces previous bearish candle
              return {
                time: d.time,
                open: value - range * 1.2,
                high: value + range * 0.5,
                low: value - range * 1.2,
                close: value + range
              };
            case 'morningStar':
              // For morning star, make the third candle (bullish)
              return {
                time: d.time,
                open: value - range,
                high: value + range * 1.5,
                low: value - range,
                close: value + range * 1.5
              };
            case 'eveningStar':
              // For evening star, make the third candle (bearish)
              return {
                time: d.time,
                open: value + range,
                high: value + range,
                low: value - range * 1.5,
                close: value - range * 1.5
              };
            case 'threeWhiteSoldiers':
              // For three white soldiers, make the third bullish candle
              return {
                time: d.time,
                open: value - range * 0.5,
                high: value + range * 1.5,
                low: value - range * 0.5,
                close: value + range * 1.5
              };
            case 'threeBlackCrows':
              // For three black crows, make the third bearish candle
              return {
                time: d.time,
                open: value + range * 0.5,
                high: value + range * 0.5,
                low: value - range * 1.5,
                close: value - range * 1.5
              };
            default:
              // For other patterns or the default candle type
              break;
          }
        }
        
        // For specific patterns, create special candles for days before/after the pattern
        if (chartType === 'engulfing' && index === 5) {
          // Small bearish candle before engulfing
          return {
            time: d.time,
            open: value + range * 0.5,
            high: value + range * 0.7,
            low: value - range * 0.7,
            close: value - range * 0.5
          };
        }
        
        if (chartType === 'piercingLine' && index === 5) {
          // Bearish candle before piercing line
          return {
            time: d.time,
            open: value + range,
            high: value + range,
            low: value - range,
            close: value - range
          };
        }
        
        if (chartType === 'morningStar') {
          if (index === 4) {
            // First candle of morning star (bearish)
            return {
              time: d.time,
              open: value + range,
              high: value + range,
              low: value - range,
              close: value - range
            };
          } else if (index === 5) {
            // Second candle of morning star (small/doji)
            return {
              time: d.time,
              open: value - range * 0.2,
              high: value + range * 0.3,
              low: value - range * 0.3,
              close: value
            };
          }
        }
        
        if (chartType === 'eveningStar') {
          if (index === 4) {
            // First candle of evening star (bullish)
            return {
              time: d.time,
              open: value - range,
              high: value + range,
              low: value - range,
              close: value + range
            };
          } else if (index === 5) {
            // Second candle of evening star (small/doji)
            return {
              time: d.time,
              open: value + range * 0.2,
              high: value + range * 0.3,
              low: value - range * 0.3,
              close: value
            };
          }
        }
        
        if (chartType === 'threeWhiteSoldiers') {
          if (index === 5) {
            // First white soldier
            return {
              time: d.time,
              open: value - range * 0.5,
              high: value + range,
              low: value - range * 0.5,
              close: value + range
            };
          } else if (index === 6) {
            // Second white soldier
            return {
              time: d.time,
              open: value,
              high: value + range * 1.2,
              low: value,
              close: value + range * 1.2
            };
          }
        }
        
        if (chartType === 'threeBlackCrows') {
          if (index === 5) {
            // First black crow
            return {
              time: d.time,
              open: value + range * 0.5,
              high: value + range * 0.5,
              low: value - range,
              close: value - range
            };
          } else if (index === 6) {
            // Second black crow
            return {
              time: d.time,
              open: value,
              high: value,
              low: value - range * 1.2,
              close: value - range * 1.2
            };
          }
        }
        
        // For default candles, alternate between bullish and bearish
        const isEven = parseInt(d.time.split('-')[2]) % 2 === 0;
        return {
          time: d.time,
          open: isEven ? value - range * 0.5 : value + range * 0.5,
          high: value + range,
          low: value - range,
          close: isEven ? value + range * 0.5 : value - range * 0.5
        };
      });
      
      candleSeries.setData(candleData);
    } else {
      // Use a line series for non-candle chart types
      const lineSeries = chart.addLineSeries({
        color: lineColor === 'red' ? '#ca0e0e' : '#26a69a',
        lineWidth: 2,
      });
      const lineData = data.map(d => ({
        time: d.time,
        value: getClose(d)
      }));
      lineSeries.setData(lineData);
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
        case 'fallingWedge':
          addFallingWedge(chart, data);
          break;
        case 'risingWedge':
          addRisingWedge(chart, data);
          break;
        case 'cupAndHandle':
          addCupAndHandle(chart, data);
          break;
        case 'bullFlag':
          addBullFlag(chart, data);
          break;
        case 'bullPennant':
          addBullPennant(chart, data);
          break;
        case 'uptrend':
          addUptrend(chart, data);
          break;
        case 'downtrend':
          addDowntrend(chart, data);
          break;
        // Add more cases as needed.
        default:
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

    const addCupAndHandle = (chart, data) => {
      const resistanceSeries = chart.addLineSeries({
        color: 'red',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      resistanceSeries.setData([
        { time: data[13].time, value: data[13].value },
        { time: data[17].time, value: data[17].value },
      ]);
      const supportSeries = chart.addLineSeries({
        color: 'blue',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      supportSeries.setData([
        { time: data[14].time, value: data[14].value },
        { time: data[18].time, value: data[18].value },
      ]);
    };

    const addBullFlag = (chart, data) => {
      const resistanceSeries = chart.addLineSeries({
        color: 'red',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      resistanceSeries.setData([
        { time: data[4].time, value: data[4].value },
        { time: data[10].time, value: data[10].value },
      ]);
      const supportSeries = chart.addLineSeries({
        color: 'blue',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      supportSeries.setData([
        { time: data[5].time, value: data[5].value },
        { time: data[11].time, value: data[11].value },
      ]);
    };

    const addBullPennant = (chart, data) => {
      const resistanceSeries = chart.addLineSeries({
        color: 'red',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      resistanceSeries.setData([
        { time: data[4].time, value: data[4].value },
        { time: data[10].time, value: data[10].value },
      ]);
      const supportSeries = chart.addLineSeries({
        color: 'blue',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      supportSeries.setData([
        { time: data[5].time, value: data[5].value },
        { time: data[11].time, value: data[11].value },
      ]);
    };

    const addUptrend = (chart, data) => {
      const supportSeries = chart.addLineSeries({
        color: 'blue',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      supportSeries.setData([
        { time: data[2].time, value: data[2].value },
        { time: data[16].time, value: data[16].value },
      ]);
    };

    const addDowntrend = (chart, data) => {
      const supportSeries = chart.addLineSeries({
        color: 'red',
        lineStyle: LineStyle.Dotted,
        lineWidth: 2,
        priceLineVisible: false,
      });
      supportSeries.setData([
        { time: data[2].time, value: data[2].value },
        { time: data[16].time, value: data[16].value },
      ]);
    };

    // Add overlays.
    addCustomOverlays();

    // Handle chart resizing.
    const handleResize = () => {
      if (chartContainerRef && chartContainerRef.current && chartContainerRef.current.clientWidth) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: height
        });
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
  }, [data, chartType, lineColor, height, shouldRenderCandlesticks]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: `${height}px` }}
      className="chart-display-container"
    />
  );
};

export default ChartDisplay;
