import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../helpers/renderWithProviders';
import AuthGuard from '../../app/components/AuthGuard';
import * as StacksProvider from '../../app/components/StacksProvider';

// Mock the StacksProvider
vi.mock('../../app/components/StacksProvider', () => ({
  useStacks: vi.fn(),
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    vi.mocked(StacksProvider.useStacks).mockReturnValue({
      userData: { profile: { stxAddress: { mainnet: 'ST123' } } },
      authenticate: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders fallback when user is not authenticated', () => {
    vi.mocked(StacksProvider.useStacks).mockReturnValue({
      userData: null,
      authenticate: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    vi.mocked(StacksProvider.useStacks).mockReturnValue({
      userData: null,
      authenticate: vi.fn(),
      signOut: vi.fn(),
    });

    renderWithProviders(
      <AuthGuard fallback={<div>Custom Fallback</div>}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('calls authenticate when connect wallet button is clicked', async () => {
    const authenticate = vi.fn();
    vi.mocked(StacksProvider.useStacks).mockReturnValue({
      userData: null,
      authenticate,
      signOut: vi.fn(),
    });

    const userEvent = (await import('@testing-library/user-event')).default.setup();

    renderWithProviders(<AuthGuard><div>Content</div></AuthGuard>);

    const button = screen.getByText('Connect Wallet');
    await userEvent.click(button);

    expect(authenticate).toHaveBeenCalledTimes(1);
  });
});


