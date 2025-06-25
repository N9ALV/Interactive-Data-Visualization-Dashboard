
import { MainLayout } from '@/components/layout/main-layout';
import { FinancialMetrics } from '@/components/metrics/financial-metrics';

export default function MetricsPage() {
  return (
    <MainLayout 
      title="Financial Metrics" 
      subtitle="Performance analysis and financial data visualization"
    >
      <FinancialMetrics />
    </MainLayout>
  );
}
