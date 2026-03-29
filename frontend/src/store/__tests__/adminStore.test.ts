import { beforeEach, describe, expect, it } from 'vitest';
import { useAdminStore } from '@/store/adminStore';

// Reset store state before each test
beforeEach(() => {
  useAdminStore.setState({
    isAuthenticated: false,
    email: 'admin@modavance.com',
    password: 'admin123',
  });
});

describe('adminStore.login', () => {
  it('returns true and sets isAuthenticated when password is correct', () => {
    const { login } = useAdminStore.getState();
    const result = login('admin123');

    expect(result).toBe(true);
    expect(useAdminStore.getState().isAuthenticated).toBe(true);
  });

  it('returns false and leaves isAuthenticated false when password is wrong', () => {
    const { login } = useAdminStore.getState();
    const result = login('wrongpassword');

    expect(result).toBe(false);
    expect(useAdminStore.getState().isAuthenticated).toBe(false);
  });

  it('returns false for empty password', () => {
    const result = useAdminStore.getState().login('');
    expect(result).toBe(false);
  });
});

describe('adminStore.logout', () => {
  it('sets isAuthenticated to false after login', () => {
    useAdminStore.setState({ isAuthenticated: true });
    useAdminStore.getState().logout();
    expect(useAdminStore.getState().isAuthenticated).toBe(false);
  });
});

describe('adminStore.changePassword', () => {
  it('returns true and updates password when current password is correct', () => {
    const result = useAdminStore.getState().changePassword('admin123', 'newpassword99');

    expect(result).toBe(true);
    expect(useAdminStore.getState().password).toBe('newpassword99');
  });

  it('returns false and does not change password when current is wrong', () => {
    const result = useAdminStore.getState().changePassword('wrongcurrent', 'newpassword99');

    expect(result).toBe(false);
    expect(useAdminStore.getState().password).toBe('admin123');
  });

  it('new password works for subsequent login', () => {
    useAdminStore.getState().changePassword('admin123', 'securepass42');
    useAdminStore.setState({ isAuthenticated: false });

    const ok = useAdminStore.getState().login('securepass42');
    expect(ok).toBe(true);
    expect(useAdminStore.getState().isAuthenticated).toBe(true);
  });

  it('old password no longer works after change', () => {
    useAdminStore.getState().changePassword('admin123', 'securepass42');
    useAdminStore.setState({ isAuthenticated: false });

    const ok = useAdminStore.getState().login('admin123');
    expect(ok).toBe(false);
  });
});

describe('adminStore.changeEmail', () => {
  it('updates the email', () => {
    useAdminStore.getState().changeEmail('newemail@example.com');
    expect(useAdminStore.getState().email).toBe('newemail@example.com');
  });

  it('accepts any string as email (validation is in the UI layer)', () => {
    useAdminStore.getState().changeEmail('');
    expect(useAdminStore.getState().email).toBe('');
  });
});
