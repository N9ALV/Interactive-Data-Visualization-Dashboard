
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SLEEVE_CONFIG } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all portfolio instruments with their allocations
    const instruments = await prisma.portfolioInstrument.findMany({
      select: {
        ticker: true,
        fundName: true,
        sleeve: true,
        targetAllocation: true,
        currentAllocation: true,
      },
    });

    // Group by sleeve and calculate totals
    const sleeveData = Object.entries(SLEEVE_CONFIG).map(([sleeveId, config]) => {
      const sleeveInstruments = instruments.filter(inst => inst.sleeve === sleeveId);
      const currentTotal = sleeveInstruments.reduce((sum, inst) => sum + inst.currentAllocation, 0);
      const targetTotal = sleeveInstruments.reduce((sum, inst) => sum + inst.targetAllocation, 0);
      
      return {
        sleeve: sleeveId,
        name: config.name,
        current: currentTotal,
        target: targetTotal,
        value: currentTotal, // For chart display
        instruments: sleeveInstruments.map(inst => inst.ticker),
        description: config.description,
      };
    }).filter(sleeve => sleeve.instruments.length > 0);

    return NextResponse.json(sleeveData);
  } catch (error) {
    console.error('Error fetching portfolio allocation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio allocation' },
      { status: 500 }
    );
  }
}
