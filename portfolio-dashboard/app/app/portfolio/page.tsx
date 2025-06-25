
import { MainLayout } from '@/components/layout/main-layout';
import { PortfolioDeepDive } from '@/components/portfolio/portfolio-deep-dive';

export default function PortfolioPage() {
  return (
    <MainLayout 
      title="Portfolio Deep Dive" 
      subtitle="Detailed portfolio composition and instrument analysis"
    >
      <PortfolioDeepDive />
    </MainLayout>
  );
}
