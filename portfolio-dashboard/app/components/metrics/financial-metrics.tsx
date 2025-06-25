
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, PieChart, Download } from 'lucide-react';

export function FinancialMetrics() {
  const [selectedInstrument, setSelectedInstrument] = useState('all');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'eps']);
  const [timeframe, setTimeframe] = useState('1Y');

  const instruments = ['NOBL', 'XYLD', 'IDU', 'SCHP', 'IEI', 'DBMF', 'BTAL', 'VNQ', 'SGOV'];
  const availableMetrics = [
    { id: 'revenue', name: 'Revenue', category: 'Financial' },
    { id: 'ebitda', name: 'EBITDA', category: 'Financial' },
    { id: 'eps', name: 'EPS', category: 'Financial' },
    { id: 'roce', name: 'ROCE', category: 'Ratios' },
    { id: 'debt_ratio', name: 'Debt Ratio', category: 'Ratios' },
    { id: 'yield', name: 'Dividend Yield', category: 'Income' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analysis Controls
          </CardTitle>
          <CardDescription>
            Configure your financial metrics analysis parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Instrument</label>
              <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Instruments</SelectItem>
                  {instruments.map(ticker => (
                    <SelectItem key={ticker} value={ticker}>
                      {ticker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="3Y">3 Years</SelectItem>
                  <SelectItem value="5Y">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Selected Metrics</label>
            <div className="flex flex-wrap gap-2">
              {availableMetrics.map(metric => (
                <Badge
                  key={metric.id}
                  variant={selectedMetrics.includes(metric.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedMetrics(prev => 
                      prev.includes(metric.id) 
                        ? prev.filter(m => m !== metric.id)
                        : [...prev, metric.id]
                    );
                  }}
                >
                  {metric.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Historical performance of selected metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Financial metrics charts will be displayed here
              <br />
              <small>Integrate with Financial Modeling Prep API for live data</small>
            </div>
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Comparative Analysis</CardTitle>
            <CardDescription>Cross-instrument metric comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Comparative bar charts will be displayed here
              <br />
              <small>Real-time data from FMP API integration</small>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
