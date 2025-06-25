
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PortfolioTreemap } from '@/components/charts/portfolio-treemap';
import { InstrumentTable } from '@/components/portfolio/instrument-table';
import { PieChart, Table, Download } from 'lucide-react';

export function PortfolioDeepDive() {
  const [viewMode, setViewMode] = useState<'treemap' | 'table'>('treemap');
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch('/api/portfolio/instruments');
        if (response.ok) {
          const data = await response.json();
          setInstruments(data);
        }
      } catch (error) {
        console.error('Error fetching instruments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  const handleExport = () => {
    // Implement CSV export functionality
    console.log('Exporting portfolio data...');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'treemap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('treemap')}
              className="gap-2"
            >
              <PieChart className="w-4 h-4" />
              Treemap
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="gap-2"
            >
              <Table className="w-4 h-4" />
              Table
            </Button>
          </div>
          <Badge variant="outline">
            {instruments.length} Instruments
          </Badge>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Main Content */}
      {viewMode === 'treemap' ? (
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Portfolio Composition Treemap</CardTitle>
            <CardDescription>
              Visual representation of portfolio weights by instrument and sleeve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <PortfolioTreemap data={instruments} loading={loading} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Instruments</CardTitle>
            <CardDescription>
              Detailed view of all portfolio holdings with key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstrumentTable instruments={instruments} loading={loading} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
