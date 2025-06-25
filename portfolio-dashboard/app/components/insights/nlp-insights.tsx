
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, FileText, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export function NLPInsights() {
  const [selectedInstrument, setSelectedInstrument] = useState('NOBL');
  const [analysisType, setAnalysisType] = useState('all');

  const instruments = ['NOBL', 'XYLD', 'IDU', 'SCHP', 'IEI', 'DBMF', 'VNQ', 'SGOV'];

  // Simulated NLP analysis results
  const sentimentData = {
    overall: 0.65, // 0.65 = 65% positive
    management: 0.72,
    outlook: 0.58,
    risks: -0.23,
  };

  const keyThemes = [
    { theme: 'Dividend Growth', frequency: 89, sentiment: 0.8 },
    { theme: 'Interest Rates', frequency: 76, sentiment: -0.2 },
    { theme: 'Market Volatility', frequency: 64, sentiment: -0.4 },
    { theme: 'Economic Recovery', frequency: 52, sentiment: 0.6 },
    { theme: 'Inflation Hedge', frequency: 45, sentiment: 0.3 },
    { theme: 'Liquidity Concerns', frequency: 28, sentiment: -0.5 },
  ];

  const forwardLookingStatements = [
    {
      statement: "We expect continued dividend growth in line with our long-term strategy",
      sentiment: 0.7,
      confidence: 85,
      source: "Q3 2024 Earnings Call"
    },
    {
      statement: "Market conditions may remain challenging in the near term",
      sentiment: -0.3,
      confidence: 72,
      source: "10-K Filing"
    },
    {
      statement: "Strong balance sheet positions us well for future opportunities",
      sentiment: 0.8,
      confidence: 91,
      source: "Annual Report"
    }
  ];

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-400';
    if (sentiment < -0.3) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.3) return <TrendingUp className="w-4 h-4" />;
    if (sentiment < -0.3) return <TrendingDown className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Analysis Configuration
          </CardTitle>
          <CardDescription>
            Configure NLP analysis parameters for financial document analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Instrument</label>
              <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {instruments.map(ticker => (
                    <SelectItem key={ticker} value={ticker}>
                      {ticker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Analysis Type</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  <SelectItem value="earnings">Earnings Calls</SelectItem>
                  <SelectItem value="filings">SEC Filings</SelectItem>
                  <SelectItem value="reports">Annual Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Overall sentiment from financial communications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(sentimentData).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <span className={`text-sm font-mono ${getSentimentColor(score)}`}>
                    {(score * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={Math.abs(score) * 100} 
                  className={`h-2 ${score >= 0 ? 'text-green-400' : 'text-red-400'}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Themes</CardTitle>
            <CardDescription>Most frequently mentioned topics and their sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keyThemes.map((theme, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/50">
                  <div className="flex items-center gap-3">
                    {getSentimentIcon(theme.sentiment)}
                    <div>
                      <span className="font-medium text-sm">{theme.theme}</span>
                      <div className="text-xs text-muted-foreground">
                        Mentioned {theme.frequency} times
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={getSentimentColor(theme.sentiment)}>
                    {theme.sentiment > 0 ? '+' : ''}{(theme.sentiment * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forward-Looking Statements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Forward-Looking Statements
          </CardTitle>
          <CardDescription>
            Key forward-looking statements extracted from recent communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forwardLookingStatements.map((statement, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/10 border border-border/50">
                <div className="flex items-start gap-3">
                  {getSentimentIcon(statement.sentiment)}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed mb-2">"{statement.statement}"</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Source: {statement.source}</span>
                      <span>Confidence: {statement.confidence}%</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSentimentColor(statement.sentiment)}`}
                      >
                        {statement.sentiment > 0 ? 'Positive' : statement.sentiment < 0 ? 'Negative' : 'Neutral'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
