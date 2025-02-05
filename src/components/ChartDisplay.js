import React, { useEffect, useRef } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';

const ChartDisplay = ({ data, chartType }) => {
    const chartContainerRef = useRef();

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300,
            layout: {
                backgroundColor: '#ffffff',
                textColor: '#000000',
            },
            grid: {
                vertLines: {
                    color: '#e0e0e0',
                },
                horzLines: {
                    color: '#e0e0e0',
                },
            },
            crossHair: {
                mode: 1, // Normal crosshair mode
            },
            priceScale: {
                borderColor: '#cccccc',
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                minBarSpacing: 5,
                borderColor: '#cccccc',
            },
            handleScroll: false, // Prevent horizontal scrolling
            handleScale: false,
        });

        // Create a candlestick series for the chart
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        candlestickSeries.setData(data);

        // Fit the time scale to the data to center and fill the width
        chart.timeScale().fitContent();

        // Function to add custom overlays based on chartType
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
                // Add more cases for other chart types as needed
                default:
                    break;
            }
        };

        // Implementations for custom overlays
        const addSupportLine = (chart, data) => {
            // Assuming support is at the lowest low in the data
            const lows = data.map(d => d.low);
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
            // Assuming resistance is at the highest high in the data
            const highs = data.map(d => d.high);
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
            // Identify peaks for left shoulder, head, and right shoulder
            // This is a simplistic approach assuming data is ordered and peaks are distinct

            // Find all local maxima
            const peaks = [];
            for (let i = 1; i < data.length - 1; i++) {
                if (data[i].high > data[i - 1].high && data[i].high > data[i + 1].high) {
                    peaks.push(data[i]);
                }
            }

            if (peaks.length < 3) {
                console.warn('Not enough peaks to form a Head and Shoulders pattern.');
                return;
            }

            // Assume the first peak is left shoulder, second is head, third is right shoulder
            const leftShoulder = peaks[0];
            const head = peaks[1];
            const rightShoulder = peaks[2];

            // Draw trendlines connecting the shoulders and head
            const trendlineSeries = chart.addLineSeries({
                color: 'purple',
                lineStyle: LineStyle.Solid,
                lineWidth: 2,
                crossHairMarkerVisible: false,
                lastValueVisible: false,
                priceLineVisible: false,
            });

            const trendlineData = [
                { time: leftShoulder.time, value: leftShoulder.high },
                { time: head.time, value: head.high },
                { time: rightShoulder.time, value: rightShoulder.high },
            ];
            trendlineSeries.setData(trendlineData);

            // Draw the neckline
            // Neckline is the support level connecting the lows between shoulders and head
            // Find the lowest low between left shoulder and head, and between head and right shoulder
            const neckLow1 = Math.min(...data.filter(d => d.time >= leftShoulder.time && d.time <= head.time).map(d => d.low));
            const neckLow2 = Math.min(...data.filter(d => d.time >= head.time && d.time <= rightShoulder.time).map(d => d.low));
            const neckline = (neckLow1 + neckLow2) / 2; // Simple average for neckline level

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

        // Add custom overlays based on chartType
        addCustomOverlays();

        // Optional: Handle chart resizing
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            chart.timeScale().fitContent();
            addCustomOverlays(); // Re-add overlays after resize if necessary
        };

        // Create a ResizeObserver to handle container resizing
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
            style={{ width: '100%', height: '300px' }} // Ensure the container fills the width
        />
    );
};

export default ChartDisplay;
