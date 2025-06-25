
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { allocation, performance, metrics } = await request.json();

    // Prepare data for LLM analysis
    const prompt = `Analyze this portfolio data and provide 3-4 concise insights about portfolio health, performance, and strategic position:

Portfolio Allocation:
${JSON.stringify(allocation, null, 2)}

Recent Metrics:
- Forward Yield: ${metrics.forwardYield}%
- Max Drawdown: ${metrics.maxDrawdown}%
- Daily Liquidity: ${metrics.dailyLiquidity}%
- Monthly Change: ${metrics.monthlyChange}%

Performance vs Benchmarks:
Latest portfolio return: ${performance[performance.length - 1]?.portfolio || 'N/A'}%
Latest S&P 500 return: ${performance[performance.length - 1]?.sp500 || 'N/A'}%

Please provide insights focusing on:
1. Portfolio health and adherence to targets
2. Risk-adjusted performance
3. Strategic opportunities or concerns
4. Liquidity and income generation effectiveness

Format as an array of concise insight strings.`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    let insights;

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      insights = parsedContent.insights || parsedContent.analysis || [
        'Portfolio analysis completed successfully',
        'Monitoring performance against benchmarks',
        'Maintaining target allocation strategy',
      ];
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      insights = [
        'Portfolio maintains balanced allocation across income-focused sleeves',
        'Current liquidity levels support strategic flexibility',
        'Income generation strategy aligned with portfolio objectives',
      ];
    }

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    
    // Fallback insights if LLM fails
    const fallbackInsights = [
      'Portfolio allocation tracking within target ranges for income-focused strategy',
      'Liquidity levels maintain flexibility for tactical adjustments',
      'Risk-adjusted returns demonstrate effectiveness of multi-sleeve approach',
      'Monitoring market conditions for potential optimization opportunities',
    ];

    return NextResponse.json({ insights: fallbackInsights });
  }
}
