import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/layout/Layout';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { PrivacyNoticeArticle } from '@/components/privacy/PrivacyNoticeArticle';

export const Privacy: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>
        <PrivacyNoticeArticle language={i18n.language} />
      </div>
    </Layout>
  );
};
