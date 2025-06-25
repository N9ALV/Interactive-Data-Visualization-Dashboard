
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '1Y';
    
    // Calculate date range based on timeframe
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case '3Y':
        startDate.setFullYear(endDate.getFullYear() - 3);
        break;
      case '5Y':
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
      default:
        startDate.setFullYear(endDate.getFullYear() - 1);
    }

    // For now, generate synthetic performance data
    // In a real implementation, this would fetch actual historical data
    const performanceData = generateSyntheticPerformanceData(startDate, endDate);
    
    return NextResponse.json(performanceData);
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio performance' },
      { status: 500 }
    );
  }
}

function generateSyntheticPerformanceData(startDate: Date, endDate: Date) {
  const data = [];
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const interval = Math.max(1, Math.floor(daysDiff / 50)); // Generate ~50 data points
  
  let portfolioReturn = 0;
  let sp500Return = 0;
  let bondsReturn = 0;
  
  for (let i = 0; i <= daysDiff; i += interval) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Simulate returns with some realistic patterns
    const timeProgress = i / daysDiff;
    
    // Portfolio: more stable, income-focused
    portfolioReturn += (Math.random() - 0.45) * 0.8 + 0.01; // Slight positive bias
    
    // S&P 500: more volatile
    sp500Return += (Math.random() - 0.48) * 1.2 + 0.015; // Higher volatility, slight positive bias
    
    // Bonds: lower volatility, steady
    bondsReturn += (Math.random() - 0.5) * 0.3 + 0.005; // Low volatility, small positive bias
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      portfolio: portfolioReturn,
      sp500: sp500Return,
      bonds: bondsReturn,
    });
  }
  
  return data;
}
