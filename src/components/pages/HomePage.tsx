import React from 'react';
import MainLayout from '@/components/layout/MainLayout/MainLayout';
import BasicInfoSection from '@/components/portfolio/BasicInfo/BasicInfoSection';
import ExperienceSection from '@/components/portfolio/Experience/ExperienceSection';
import EducationSection from '@/components/portfolio/Education/EducationSection';
import CertificationsSection from '@/components/portfolio/Certifications/CertificationsSection';
import { getPortfolioData } from '@/services/portfolioService';

const HomePage: React.FC = () => {
  const data = getPortfolioData();

  return (
    <MainLayout>
      <BasicInfoSection data={data.basicInfo} />
      <ExperienceSection data={data.experience} />
      <EducationSection data={data.education} />
      <CertificationsSection data={data.certifications} />
    </MainLayout>
  );
};

export default HomePage;
