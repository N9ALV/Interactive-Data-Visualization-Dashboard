
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings as SettingsIcon, Key, Bell, Palette, Database, CheckCircle } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    fmpApiKey: '',
    refreshInterval: '3600',
    defaultTimeframe: '1Y',
    theme: 'dark',
    enableNotifications: true,
    enableSP500: true,
    enableBondBench: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Load current settings
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await fetch('/api/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: settings.fmpApiKey }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setConnectionStatus('success');
      } else {
        console.error('API test failed:', data.error);
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus('error');
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      setSaveStatus(response.ok ? 'success' : 'error');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle');
  };

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Configure your Financial Modeling Prep API key and connection settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fmp-api-key">Financial Modeling Prep API Key</Label>
            <div className="flex gap-2">
              <Input
                id="fmp-api-key"
                type="password"
                placeholder="Enter your FMP API key"
                value={settings.fmpApiKey}
                onChange={(e) => updateSetting('fmpApiKey', e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={testConnection}
                disabled={connectionStatus === 'testing' || !settings.fmpApiKey}
              >
                {connectionStatus === 'testing' ? 'Testing...' : 'Test'}
              </Button>
            </div>
            {connectionStatus === 'success' && (
              <Alert className="border-green-500/20 bg-green-500/10">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  API connection successful!
                </AlertDescription>
              </Alert>
            )}
            {connectionStatus === 'error' && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  API connection failed. Please check your API key.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="refresh-interval">Data Refresh Interval</Label>
            <Select value={settings.refreshInterval} onValueChange={(value) => updateSetting('refreshInterval', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="900">15 minutes</SelectItem>
                <SelectItem value="1800">30 minutes</SelectItem>
                <SelectItem value="3600">1 hour</SelectItem>
                <SelectItem value="7200">2 hours</SelectItem>
                <SelectItem value="21600">6 hours</SelectItem>
                <SelectItem value="43200">12 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Dashboard Preferences
          </CardTitle>
          <CardDescription>
            Customize your dashboard appearance and default settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-timeframe">Default Timeframe</Label>
            <Select value={settings.defaultTimeframe} onValueChange={(value) => updateSetting('defaultTimeframe', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="3Y">3 Years</SelectItem>
                <SelectItem value="5Y">5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts for significant portfolio changes
              </p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Benchmark Comparisons
          </CardTitle>
          <CardDescription>
            Configure which benchmarks to display in performance comparisons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>S&P 500 Benchmark</Label>
              <p className="text-sm text-muted-foreground">
                Compare against S&P 500 index performance
              </p>
            </div>
            <Switch
              checked={settings.enableSP500}
              onCheckedChange={(checked) => updateSetting('enableSP500', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>30/70 Aggregate Bond Benchmark</Label>
              <p className="text-sm text-muted-foreground">
                Compare against 30/70 aggregate bond index
              </p>
            </div>
            <Switch
              checked={settings.enableBondBench}
              onCheckedChange={(checked) => updateSetting('enableBondBench', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        {saveStatus === 'success' && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Settings saved successfully
          </Badge>
        )}
        {saveStatus === 'error' && (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Error saving settings
          </Badge>
        )}
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
