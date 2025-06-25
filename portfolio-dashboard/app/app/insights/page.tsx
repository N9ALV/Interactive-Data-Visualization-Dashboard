
import { MainLayout } from '@/components/layout/main-layout';
import { NLPInsights } from '@/components/insights/nlp-insights';

export default function InsightsPage() {
  return (
    <MainLayout 
      title="NLP Insights" 
      subtitle="AI-powered sentiment analysis and thematic insights from financial reports"
    >
      <NLPInsights />
    </MainLayout>
  );
}
