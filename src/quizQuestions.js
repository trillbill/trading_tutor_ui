const quizQuestions = [
  {
    name: "Exponential Moving Average (EMA)",
    questions: [
      {
        question: "What makes the Exponential Moving Average (EMA) different from the Simple Moving Average (SMA)?",
        options: ["It gives more weight to recent price data", "It only uses closing prices", "It requires more historical data", "It is calculated using median prices"],
        correctAnswer: "It gives more weight to recent price data"
      },
      {
        question: "Why might traders prefer using an EMA over an SMA?",
        options: ["EMAs are more responsive to current market conditions", "EMAs are easier to calculate manually", "EMAs work better in sideways markets", "EMAs are less prone to false signals"],
        correctAnswer: "EMAs are more responsive to current market conditions"
      },
      {
        question: "What is a common use of the EMA in trading?",
        options: ["To identify potential buy or sell signals when crossing other moving averages", "To predict exact price targets", "To determine market volatility", "To calculate trading volume"],
        correctAnswer: "To identify potential buy or sell signals when crossing other moving averages"
      },
      {
        question: "Which timeframe is the EMA most useful for?",
        options: ["Short-term price movements", "Only yearly trends", "Only monthly trends", "It cannot be used for any specific timeframe"],
        correctAnswer: "Short-term price movements"
      },
      {
        question: "When two EMAs of different periods cross, what might this indicate?",
        options: ["A potential change in trend direction", "The market is closed", "Trading volume is increasing", "The asset is illiquid"],
        correctAnswer: "A potential change in trend direction"
      }
    ]
  },
  {
    name: "Simple Moving Average (SMA)",
    questions: [
      {
        question: "How is the Simple Moving Average (SMA) calculated?",
        options: ["By averaging prices over a specified period", "By multiplying prices by a factor", "By using only the highest prices in a period", "By comparing current price to previous day's price"],
        correctAnswer: "By averaging prices over a specified period"
      },
      {
        question: "What are common periods used for SMAs?",
        options: ["10, 50, or 200 days", "3, 5, or 7 days only", "1000 days or more", "1 minute or less"],
        correctAnswer: "10, 50, or 200 days"
      },
      {
        question: "How does the SMA treat all prices within its calculation period?",
        options: ["Equally", "With decreasing importance", "With increasing importance", "It ignores outliers"],
        correctAnswer: "Equally"
      },
      {
        question: "What is a limitation of the SMA compared to the EMA?",
        options: ["It is less responsive to recent price changes", "It requires more data points", "It cannot be used for long-term analysis", "It only works in bull markets"],
        correctAnswer: "It is less responsive to recent price changes"
      },
      {
        question: "What might a price crossing above its 200-day SMA indicate?",
        options: ["A potential bullish signal", "The market is overbought", "Trading should be avoided", "The asset is highly volatile"],
        correctAnswer: "A potential bullish signal"
      }
    ]
  },
  {
    name: "Relative Strength Index (RSI)",
    questions: [
      {
        question: "What type of indicator is the RSI?",
        options: ["A momentum oscillator", "A volume indicator", "A trend indicator", "A volatility indicator"],
        correctAnswer: "A momentum oscillator"
      },
      {
        question: "What range does the RSI oscillate between?",
        options: ["0 to 100", "-100 to 100", "0 to 1", "-1 to 1"],
        correctAnswer: "0 to 100"
      },
      {
        question: "What RSI reading typically indicates an overbought condition?",
        options: ["Above 70", "Above 50", "Above 30", "Above 90"],
        correctAnswer: "Above 70"
      },
      {
        question: "What RSI reading typically indicates an oversold condition?",
        options: ["Below 30", "Below 50", "Below 70", "Below 10"],
        correctAnswer: "Below 30"
      },
      {
        question: "What is RSI divergence?",
        options: ["When price makes a new high/low but RSI doesn't confirm it", "When RSI crosses the 50 level", "When RSI stays above 70 for multiple days", "When RSI equals the price"],
        correctAnswer: "When price makes a new high/low but RSI doesn't confirm it"
      }
    ]
  },
  {
    name: "Moving Average Convergence Divergence (MACD)",
    questions: [
      {
        question: "How is the MACD line calculated?",
        options: ["By subtracting the 26-period EMA from the 12-period EMA", "By adding two EMAs together", "By dividing the fast EMA by the slow EMA", "By comparing price to a single EMA"],
        correctAnswer: "By subtracting the 26-period EMA from the 12-period EMA"
      },
      {
        question: "What is the signal line in MACD?",
        options: ["The 9-period EMA of the MACD line", "The zero line in the middle", "The histogram portion", "The 26-period EMA"],
        correctAnswer: "The 9-period EMA of the MACD line"
      },
      {
        question: "What might the MACD crossing above its signal line indicate?",
        options: ["A potential bullish signal", "A guaranteed price drop", "The market is closed", "Trading volume is decreasing"],
        correctAnswer: "A potential bullish signal"
      },
      {
        question: "What does the histogram in the MACD indicator represent?",
        options: ["The difference between the MACD line and the signal line", "Trading volume", "Price volatility", "Market sentiment"],
        correctAnswer: "The difference between the MACD line and the signal line"
      },
      {
        question: "What type of indicator is MACD classified as?",
        options: ["A trend-following momentum indicator", "A leading indicator", "A volume oscillator", "A market breadth indicator"],
        correctAnswer: "A trend-following momentum indicator"
      }
    ]
  },
  {
    name: "Fibonacci Retracement",
    questions: [
      {
        question: "What are the key Fibonacci retracement levels used in technical analysis?",
        options: ["23.6%, 38.2%, 50%, 61.8%, and 100%", "10%, 20%, 30%, 40%, and 50%", "1%, 2%, 3%, 5%, and 8%", "33%, 66%, and 99%"],
        correctAnswer: "23.6%, 38.2%, 50%, 61.8%, and 100%"
      },
      {
        question: "What do Fibonacci retracement levels help identify?",
        options: ["Potential support and resistance levels", "Exact entry and exit points", "Future price targets", "Market sentiment"],
        correctAnswer: "Potential support and resistance levels"
      },
      {
        question: "The 50% retracement level is technically not a Fibonacci number, but is included because:",
        options: ["It's often a significant level where price reacts", "It's required by trading regulations", "It makes calculations easier", "It represents the golden ratio"],
        correctAnswer: "It's often a significant level where price reacts"
      },
      {
        question: "How are Fibonacci retracement levels typically drawn?",
        options: ["From a significant low to a significant high (or vice versa)", "Only on daily charts", "Only during market hours", "From left to right on the chart"],
        correctAnswer: "From a significant low to a significant high (or vice versa)"
      },
      {
        question: "What is the best practice when using Fibonacci retracement levels?",
        options: ["Use them in conjunction with other indicators for confirmation", "Use them as the only indicator for trading decisions", "Apply them only to certain asset classes", "Redraw them every trading day"],
        correctAnswer: "Use them in conjunction with other indicators for confirmation"
      }
    ]
  },
  {
    name: "Elliott Wave Theory",
    questions: [
      {
        question: "According to Elliott Wave Theory, how many waves make up a complete market cycle?",
        options: ["8 waves (5 impulse waves and 3 corrective waves)", "3 waves", "10 waves", "12 waves"],
        correctAnswer: "8 waves (5 impulse waves and 3 corrective waves)"
      },
      {
        question: "What drives the patterns in Elliott Wave Theory?",
        options: ["The psychology of traders and investors", "Government regulations", "Corporate earnings", "Interest rates"],
        correctAnswer: "The psychology of traders and investors"
      },
      {
        question: "In Elliott Wave Theory, what direction do impulse waves move?",
        options: ["In the direction of the main trend", "Against the main trend", "Sideways only", "In circles"],
        correctAnswer: "In the direction of the main trend"
      },
      {
        question: "What are the corrective waves labeled as in Elliott Wave Theory?",
        options: ["A, B, and C", "6, 7, and 8", "X, Y, and Z", "I, II, and III"],
        correctAnswer: "A, B, and C"
      },
      {
        question: "What principle is Elliott Wave Theory based on?",
        options: ["Markets move in predictable patterns", "Markets are completely random", "Markets only respond to news events", "Markets only follow economic indicators"],
        correctAnswer: "Markets move in predictable patterns"
      }
    ]
  },
  {
    name: "Momentum Trading",
    questions: [
      {
        question: "What is the core belief of momentum trading?",
        options: ["Assets that have been rising will continue to rise, and those falling will continue to fall", "Buy low and sell high", "The market always reverts to the mean", "Price and volume are unrelated"],
        correctAnswer: "Assets that have been rising will continue to rise, and those falling will continue to fall"
      },
      {
        question: "What do momentum traders typically look for?",
        options: ["Stocks moving significantly in one direction on high volume", "Stocks with low volatility", "Only blue-chip stocks", "Only penny stocks"],
        correctAnswer: "Stocks moving significantly in one direction on high volume"
      },
      {
        question: "Which of these indicators is commonly used in momentum trading?",
        options: ["Relative Strength Index (RSI)", "Book value", "P/E ratio", "Dividend yield"],
        correctAnswer: "Relative Strength Index (RSI)"
      },
      {
        question: "What timeframe do momentum traders typically focus on?",
        options: ["Short to medium term", "Very long term only", "Multi-year trends only", "Decade-long cycles"],
        correctAnswer: "Short to medium term"
      },
      {
        question: "What is a potential risk of momentum trading?",
        options: ["Sudden trend reversals", "Too little market volatility", "Excessive transaction fees", "Too few trading opportunities"],
        correctAnswer: "Sudden trend reversals"
      }
    ]
  },
  {
    name: "Dow Theory",
    questions: [
      {
        question: "What does Dow Theory assert about the stock market?",
        options: ["It moves in trends that can be identified and followed", "It is completely random", "It only responds to interest rates", "It only follows economic indicators"],
        correctAnswer: "It moves in trends that can be identified and followed"
      },
      {
        question: "According to Dow Theory, what are the three types of market trends?",
        options: ["Primary, secondary, and minor trends", "Bull, bear, and sideways trends", "Fast, medium, and slow trends", "Short, intermediate, and long trends"],
        correctAnswer: "Primary, secondary, and minor trends"
      },
      {
        question: "What is a key principle of Dow Theory regarding trend confirmation?",
        options: ["Market indices should confirm each other", "Trends are only valid if confirmed by news", "Volume is irrelevant to trend confirmation", "Only price matters, not time"],
        correctAnswer: "Market indices should confirm each other"
      },
      {
        question: "How long does a primary trend typically last according to Dow Theory?",
        options: ["One year or more", "One day to one week", "One month exactly", "Five years minimum"],
        correctAnswer: "One year or more"
      },
      {
        question: "Which of these is NOT one of the six basic tenets of Dow Theory?",
        options: ["The market always predicts exact price targets", "The market discounts everything", "Market indices must confirm each other", "Volume must confirm the trend"],
        correctAnswer: "The market always predicts exact price targets"
      }
    ]
  },
  {
    name: "Gann Theory",
    questions: [
      {
        question: "What does Gann Theory primarily use to predict price movements?",
        options: ["Geometric angles and time cycles", "Fundamental analysis only", "Company earnings reports", "Market sentiment surveys"],
        correctAnswer: "Geometric angles and time cycles"
      },
      {
        question: "What is the most famous angle in Gann Theory?",
        options: ["The 1×1 angle (45 degrees)", "The 90-degree angle", "The 30-degree angle", "The 180-degree angle"],
        correctAnswer: "The 1×1 angle (45 degrees)"
      },
      {
        question: "According to Gann Theory, what is the relationship between price and time?",
        options: ["They are equally important", "Price is more important than time", "Time is more important than price", "They are unrelated"],
        correctAnswer: "They are equally important"
      },
      {
        question: "What tool is NOT typically associated with Gann Theory?",
        options: ["Bollinger Bands", "Gann Fan", "Gann Square", "Gann Angles"],
        correctAnswer: "Bollinger Bands"
      },
      {
        question: "What did W.D. Gann believe about market movements?",
        options: ["They follow natural mathematical laws and geometric patterns", "They are completely random", "They only follow news events", "They are unpredictable"],
        correctAnswer: "They follow natural mathematical laws and geometric patterns"
      }
    ]
  }
];

export default quizQuestions;