import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the service
jest.mock('@/services/portfolioService', () => ({
  getPortfolioData: () => ({
    basicInfo: {
      name: "Test User",
      title: "Test Title",
      summary: "Test Summary",
      contact: { email: "test@example.com" }
    },
    experience: [
      {
        company: "Test Company",
        role: "Test Role",
        startDate: "2020",
        endDate: "Present",
        description: "Test Description"
      }
    ],
    education: [],
    extras: []
  })
}));

describe('Home Page', () => {
  it('renders the basic info', () => {
    render(<Home />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Summary')).toBeInTheDocument();
  });

  it('renders experience section', () => {
    render(<Home />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Test Role')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });
});
