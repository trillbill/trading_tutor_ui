const terminologyData = [
  // Price Levels
  {
    name: "Support",
    category: "Charts",
    value:
      "Price support is a level where an asset’s price tends to stop falling because buyers step in, creating demand. If the price breaks below this level, it may signal further declines.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/price-support.png",
    chartType: "support",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 52 },
      { time: '2022-01-02', value: 53 },
      { time: '2022-01-03', value: 52 },
      { time: '2022-01-04', value: 47 },
      { time: '2022-01-05', value: 51 },
      { time: '2022-01-06', value: 52 },
      { time: '2022-01-07', value: 50 },
      { time: '2022-01-08', value: 49 },
      { time: '2022-01-09', value: 47 },
      { time: '2022-01-10', value: 49 },
      { time: '2022-01-11', value: 51 },
      { time: '2022-01-12', value: 50 },
      { time: '2022-01-13', value: 52 },
      { time: '2022-01-14', value: 51 },
      { time: '2022-01-15', value: 49 },
      { time: '2022-01-16', value: 47 },
      { time: '2022-01-17', value: 49 },
    ],
  },
  {
    name: "Resistance",
    category: "Charts",
    value:
      "Price resistance is a level where an asset’s price tends to stop rising because sellers step in, creating supply. If the price breaks above this level, it may signal further gains.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/price-resistance.png",
    chartType: "resistance",
    lineColor: "red",
    data: [
      { time: '2022-01-01', value: 44 },
      { time: '2022-01-02', value: 46 },
      { time: '2022-01-03', value: 45 },
      { time: '2022-01-04', value: 47 },
      { time: '2022-01-05', value: 48 },
      { time: '2022-01-06', value: 49 },
      { time: '2022-01-07', value: 46 },
      { time: '2022-01-08', value: 44 },
      { time: '2022-01-09', value: 45 },
      { time: '2022-01-10', value: 49 },
      { time: '2022-01-11', value: 47 },
      { time: '2022-01-12', value: 45 },
      { time: '2022-01-13', value: 49 },
      { time: '2022-01-14', value: 47 },
    ],
  },

  // Chart Patterns
  {
    name: "Head and Shoulders Pattern",
    category: "Charts",
    value:
      "The Head and Shoulders pattern is a bearish reversal pattern that signals a potential trend change from bullish to bearish. It consists of three peaks: a higher middle peak (the head) and two lower peaks on either side (the shoulders). The neckline, drawn across the lowest points between the peaks, acts as a support level. When the price breaks below the neckline, it confirms the pattern and suggests a potential downtrend.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/head-and-shoulders.png",
    chartType: "hns",
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
    category: "Charts",
    value:
      "The Inverse Head and Shoulders pattern is a bullish reversal pattern that signals a potential trend change from bearish to bullish. It consists of three troughs: a lower middle trough (the head) and two higher troughs on either side (the shoulders). The neckline, drawn across the highest points between the troughs, acts as a resistance level. When the price breaks above the neckline, it confirms the pattern and suggests a potential uptrend.",
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
    category: "Charts",
    value:
      "A Double Top is a bearish reversal pattern that signals a potential trend change from bullish to bearish. It forms when the price reaches a high, pulls back, then retests the same high but fails to break through. This creates two peaks at roughly the same level, with a neckline acting as support. When the price breaks below the neckline, it confirms the pattern and suggests a potential downtrend.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/double-top.png",
    chartType: "resistance",
    lineColor: "red",
    data: [
      { time: '2022-01-01', value: 44 },
      { time: '2022-01-02', value: 46 },
      { time: '2022-01-03', value: 45 },
      { time: '2022-01-04', value: 47 },
      { time: '2022-01-05', value: 48 },
      { time: '2022-01-06', value: 49 },
      { time: '2022-01-07', value: 46 },
      { time: '2022-01-08', value: 44 },
      { time: '2022-01-09', value: 45 },
      { time: '2022-01-10', value: 44 },
      { time: '2022-01-11', value: 45 },
      { time: '2022-01-12', value: 43 },
      { time: '2022-01-13', value: 44 },
      { time: '2022-01-14', value: 45 },
      { time: '2022-01-15', value: 45 },
      { time: '2022-01-16', value: 44 },
      { time: '2022-01-17', value: 46 },
      { time: '2022-01-18', value: 47 },
      { time: '2022-01-19', value: 49 },
      { time: '2022-01-20', value: 48 },
      { time: '2022-01-21', value: 47 },
      { time: '2022-01-22', value: 46 },
      { time: '2022-01-23', value: 44 },
      { time: '2022-01-24', value: 45 }, 
    ],
  },
  {
    name: "Double Bottom",
    category: "Charts",
    value:
      "A Double Bottom is a bullish reversal pattern that signals a potential trend change from bearish to bullish. It forms when the price drops to a low, bounces up, then retests the same low but fails to break lower. This creates two troughs at roughly the same level, with a neckline acting as resistance. When the price breaks above the neckline, it confirms the pattern and suggests a potential uptrend.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/double-bottom.png",
    chartType: "support",
    lineColor: "green",
    data: [
      // Two similar troughs with a hump between them.
      { time: '2022-01-01', value: 49 },
      { time: '2022-01-02', value: 48 },
      { time: '2022-01-03', value: 48 },
      { time: '2022-01-04', value: 47 },
      { time: '2022-01-05', value: 48 },
      { time: '2022-01-06', value: 49 },
      { time: '2022-01-07', value: 48 },
      { time: '2022-01-08', value: 46 },
      { time: '2022-01-09', value: 45 },
      { time: '2022-01-10', value: 47 },
      { time: '2022-01-11', value: 45 },
      { time: '2022-01-12', value: 43 },
      { time: '2022-01-13', value: 44 },
      { time: '2022-01-14', value: 45 },
      { time: '2022-01-15', value: 47 },
      { time: '2022-01-16', value: 45 },
      { time: '2022-01-17', value: 46 },
      { time: '2022-01-18', value: 47 },
      { time: '2022-01-19', value: 48 },
      { time: '2022-01-20', value: 43 },
      { time: '2022-01-21', value: 44 },
      { time: '2022-01-22', value: 46 },
      { time: '2022-01-23', value: 47 },
      { time: '2022-01-24', value: 48 },
    ],
  },
  {
    name: "Ascending Triangle",
    category: "Charts",
    value:
      "An Ascending Triangle is a bullish continuation pattern that signals a potential breakout to the upside. It forms when the price creates higher lows, while the highs remain around the same level, forming a flat resistance line. This indicates increasing buying pressure. When the price breaks above the resistance line with strong volume, it confirms the pattern and suggests a potential uptrend.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/ascending-triangle.png",
    chartType: "resistance",
    lineColor: "green",
    data: [
      { time: '2022-01-01', value: 45 },  // starting support
      { time: '2022-01-02', value: 50 },  // support rising
      { time: '2022-01-03', value: 48 },
      { time: '2022-01-04', value: 65 },
      { time: '2022-01-05', value: 50 },  // test resistance (flat at 65)
      { time: '2022-01-06', value: 60 },  // bounce off resistance
      { time: '2022-01-07', value: 65 },  // support continues rising
      { time: '2022-01-08', value: 53 },  // another test of resistance
      { time: '2022-01-09', value: 57 },  // bounce, support rising further
      { time: '2022-01-10', value: 64 },
      { time: '2022-01-11', value: 65 },
      { time: '2022-01-12', value: 58 },  // test resistance again
      { time: '2022-01-13', value: 65 },  // support holds
      { time: '2022-01-14', value: 59 },
      { time: '2022-01-15', value: 59 },  // resistance is touched again
      { time: '2022-01-16', value: 65 },  // support slightly below resistance
      { time: '2022-01-17', value: 65 },
    ],
  },
  {
    name: "Descending Triangle",
    category: "Charts",
    value:
      "A Descending Triangle is a bearish continuation pattern that signals a potential breakdown to the downside. It forms when the price creates lower highs, while the lows remain around the same level, forming a flat support line. This indicates increasing selling pressure. When the price breaks below the support line with strong volume, it confirms the pattern and suggests a potential downtrend.",
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
    category: "Charts",
    value:
      "A Rising Wedge is a bearish reversal pattern that signals a potential trend change from bullish to bearish. It forms when the price moves within a narrowing upward-sloping channel, creating higher highs and higher lows, but with weakening momentum. When the price breaks below the lower trendline with strong volume, it confirms the pattern and suggests a potential downtrend.",
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
    category: "Charts",
    value:
      "A Falling Wedge is a bullish reversal pattern that signals a potential trend change from bearish to bullish. It forms when the price moves within a narrowing downward-sloping channel, creating lower highs and lower lows, but with weakening selling pressure. When the price breaks above the upper trendline with strong volume, it confirms the pattern and suggests a potential uptrend. ",
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
  // {
  //   name: "Golden Cross",
  //   category: "Tools",
  //   value:
  //     "A bullish signal formed when a short-term moving average crosses above a longer-term moving average.",
  //   image:
  //     "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/golden-cross.png",
  //   chartType: "goldenCross",
  //   lineColor: "green",
  //   data: [
  //     { time: '2022-01-01', value: 44 },
  //     { time: '2022-01-02', value: 39 },
  //     { time: '2022-01-03', value: 42 },
  //     { time: '2022-01-04', value: 45 },
  //     { time: '2022-01-05', value: 52 },
  //     { time: '2022-01-06', value: 62 },
  //     { time: '2022-01-07', value: 61 },
  //     { time: '2022-01-08', value: 61 },
  //     { time: '2022-01-09', value: 58 },
  //     { time: '2022-01-10', value: 59 },
  //     { time: '2022-01-11', value: 58 }, // Short-term moving average crosses above long-term moving average
  //     { time: '2022-01-12', value: 55 }, // Continuing upward trend
  //     { time: '2022-01-13', value: 54 },
  //     { time: '2022-01-14', value: 56 },
  //     { time: '2022-01-15', value: 56 },
  //     { time: '2022-01-16', value: 52 },
  //     { time: '2022-01-17', value: 59 },
  //     { time: '2022-01-18', value: 60 },
  //     { time: '2022-01-19', value: 64 },
  //     { time: '2022-01-20', value: 66 },
  //     { time: '2022-01-21', value: 50 },
  //     { time: '2022-01-22', value: 49 },
  //     { time: '2022-01-23', value: 69 },
  //     { time: '2022-01-24', value: 59 },
  //     { time: '2022-01-25', value: 74 },
  //     { time: '2022-01-26', value: 74 },
  //     { time: '2022-01-27', value: 75 },
  //     { time: '2022-01-28', value: 73 },
  //     { time: '2022-01-29', value: 76 },
  //     { time: '2022-01-30', value: 77 },
  //     { time: '2022-01-31', value: 75 },
  //     { time: '2022-02-01', value: 78 },
  //   ],
  // },
  // {
  //   name: "Death Cross",
  //   category: "Tools",
  //   value:
  //     "A bearish signal formed when a short-term moving average crosses below a longer-term moving average.",
  //   image:
  //     "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/death-cross.png",
  //   chartType: "deathCross",
  //   lineColor: "red",
  //   data: [
  //     { time: '2022-01-01', value: 60 },
  //     { time: '2022-01-02', value: 59 },
  //     { time: '2022-01-03', value: 58 },
  //     { time: '2022-01-04', value: 57 },
  //     { time: '2022-01-05', value: 56 },
  //     { time: '2022-01-06', value: 55 },
  //     { time: '2022-01-07', value: 54 },
  //     { time: '2022-01-08', value: 53 },
  //     { time: '2022-01-09', value: 52 },
  //     { time: '2022-01-10', value: 51 },
  //   ],
  // },
  {
    name: "EMA (Exponential Moving Average)",
    category: "Tools",
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
    category: "Tools",
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
    category: "Tools",
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
    category: "Tools",
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
    category: "Tools",
    value:
      "A technique using horizontal lines to indicate key Fibonacci levels during a retracement.",
    image:
      "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/fibonacci-retracement.png",
    chartType: "fibonacciRetracement",
    lineColor: "green",
    video: "https://www.youtube.com/embed/m5PzY2xaPIg?si=yaP43MeCGKiYQqJf",
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
  {
    name: "Elliott Wave Theory",
    category: "Theory",
    value: "This theory posits that market prices move in predictable cycles, reflecting the emotions and behaviors of market participants. According to this theory, these cycles are influenced by the psychology of traders and investors, leading to patterns that can be identified and used for forecasting future price movements. The theory is based on the idea that market trends follow a specific structure of waves, which can be classified into impulse waves and corrective waves.",
    image: "https://example.com/elliot-wave-theory.png", // Replace with actual image URL
    chartType: "elliotWave",
    lineColor: "blue",
    video: "https://www.youtube.com/embed/WGExLtdKdSg?si=Iz92Xo0xbSp2PXgB",
    data: [],
  },
  {
      name: "Momentum Trading",
      category: "Theory",
      value: "A strategy that aims to capitalize on the continuation of existing trends in the market. Traders who employ this strategy believe that assets that have been rising steadily will continue to rise, while those that have been falling will continue to fall. This approach often involves using technical indicators to identify the strength of a trend and making trades based on the momentum of price movements. Traders typically look for stocks that are moving significantly in one direction on high volume.",
      image: "https://example.com/momentum-trading.png", // Replace with actual image URL
      chartType: "momentumTrading",
      lineColor: "orange",
      video: "https://www.youtube.com/embed/2_ZAxSfM6Ss?si=WKC5V_vVwsu2E6Fq",
      data: [],
  },
  {
      name: "Dow Theory",
      category: "Theory",
      value: "This theory is a framework for understanding market trends and movements. It asserts that the stock market moves in trends, which can be identified and followed. The theory emphasizes the importance of confirming trends through various market indices. This theory also introduces concepts such as primary trends, secondary trends, and minor trends.",
      image: "https://example.com/dow-theory.png", // Replace with actual image URL
      chartType: "dowTheory", 
      lineColor: "purple",
      video: "https://www.youtube.com/embed/DenOjcBAX0M?si=GljKhiV8mXAp3Z-E",
      data: [],
  },
  {
      name: "Gann Theory",
      category: "Theory",
      value: "This theory involves a method of technical analysis that uses angles and time cycles to predict price movements. It asserts that the market moves in predictable patterns and that these patterns can be analyzed using geometric angles and time intervals. The theory incorporates various tools, such as angles, fans, and time cycles, to help traders identify potential support and resistance levels, as well as entry and exit points.",
      image: "https://example.com/gann-theory.png", // Replace with actual image URL
      chartType: "gannTheory",
      lineColor: "brown",
      video: "https://www.youtube.com/embed/OpL-h9WPPF8?si=HTZAqUVElaobM6bl",
      data: [],
  },
];

export default terminologyData;
