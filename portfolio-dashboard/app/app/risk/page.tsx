
import { MainLayout } from '@/components/layout/main-layout';
import { RiskAnalysis } from '@/components/risk/risk-analysis';

export default function RiskPage() {
  return (
    <MainLayout 
      title="Risk Analysis" 
      subtitle="Portfolio risk assessment and stress testing scenarios"
    >
      <RiskAnalysis />
    </MainLayout>
  );
}
