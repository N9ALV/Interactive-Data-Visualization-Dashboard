
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const instruments = await prisma.portfolioInstrument.findMany({
      orderBy: {
        currentAllocation: 'desc',
      },
    });

    return NextResponse.json(instruments);
  } catch (error) {
    console.error('Error fetching portfolio instruments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio instruments' },
      { status: 500 }
    );
  }
}
