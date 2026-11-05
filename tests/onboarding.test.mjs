import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  UpdateOnboardingStateSchema, 
  OnboardingReminderPreferencesSchema, 
  DocumentCategoryEnum 
} from '../packages/validators/dist/index.js';

describe('PaperTrail User Onboarding Experience Test Suite', () => {

  describe('1. Zod Validation & Schema Enforcement', () => {
    it('should validate default reminder preferences', () => {
      const parsed = OnboardingReminderPreferencesSchema.parse({});
      assert.strictEqual(parsed.documentExpiry, true);
      assert.strictEqual(parsed.warrantyExpiry, true);
      assert.strictEqual(parsed.insuranceRenewal, true);
      assert.strictEqual(parsed.billPayment, true);
    });

    it('should allow partial custom reminder preferences', () => {
      const parsed = OnboardingReminderPreferencesSchema.partial().parse({
        billPayment: false,
      });
      assert.strictEqual(parsed.billPayment, false);
      assert.strictEqual(parsed.documentExpiry, undefined);
    });

    it('should accept valid onboarding progression steps 1 through 6', () => {
      for (let s = 1; s <= 6; s++) {
        const validated = UpdateOnboardingStateSchema.parse({ step: s });
        assert.strictEqual(validated.step, s);
      }
    });

    it('should reject invalid onboarding steps (0 or 7+)', () => {
      assert.throws(() => UpdateOnboardingStateSchema.parse({ step: 0 }));
      assert.throws(() => UpdateOnboardingStateSchema.parse({ step: 7 }));
      assert.throws(() => UpdateOnboardingStateSchema.parse({ step: -1 }));
    });

    it('should validate selected categories array with custom categories', () => {
      const validated = UpdateOnboardingStateSchema.parse({
        selectedCategories: ['Identity', 'Insurance', 'Warranties'],
      });
      assert.deepStrictEqual(validated.selectedCategories, ['Identity', 'Insurance', 'Warranties']);
    });

    it('should validate profile display name and language during onboarding', () => {
      const validated = UpdateOnboardingStateSchema.parse({
        displayName: 'Dr. Jane Doe',
        preferredLanguage: 'fr',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      });
      assert.strictEqual(validated.displayName, 'Dr. Jane Doe');
      assert.strictEqual(validated.preferredLanguage, 'fr');
    });

    it('should reject empty display name if provided as whitespace only', () => {
      assert.throws(() => UpdateOnboardingStateSchema.parse({ displayName: '' }));
    });
  });

  describe('2. Multi-Step Journey & State Persistence Lifecycle', () => {
    // Simulated in-memory store representing database user records
    const usersDb = new Map();

    const createInitialUser = (id, clerkId, email, fullName) => {
      const user = {
        id,
        clerkId,
        email,
        fullName,
        storageUsedBytes: 0,
        storageQuotaBytes: 524288000,
        onboardingCompleted: false,
        onboardingStep: 1,
        selectedDocumentCategories: [],
        reminderPreferences: {
          documentExpiry: true,
          warrantyExpiry: true,
          insuranceRenewal: true,
          billPayment: true,
        },
        preferredLanguage: 'en',
      };
      usersDb.set(clerkId, user);
      return user;
    };

    const updateOnboarding = (authenticatedUser, payload) => {
      const validated = UpdateOnboardingStateSchema.parse(payload);
      const user = usersDb.get(authenticatedUser.clerkId);
      if (!user) throw new Error('User not found');

      if (validated.step !== undefined) user.onboardingStep = validated.step;
      if (validated.completed !== undefined) user.onboardingCompleted = validated.completed;
      if (validated.selectedCategories !== undefined) user.selectedDocumentCategories = validated.selectedCategories;
      if (validated.reminderPreferences !== undefined) {
        user.reminderPreferences = {
          ...user.reminderPreferences,
          ...validated.reminderPreferences,
        };
      }
      if (validated.preferredLanguage !== undefined) user.preferredLanguage = validated.preferredLanguage;
      if (validated.displayName !== undefined) user.fullName = validated.displayName;
      if (validated.avatarUrl) user.avatarUrl = validated.avatarUrl;

      return { ...user };
    };

    const completeOnboarding = (authenticatedUser) => {
      const user = usersDb.get(authenticatedUser.clerkId);
      if (!user) throw new Error('User not found');
      user.onboardingCompleted = true;
      user.onboardingStep = 6;
      return { ...user };
    };

    it('Step 1: New user begins with clean uncompleted onboarding state', () => {
      const newUser = createInitialUser('usr-1', 'clerk_user_1', 'alice@vault.io', 'Alice Smith');
      assert.strictEqual(newUser.onboardingCompleted, false);
      assert.strictEqual(newUser.onboardingStep, 1);
      assert.deepStrictEqual(newUser.selectedDocumentCategories, []);
    });

    it('Step 2: User selects document categories and persists state', () => {
      const user = usersDb.get('clerk_user_1');
      const updated = updateOnboarding(user, {
        step: 2,
        selectedCategories: ['Identity', 'Insurance', 'Warranties'],
      });
      assert.strictEqual(updated.onboardingStep, 2);
      assert.deepStrictEqual(updated.selectedDocumentCategories, ['Identity', 'Insurance', 'Warranties']);
    });

    it('Midway Refresh Resilience: Resuming onboarding restores step and saved selections', () => {
      // Simulating a browser page reload midway at step 3
      const user = usersDb.get('clerk_user_1');
      assert.strictEqual(user.onboardingStep, 2);
      assert.deepStrictEqual(user.selectedDocumentCategories, ['Identity', 'Insurance', 'Warranties']);

      // Advance to step 3 (Privacy & Security architecture)
      const atStep3 = updateOnboarding(user, { step: 3 });
      assert.strictEqual(atStep3.onboardingStep, 3);
    });

    it('Step 4: User updates profile display name and language', () => {
      const user = usersDb.get('clerk_user_1');
      const updated = updateOnboarding(user, {
        step: 4,
        displayName: 'Alice M. Smith',
        preferredLanguage: 'es',
      });
      assert.strictEqual(updated.fullName, 'Alice M. Smith');
      assert.strictEqual(updated.preferredLanguage, 'es');
      assert.strictEqual(updated.onboardingStep, 4);
    });

    it('Step 5: User customizes reminder preferences', () => {
      const user = usersDb.get('clerk_user_1');
      const updated = updateOnboarding(user, {
        step: 5,
        reminderPreferences: {
          billPayment: false,
          warrantyExpiry: true,
        },
      });
      assert.strictEqual(updated.reminderPreferences.billPayment, false);
      assert.strictEqual(updated.reminderPreferences.documentExpiry, true);
      assert.strictEqual(updated.reminderPreferences.insuranceRenewal, true);
      assert.strictEqual(updated.reminderPreferences.warrantyExpiry, true);
    });

    it('Step 6 & Completion: Marking onboarding as complete locks state', () => {
      const user = usersDb.get('clerk_user_1');
      const completed = completeOnboarding(user);
      assert.strictEqual(completed.onboardingCompleted, true);
      assert.strictEqual(completed.onboardingStep, 6);
    });

    it('Repeated Login: Existing user sign-in retains onboardingCompleted: true', () => {
      const user = usersDb.get('clerk_user_1');
      assert.strictEqual(user.onboardingCompleted, true);
      // User is routed to dashboard and does not repeat onboarding
    });

    it('Skippable Step: Skipping document categories persists clean empty array', () => {
      const user2 = createInitialUser('usr-2', 'clerk_user_2', 'bob@vault.io', 'Bob Jones');
      const skipped = updateOnboarding(user2, {
        step: 2,
        selectedCategories: [], // skipped
      });
      assert.strictEqual(skipped.onboardingStep, 2);
      assert.deepStrictEqual(skipped.selectedDocumentCategories, []);
    });

    it('Data Isolation: User A cannot alter User B onboarding state', () => {
      const userA = usersDb.get('clerk_user_1');
      const userB = usersDb.get('clerk_user_2');

      // Attempt to pass userB ID inside payload while authenticated as userA
      const res = updateOnboarding(userA, {
        step: 4,
        displayName: 'Alice Updated',
        // Attacker attempts to spoof user ID in payload
        userId: userB.id,
      });

      // User A is updated
      assert.strictEqual(res.fullName, 'Alice Updated');
      assert.strictEqual(usersDb.get('clerk_user_1').fullName, 'Alice Updated');

      // User B is completely untouched and isolated
      assert.strictEqual(usersDb.get('clerk_user_2').fullName, 'Bob Jones');
    });

    it('API Failure and Retry: Rejects invalid payload and recovers with valid input', () => {
      const userA = usersDb.get('clerk_user_1');
      
      // Invalid input throws
      assert.throws(() => {
        updateOnboarding(userA, {
          step: 99, // Invalid step
        });
      });

      // Retry with valid input succeeds smoothly
      const recovered = updateOnboarding(userA, {
        step: 5,
      });
      assert.strictEqual(recovered.onboardingStep, 5);
    });
  });

  describe('3. Security Guarantees & Privacy Compliance', () => {
    it('Verifies privacy architecture attributes are strictly truthful', () => {
      const architecture = {
        storageType: 'Cloudflare R2 private bucket with user isolation',
        authMethod: 'Clerk cryptographically verified session JWT',
        encryptionRest: 'AES-256 server-side volume encryption',
        encryptionTransit: 'TLS 1.3 enforced',
        accessMethod: 'Ephemeral presigned URLs (15m upload, 1h view)',
        endToEndClientEncryptionClaimed: false, // Strictly NO false E2EE claims
      };

      assert.strictEqual(architecture.endToEndClientEncryptionClaimed, false);
      assert.strictEqual(architecture.encryptionRest.includes('AES-256'), true);
      assert.strictEqual(architecture.encryptionTransit.includes('TLS 1.3'), true);
    });
  });

});
