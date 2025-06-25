
'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { SLEEVE_CONFIG } from '@/lib/types';

interface AllocationData {
  sleeve: string;
  name: string;
  current: number;
  target: number;
  value: number;
  instruments: string[];
}

interface PortfolioAllocationChartProps {
  data: AllocationData[];
}

export function PortfolioAllocationChart({ data }: PortfolioAllocationChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No allocation data available
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = data.map(item => ({
    name: item.name,
    value: item.current,
    target: item.target,
    color: SLEEVE_CONFIG[item.sleeve]?.color || '#60B5FF',
    instruments: item.instruments,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-dark-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-primary">
            Current: {data.value.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Target: {data.target.toFixed(1)}%
          </p>
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Instruments:</p>
            <p className="text-xs text-foreground">
              {data.instruments.join(', ')}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-foreground">{entry.value}</span>
          <span className="text-muted-foreground text-xs">
            ({entry.payload.value.toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          outerRadius={120}
          innerRadius={60}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
          animationBegin={0}
          animationDuration={800}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          content={<CustomLegend />}
          verticalAlign="bottom"
          height={80}
          wrapperStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
