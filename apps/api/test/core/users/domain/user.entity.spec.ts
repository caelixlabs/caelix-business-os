import { UserStatus } from '@/core/users';
import { User } from '@/core/users/domain/entities/user.entity';
import { UserRegisteredEvent } from '@/core/users/domain/events';

describe('User', () => {
  describe('register', () => {
    it('creates an ACTIVE user and records UserRegisteredEvent', () => {
      const user = User.register({
        id: 'user-1',
        organizationId: 'org-1',
        email: 'Jane@Example.com',
        passwordHash: 'hashed',
        firstName: 'Jane',
        lastName: 'Doe',
      });

      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.fullName).toBe('Jane Doe');

      const events = user.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserRegisteredEvent);
      expect((events[0] as UserRegisteredEvent).organizationId).toBe('org-1');
    });

    it('normalizes email to lowercase and trims names', () => {
      const user = User.register({
        id: 'user-1',
        organizationId: 'org-1',
        email: 'Jane@Example.com',
        passwordHash: 'hashed',
        firstName: '  Jane  ',
        lastName: '  Doe  ',
      });

      expect(user.email).toBe('jane@example.com');
      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Doe');
    });

    it('assigns branchId when provided, leaves it undefined otherwise', () => {
      const withBranch = User.register({
        id: 'user-1',
        organizationId: 'org-1',
        branchId: 'branch-1',
        email: 'a@b.com',
        passwordHash: 'hashed',
        firstName: 'A',
        lastName: 'B',
      });
      expect(withBranch.branchId).toBe('branch-1');

      const withoutBranch = User.register({
        id: 'user-2',
        organizationId: 'org-1',
        email: 'c@d.com',
        passwordHash: 'hashed',
        firstName: 'C',
        lastName: 'D',
      });
      expect(withoutBranch.branchId).toBeUndefined();
    });
  });

  describe('recordLogin', () => {
    it('sets lastLoginAt without recording a domain event', () => {
      const user = User.register({
        id: 'user-1',
        organizationId: 'org-1',
        email: 'a@b.com',
        passwordHash: 'hashed',
        firstName: 'A',
        lastName: 'B',
      });
      user.pullDomainEvents(); // clear registration event

      expect(user.lastLoginAt).toBeUndefined();
      user.recordLogin();

      expect(user.lastLoginAt).toBeInstanceOf(Date);
      expect(user.pullDomainEvents()).toHaveLength(0);
    });
  });

  describe('suspend / reactivate', () => {
    it('transitions status correctly', () => {
      const user = User.register({
        id: 'user-1',
        organizationId: 'org-1',
        email: 'a@b.com',
        passwordHash: 'hashed',
        firstName: 'A',
        lastName: 'B',
      });

      user.suspend();
      expect(user.status).toBe(UserStatus.SUSPENDED);

      user.reactivate();
      expect(user.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('changePasswordHash', () => {
    it('replaces the stored hash', () => {
      const user = User.register({
        id: 'user-1',
        organizationId: 'org-1',
        email: 'a@b.com',
        passwordHash: 'old-hash',
        firstName: 'A',
        lastName: 'B',
      });

      user.changePasswordHash('new-hash');
      expect(user.passwordHash).toBe('new-hash');
    });
  });
});
