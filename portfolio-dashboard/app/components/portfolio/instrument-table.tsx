
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SLEEVE_CONFIG } from '@/lib/types';
import { Search, ExternalLink } from 'lucide-react';

interface InstrumentTableProps {
  instruments: any[];
  loading: boolean;
}

export function InstrumentTable({ instruments, loading }: InstrumentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted/30 rounded animate-shimmer" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/20 rounded animate-shimmer" />
        ))}
      </div>
    );
  }

  const filteredInstruments = instruments.filter(instrument =>
    instrument.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instrument.fundName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInstruments = [...filteredInstruments].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSleeveBadge = (sleeve: string) => {
    const config = SLEEVE_CONFIG[sleeve];
    if (!config) return null;
    
    return (
      <Badge 
        variant="outline" 
        style={{ borderColor: config.color, color: config.color }}
        className="text-xs"
      >
        {config.id}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search instruments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('ticker')}
              >
                Ticker
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('fundName')}
              >
                Fund Name
              </TableHead>
              <TableHead>Sleeve</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 text-right"
                onClick={() => handleSort('currentAllocation')}
              >
                Allocation
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 text-right"
                onClick={() => handleSort('yield')}
              >
                Yield
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInstruments.map((instrument) => (
              <TableRow key={instrument.ticker} className="hover:bg-muted/10">
                <TableCell className="font-mono font-medium">
                  {instrument.ticker}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={instrument.fundName}>
                    {instrument.fundName}
                  </div>
                </TableCell>
                <TableCell>
                  {getSleeveBadge(instrument.sleeve)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {instrument.currentAllocation?.toFixed(1) || 
                   instrument.targetAllocation?.toFixed(1) || '0.0'}%
                </TableCell>
                <TableCell className="text-right font-mono">
                  {instrument.yield || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {instrument.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ExternalLink className="w-3 h-3" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedInstruments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No instruments found matching your search.
        </div>
      )}
    </div>
  );
}
