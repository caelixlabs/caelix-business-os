import { PasswordHasherService } from '@/common/security/password-hasher.service';

describe('PasswordHasherService', () => {
  let service: PasswordHasherService;

  beforeEach(() => {
    service = new PasswordHasherService();
  });

  describe('hash', () => {
    it('produces a bcrypt hash, never the plain text', async () => {
      const hash = await service.hash('correct-horse-battery-staple');

      expect(hash).not.toBe('correct-horse-battery-staple');
      // bcrypt hash format: $2b$<cost>$<22-char salt><31-char hash>
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
    });

    it('produces a different hash for the same password each time (random salt)', async () => {
      const [hashA, hashB] = await Promise.all([
        service.hash('same-password'),
        service.hash('same-password'),
      ]);

      expect(hashA).not.toBe(hashB);
    });
  });

  describe('compare', () => {
    it('returns true for the correct password against its own hash', async () => {
      const hash = await service.hash('correct-password');

      await expect(service.compare('correct-password', hash)).resolves.toBe(true);
    });

    it('returns false for an incorrect password', async () => {
      const hash = await service.hash('correct-password');

      await expect(service.compare('wrong-password', hash)).resolves.toBe(false);
    });

    it('returns false rather than throwing for a malformed hash', async () => {
      await expect(service.compare('anything', 'not-a-real-bcrypt-hash')).resolves.toBe(false);
    });
  });
});
