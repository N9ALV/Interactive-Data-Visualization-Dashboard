import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get the first portfolio settings (assuming single user for now)
    const portfolio = await prisma.portfolio.findFirst({
      select: {
        fmpApiKey: true,
        settings: true,
      }
    });

    if (!portfolio) {
      return NextResponse.json({
        fmpApiKey: '',
        refreshInterval: '3600',
        defaultTimeframe: '1Y',
        theme: 'dark',
        enableNotifications: true,
        enableSP500: true,
        enableBondBench: true,
      });
    }

    // Parse settings JSON if it exists
    let settings = {
      refreshInterval: '3600',
      defaultTimeframe: '1Y',
      theme: 'dark',
      enableNotifications: true,
      enableSP500: true,
      enableBondBench: true,
    };

    if (portfolio.settings) {
      try {
        settings = { ...settings, ...JSON.parse(portfolio.settings) };
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }

    return NextResponse.json({
      fmpApiKey: portfolio.fmpApiKey || '',
      ...settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fmpApiKey, ...otherSettings } = body;

    // Get or create the first portfolio
    let portfolio = await prisma.portfolio.findFirst();
    
    if (!portfolio) {
      // Create a default portfolio if none exists
      portfolio = await prisma.portfolio.create({
        data: {
          userId: 'default-user',
          name: 'My Portfolio',
          description: 'Default portfolio',
          fmpApiKey: fmpApiKey,
          settings: JSON.stringify(otherSettings),
        }
      });
    } else {
      // Update existing portfolio
      portfolio = await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: {
          fmpApiKey: fmpApiKey,
          settings: JSON.stringify(otherSettings),
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
