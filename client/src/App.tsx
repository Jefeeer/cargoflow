import { Routes, Route } from 'react-router-dom';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import HomePage from '@/pages/HomePage';
import QuotePage from '@/pages/QuotePage';
import ContactPage from '@/pages/ContactPage';
import AviationPage from '@/pages/AviationPage';
import FreightPage from '@/pages/FreightPage';
import BusinessShippingPage from '@/pages/BusinessShippingPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/aviation" element={<AviationPage />} />
          <Route path="/freight" element={<FreightPage />} />
          <Route path="/business-shipping" element={<BusinessShippingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
