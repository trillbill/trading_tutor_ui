const terminologyData = [
  // Price Levels
  {
      name: "Support",
      category: "Price Levels",
      value: "A price level where a downtrend can be expected to pause due to a concentration of demand.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/price-support.png",
      chartType: "support",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 },
          { time: '2022-01-03', open: 50, high: 51, low: 46, close: 47 },
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 },
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 },
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 },
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 },
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 },
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 },
          { time: '2022-01-10', open: 47, high: 48, low: 46, close: 48 },
      ],
  },
  {
      name: "Resistance",
      category: "Price Levels",
      value: "A price level where an uptrend can be expected to pause due to a concentration of supply.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/price-resistance.png",
      chartType: "resistance",
      data: [
          { time: '2022-01-01', open: 44, high: 46, low: 43, close: 45 }, // Day 1: Start low
          { time: '2022-01-02', open: 45, high: 47, low: 44, close: 46 }, // Day 2: Up
          { time: '2022-01-03', open: 46, high: 48, low: 45, close: 47 }, // Day 3: Up
          { time: '2022-01-04', open: 47, high: 49, low: 46, close: 48 }, // Day 4: Up
          { time: '2022-01-05', open: 48, high: 50, low: 47, close: 49 }, // Day 5: Reach Resistance
          { time: '2022-01-06', open: 49, high: 50, low: 44, close: 45 }, // Day 6: Retrace back to 44
          { time: '2022-01-07', open: 45, high: 46, low: 43, close: 44 }, // Day 7: Low
          { time: '2022-01-08', open: 44, high: 48, low: 43, close: 46 }, // Day 8: Recover
          { time: '2022-01-09', open: 46, high: 50, low: 44, close: 49 }, // Day 9: Rise again
          { time: '2022-01-10', open: 49, high: 50, low: 44, close: 50 }, // Day 10: Reach Resistance again
      ],
  },

  // Chart Patterns
  {
      name: "Head and Shoulders Pattern",
      category: "Chart Patterns",
      value: "A reversal pattern formed by three peaks, where the middle peak is the highest.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/head-and-shoulders.png",
      chartType: "headAndShoulders",
      data: [
          // Week 1
          { time: '2022-01-01', open: 40, high: 42, low: 38, close: 41 }, // Day 1: Consolidation
          { time: '2022-01-02', open: 41, high: 44, low: 39, close: 43 }, // Day 2: Rise towards Left Shoulder
          { time: '2022-01-03', open: 43, high: 46, low: 41, close: 45 }, // Day 3: Continued Rise
          { time: '2022-01-04', open: 45, high: 48, low: 43, close: 47 }, // Day 4: Peak of Left Shoulder
          { time: '2022-01-05', open: 47, high: 48, low: 44, close: 48 }, // Day 5: Stabilization at Left Shoulder
          { time: '2022-01-06', open: 48, high: 50, low: 46, close: 49 }, // Day 6: Slight Rise
          { time: '2022-01-07', open: 49, high: 50, low: 43, close: 43 }, // Day 7: Retracement to Neckline
      
          // Week 2
          { time: '2022-01-08', open: 43, high: 45, low: 40, close: 42 }, // Day 8: Retracement Phase
          { time: '2022-01-09', open: 42, high: 44, low: 39, close: 43 }, // Day 9: Recovery Start
          { time: '2022-01-10', open: 43, high: 46, low: 40, close: 44 }, // Day 10: Rise towards Head
          { time: '2022-01-11', open: 44, high: 50, low: 43, close: 49 }, // Day 11: Continued Rise
          { time: '2022-01-12', open: 49, high: 55, low: 45, close: 54 }, // Day 12: Significant Rise
          { time: '2022-01-13', open: 54, high: 60, low: 53, close: 58 }, // Day 13: Approaching Head Peak
          { time: '2022-01-14', open: 58, high: 65, low: 57, close: 65 }, // Day 14: Peak of Head (Center of Chart)
      
          // Week 3
          { time: '2022-01-15', open: 65, high: 65, low: 52, close: 55 }, // Day 15: Retracement from Head
          { time: '2022-01-16', open: 55, high: 58, low: 50, close: 52 }, // Day 16: Retracement Phase
          { time: '2022-01-17', open: 52, high: 53, low: 43, close: 45 }, // Day 17: Stabilization
          { time: '2022-01-18', open: 45, high: 46, low: 38, close: 41 }, // Day 18: Recovery Start
          { time: '2022-01-19', open: 41, high: 44, low: 39, close: 43 }, // Day 19: Rise towards Right Shoulder
          { time: '2022-01-20', open: 43, high: 46, low: 42, close: 45 }, // Day 20: Continued Rise
          { time: '2022-01-21', open: 45, high: 50, low: 43, close: 50 }, // Day 21: Peak of Right Shoulder
      
          // Week 4
          { time: '2022-01-22', open: 50, high: 50, low: 43, close: 43 }, // Day 22: Retracement to Neckline
          { time: '2022-01-23', open: 43, high: 45, low: 40, close: 42 }, // Day 23: Retracement Phase
          { time: '2022-01-24', open: 42, high: 44, low: 39, close: 43 }, // Day 24: Stabilization
          { time: '2022-01-25', open: 43, high: 45, low: 38, close: 40 }, // Day 25: Recovery Start
          { time: '2022-01-26', open: 40, high: 41, low: 36, close: 39 }, // Day 26: Continued Recovery
          { time: '2022-01-27', open: 39, high: 40, low: 35, close: 37 }, // Day 27: Consolidation
          { time: '2022-01-28', open: 37, high: 39, low: 30, close: 35 }, // Day 28: Final Confirmation
      ],
  },
  {
      name: "Inverse Head and Shoulders",
      category: "Chart Patterns",
      value: "A bullish reversal pattern that mirrors the regular Head and Shoulders, signaling a potential shift from a bearish to a bullish trend.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/inverse-head-and-shoulders.png",
      chartType: "inverseHeadAndShoulders",
      data: [
          // Week 1
          { time: '2022-01-01', open: 60, high: 60, low: 60, close: 60 }, // Day 1: Consolidation
          { time: '2022-01-02', open: 60, high: 60, low: 58, close: 58 }, // Day 2: Drop towards Left Inverse Shoulder
          { time: '2022-01-03', open: 58, high: 58, low: 56, close: 56 }, // Day 3: Continued Drop
          { time: '2022-01-04', open: 56, high: 56, low: 54, close: 54 }, // Day 4: Continued Drop
          { time: '2022-01-05', open: 54, high: 56, low: 52, close: 52 }, // Day 5: Peak of Left Inverse Shoulder (trough at 52)
          { time: '2022-01-06', open: 52, high: 54, low: 54, close: 56 }, // Day 6: Minor Recovery
          { time: '2022-01-07', open: 53, high: 54, low: 52, close: 57 }, // Day 7: Stabilization at Trough
      
          // Week 2
          { time: '2022-01-08', open: 57, high: 59, low: 56, close: 58 }, // Day 8: Start of Head Inverse Trough
          { time: '2022-01-09', open: 58, high: 50, low: 48, close: 48 }, // Day 9: Continued Drop
          { time: '2022-01-10', open: 48, high: 48, low: 45, close: 45 }, // Day 10: Continued Drop
          { time: '2022-01-11', open: 45, high: 45, low: 42, close: 42 }, // Day 11: Continued Drop
          { time: '2022-01-12', open: 42, high: 42, low: 40, close: 40 }, // Day 12: Continued Drop
          { time: '2022-01-13', open: 40, high: 40, low: 35, close: 35 }, // Day 13: Head Inverse Trough
          { time: '2022-01-14', open: 35, high: 35, low: 33, close: 37 }, // Day 14: Confirm Trough
      
          // Week 3
          { time: '2022-01-15', open: 35, high: 38, low: 35, close: 38 }, // Day 15: Retracement up
          { time: '2022-01-16', open: 38, high: 42, low: 38, close: 42 }, // Day 16: Continued Rise
          { time: '2022-01-17', open: 42, high: 45, low: 42, close: 45 }, // Day 17: Continued Rise
          { time: '2022-01-18', open: 45, high: 60, low: 45, close: 60 }, // Day 18: Rise to Neckline
          { time: '2022-01-19', open: 60, high: 60, low: 52, close: 56 }, // Day 19: Drop to Match Left Inverse Shoulder
          { time: '2022-01-20', open: 56, high: 52, low: 52, close: 54 }, // Day 20: Stabilization at Trough
          { time: '2022-01-21', open: 52, high: 52, low: 50, close: 55 }, // Day 21: Stabilization at Trough
      
          // Week 4
          { time: '2022-01-22', open: 55, high: 58, low: 52, close: 57 }, // Day 22: Confirmation Uptrend
          { time: '2022-01-23', open: 55, high: 59, low: 54, close: 58 }, // Day 23: Continued Rise
          { time: '2022-01-24', open: 58, high: 60, low: 58, close: 60 }, // Day 24: Continued Rise
          { time: '2022-01-25', open: 60, high: 62, low: 55, close: 58 }, // Day 25: Continued Rise
          { time: '2022-01-26', open: 58, high: 62, low: 57, close: 61 }, // Day 26: Continued Rise
          { time: '2022-01-27', open: 61, high: 63, low: 60, close: 62 }, // Day 27: Continued Rise
          { time: '2022-01-28', open: 62, high: 65, low: 60, close: 64 }, // Day 28: Final Confirmation Uptrend
      ],
  },
  {
      name: "Double Top",
      category: "Chart Patterns",
      value: "A bearish reversal pattern where the price reaches a high level twice and is unable to break above that level, indicating potential downward movement.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/double-top.png",
      chartType: "doubleTop",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "Double Bottom",
      category: "Chart Patterns",
      value: "A bullish reversal pattern where the price reaches a low level twice and is unable to break below that level, signaling possible upward movement.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/double-bottom.png",
      chartType: "doubleBottom",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "Ascending Triangle",
      category: "Chart Patterns",
      value: "A bullish continuation pattern characterized by a rising lower trendline and a horizontal resistance line at the top of the pattern.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/ascending-triangle.png",
      chartType: "ascendingTriangle",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "Descending Triangle",
      category: "Chart Patterns",
      value: "A bearish continuation pattern characterized by a falling upper trendline and a horizontal support line at the bottom of the pattern.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/descending-triangle.png",
      chartType: "descendingTriangle",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "Rising Wedge",
      category: "Chart Patterns",
      value: "A bearish reversal pattern that occurs when the price is making higher highs and higher lows, but the range is narrowing.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/rising-wedge.png",
      chartType: "risingWedge",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "Falling Wedge",
      category: "Chart Patterns",
      value: "A bullish reversal pattern that occurs when the price is making lower highs and lower lows, but the range is narrowing.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/falling-wedge.png",
      chartType: "fallingWedge",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },

  // Moving Averages
  {
      name: "Golden Cross",
      category: "Moving Averages",
      value: "A bullish signal formed when a short-term moving average crosses above a longer-term moving average, often indicating upward momentum.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/golden-cross.png",
      chartType: "goldenCross",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "Death Cross",
      category: "Moving Averages",
      value: "A bearish signal formed when a short-term moving average crosses below a longer-term moving average, often indicating downward momentum.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/death-cross.png",
      chartType: "deathCross",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "EMA (Exponential Moving Average)",
      category: "Moving Averages",
      value: "A type of moving average that places a greater weight and significance on the most recent data points, responding more quickly to price changes.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/ema.png",
      chartType: "ema",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "SMA (Simple Moving Average)",
      category: "Moving Averages",
      value: "The simplest form of a moving average, calculated by summing recent prices and dividing by the number of time periods.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/sma.png",
      chartType: "sma",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },

  // Momentum Indicators
  {
      name: "RSI (Relative Strength Index)",
      category: "Momentum Indicators",
      value: "A momentum oscillator that measures the speed and change of price movements, typically used to identify overbought or oversold conditions.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/rsi.png",
      chartType: "rsi",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },
  {
      name: "MACD (Moving Average Convergence Divergence)",
      category: "Momentum Indicators",
      value: "A trend-following momentum indicator that shows the relationship between two moving averages of a security's price.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/macd.png",
      chartType: "macd",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },

  // Technical Analysis Tools
  {
      name: "Fibonacci Retracement",
      category: "Technical Analysis Tools",
      value: "A technique using horizontal lines to indicate areas of support or resistance at key Fibonacci levels before the price continues in the original direction.",
      image: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/fibonacci-retracement.png",
      chartType: "fibonacciRetracement",
      data: [
          { time: '2022-01-01', open: 52, high: 55, low: 50, close: 53 }, // Up
          { time: '2022-01-02', open: 53, high: 54, low: 49, close: 50 }, // Down
          { time: '2022-01-03', open: 50, high: 51, low: 48, close: 49 }, // Down
          { time: '2022-01-04', open: 49, high: 52, low: 47, close: 51 }, // Up (Bounce off Support)
          { time: '2022-01-05', open: 51, high: 53, low: 50, close: 52 }, // Up
          { time: '2022-01-06', open: 52, high: 54, low: 50, close: 50 }, // Down (Touches Support)
          { time: '2022-01-07', open: 50, high: 51, low: 48, close: 49 }, // Down (Bounce off Support)
          { time: '2022-01-08', open: 49, high: 50, low: 47, close: 48 }, // Down
          { time: '2022-01-09', open: 48, high: 49, low: 46, close: 47 }, // Down
          { time: '2022-01-10', open: 47, high: 48, low: 45, close: 46 },
      ],
  },

  // Moving Averages (Additional Indicators)
  // Already included Golden Cross, Death Cross, EMA, and SMA above

  // Indicators and Patterns can be expanded similarly.

  // Placeholder for Additional Entries
  // Add more entries here if needed
];

export default terminologyData;
