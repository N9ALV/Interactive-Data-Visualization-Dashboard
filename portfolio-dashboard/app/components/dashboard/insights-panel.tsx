
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

interface InsightsPanelProps {
  insights: string[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getInsightIcon = (insight: string) => {
    if (insight.toLowerCase().includes('risk') || insight.toLowerCase().includes('concern')) {
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
    if (insight.toLowerCase().includes('opportunity') || insight.toLowerCase().includes('strong')) {
      return <TrendingUp className="w-4 h-4 text-success" />;
    }
    return <Lightbulb className="w-4 h-4 text-primary" />;
  };

  const getInsightType = (insight: string) => {
    if (insight.toLowerCase().includes('risk') || insight.toLowerCase().includes('concern')) {
      return 'Risk';
    }
    if (insight.toLowerCase().includes('opportunity') || insight.toLowerCase().includes('strong')) {
      return 'Opportunity';
    }
    return 'Insight';
  };

  return (
    <Card className="chart-container">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <CardTitle>AI-Generated Insights</CardTitle>
        </div>
        <CardDescription>
          Automated analysis of portfolio health and strategic position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/50"
            >
              {getInsightIcon(insight)}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getInsightType(insight)}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed">{insight}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
