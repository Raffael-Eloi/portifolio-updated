import { PortfolioData } from '@/models/types';
import portfolioData from '@/data/portfolio.json';

export const getPortfolioData = (): PortfolioData => {
  // In a real app, this might fetch from an API or database.
  // For now, it acts as a Controller returning the Model data.
  return portfolioData;
};
