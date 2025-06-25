
'use client';

import dynamic from 'next/dynamic';
import { SLEEVE_CONFIG } from '@/lib/types';

// @ts-ignore
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Loading treemap...</div>
});

interface TreemapProps {
  data: any[];
  loading: boolean;
}

export function PortfolioTreemap({ data, loading }: TreemapProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading portfolio treemap...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No portfolio data available
      </div>
    );
  }

  // Prepare treemap data
  const treemapData: any = {
    type: 'treemap',
    labels: data.map(item => item.ticker),
    parents: data.map(item => SLEEVE_CONFIG[item.sleeve]?.name || 'Portfolio'),
    values: data.map(item => item.currentAllocation || item.targetAllocation || 1),
    textinfo: 'label+value',
    texttemplate: '%{label}<br>%{value:.1f}%',
    hovertemplate: '%{label}<br>Allocation: %{value:.1f}%<br>Sleeve: %{parent}<extra></extra>',
    marker: {
      colorscale: [
        [0, '#60B5FF'], [0.2, '#FF9149'], [0.4, '#FF9898'], 
        [0.6, '#FF90BB'], [0.8, '#80D8C3'], [1, '#A19AD3']
      ],
      showscale: false,
    },
  };

  const layout: any = {
    title: false,
    font: { color: '#E8E8E8', size: 12 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { t: 20, r: 20, b: 20, l: 20 },
    hoverlabel: {
      bgcolor: '#2D3748',
      font: { size: 13, color: '#E8E8E8' },
      align: 'left',
    },
  };

  const config: any = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      "autoScale2d", "autoscale", "editInChartStudio", "editinchartstudio", 
      "hoverCompareCartesian", "hovercompare", "lasso", "lasso2d", "pan", 
      "pan2d", "resetViews", "select", "select2d", "sendDataToCloud", 
      "senddatatocloud", "toggleHover", "toggleSpikelines", "togglehover", 
      "togglespikelines", "zoom", "zoom2d", "zoomIn2d", "zoomOut2d"
    ]
  };

  return (
    <Plot
      data={[treemapData]}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
