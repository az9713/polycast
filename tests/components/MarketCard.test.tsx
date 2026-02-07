import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarketCard from '@/components/MarketCard';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('MarketCard', () => {
  const defaultProps = {
    id: 'market-1',
    title: 'Will BTC be above $110K?',
    category: 'crypto',
    yes_price: 0.65,
    no_price: 0.35,
    volume: 125000,
    resolution_date: '2026-12-31',
    status: 'open',
  };

  it('should render the market title', () => {
    render(<MarketCard {...defaultProps} />);
    expect(screen.getByText('Will BTC be above $110K?')).toBeDefined();
  });

  it('should render category badge', () => {
    render(<MarketCard {...defaultProps} />);
    expect(screen.getByText('crypto')).toBeDefined();
  });

  it('should display YES percentage', () => {
    render(<MarketCard {...defaultProps} />);
    expect(screen.getByText('65%')).toBeDefined();
  });

  it('should display NO percentage', () => {
    render(<MarketCard {...defaultProps} />);
    expect(screen.getByText('35%')).toBeDefined();
  });

  it('should display formatted volume', () => {
    render(<MarketCard {...defaultProps} />);
    expect(screen.getByText('$125K')).toBeDefined();
  });

  it('should link to market detail page', () => {
    render(<MarketCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/markets/market-1');
  });

  it('should handle different categories', () => {
    const { rerender } = render(<MarketCard {...defaultProps} category="ai" />);
    expect(screen.getByText('ai')).toBeDefined();

    rerender(<MarketCard {...defaultProps} category="politics" />);
    expect(screen.getByText('politics')).toBeDefined();
  });

  it('should handle 50/50 pricing', () => {
    render(<MarketCard {...defaultProps} yes_price={0.50} no_price={0.50} />);
    const fiftyElements = screen.getAllByText('50%');
    expect(fiftyElements).toHaveLength(2);
  });
});
