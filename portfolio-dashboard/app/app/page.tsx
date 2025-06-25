
import { MainLayout } from '@/components/layout/main-layout';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';

export default function DashboardPage() {
  return (
    <MainLayout 
      title="Portfolio Dashboard" 
      subtitle="Liquidity-focused income portfolio analysis and performance metrics"
    >
      <DashboardOverview />
    </MainLayout>
  );
}
