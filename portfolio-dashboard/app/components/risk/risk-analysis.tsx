
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, TrendingDown, AlertTriangle, Play } from 'lucide-react';

interface StressTestResults {
  maxDrawdown: number;
  totalLoss: number;
  recoveryTime: number;
}

export function RiskAnalysis() {
  const [selectedScenario, setSelectedScenario] = useState('2008-crisis');
  const [scenarios, setScenarios] = useState([]);
  const [stressTestResults, setStressTestResults] = useState<StressTestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Fetch stress test scenarios
    const fetchScenarios = async () => {
      try {
        const response = await fetch('/api/risk/scenarios');
        if (response.ok) {
          const data = await response.json();
          setScenarios(data);
        }
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };

    fetchScenarios();
  }, []);

  const runStressTest = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/risk/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: selectedScenario }),
      });
      
      if (response.ok) {
        const results = await response.json();
        setStressTestResults(results);
      }
    } catch (error) {
      console.error('Error running stress test:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const riskFactors = [
    { factor: 'Interest Rate Risk', level: 'Medium', description: 'Bond portfolio sensitivity to rate changes' },
    { factor: 'Equity Market Risk', level: 'Low', description: 'Limited equity exposure through diversification' },
    { factor: 'Liquidity Risk', level: 'Low', description: 'High daily liquidity across instruments' },
    { factor: 'Credit Risk', level: 'Very Low', description: 'Treasury and high-grade instruments' },
    { factor: 'Inflation Risk', level: 'Low', description: 'TIPS allocation provides inflation hedge' },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Very Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Very High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Factors Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Factors Assessment
          </CardTitle>
          <CardDescription>
            Key risk factors identified for the portfolio composition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/10 border border-border/50">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{risk.factor}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                </div>
                <Badge className={getRiskColor(risk.level)}>
                  {risk.level}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stress Testing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Stress Test Scenarios
            </CardTitle>
            <CardDescription>
              Run portfolio stress tests against historical scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Scenario</label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2008-crisis">2008 Financial Crisis</SelectItem>
                  <SelectItem value="covid-pandemic">COVID-19 Pandemic</SelectItem>
                  <SelectItem value="inflation-spike">Inflation Spike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={runStressTest} 
              disabled={isRunning}
              className="w-full gap-2"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Stress Test...' : 'Run Stress Test'}
            </Button>

            {stressTestResults && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Stress test completed. Maximum drawdown: {stressTestResults.maxDrawdown}%
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Drawdown Analysis</CardTitle>
            <CardDescription>Historical portfolio drawdown patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Drawdown chart will be displayed here
              <br />
              <small>Historical drawdown visualization</small>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
