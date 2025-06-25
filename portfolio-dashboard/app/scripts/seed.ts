
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Read the portfolio instruments research data
  const dataPath = path.join(__dirname, '../data/portfolio_instruments_research.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(rawData);

  // Map instruments to sleeves based on the portfolio plan
  const sleeveMapping: Record<string, { sleeve: string; targetAllocation: number }> = {
    'NOBL': { sleeve: 'A', targetAllocation: 17.5 }, // Quality Dividend (35% / 2 instruments)
    'XYLD': { sleeve: 'A', targetAllocation: 17.5 }, // Option Income (35% / 2 instruments)
    'IDU': { sleeve: 'D', targetAllocation: 5 },    // Real-Asset Yield utilities (10% / 2 instruments)
    'SCHP': { sleeve: 'B', targetAllocation: 10 },  // Inflation Hedge (20% / 2 instruments)
    'IEI': { sleeve: 'B', targetAllocation: 10 },   // Fixed-Income (20% / 2 instruments)
    'DBMF': { sleeve: 'C', targetAllocation: 12.5 }, // Market-Neutral/Alt Alpha (25% / 2 instruments)
    'BTAL': { sleeve: 'C', targetAllocation: 12.5 }, // Market-Neutral/Alt Alpha (25% / 2 instruments)
    'MERFX': { sleeve: 'C', targetAllocation: 0 },   // Additional alternative strategy
    'VNQ': { sleeve: 'D', targetAllocation: 5 },    // Real-Asset Yield REITs (10% / 2 instruments)
    'UTF': { sleeve: 'D', targetAllocation: 0 },    // Additional real asset
    'SGOV': { sleeve: 'E', targetAllocation: 10 },  // Cash & Cash-Like (10%)
  };

  // Create portfolio instruments
  for (const [ticker, instrumentData] of Object.entries(data.portfolio_instruments)) {
    const mapping = sleeveMapping[ticker];
    if (!mapping) continue;

    // Type assertion for instrumentData
    const instrument = instrumentData as any;

    try {
      await prisma.portfolioInstrument.upsert({
        where: { ticker },
        update: {
          fundName: instrument.fund_name,
          category: instrument.category,
          underlyingAssets: instrument.underlying_assets,
          expenseRatio: instrument.expense_ratio,
          aum: instrument.AUM,
          yield: instrument.yield,
          inception: instrument.inception,
          keyCharacteristics: instrument.key_characteristics,
          commonMetrics: instrument.common_metrics_available,
          sleeve: mapping.sleeve,
          targetAllocation: mapping.targetAllocation,
          currentAllocation: mapping.targetAllocation, // Start with target allocation
        },
        create: {
          ticker,
          fundName: instrument.fund_name,
          category: instrument.category,
          underlyingAssets: instrument.underlying_assets,
          expenseRatio: instrument.expense_ratio,
          aum: instrument.AUM,
          yield: instrument.yield,
          inception: instrument.inception,
          keyCharacteristics: instrument.key_characteristics,
          commonMetrics: instrument.common_metrics_available,
          sleeve: mapping.sleeve,
          targetAllocation: mapping.targetAllocation,
          currentAllocation: mapping.targetAllocation,
        },
      });
      console.log(`✓ Created/updated instrument: ${ticker}`);
    } catch (error) {
      console.error(`Error creating instrument ${ticker}:`, error);
    }
  }

  // Create default portfolio allocation
  await prisma.portfolioAllocation.upsert({
    where: { name: 'Target Allocation' },
    update: {
      isActive: true,
      sleeveA: 35, // Quality Dividend & Option Income
      sleeveB: 20, // Fixed-Income & Inflation Hedge
      sleeveC: 25, // Market-Neutral/Alt Alpha
      sleeveD: 10, // Real-Asset Yield
      sleeveE: 10, // Cash & Cash-Like
      forwardYield: 4.5,
      maxDrawdown: 15,
      dailyLiquidity: 85,
    },
    create: {
      name: 'Target Allocation',
      isActive: true,
      sleeveA: 35,
      sleeveB: 20,
      sleeveC: 25,
      sleeveD: 10,
      sleeveE: 10,
      forwardYield: 4.5,
      maxDrawdown: 15,
      dailyLiquidity: 85,
    },
  });

  // Create default user settings
  await prisma.userSettings.upsert({
    where: { userId: 'default' },
    update: {
      fmpApiKey: process.env.FMP_API_KEY,
      refreshInterval: 3600,
      defaultTimeframe: '1Y',
      theme: 'dark',
      enableNotifications: true,
      enableSP500: true,
      enableBondBench: true,
    },
    create: {
      userId: 'default',
      fmpApiKey: process.env.FMP_API_KEY,
      refreshInterval: 3600,
      defaultTimeframe: '1Y',
      theme: 'dark',
      enableNotifications: true,
      enableSP500: true,
      enableBondBench: true,
    },
  });

  // Create stress test scenarios
  const scenarios = [
    {
      name: '2008 Financial Crisis',
      description: 'Simulating the 2008-2009 financial crisis impact on portfolio',
      equityShock: -37,
      bondShock: 5.2,
      realEstateShock: -20,
      volatilityMultiplier: 2.5,
      duration: 365,
    },
    {
      name: 'COVID-19 Pandemic',
      description: 'Simulating the early 2020 pandemic market shock',
      equityShock: -34,
      bondShock: 8.2,
      realEstateShock: -15,
      volatilityMultiplier: 3.0,
      duration: 90,
    },
    {
      name: 'Inflation Spike',
      description: 'High inflation environment scenario',
      equityShock: -15,
      bondShock: -10,
      realEstateShock: 10,
      volatilityMultiplier: 1.8,
      duration: 180,
    },
  ];

  for (const scenario of scenarios) {
    await prisma.stressTestScenario.upsert({
      where: { name: scenario.name },
      update: scenario,
      create: scenario,
    });
  }

  console.log('✓ Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
