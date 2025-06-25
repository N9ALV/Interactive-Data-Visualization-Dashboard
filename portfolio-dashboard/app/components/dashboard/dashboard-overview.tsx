
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PortfolioAllocationChart } from '@/components/charts/portfolio-allocation-chart';
import { PerformanceChart } from '@/components/charts/performance-chart';
import { MetricCard } from '@/components/dashboard/metric-card';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Shield, Droplets, RefreshCw } from 'lucide-react';

interface DashboardData {
  allocation: any;
  performance: any[];
  metrics: {
    forwardYield: number;
    maxDrawdown: number;
    dailyLiquidity: number;
    totalValue: number;
    monthlyChange: number;
    volatility: number;
  };
  insights: string[];
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allocationRes, performanceRes, metricsRes] = await Promise.all([
        fetch('/api/portfolio/allocation'),
        fetch('/api/portfolio/performance'),
        fetch('/api/portfolio/metrics'),
      ]);

      if (!allocationRes.ok || !performanceRes.ok || !metricsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [allocation, performance, metrics] = await Promise.all([
        allocationRes.json(),
        performanceRes.json(),
        metricsRes.json(),
      ]);

      // Generate insights using LLM API
      const insightsRes = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocation, performance, metrics }),
      });

      const insights = insightsRes.ok 
        ? (await insightsRes.json()).insights 
        : ['Portfolio analysis in progress...'];

      setData({
        allocation,
        performance,
        metrics,
        insights,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for refresh events
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('dataRefresh', handleRefresh);
    
    return () => window.removeEventListener('dataRefresh', handleRefresh);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-destructive mb-4">⚠️ {error}</div>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const { allocation, performance, metrics, insights } = data;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Forward Yield"
          value={metrics.forwardYield}
          format="percentage"
          icon={TrendingUp}
          trend={metrics.forwardYield > 4.0 ? 'up' : 'down'}
          description="Target: 4-5%"
        />
        <MetricCard
          title="Max Drawdown"
          value={metrics.maxDrawdown}
          format="percentage"
          icon={Shield}
          trend={metrics.maxDrawdown < 15 ? 'up' : 'down'}
          description="Target: <15%"
        />
        <MetricCard
          title="Daily Liquidity"
          value={metrics.dailyLiquidity}
          format="percentage"
          icon={Droplets}
          trend={metrics.dailyLiquidity > 80 ? 'up' : 'down'}
          description="Target: 85%"
        />
        <MetricCard
          title="Portfolio Value"
          value={metrics.totalValue}
          format="currency"
          icon={DollarSign}
          trend={metrics.monthlyChange > 0 ? 'up' : 'down'}
          description={`${metrics.monthlyChange > 0 ? '+' : ''}${metrics.monthlyChange.toFixed(2)}% this month`}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>5-sleeve allocation vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <PortfolioAllocationChart data={allocation} />
            </div>
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Performance vs Benchmarks</CardTitle>
            <CardDescription>1-year trailing performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <PerformanceChart data={performance} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Panel */}
      <InsightsPanel insights={insights} />
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-card/50 rounded-xl animate-shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-[500px] bg-card/50 rounded-xl animate-shimmer" />
        ))}
      </div>
      <div className="h-40 bg-card/50 rounded-xl animate-shimmer" />
    </div>
  );
}
