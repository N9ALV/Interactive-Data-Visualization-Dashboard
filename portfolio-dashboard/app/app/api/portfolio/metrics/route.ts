
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the active portfolio allocation
    const allocation = await prisma.portfolioAllocation.findFirst({
      where: { isActive: true },
    });

    // Get portfolio instruments for yield calculation
    const instruments = await prisma.portfolioInstrument.findMany({
      select: {
        ticker: true,
        yield: true,
        currentAllocation: true,
      },
    });

    // Calculate weighted average yield
    let weightedYield = 0;
    let totalAllocation = 0;
    
    for (const instrument of instruments) {
      if (instrument.yield && instrument.currentAllocation > 0) {
        const yieldValue = parseFloat(instrument.yield.replace('%', '')) || 0;
        weightedYield += yieldValue * (instrument.currentAllocation / 100);
        totalAllocation += instrument.currentAllocation;
      }
    }
    
    const forwardYield = totalAllocation > 0 ? (weightedYield / totalAllocation) * 100 : 4.5;

    // Simulate some metrics for demo purposes
    // In a real implementation, these would be calculated from historical data
    const metrics = {
      forwardYield: Math.max(3.5, Math.min(6.0, forwardYield)) || 4.5,
      maxDrawdown: allocation?.maxDrawdown || 12.3,
      dailyLiquidity: allocation?.dailyLiquidity || 87.5,
      totalValue: 2500000 + Math.random() * 500000, // Simulated portfolio value
      monthlyChange: -1.5 + Math.random() * 4, // Simulated monthly change
      volatility: 8.2 + Math.random() * 3, // Simulated volatility
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching portfolio metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio metrics' },
      { status: 500 }
    );
  }
}
