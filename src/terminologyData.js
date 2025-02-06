const terminologyData = [
  // Price Levels
  {
    name: "Support",
    category: "Price Levels",
    value:
      "A price level where a downtrend can be expected to pause due to a concentration of demand.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/price-support.png",
    chartType: "support",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 52 },
      { time: '2022-01-02', value: 53 },
      { time: '2022-01-03', value: 50 },
      { time: '2022-01-04', value: 47 },
      { time: '2022-01-05', value: 51 },
      { time: '2022-01-06', value: 52 },
      { time: '2022-01-07', value: 50 },
      { time: '2022-01-08', value: 49 },
      { time: '2022-01-09', value: 47 },
      { time: '2022-01-10', value: 48 },
    ],
  },
  {
    name: "Resistance",
    category: "Price Levels",
    value:
      "A price level where an uptrend can be expected to pause due to a concentration of supply.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/price-resistance.png",
    chartType: "resistance",
    lineColor: "red",
    data: [
      { time: '2022-01-01', value: 44 },
      { time: '2022-01-02', value: 45 },
      { time: '2022-01-03', value: 46 },
      { time: '2022-01-04', value: 47 },
      { time: '2022-01-05', value: 48 },
      { time: '2022-01-06', value: 49 },
      { time: '2022-01-07', value: 45 },
      { time: '2022-01-08', value: 44 },
      { time: '2022-01-09', value: 49 },
      { time: '2022-01-10', value: 47 },
    ],
  },

  // Chart Patterns
  {
    name: "Head and Shoulders Pattern",
    category: "Chart Patterns",
    value:
      "A reversal pattern formed by three peaks, where the middle peak is the highest.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/head-and-shoulders.png",
    chartType: "headAndShoulders",
    lineColor: "red",
    data: [
      // Simulated values: left shoulder, head, then right shoulder.
      { time: '2022-01-01', value: 40 },
      { time: '2022-01-02', value: 41 }, // left shoulder peak ~41
      { time: '2022-01-03', value: 47 },
      { time: '2022-01-04', value: 44 }, // head peak ~48
      { time: '2022-01-05', value: 40 },
      { time: '2022-01-06', value: 42 }, // right shoulder ~42
      { time: '2022-01-07', value: 46 },
      { time: '2022-01-08', value: 55 },
      { time: '2022-01-09', value: 49 },
      { time: '2022-01-10', value: 47 },
      { time: '2022-01-11', value: 42 },
      { time: '2022-01-12', value: 40 },
      { time: '2022-01-13', value: 42 },
      { time: '2022-01-14', value: 44 },
      { time: '2022-01-15', value: 46 },
      { time: '2022-01-16', value: 43 },
      { time: '2022-01-17', value: 39 },
    ],
  },
  {
    name: "Inverse Head and Shoulders",
    category: "Chart Patterns",
    value:
      "A bullish reversal pattern that mirrors the regular Head and Shoulders.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/inverse-head-and-shoulders.png",
    chartType: "inverseHeadAndShoulders",
    lineColor: "green",
    data: [
      // Simulated values: left shoulder, head, then right shoulder.
      { time: '2022-01-01', value: 54 },
      { time: '2022-01-02', value: 49 }, // left shoulder peak ~41
      { time: '2022-01-03', value: 46 },
      { time: '2022-01-04', value: 45 }, // head peak ~48
      { time: '2022-01-05', value: 48 },
      { time: '2022-01-06', value: 53 }, // right shoulder ~42
      { time: '2022-01-07', value: 51 },
      { time: '2022-01-08', value: 46 },
      { time: '2022-01-09', value: 41 },
      { time: '2022-01-10', value: 38 },
      { time: '2022-01-11', value: 42 },
      { time: '2022-01-12', value: 45 },
      { time: '2022-01-13', value: 53 },
      { time: '2022-01-14', value: 51 },
      { time: '2022-01-15', value: 48 },
      { time: '2022-01-16', value: 44 },
      { time: '2022-01-17', value: 49 },
      { time: '2022-01-18', value: 51 },
    ],
  },
  {
    name: "Double Top",
    category: "Chart Patterns",
    value:
      "A bearish reversal pattern where the price reaches a high level twice and is unable to break above that level.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/double-top.png",
    chartType: "resistance",
    lineColor: "red",
    data: [
      // Two similar peaks with a dip in between.
      { time: '2022-01-01', value: 45 },
      { time: '2022-01-02', value: 47 }, // first top ~56
      { time: '2022-01-03', value: 48 }, // dip ~53
      { time: '2022-01-04', value: 55 }, // second top ~56
      { time: '2022-01-05', value: 51 },
      { time: '2022-01-06', value: 45 },
      { time: '2022-01-07', value: 44 },
      { time: '2022-01-08', value: 46 },
      { time: '2022-01-09', value: 50 },
      { time: '2022-01-10', value: 54 },
      { time: '2022-01-11', value: 55 },
      { time: '2022-01-12', value: 52 },
      { time: '2022-01-13', value: 49 },
      { time: '2022-01-14', value: 44 },
    ],
  },
  {
    name: "Double Bottom",
    category: "Chart Patterns",
    value:
      "A bullish reversal pattern where the price reaches a low level twice with a hump in between.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/double-bottom.png",
    chartType: "support",
    lineColor: "green",
    data: [
      // Two similar troughs with a hump between them.
      { time: '2022-01-01', value: 60 },
      { time: '2022-01-02', value: 58 },
      { time: '2022-01-03', value: 50 }, // first bottom ~50
      { time: '2022-01-04', value: 58 }, // hump ~64
      { time: '2022-01-05', value: 57 }, // second bottom ~50
      { time: '2022-01-06', value: 60 },
      { time: '2022-01-07', value: 54 },
      { time: '2022-01-08', value: 50 },
      { time: '2022-01-09', value: 54 },
      { time: '2022-01-10', value: 58 },
    ],
  },
  {
    name: "Ascending Triangle",
    category: "Chart Patterns",
    value:
      "A bullish continuation pattern with a rising lower trendline and a horizontal resistance.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/ascending-triangle.png",
    chartType: "resistance",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 45 },  // starting support
      { time: '2022-01-02', value: 47 },  // support rising
      { time: '2022-01-03', value: 48 },
      { time: '2022-01-04', value: 50 },
      { time: '2022-01-05', value: 65 },  // test resistance (flat at 65)
      { time: '2022-01-06', value: 52 },  // bounce off resistance
      { time: '2022-01-07', value: 54 },  // support continues rising
      { time: '2022-01-08', value: 65 },  // another test of resistance
      { time: '2022-01-09', value: 56 },  // bounce, support rising further
      { time: '2022-01-10', value: 58 },
      { time: '2022-01-11', value: 60 },
      { time: '2022-01-12', value: 65 },  // test resistance again
      { time: '2022-01-13', value: 62 },  // support holds
      { time: '2022-01-14', value: 64 },
      { time: '2022-01-15', value: 65 },  // resistance is touched again
      { time: '2022-01-16', value: 64 }   // support slightly below resistance
    ],
  },
  {
    name: "Descending Triangle",
    category: "Chart Patterns",
    value:
      "A bearish continuation pattern with a descending upper trendline and horizontal support.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/descending-triangle.png",
    chartType: "support",
    lineColor: "red",
    data: [
      { time: '2022-01-01', value: 44 },  // starting support
      { time: '2022-01-02', value: 48 },  // support rising
      { time: '2022-01-03', value: 64 },
      { time: '2022-01-04', value: 55 },
      { time: '2022-01-05', value: 50 },  // test resistance (flat at 65)
      { time: '2022-01-06', value: 44 },  // bounce off resistance
      { time: '2022-01-07', value: 48 },  // support continues rising
      { time: '2022-01-08', value: 60 },  // another test of resistance
      { time: '2022-01-09', value: 54 },  // bounce, support rising further
      { time: '2022-01-10', value: 44 },
      { time: '2022-01-11', value: 49 },
      { time: '2022-01-12', value: 55 },  // test resistance again
      { time: '2022-01-13', value: 52 },  // support holds
      { time: '2022-01-14', value: 44 },
      { time: '2022-01-15', value: 50 },  // resistance is touched again
      { time: '2022-01-16', value: 44 }   // support slightly below resistance
    ],
  },
  {
    name: "Rising Wedge",
    category: "Chart Patterns",
    value:
      "A bearish reversal pattern with converging highs and lows as prices increase.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/rising-wedge.png",
    chartType: "risingWedge",
    lineColor: "red",
    data: [
      // Increasing values with a narrowing range.
      { time: '2022-01-01', value: 45 },
      { time: '2022-01-02', value: 48 },
      { time: '2022-01-03', value: 46 },
      { time: '2022-01-04', value: 55 },
      { time: '2022-01-05', value: 49 },
      { time: '2022-01-06', value: 57 },
      { time: '2022-01-07', value: 52 },
      { time: '2022-01-08', value: 58 },
      { time: '2022-01-09', value: 56 },
      { time: '2022-01-10', value: 59 },
    ],
  },
  {
    name: "Falling Wedge",
    category: "Chart Patterns",
    value:
      "A bullish reversal pattern with converging highs and lows as prices decrease.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/falling-wedge.png",
    chartType: "fallingWedge",
    lineColor: "green",
    data: [
      // Decreasing values with a narrowing range.
      { time: '2022-01-01', value: 45 },
      { time: '2022-01-02', value: 59 },
      { time: '2022-01-03', value: 51 },
      { time: '2022-01-04', value: 57 },
      { time: '2022-01-05', value: 49 },
      { time: '2022-01-06', value: 54 },
      { time: '2022-01-07', value: 47 },
      { time: '2022-01-08', value: 52 },
      { time: '2022-01-09', value: 45 },
      { time: '2022-01-10', value: 55 },
    ],
  },

  // Moving Averages
  {
    name: "Golden Cross",
    category: "Moving Averages",
    value:
      "A bullish signal formed when a short-term moving average crosses above a longer-term moving average.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/golden-cross.png",
    chartType: "goldenCross",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 44 },
      { time: '2022-01-02', value: 39 },
      { time: '2022-01-03', value: 42 },
      { time: '2022-01-04', value: 45 },
      { time: '2022-01-05', value: 52 },
      { time: '2022-01-06', value: 62 },
      { time: '2022-01-07', value: 61 },
      { time: '2022-01-08', value: 61 },
      { time: '2022-01-09', value: 58 },
      { time: '2022-01-10', value: 59 },
      { time: '2022-01-11', value: 58 }, // Short-term moving average crosses above long-term moving average
      { time: '2022-01-12', value: 55 }, // Continuing upward trend
      { time: '2022-01-13', value: 54 },
      { time: '2022-01-14', value: 56 },
      { time: '2022-01-15', value: 56 },
      { time: '2022-01-16', value: 52 },
      { time: '2022-01-17', value: 59 },
      { time: '2022-01-18', value: 60 },
      { time: '2022-01-19', value: 64 },
      { time: '2022-01-20', value: 66 },
      { time: '2022-01-21', value: 50 },
      { time: '2022-01-22', value: 49 },
      { time: '2022-01-23', value: 69 },
      { time: '2022-01-24', value: 59 },
      { time: '2022-01-25', value: 74 },
      { time: '2022-01-26', value: 74 },
      { time: '2022-01-27', value: 75 },
      { time: '2022-01-28', value: 73 },
      { time: '2022-01-29', value: 76 },
      { time: '2022-01-30', value: 77 },
      { time: '2022-01-31', value: 75 },
      { time: '2022-02-01', value: 78 },
    ],
  },
  {
    name: "Death Cross",
    category: "Moving Averages",
    value:
      "A bearish signal formed when a short-term moving average crosses below a longer-term moving average.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/death-cross.png",
    chartType: "deathCross",
    lineColor: "red",
    data: [
      { time: '2022-01-01', value: 60 },
      { time: '2022-01-02', value: 59 },
      { time: '2022-01-03', value: 58 },
      { time: '2022-01-04', value: 57 },
      { time: '2022-01-05', value: 56 },
      { time: '2022-01-06', value: 55 },
      { time: '2022-01-07', value: 54 },
      { time: '2022-01-08', value: 53 },
      { time: '2022-01-09', value: 52 },
      { time: '2022-01-10', value: 51 },
    ],
  },
  {
    name: "EMA (Exponential Moving Average)",
    category: "Moving Averages",
    value:
      "A type of moving average that places greater weight on recent prices.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/ema.png",
    chartType: "ema",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 50 },
      { time: '2022-01-02', value: 51 },
      { time: '2022-01-03', value: 52 },
      { time: '2022-01-04', value: 53 },
      { time: '2022-01-05', value: 54 },
      { time: '2022-01-06', value: 55 },
      { time: '2022-01-07', value: 56 },
      { time: '2022-01-08', value: 57 },
      { time: '2022-01-09', value: 58 },
      { time: '2022-01-10', value: 59 },
    ],
  },
  {
    name: "SMA (Simple Moving Average)",
    category: "Moving Averages",
    value:
      "The simplest form of a moving average, calculated by averaging prices over a given period.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/sma.png",
    chartType: "sma",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 50 },
      { time: '2022-01-02', value: 51 },
      { time: '2022-01-03', value: 52 },
      { time: '2022-01-04', value: 53 },
      { time: '2022-01-05', value: 54 },
      { time: '2022-01-06', value: 55 },
      { time: '2022-01-07', value: 56 },
      { time: '2022-01-08', value: 57 },
      { time: '2022-01-09', value: 58 },
      { time: '2022-01-10', value: 59 },
    ],
  },

  // Momentum Indicators
  {
    name: "RSI (Relative Strength Index)",
    category: "Momentum Indicators",
    value:
      "A momentum oscillator that measures the speed and change of price movements.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/rsi.png",
    chartType: "rsi",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 50 },
      { time: '2022-01-02', value: 52 },
      { time: '2022-01-03', value: 51 },
      { time: '2022-01-04', value: 53 },
      { time: '2022-01-05', value: 54 },
      { time: '2022-01-06', value: 55 },
      { time: '2022-01-07', value: 56 },
      { time: '2022-01-08', value: 57 },
      { time: '2022-01-09', value: 58 },
      { time: '2022-01-10', value: 59 },
    ],
  },
  {
    name: "MACD (Moving Average Convergence Divergence)",
    category: "Momentum Indicators",
    value:
      "A trend-following momentum indicator that shows the relationship between two moving averages.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/macd.png",
    chartType: "macd",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 50 },
      { time: '2022-01-02', value: 52 },
      { time: '2022-01-03', value: 51 },
      { time: '2022-01-04', value: 53 },
      { time: '2022-01-05', value: 54 },
      { time: '2022-01-06', value: 55 },
      { time: '2022-01-07', value: 56 },
      { time: '2022-01-08', value: 57 },
      { time: '2022-01-09', value: 58 },
      { time: '2022-01-10', value: 59 },
    ],
  },

  // Technical Analysis Tools
  {
    name: "Fibonacci Retracement",
    category: "Technical Analysis Tools",
    value:
      "A technique using horizontal lines to indicate key Fibonacci levels during a retracement.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/fibonacci-retracement.png",
    chartType: "fibonacciRetracement",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 50 },
      { time: '2022-01-02', value: 53 },
      { time: '2022-01-03', value: 58 },
      { time: '2022-01-04', value: 64 },
      { time: '2022-01-05', value: 63 },
      { time: '2022-01-06', value: 60 },
      { time: '2022-01-07', value: 57 },
      { time: '2022-01-08', value: 55 },
      { time: '2022-01-09', value: 54 },
      { time: '2022-01-10', value: 53 },
    ],
  },
];

export default terminologyData;
