import React from 'react';
import MainLayout from '@/components/layout/MainLayout/MainLayout';
import BasicInfoSection from '@/components/portfolio/BasicInfo/BasicInfoSection';
import ExperienceSection from '@/components/portfolio/Experience/ExperienceSection';
import EducationSection from '@/components/portfolio/Education/EducationSection';
import ExtrasSection from '@/components/portfolio/Extras/ExtrasSection';
import { getPortfolioData } from '@/services/portfolioService';

export const metadata = {
  title: 'Portfolio',
  description: 'My Professional Portfolio',
};

export default function Home() {
  const data = getPortfolioData();

  return (
    <MainLayout>
      <BasicInfoSection data={data.basicInfo} />
      <ExperienceSection data={data.experience} />
      <EducationSection data={data.education} />
      <ExtrasSection data={data.extras} />
    </MainLayout>
  );
}
