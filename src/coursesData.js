const coursesData = [
  {
    id: 1,
    title: "Market Microstructure",
    description: "Understand how markets function at the most granular level",
    fullDescription: "This comprehensive course delves into the mechanics of financial markets, exploring how trading venues operate, orders are processed, and prices are formed. You'll gain insights into liquidity dynamics, order types, market depth, and how these factors influence trading strategies. Perfect for traders who want to understand what's happening 'under the hood' of the markets they trade.",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Market_Microstructure.png",
    duration: "4 hours",
    level: "Intermediate",
    premium: true,
    modules: [
      {
        id: 101,
        title: "Introduction to Market Microstructure",
        duration: "3 min",
        description: "Overview of market microstructure concepts and why they matter to traders",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Market-Microstructure-Intro.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Introduction+to+Market+Microstructure.png"
      },
      {
        id: 102,
        title: "Order Types and Execution",
        duration: "5 min",
        description: "Detailed exploration of market orders, limit orders, and advanced order types",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Order-Types-Execution.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Order+Types+and+Execution.png"
      },
      {
        id: 103,
        title: "Liquidity and Market Depth",
        duration: "5 min",
        description: "Understanding liquidity providers, market makers, and reading the order book",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Liquidity-and-Market-Depth.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Liquidity+and+Market+Depth.png"
      },
      {
        id: 104,
        title: "Price Formation and Discovery",
        duration: "6 min",
        description: "How prices are formed through the interaction of buyers and sellers",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Price-Formation-Discovery.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Price+Formation+and+Discovery.png"
      },
      {
        id: 105,
        title: "Market Impact and Trading Costs",
        duration: "6 min",
        description: "Analyzing transaction costs, slippage, and minimizing market impact",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Market-Impact-Trading-Costs.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Market+Impact+and+Trading+Costs.png"
      }
    ]
  },
  {
    id: 2,
    title: "Options Trading for Beginners",
    description: "Learn the fundamentals of options trading from the ground up",
    fullDescription: "This beginner-friendly course introduces you to the world of options trading. Starting with basic concepts and terminology, you'll progress to understanding option pricing, strategies for different market conditions, and risk management techniques. By the end of this course, you'll have the knowledge to begin incorporating options into your trading toolkit with confidence.",
    thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Options-Trading-for-Beginners.png",
    duration: "6 hours",
    level: "Beginner",
    instructor: "Michael Chen",
    premium: true,
    modules: [
      {
        id: 201,
        title: "Options Basics: Calls and Puts",
        duration: "5 min",
        description: "Understanding the fundamental building blocks of options trading",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Options-Basics.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Options+Basics_+Calls+and+Puts.png"
      },
      {
        id: 202,
        title: "Option Pricing and the Greeks",
        duration: "6 min",
        description: "How options are priced and the factors that influence their value",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Option-Pricing-And-Greeks.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Option+Pricing+and+the+Greeks.png"
      },
      {
        id: 203,
        title: "Basic Options Strategies",
        duration: "6 min",
        description: "Covered calls, protective puts, and other beginner-friendly strategies",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Basic-Options-Strategies.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Basic+Options+Strategies.png"
      },
      {
        id: 204,
        title: "Implied Volatility and Time Decay",
        duration: "6 min",
        description: "Understanding how time and volatility affect option prices",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Implied-Volatility-Time-Decay.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Implied+Volatility+and+Time+Decay.png"
      },
      {
        id: 205,
        title: "Risk Management for Options Traders",
        duration: "6 min",
        description: "Position sizing, hedging, and managing risk in options trading",
        videoUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Risk-Management-For-Options-Traders.mp4",
        thumbnailUrl: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Risk+Management+for+Options+Traders.png"
      }
    ]
  },
  // {
  //   id: 3,
  //   title: "Technical Analysis Mastery",
  //   description: "Master chart patterns, indicators, and technical trading strategies",
  //   fullDescription: "This comprehensive course takes you from the basics to advanced concepts in technical analysis. You'll learn to identify and trade various chart patterns, effectively use technical indicators, and develop a systematic approach to technical trading. With practical examples and case studies, you'll be able to apply these techniques to real market situations.",
  //   thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Technical-Analysis-Mastery.png",
  //   duration: "8 hours",
  //   level: "All Levels",
  //   instructor: "Robert Williams",
  //   premium: true,
  //   modules: [
  //     {
  //       id: 301,
  //       title: "Foundations of Technical Analysis",
  //       duration: "60 min",
  //       description: "Core principles, assumptions, and the psychology behind technical analysis"
  //     },
  //     {
  //       id: 302,
  //       title: "Chart Patterns and Price Action",
  //       duration: "90 min",
  //       description: "Identifying and trading reversal and continuation patterns"
  //     },
  //     {
  //       id: 303,
  //       title: "Trend Analysis and Moving Averages",
  //       duration: "75 min",
  //       description: "Identifying trends and using moving averages effectively"
  //     },
  //     {
  //       id: 304,
  //       title: "Momentum and Oscillator Indicators",
  //       duration: "75 min",
  //       description: "Using RSI, MACD, Stochastic, and other momentum indicators"
  //     },
  //     {
  //       id: 305,
  //       title: "Volume Analysis and Market Breadth",
  //       duration: "60 min",
  //       description: "Incorporating volume and market breadth into your technical analysis"
  //     },
  //     {
  //       id: 306,
  //       title: "Building a Technical Trading System",
  //       duration: "90 min",
  //       description: "Combining multiple techniques into a coherent trading approach"
  //     }
  //   ]
  // },
  // {
  //   id: 4,
  //   title: "Fundamental Analysis for Traders",
  //   description: "Learn how to incorporate fundamental data into your trading decisions",
  //   fullDescription: "This course bridges the gap between fundamental analysis and trading. Rather than focusing on long-term investing, you'll learn how to use economic data, earnings reports, and other fundamental factors to inform shorter-term trading decisions. Discover how markets react to various types of news and economic events, and how to position yourself accordingly.",
  //   thumbnail: "https://d23vnzhpxwsomk.cloudfront.net/trading-tutor/Fundamental-Analysis-for-Traders.png",
  //   duration: "5 hours",
  //   level: "Intermediate",
  //   instructor: "Jennifer Martinez",
  //   premium: true,
  //   modules: [
  //     {
  //       id: 401,
  //       title: "Fundamental Analysis for Different Timeframes",
  //       duration: "45 min",
  //       description: "Adapting fundamental analysis for various trading horizons"
  //     },
  //     {
  //       id: 402,
  //       title: "Economic Indicators and Market Reactions",
  //       duration: "75 min",
  //       description: "How markets typically respond to major economic data releases"
  //     },
  //     {
  //       id: 403,
  //       title: "Earnings Season Trading Strategies",
  //       duration: "60 min",
  //       description: "Approaches for trading before, during, and after earnings announcements"
  //     },
  //     {
  //       id: 404,
  //       title: "Sector Rotation and Industry Analysis",
  //       duration: "60 min",
  //       description: "Identifying sectors and industries poised for outperformance"
  //     },
  //     {
  //       id: 405,
  //       title: "Integrating Technical and Fundamental Analysis",
  //       duration: "60 min",
  //       description: "Creating a holistic approach that leverages both methodologies"
  //     }
  //   ]
  // }
];

export default coursesData;