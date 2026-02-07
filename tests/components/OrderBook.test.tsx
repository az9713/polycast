import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderBook from '@/components/OrderBook';

describe('OrderBook', () => {
  it('should render with empty order book', () => {
    render(<OrderBook yesBids={[]} noBids={[]} />);
    expect(screen.getAllByText('No orders')).toHaveLength(2);
  });

  it('should render yes bids', () => {
    const yesBids = [
      { price: 0.65, quantity: 100, filled_quantity: 0 },
      { price: 0.60, quantity: 50, filled_quantity: 10 },
    ];
    render(<OrderBook yesBids={yesBids} noBids={[]} />);
    expect(screen.getByText('65¢')).toBeDefined();
    expect(screen.getByText('60¢')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined(); // quantity for first bid
    expect(screen.getByText('40')).toBeDefined(); // 50 - 10 remaining
  });

  it('should render no bids', () => {
    const noBids = [
      { price: 0.40, quantity: 200, filled_quantity: 0 },
    ];
    render(<OrderBook yesBids={[]} noBids={noBids} />);
    expect(screen.getByText('40¢')).toBeDefined();
    expect(screen.getByText('200')).toBeDefined();
  });

  it('should render both sides', () => {
    const yesBids = [{ price: 0.65, quantity: 100, filled_quantity: 0 }];
    const noBids = [{ price: 0.35, quantity: 100, filled_quantity: 0 }];
    render(<OrderBook yesBids={yesBids} noBids={noBids} />);
    expect(screen.getByText('YES Bids')).toBeDefined();
    expect(screen.getByText('NO Bids')).toBeDefined();
  });

  it('should show column headers', () => {
    render(<OrderBook yesBids={[]} noBids={[]} />);
    expect(screen.getByText('YES Bids')).toBeDefined();
    expect(screen.getByText('NO Bids')).toBeDefined();
  });

  it('should limit to 8 levels per side', () => {
    const yesBids = Array.from({ length: 12 }, (_, i) => ({
      price: (99 - i) / 100,
      quantity: 10,
      filled_quantity: 0,
    }));
    render(<OrderBook yesBids={yesBids} noBids={[]} />);
    // Should only show 8 items, not 12
    const priceElements = screen.getAllByText(/¢$/);
    // Count YES side prices only (max 8)
    expect(priceElements.length).toBeLessThanOrEqual(8);
  });
});
