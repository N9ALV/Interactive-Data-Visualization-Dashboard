
'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PerformanceData {
  date: string;
  portfolio: number;
  sp500: number;
  bonds: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No performance data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-dark-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255, 255, 255, 0.1)" 
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          interval="preserveStartEnd"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          label={{ 
            value: 'Return (%)', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 11, fill: '#94A3B8' }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ fontSize: 11 }}
        />
        <Line
          type="monotone"
          dataKey="portfolio"
          stroke="#60B5FF"
          strokeWidth={3}
          dot={false}
          name="Portfolio"
          animationDuration={1000}
        />
        <Line
          type="monotone"
          dataKey="sp500"
          stroke="#FF9149"
          strokeWidth={2}
          dot={false}
          name="S&P 500"
          strokeDasharray="5 5"
          animationDuration={1000}
        />
        <Line
          type="monotone"
          dataKey="bonds"
          stroke="#80D8C3"
          strokeWidth={2}
          dot={false}
          name="30/70 Agg Bond"
          strokeDasharray="3 3"
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
