const terminologyData = [
  // Price Levels
  {
    name: "Support",
    category: "Charts",
    value:
      "Support is a key concept in technical analysis that refers to a price level at which an asset tends to find buying interest, preventing the price from falling further. It represents a level where demand is strong enough to counteract selling pressure, causing the price to \"bounce\" or stabilize. When the price approaches support, traders often see it as an opportunity to buy, expecting the price to rise again. If the price breaks below support, it may signal a potential trend reversal or further decline.",
    shortDescription: "Support is a price level where buying interest prevents further declines.",
    chartType: "support",
    lineColor: "green",
    data: [
      { time: '2025-01-01', value: 52 },
      { time: '2025-01-02', value: 53 },
      { time: '2025-01-03', value: 52 },
      { time: '2025-01-04', value: 47 },
      { time: '2025-01-05', value: 51 },
      { time: '2025-01-06', value: 52 },
      { time: '2025-01-07', value: 50 },
      { time: '2025-01-08', value: 49 },
      { time: '2025-01-09', value: 47 },
      { time: '2025-01-10', value: 49 },
      { time: '2025-01-11', value: 51 },
      { time: '2025-01-12', value: 50 },
      { time: '2025-01-13', value: 52 },
      { time: '2025-01-14', value: 51 },
      { time: '2025-01-15', value: 49 },
      { time: '2025-01-16', value: 47 },
      { time: '2025-01-17', value: 49 },
    ],
  },
  {
    name: "Resistance",
    category: "Charts",
    value:
      "Resistance is a key concept in technical analysis that refers to a price level where selling pressure is strong enough to prevent the price from rising further. It represents a level where supply exceeds demand, causing the price to \"stall\" or reverse direction. When the price approaches resistance, traders often view it as an opportunity to sell or short, expecting the price to fall. If the price breaks above resistance, it may signal a breakout and the potential for further gains.",
    shortDescription: "Resistance is a price level where selling pressure prevents further increases.",
    chartType: "resistance",
    lineColor: "red",
    data: [
      { time: '2025-01-01', value: 44 },
      { time: '2025-01-02', value: 46 },
      { time: '2025-01-03', value: 45 },
      { time: '2025-01-04', value: 47 },
      { time: '2025-01-05', value: 48 },
      { time: '2025-01-06', value: 49 },
      { time: '2025-01-07', value: 46 },
      { time: '2025-01-08', value: 44 },
      { time: '2025-01-09', value: 45 },
      { time: '2025-01-10', value: 49 },
      { time: '2025-01-11', value: 47 },
      { time: '2025-01-12', value: 45 },
      { time: '2025-01-13', value: 49 },
      { time: '2025-01-14', value: 47 },
    ],
  },

  // Chart Patterns
  {
    name: "Head and Shoulders Pattern",
    category: "Charts",
    value:
      "The Head and Shoulders pattern is a bearish reversal pattern that signals a potential trend change from bullish to bearish. It consists of three peaks: a higher middle peak (the head) and two lower peaks on either side (the shoulders). The neckline, drawn across the lowest points between the peaks, acts as a support level. When the price breaks below the neckline, it confirms the pattern and suggests a potential downtrend.",
    shortDescription: "A bearish reversal pattern formed by two similar peaks in price (shoulders) with a larger peak in the middle (head).",
    chartType: "None",
    lineColor: "red",
    data: [
      // Simulated values: left shoulder, head, then right shoulder.
      { time: '2025-01-01', value: 40 },
      { time: '2025-01-02', value: 41 }, // left shoulder peak ~41
      { time: '2025-01-03', value: 47 },
      { time: '2025-01-04', value: 44 }, // head peak ~48
      { time: '2025-01-05', value: 40 },
      { time: '2025-01-06', value: 42 }, // right shoulder ~42
      { time: '2025-01-07', value: 46 },
      { time: '2025-01-08', value: 55 },
      { time: '2025-01-09', value: 49 },
      { time: '2025-01-10', value: 47 },
      { time: '2025-01-11', value: 42 },
      { time: '2025-01-12', value: 40 },
      { time: '2025-01-13', value: 42 },
      { time: '2025-01-14', value: 44 },
      { time: '2025-01-15', value: 46 },
      { time: '2025-01-16', value: 43 },
      { time: '2025-01-17', value: 39 },
    ],
  },
  {
    name: "Inverse Head and Shoulders",
    category: "Charts",
    value:
      "The Inverse Head and Shoulders pattern is a bullish reversal pattern that signals a potential trend change from bearish to bullish. It consists of three troughs: a lower middle trough (the head) and two higher troughs on either side (the shoulders). The neckline, drawn across the highest points between the troughs, acts as a resistance level. When the price breaks above the neckline, it confirms the pattern and suggests a potential uptrend.",
    shortDescription: "A bullish reversal pattern which mirrors the head and shoulders pattern formed by two similar dips in price (shoulders) with a larger dip in the middle (head).",
    chartType: "None",
    lineColor: "green",
    data: [
      // Simulated values: left shoulder, head, then right shoulder.
      { time: '2025-01-01', value: 54 },
      { time: '2025-01-02', value: 49 }, // left shoulder peak ~41
      { time: '2025-01-03', value: 46 },
      { time: '2025-01-04', value: 45 }, // head peak ~48
      { time: '2025-01-05', value: 48 },
      { time: '2025-01-06', value: 53 }, // right shoulder ~42
      { time: '2025-01-07', value: 51 },
      { time: '2025-01-08', value: 46 },
      { time: '2025-01-09', value: 41 },
      { time: '2025-01-10', value: 38 },
      { time: '2025-01-11', value: 42 },
      { time: '2025-01-12', value: 45 },
      { time: '2025-01-13', value: 53 },
      { time: '2025-01-14', value: 51 },
      { time: '2025-01-15', value: 48 },
      { time: '2025-01-16', value: 44 },
      { time: '2025-01-17', value: 49 },
      { time: '2025-01-18', value: 51 },
    ],
  },
  {
    name: "Double Top",
    category: "Charts",
    value:
      "A Double Top is a bearish reversal pattern that signals a potential trend change from bullish to bearish. It forms when the price reaches a high, pulls back, then retests the same high but fails to break through. This creates two peaks at roughly the same level, with a neckline acting as support. When the price breaks below the neckline, it confirms the pattern and suggests a potential downtrend.",
    shortDescription: "A bearish reversal pattern formed by two peaks at the same price level.",
    chartType: "resistance",
    lineColor: "red",
    data: [
      { time: '2025-01-01', value: 44 },
      { time: '2025-01-02', value: 46 },
      { time: '2025-01-03', value: 45 },
      { time: '2025-01-04', value: 47 },
      { time: '2025-01-05', value: 48 },
      { time: '2025-01-06', value: 49 },
      { time: '2025-01-07', value: 46 },
      { time: '2025-01-08', value: 44 },
      { time: '2025-01-09', value: 45 },
      { time: '2025-01-10', value: 44 },
      { time: '2025-01-11', value: 45 },
      { time: '2025-01-12', value: 43 },
      { time: '2025-01-13', value: 44 },
      { time: '2025-01-14', value: 45 },
      { time: '2025-01-15', value: 45 },
      { time: '2025-01-16', value: 44 },
      { time: '2025-01-17', value: 46 },
      { time: '2025-01-18', value: 47 },
      { time: '2025-01-19', value: 49 },
      { time: '2025-01-20', value: 48 },
      { time: '2025-01-21', value: 47 },
      { time: '2025-01-22', value: 46 },
      { time: '2025-01-23', value: 44 },
      { time: '2025-01-24', value: 45 }, 
    ],
  },
  {
    name: "Double Bottom",
    category: "Charts",
    value:
      "A Double Bottom is a bullish reversal pattern that signals a potential trend change from bearish to bullish. It forms when the price drops to a low, bounces up, then retests the same low but fails to break lower. This creates two troughs at roughly the same level, with a neckline acting as resistance. When the price breaks above the neckline, it confirms the pattern and suggests a potential uptrend.",
    shortDescription: "A bullish reversal pattern formed by two troughs at the same price level.",
    chartType: "support",
    lineColor: "green",
    data: [
      // Two similar troughs with a hump between them.
      { time: '2025-01-01', value: 49 },
      { time: '2025-01-02', value: 48 },
      { time: '2025-01-03', value: 48 },
      { time: '2025-01-04', value: 47 },
      { time: '2025-01-05', value: 48 },
      { time: '2025-01-06', value: 49 },
      { time: '2025-01-07', value: 48 },
      { time: '2025-01-08', value: 46 },
      { time: '2025-01-09', value: 45 },
      { time: '2025-01-10', value: 47 },
      { time: '2025-01-11', value: 45 },
      { time: '2025-01-12', value: 43 },
      { time: '2025-01-13', value: 44 },
      { time: '2025-01-14', value: 45 },
      { time: '2025-01-15', value: 47 },
      { time: '2025-01-16', value: 45 },
      { time: '2025-01-17', value: 46 },
      { time: '2025-01-18', value: 47 },
      { time: '2025-01-19', value: 48 },
      { time: '2025-01-20', value: 43 },
      { time: '2025-01-21', value: 44 },
      { time: '2025-01-22', value: 46 },
      { time: '2025-01-23', value: 47 },
      { time: '2025-01-24', value: 48 },
    ],
  },
  {
    name: "Ascending Triangle",
    category: "Charts",
    value:
      "An Ascending Triangle is a bullish continuation pattern that signals a potential breakout to the upside. It forms when the price creates higher lows, while the highs remain around the same level, forming a flat resistance line. This indicates increasing buying pressure. When the price breaks above the resistance line with strong volume, it confirms the pattern and suggests a potential uptrend.",
    shortDescription: "A bullish continuation pattern formed when price repeatedly tests an area of resistance while setting consecutively higher lows.",
    chartType: "resistance",
    lineColor: "green",
    data: [
      { time: '2025-01-01', value: 45 },  // starting support
      { time: '2025-01-02', value: 50 },  // support rising
      { time: '2025-01-03', value: 48 },
      { time: '2025-01-04', value: 65 },
      { time: '2025-01-05', value: 52 },  // test resistance (flat at 65)
      { time: '2025-01-06', value: 60 },  // bounce off resistance
      { time: '2025-01-07', value: 65 },  // support continues rising
      { time: '2025-01-08', value: 55 },  // another test of resistance
      { time: '2025-01-09', value: 57 },  // bounce, support rising further
      { time: '2025-01-10', value: 65 },
      { time: '2025-01-11', value: 58 },
      { time: '2025-01-12', value: 59 },  // test resistance again
      { time: '2025-01-13', value: 65 },  // support holds
      { time: '2025-01-14', value: 61 },
      { time: '2025-01-15', value: 63 },  // resistance is touched again
      { time: '2025-01-16', value: 65 },  // support slightly below resistance
      { time: '2025-01-17', value: 65 },
    ],
  },
  {
    name: "Descending Triangle",
    category: "Charts",
    value:
      "A Descending Triangle is a bearish continuation pattern that signals a potential breakdown to the downside. It forms when the price creates lower highs, while the lows remain around the same level, forming a flat support line. This indicates increasing selling pressure. When the price breaks below the support line with strong volume, it confirms the pattern and suggests a potential downtrend.",
    shortDescription: "A bearish continuation pattern formed when price repeatedly tests an area of support while setting consecutively lower highs.",
    chartType: "support",
    lineColor: "red",
    data: [
      { time: '2025-01-01', value: 68 },  // starting support
      { time: '2025-01-02', value: 58 },  // support rising
      { time: '2025-01-03', value: 60 },
      { time: '2025-01-04', value: 50 },
      { time: '2025-01-05', value: 55 },  // test resistance (flat at 65)
      { time: '2025-01-06', value: 44 },  // bounce off resistance
      { time: '2025-01-07', value: 60 },  // support continues rising
      { time: '2025-01-08', value: 44 },  // another test of resistance
      { time: '2025-01-09', value: 54 },  // bounce, support rising further
      { time: '2025-01-10', value: 44 },
      { time: '2025-01-11', value: 50 },
      { time: '2025-01-12', value: 44 },  // test resistance again
      { time: '2025-01-13', value: 48 },  // support holds
      { time: '2025-01-14', value: 44 },
      { time: '2025-01-15', value: 46 },  // resistance is touched again
      { time: '2025-01-16', value: 44 }   // support slightly below resistance
    ],
  },
  {
    name: "Rising Wedge",
    category: "Charts",
    value:
      "A Rising Wedge is a bearish reversal pattern that signals a potential trend change from bullish to bearish. It forms when the price moves within a narrowing upward-sloping channel, creating higher highs and higher lows, but with weakening momentum. When the price breaks below the lower trendline with strong volume, it confirms the pattern and suggests a potential downtrend.",
    shortDescription: "A bearish reversal pattern formed when the price consolidates between upward sloping support and resistance lines.",
    chartType: "risingWedge",
    lineColor: "red",
    data: [
      // Increasing values with a narrowing range.
      { time: '2025-01-01', value: 65 },
      { time: '2025-01-02', value: 58 },
      { time: '2025-01-03', value: 62 },
      { time: '2025-01-04', value: 40 },
      { time: '2025-01-05', value: 50 },
      { time: '2025-01-06', value: 45 },
      { time: '2025-01-07', value: 53 },
      { time: '2025-01-08', value: 50 },
      { time: '2025-01-09', value: 56 },
      { time: '2025-01-10', value: 55 },
      { time: '2025-01-11', value: 59 },
      { time: '2025-01-12', value: 45 },
    ],
  },
  {
    name: "Falling Wedge",
    category: "Charts",
    value:
      "A Falling Wedge is a bullish reversal pattern that signals a potential trend change from bearish to bullish. It forms when the price moves within a narrowing downward-sloping channel, creating lower highs and lower lows, but with weakening selling pressure. When the price breaks above the upper trendline with strong volume, it confirms the pattern and suggests a potential uptrend.",
    shortDescription: "A bullish reversal pattern formed when the price consolidates between downward sloping support and resistance lines",
    chartType: "fallingWedge",
    lineColor: "green",
    data: [
      // Decreasing values with a narrowing range.
      { time: '2025-01-01', value: 45 },
      { time: '2025-01-02', value: 59 },
      { time: '2025-01-03', value: 51 },
      { time: '2025-01-04', value: 55 },
      { time: '2025-01-05', value: 50 },
      { time: '2025-01-06', value: 52 },
      { time: '2025-01-07', value: 47.5 },
      { time: '2025-01-08', value: 48 },
      { time: '2025-01-09', value: 46 },
      { time: '2025-01-10', value: 47 },
    ],
  },
  {
    name: "Cup and Handle",
    category: "Charts",
    value:
      "The Cup and Handle is a bullish continuation pattern that forms during an uptrend. It resembles a tea cup on a price chart, with a rounded bottom (the cup) followed by a slight downward drift (the handle). The pattern is complete when the price breaks above the resistance level formed by the cup's rim. This pattern indicates a period of consolidation before continuing the previous uptrend and is often seen in longer timeframes, suggesting a strong and sustainable bullish movement.",
    shortDescription: "A bullish continuation pattern resembling a cup with a handle, signaling a pause in an uptrend before continuation.",
    chartType: "cupAndHandle",
    lineColor: "green",
    data: [
      { time: '2025-01-01', value: 60 },  // Start of cup
      { time: '2025-01-02', value: 58 },
      { time: '2025-01-03', value: 55 },
      { time: '2025-01-04', value: 56 },
      { time: '2025-01-05', value: 53 },  // Bottom of cup
      { time: '2025-01-06', value: 52 },
      { time: '2025-01-07', value: 53 },
      { time: '2025-01-08', value: 52 },
      { time: '2025-01-09', value: 53 },  // Rim of cup (resistance)
      { time: '2025-01-10', value: 52 },  // Start of handle
      { time: '2025-01-11', value: 53 },
      { time: '2025-01-12', value: 57 },  // Bottom of handle
      { time: '2025-01-13', value: 59 },
      { time: '2025-01-14', value: 60 },  // Break above resistance
      { time: '2025-01-15', value: 58 },
      { time: '2025-01-16', value: 59 },
      { time: '2025-01-17', value: 57 },
      { time: '2025-01-18', value: 58 },
      { time: '2025-01-19', value: 56 },
      { time: '2025-01-20', value: 65 },
    ],
  },
  {
    name: "Flag Pattern",
    category: "Charts",
    value:
      "A Flag Pattern is a continuation pattern that forms after a strong price movement (the flagpole), followed by a period of consolidation in a channel that slopes against the previous trend (the flag). The pattern completes when the price breaks out of the channel in the direction of the original trend. Flags that slope opposite to the trend are considered more reliable. This pattern suggests a brief pause in the prevailing trend before it continues, with the length of the flagpole often indicating the potential extent of the move after the breakout.",
    shortDescription: "A continuation pattern showing a temporary pause in the trend, resembling a flag on a pole.",
    chartType: "bullFlag",
    lineColor: "green",
    data: [
      { time: '2025-01-01', value: 40 },  // Start of flagpole
      { time: '2025-01-02', value: 45 },
      { time: '2025-01-03', value: 50 },
      { time: '2025-01-04', value: 55 },
      { time: '2025-01-05', value: 60 },  // End of flagpole, start of flag
      { time: '2025-01-06', value: 55 },
      { time: '2025-01-07', value: 58 },
      { time: '2025-01-08', value: 53 },
      { time: '2025-01-09', value: 56 },
      { time: '2025-01-10', value: 51 },  // End of flag
      { time: '2025-01-11', value: 54 },  // Breakout
      { time: '2025-01-12', value: 49 },
      { time: '2025-01-13', value: 65 },
    ],
  },
  {
    name: "Pennant Pattern",
    category: "Charts",
    value:
      "A Pennant Pattern is a continuation pattern similar to a Flag but forms a small symmetrical triangle or pennant shape during the consolidation phase after a strong price movement. The pattern consists of a flagpole (the initial sharp move) followed by converging trendlines that form the pennant. The breakout typically occurs in the direction of the previous trend and often happens about halfway through the pennant formation. Trading volume usually decreases during the pennant formation and increases significantly upon breakout.",
    shortDescription: "A continuation pattern with converging trendlines forming a small symmetrical triangle after a strong move.",
    chartType: "bullPennant",
    lineColor: "green",
    data: [
      { time: '2025-01-01', value: 40 },  // Start of flagpole
      { time: '2025-01-02', value: 45 },
      { time: '2025-01-03', value: 50 },
      { time: '2025-01-04', value: 55 },
      { time: '2025-01-05', value: 60 },  // End of flagpole, start of pennant
      { time: '2025-01-06', value: 52 },
      { time: '2025-01-07', value: 59 },
      { time: '2025-01-08', value: 53 },
      { time: '2025-01-09', value: 58 },
      { time: '2025-01-10', value: 54 },  // End of pennant
      { time: '2025-01-11', value: 57 },  // Breakout
      { time: '2025-01-12', value: 55 },
      { time: '2025-01-13', value: 56 },
      { time: '2025-01-14', value: 69 },
    ],
  },
  {
    name: "Swing Failure Pattern (SFP)",
    category: "Charts",
    value:
      "A Swing Failure Pattern (SFP) is a price action pattern that occurs when the market makes a new high or low but quickly reverses, failing to maintain the new price level. This pattern indicates a potential trend reversal as it shows that the market attempted to continue in the prevailing direction but failed to do so. In an uptrend, an SFP forms when price makes a new high but quickly reverses and closes below the previous high. In a downtrend, it forms when price makes a new low but quickly reverses and closes above the previous low. Traders often use this pattern to identify exhaustion in the current trend and potential reversal points.",
    shortDescription: "A price action pattern showing failure to maintain a new high or low, signaling potential trend reversal.",
    chartType: "swingFailure",
    lineColor: "orange",
    data: [
      { time: '2025-01-01', value: 50 },
      { time: '2025-01-02', value: 52 },
      { time: '2025-01-03', value: 55 },
      { time: '2025-01-04', value: 58 },
      { time: '2025-01-05', value: 62 },  // Previous high
      { time: '2025-01-06', value: 60 },
      { time: '2025-01-07', value: 61 },
      { time: '2025-01-08', value: 64 },  // New high (failure point)
      { time: '2025-01-09', value: 59 },  // Quick reversal
      { time: '2025-01-10', value: 56 },
      { time: '2025-01-11', value: 52 },
      { time: '2025-01-12', value: 48 },
    ],
  },
  {
    name: "Break of Structure",
    category: "Charts",
    value:
      "A Break of Structure (BOS) is a technical pattern that occurs when price breaks above a significant previous high in an uptrend or below a significant previous low in a downtrend, indicating a continuation or strengthening of the current trend. This pattern is important because it shows that the market has enough momentum to overcome key structural levels. In an uptrend, a BOS confirms bullish momentum when price breaks above a previous swing high. In a downtrend, it confirms bearish momentum when price breaks below a previous swing low. Traders often use this pattern to enter trades in the direction of the trend or to add to existing positions.",
    shortDescription: "A pattern showing price breaking past significant previous highs or lows, confirming trend strength.",
    chartType: "breakOfStructure",
    lineColor: "green",
    data: [
      { time: '2025-01-01', value: 45 },
      { time: '2025-01-02', value: 48 },
      { time: '2025-01-03', value: 52 },
      { time: '2025-01-04', value: 55 },  // First high
      { time: '2025-01-05', value: 52 },
      { time: '2025-01-06', value: 50 },
      { time: '2025-01-07', value: 53 },
      { time: '2025-01-08', value: 51 },
      { time: '2025-01-09', value: 54 },
      { time: '2025-01-10', value: 57 },  // Break of structure (above previous high)
      { time: '2025-01-11', value: 60 },
      { time: '2025-01-12', value: 63 },
    ],
  },
  {
    name: "Three Drives Pattern",
    category: "Charts",
    shortDescription: "A harmonic pattern consisting of three consecutive price movements (drives) of similar length that indicate a potential reversal point.",
    value: "The Three Drives pattern is a reversal pattern that consists of three consecutive price movements or 'drives' in the same direction, each typically of similar length. The pattern follows specific Fibonacci measurements, with each drive often reaching a 127.2% or 161.8% extension of the previous correction. After the completion of the third drive, the market is expected to reverse direction.\n\nKey characteristics include:\n\n1. Three consecutive price movements in the same direction (either all up or all down)\n2. Each drive should reach similar Fibonacci extension levels\n3. The time taken to complete each drive is often symmetrical\n4. Volume typically decreases with each successive drive\n\nTraders look for the completion of the third drive to enter a counter-trend position, with a stop loss placed beyond the extreme of the third drive. This pattern works well in all timeframes and across different markets, making it a versatile tool for identifying potential reversal points.",
    chartType: "threeDrives",
    data: [
      { time: '2025-01-01', value: 50 },
      { time: '2025-01-02', value: 70 }, // First drive up
      { time: '2025-01-03', value: 60 }, // Pullback
      { time: '2025-01-04', value: 85 }, // Second drive up
      { time: '2025-01-05', value: 75 }, // Pullback
      { time: '2025-01-06', value: 95 }, // Third drive up
      { time: '2025-01-07', value: 70 }, // Reversal begins
      { time: '2025-01-08', value: 75 },
      { time: '2025-01-09', value: 65 },
      { time: '2025-01-10', value: 55 },
      { time: '2025-01-11', value: 60 }
    ],
    lineColor: "red"
  },
  {
    name: "Doji",
    category: "Charts",
    value:
      "A Doji is a candlestick pattern that forms when a security's opening and closing prices are virtually equal, creating a candlestick with a very small body or no body at all. This pattern indicates market indecision, where neither buyers nor sellers have gained control. Dojis are significant because they often signal potential trend reversals, especially after a strong uptrend or downtrend. The longer the upper and lower shadows (wicks), the more significant the market indecision. Common variations include the Long-Legged Doji, Dragonfly Doji, and Gravestone Doji.",
    shortDescription: "A candlestick pattern with virtually equal opening and closing prices, indicating market indecision.",
    chartType: "doji",
    lineColor: "orange",
    data: [
      { time: '2025-01-01', open: 49.9, high: 55, low: 45, close: 50 },
    ],
  },
  {
    name: "Engulfing Pattern",
    category: "Charts",
    value:
      "An Engulfing Pattern is a two-candle reversal pattern that occurs when the body of a candle completely engulfs the body of the previous candle. A bullish engulfing pattern forms during a downtrend when a large bullish (green/white) candle completely engulfs the body of the previous bearish (red/black) candle, signaling a potential upward reversal. Conversely, a bearish engulfing pattern forms during an uptrend when a large bearish candle engulfs the previous bullish candle, indicating a potential downward reversal. The pattern is considered more reliable when it occurs after a clear trend and is accompanied by high trading volume.",
    shortDescription: "A two-candle reversal pattern where one candle completely engulfs the body of the previous candle.",
    chartType: "engulfing",
    lineColor: "green",
    data: [
      { time: '2025-01-01', open: 50, high: 52, low: 45, close: 47 },
      { time: '2025-01-02', open: 46, high: 60, low: 45, close: 55 },
    ],
  },
  {
    name: "Morning Star",
    category: "Charts",
    value:
      "The Morning Star is a bullish three-candle reversal pattern that signals a potential bottom in a downtrend. It consists of a large bearish candle, followed by a small-bodied candle (often a Doji or Spinning Top) that gaps down, and finally a large bullish candle that closes at least halfway up the first candle's body. This pattern represents a shift from selling pressure to buying pressure, with the middle candle showing indecision before buyers take control. The Morning Star is considered a strong reversal signal, especially when it occurs at support levels and is accompanied by increased volume on the third day.",
    shortDescription: "A bullish three-candle reversal pattern signaling a potential bottom in a downtrend.",
    chartType: "morningStar",
    lineColor: "green",
    data: [
      { time: '2025-01-01', open: 52, high: 54, low: 40, close: 42 },
      { time: '2025-01-02', open: 40, high: 44, low: 39, close: 42 },
      { time: '2025-01-03', open: 42, high: 54, low: 40, close: 52 },
    ],
  },
  {
    name: "Bullish Hammer",
    category: "Charts",
    value:
      "The Bullish Hammer is a single-candle bullish reversal pattern that forms during a downtrend. It is characterized by a small body at the upper end of the trading range with a long lower shadow (wick) that is at least twice the size of the body. The long lower shadow indicates that sellers drove prices down during the session, but buyers were able to push the price back up by the close, suggesting a potential bullish reversal. The pattern is confirmed when the next candle closes higher, preferably with strong volume. The Bullish Hammer is most effective when it appears after a significant downtrend and at support levels.",
    shortDescription: "A single-candle bullish reversal pattern with a small body and long lower shadow, appearing in downtrends.",
    chartType: "hammer",
    lineColor: "green",
    data: [
      { time: '2025-01-01', open: 52, high: 54, low: 40, close: 42 },
      { time: '2025-01-02', open: 40, high: 44, low: 25, close: 43 },
    ],
  },
  {
    name: "Piercing Line",
    category: "Charts",
    value:
      "The Piercing Line is a two-candle bullish reversal pattern that occurs during a downtrend. It consists of a bearish (red/black) candle followed by a bullish (green/white) candle that opens below the previous day's low but closes above the midpoint of the previous day's body. This pattern indicates a shift from selling pressure to buying pressure, as buyers overcome the previous day's selling. The deeper the penetration into the first candle's body, the stronger the reversal signal. The Piercing Line is similar to the Bullish Engulfing pattern but doesn't completely engulf the previous candle. It's considered more reliable when accompanied by increased volume on the second day.",
    shortDescription: "A two-candle bullish reversal pattern where the second candle closes above the midpoint of the first candle.",
    chartType: "piercingLine",
    lineColor: "green",
    data: [
      { time: '2025-01-01', open: 55, high: 56, low: 40, close: 45 },
      { time: '2025-01-02', open: 42, high: 54, low: 39, close: 53 },
    ],
  },
  {
    name: "Evening Star",
    category: "Charts",
    value:
      "The Evening Star is a bearish three-candle reversal pattern that signals a potential top in an uptrend. It consists of a large bullish candle, followed by a small-bodied candle (often a Doji or Spinning Top) that gaps up, and finally a large bearish candle that closes at least halfway down the first candle's body. This pattern represents a shift from buying pressure to selling pressure, with the middle candle showing indecision before sellers take control. The Evening Star is considered a strong reversal signal, especially when it occurs at resistance levels and is accompanied by increased volume on the third day. It is the bearish counterpart to the Morning Star pattern.",
    shortDescription: "A bearish three-candle reversal pattern signaling a potential top in an uptrend.",
    chartType: "eveningStar",
    lineColor: "red",
    data: [
      { time: '2025-01-01', open: 42, high: 54, low: 40, close: 52 },
      { time: '2025-01-02', open: 52, high: 55, low: 50, close: 54 },
      { time: '2025-01-03', open: 52, high: 54, low: 40, close: 42 },
    ],
  },
  {
    name: "Three White Soldiers",
    category: "Charts",
    value:
      "The Three White Soldiers is a bullish reversal pattern that consists of three consecutive long-bodied bullish (green/white) candles, each closing higher than the previous one and opening within the body of the previous candle. This pattern indicates strong buying pressure and a potential trend reversal from a downtrend to an uptrend. Each candle should open within the previous candle's body and close near its high, showing consistent buying pressure. The pattern is considered more reliable when it forms after a downtrend, has little to no upper shadows (indicating buyers maintained control throughout each session), and is accompanied by increasing volume across the three days. It signals that bulls have taken control of the market and suggests further upward movement.",
    shortDescription: "A bullish reversal pattern consisting of three consecutive rising bullish candles, indicating strong buying pressure.",
    chartType: "threeWhiteSoldiers",
    lineColor: "green",
    data: [
      { time: '2025-01-01', open: 42, high: 54, low: 40, close: 52 },
      { time: '2025-01-02', open: 46, high: 59, low: 44, close: 57 },
      { time: '2025-01-03', open: 52, high: 65, low: 50, close: 62 },
    ],
  },
  {
    name: "Spinning Top",
    category: "Charts",
    value:
      "A Spinning Top is a candlestick pattern characterized by a small body with upper and lower shadows that are usually longer than the body itself. The small body indicates little movement between the opening and closing prices, while the long shadows suggest that both buyers and sellers were active during the session but neither could gain decisive control. This pattern represents market indecision and is often interpreted as a potential signal for a trend reversal or continuation, depending on where it appears in the existing trend and what patterns follow it. When a Spinning Top appears after a strong trend, it may indicate weakening momentum and a possible reversal. In a ranging market, it may simply reflect ongoing indecision.",
    shortDescription: "A candlestick with a small body and long upper and lower shadows, indicating market indecision.",
    chartType: "spinningTop",
    lineColor: "orange",
    data: [
      { time: '2025-01-01', open: 50, high: 60, low: 38, close: 47 },
    ],
  },
  {
    name: "Three Black Crows",
    category: "Charts",
    value:
      "The Three Black Crows is a bearish reversal pattern that consists of three consecutive long-bodied bearish (red/black) candles, each closing lower than the previous one and opening within the body of the previous candle. This pattern indicates strong selling pressure and a potential trend reversal from an uptrend to a downtrend. Each candle should open within the previous candle's body and close near its low, showing consistent selling pressure. The pattern is considered more reliable when it forms after an uptrend, has little to no lower shadows (indicating sellers maintained control throughout each session), and is accompanied by increasing volume across the three days. It signals that bears have taken control of the market and suggests further downward movement.",
    shortDescription: "A bearish reversal pattern consisting of three consecutive falling bearish candles, indicating strong selling pressure.",
    chartType: "threeBlackCrows",
    lineColor: "red",
    data: [
      { time: '2025-01-01', open: 62, high: 65, low: 50, close: 52 },
      { time: '2025-01-02', open: 57, high: 59, low: 44, close: 46 },
      { time: '2025-01-03', open: 52, high: 54, low: 40, close: 42 },
    ],
  },
  {
    name: "Exponential Moving Average (EMA)",
    category: "Tools",
    value:
      "The Exponential Moving Average (EMA) is a type of moving average that gives more weight to recent price data, making it more responsive to current market conditions compared to the Simple Moving Average (SMA). By emphasizing the most recent prices, the EMA helps traders spot trends more quickly and is often used to identify potential buy or sell signals when it crosses certain key levels or other moving averages. It's especially useful for traders looking to follow short-term price movements and changes in market momentum.",
    shortDescription: "The EMA is a moving average that prioritizes recent price data for trend analysis.",
    video: "https://www.youtube.com/embed/LJjwXJqorew?si=qIs0CU0_UviZU8qy",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+EMA.png",
  },
  {
    name: "Simple Moving Average (SMA)",
    category: "Tools",
    value:
      "The Simple Moving Average (SMA) is a widely used technical indicator that calculates the average price of an asset over a specific period of time, typically 10, 50, or 200 days. It smooths out price fluctuations to help traders identify trends and market direction. Unlike the Exponential Moving Average (EMA), the SMA treats all prices within the selected period equally, making it less responsive to recent price changes. The SMA is commonly used to confirm trends and can also be used in crossover strategies to signal potential buy or sell opportunities.",
    shortDescription: "The SMA is a basic moving average that averages prices over a specified period.",
    video: "https://www.youtube.com/embed/k7riuAueMXI?si=1ccvK-dN-aQOjcud",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+SMA.png",
  },

  // Momentum Indicators
  {
    name: "Relative Strength Index (RSI)",
    category: "Tools",
    value:
      "The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. It ranges from 0 to 100 and is typically used to identify overbought or oversold conditions in the market. When RSI is above 70, it indicates that the asset may be overbought and could be due for a pullback, while a reading below 30 suggests that it may be oversold and could be primed for a reversal. RSI helps traders spot potential buy or sell signals, and can also be used to detect divergences that may indicate trend reversals.",
    shortDescription: "The RSI is a momentum oscillator that identifies overbought or oversold conditions.",
    video: "https://www.youtube.com/embed/DtKL5hjjYWo?si=TtrwvUp7Tdms-Vrn",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+RSI.png",
  },
  {
    name: "Moving Average Convergence Divergence (MACD)",
    longName: true,
    category: "Tools",
    value:
      "The Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of an asset's price. It is calculated by subtracting the 26-period EMA from the 12-period EMA. The result is the MACD line, which is then plotted alongside the signal line (the 9-period EMA of the MACD line). Traders use the MACD to identify potential buy and sell signals, as well as to gauge the strength of a trend.",
    shortDescription: "The MACD is a momentum indicator that shows the relationship between two EMAs.",
    video: "https://www.youtube.com/embed/1AAJVAqAbHE?si=7wla9zhzzNKFvLOD",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+MACD.png",
  },
  {
    name: "Bollinger Bands",
    category: "Tools",
    value:
      "Bollinger Bands are a technical analysis tool that consists of a middle band (typically a 20-period simple moving average) and two outer bands that are standard deviations away from the middle band. These bands expand and contract based on market volatility, with wider bands indicating higher volatility and narrower bands indicating lower volatility. Traders use Bollinger Bands to identify potential overbought or oversold conditions when prices touch or exceed the outer bands, as well as to recognize periods of consolidation before potential breakouts. The bands also help in identifying trend strength and potential reversal points, making them versatile for various trading strategies.",
    shortDescription: "A volatility indicator consisting of a moving average with upper and lower bands based on standard deviations.",
    video: "https://www.youtube.com/embed/wRiR8KTlGK8?si=bvs80ohmF0Kow7Dz",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+Bollinger+Bands.png",
  },
  {
    name: "Average True Range (ATR)",
    category: "Tools",
    value:
      "The Average True Range (ATR) is a technical indicator that measures market volatility by decomposing the entire range of an asset price for a specific period. Developed by J. Welles Wilder, the ATR doesn't provide directional signals but instead quantifies the degree of price movement or volatility. Traders use the ATR to set stop-loss levels, determine position sizes, and identify potential breakout points. A higher ATR value indicates higher volatility, suggesting larger price movements, while a lower ATR value indicates lower volatility with smaller price movements. The ATR is particularly useful in trending markets to adjust trading strategies based on changing volatility conditions.",
    shortDescription: "A volatility indicator that measures the average range of price movement over a specified period.",
    video: "https://www.youtube.com/embed/h_R4bdlb7fM?si=hWC3Ij9Gg0QKc4n8",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+Average+True+Range+(ATR).png",
  },

  // Technical Analysis Tools
  {
    name: "Fibonacci Retracement",
    category: "Tools",
    value:
      "Fibonacci Retracement is a technical analysis tool that helps identify potential support and resistance levels based on the Fibonacci sequence. It involves drawing horizontal lines at key Fibonacci levels—23.6%, 38.2%, 50%, 61.8%, and 100%—to indicate where the price may reverse or consolidate after a significant price movement. Traders use these levels to predict areas of potential price retracement during a trend. Fibonacci retracement is commonly used in conjunction with other indicators to confirm entry and exit points, making it a popular method for identifying potential reversal zones in both bullish and bearish markets.",
    shortDescription: "A tool used in technical analysis to identify potential support and resistance levels based on the Fibonacci sequence.",
    video: "https://www.youtube.com/embed/m5PzY2xaPIg?si=yaP43MeCGKiYQqJf",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+Fibonacci+Retracement.png",
  },
  {
    name: "Elliott Wave Theory",
    category: "Theory",
    value: "This theory posits that market prices move in predictable cycles, reflecting the emotions and behaviors of market participants. According to this theory, these cycles are influenced by the psychology of traders and investors, leading to patterns that can be identified and used for forecasting future price movements. The theory is based on the idea that market trends follow a specific structure of waves, which can be classified into impulse waves and corrective waves.",
    shortDescription: "A theory suggesting market prices move in predictable cycles driven by market participants' emotions and behaviors.",
    video: "https://www.youtube.com/embed/WGExLtdKdSg?si=Iz92Xo0xbSp2PXgB",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+Elliott+Wave+Theory.png",
  },
  {
      name: "Momentum Trading",
      category: "Theory",
      value: "A strategy that aims to capitalize on the continuation of existing trends in the market. Traders who employ this strategy believe that assets that have been rising steadily will continue to rise, while those that have been falling will continue to fall. This approach often involves using technical indicators to identify the strength of a trend and making trades based on the momentum of price movements. Traders typically look for stocks that are moving significantly in one direction on high volume.",
      shortDescription: "A strategy focused on capitalizing on the continuation of trends by trading based on price momentum.",
      video: "https://www.youtube.com/embed/2_ZAxSfM6Ss?si=WKC5V_vVwsu2E6Fq",
      thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+Momentum+Trading.png",
  },
  {
      name: "Dow Theory",
      category: "Theory",
      value: "This theory is a framework for understanding market trends and movements. It asserts that the stock market moves in trends, which can be identified and followed. The theory emphasizes the importance of confirming trends through various market indices. This theory also introduces concepts such as primary trends, secondary trends, and minor trends.",
      shortDescription: "A framework for understanding market trends that emphasizes the identification and confirmation of trends.",
      video: "https://www.youtube.com/embed/DenOjcBAX0M?si=GljKhiV8mXAp3Z-E",
      thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+Dow+Theory.png",
  },
  {
      name: "Gann Theory",
      category: "Theory",
      value: "This theory involves a method of technical analysis that uses angles and time cycles to predict price movements. It asserts that the market moves in predictable patterns and that these patterns can be analyzed using geometric angles and time intervals. The theory incorporates various tools, such as angles, fans, and time cycles, to help traders identify potential support and resistance levels, as well as entry and exit points.",
      shortDescription: "A method of technical analysis using angles and time cycles to predict market price movements.",
      video: "https://www.youtube.com/embed/OpL-h9WPPF8?si=HTZAqUVElaobM6bl",
      thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Understanding_+GannTheory.png",
  },
];

export default terminologyData;
