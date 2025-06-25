
import { MainLayout } from '@/components/layout/main-layout';
import { Settings } from '@/components/settings/settings';

export default function SettingsPage() {
  return (
    <MainLayout 
      title="Settings" 
      subtitle="Configuration and preferences for your portfolio dashboard"
    >
      <Settings />
    </MainLayout>
  );
}
