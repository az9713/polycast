import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TradePanel from '@/components/TradePanel';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('TradePanel', () => {
  const defaultProps = {
    marketId: 'market-1',
    yesPrice: 0.60,
    noPrice: 0.40,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderLoggedIn() {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    return render(<TradePanel {...defaultProps} />);
  }

  function renderLoggedOut() {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    return render(<TradePanel {...defaultProps} />);
  }

  it('should render the trade panel title', async () => {
    renderLoggedIn();
    expect(screen.getByText('Place Order')).toBeDefined();
  });

  it('should show Buy Yes and Buy No buttons when logged in', async () => {
    renderLoggedIn();
    await waitFor(() => {
      expect(screen.getByText('Buy Yes')).toBeDefined();
      expect(screen.getByText('Buy No')).toBeDefined();
    });
  });

  it('should have price and shares inputs when logged in', async () => {
    renderLoggedIn();
    await waitFor(() => {
      expect(screen.getByLabelText('Price')).toBeDefined();
      expect(screen.getByLabelText('Shares')).toBeDefined();
    });
  });

  it('should default price to yes price', async () => {
    renderLoggedIn();
    await waitFor(() => {
      const priceInput = screen.getByLabelText('Price') as HTMLInputElement;
      expect(priceInput.value).toBe('0.60');
    });
  });

  it('should switch price when toggling side', async () => {
    renderLoggedIn();
    await waitFor(() => {
      expect(screen.getByText('Buy No')).toBeDefined();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Buy No'));
    });
    const priceInput = screen.getByLabelText('Price') as HTMLInputElement;
    expect(priceInput.value).toBe('0.40');
  });

  it('should show cost calculation when shares entered', async () => {
    renderLoggedIn();
    await waitFor(() => {
      expect(screen.getByLabelText('Shares')).toBeDefined();
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Shares'), { target: { value: '10' } });
    });
    expect(screen.getByText('$6.00')).toBeDefined();
  });

  it('should show potential payout', async () => {
    renderLoggedIn();
    await waitFor(() => {
      expect(screen.getByLabelText('Shares')).toBeDefined();
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Shares'), { target: { value: '10' } });
    });
    expect(screen.getByText('$10.00')).toBeDefined();
  });

  it('should show login button when not logged in', async () => {
    renderLoggedOut();
    await waitFor(() => {
      expect(screen.getByText('Log in to trade')).toBeDefined();
    });
  });
});
