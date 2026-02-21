import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MotherPortal from './pages/MotherPortal';
import OnboardingFinder from './pages/OnboardingFinder';
import NGOIntelligence from './pages/NGOIntelligence';
import FundingScout from './pages/FundingScout';
import PriorityTargets from './pages/PriorityTargets';
import OutreachGenerator from './pages/OutreachGenerator';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mother-portal" element={<MotherPortal />} />
          <Route path="/onboarding-finder" element={<OnboardingFinder />} />
          <Route path="/ngo-intelligence" element={<NGOIntelligence />} />
          <Route path="/funding-scout" element={<FundingScout />} />
          <Route path="/priority-targets" element={<PriorityTargets />} />
          <Route path="/outreach" element={<OutreachGenerator />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
