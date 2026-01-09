import React from 'react';
import MainLayout from '@/components/templates/MainLayout/MainLayout';
import BasicInfoSection from '@/components/organisms/BasicInfoSection/BasicInfoSection';
import ExperienceSection from '@/components/organisms/ExperienceSection/ExperienceSection';
import EducationSection from '@/components/organisms/EducationSection/EducationSection';
import ExtrasSection from '@/components/organisms/ExtrasSection/ExtrasSection';
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
