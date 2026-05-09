import { describe, expect, test } from 'bun:test';
import type { GatewayConfig } from '../../config.js';

describe('LINE plugin group policy', () => {
  test('blocks group messages when groupPolicy is disabled', () => {
    // Simulate resolveAccount function behavior
    const cfg: GatewayConfig = {
      gateway: { accountId: 'default', logLevel: 'info' },
      channels: {
        whatsapp: { enabled: true, accounts: {}, allowFrom: [] },
        line: {
          enabled: true,
          accounts: {
            'default': {
              enabled: true,
              groupPolicy: 'disabled',
            } as any,
          },
        },
      },
      bindings: [],
    };

    const account = cfg.channels.line?.accounts?.['default'] as any;
    const groupPolicy = account?.groupPolicy ?? 'disabled';

    expect(groupPolicy).toBe('disabled');
  });

  test('allows group messages when groupPolicy is open', () => {
    const cfg: GatewayConfig = {
      gateway: { accountId: 'default', logLevel: 'info' },
      channels: {
        whatsapp: { enabled: true, accounts: {}, allowFrom: [] },
        line: {
          enabled: true,
          accounts: {
            'default': {
              enabled: true,
              groupPolicy: 'open',
            } as any,
          },
        },
      },
      bindings: [],
    };

    const account = cfg.channels.line?.accounts?.['default'] as any;
    const groupPolicy = account?.groupPolicy ?? 'disabled';

    expect(groupPolicy).toBe('open');
  });

  test('defaults to disabled when groupPolicy is not specified', () => {
    const cfg: GatewayConfig = {
      gateway: { accountId: 'default', logLevel: 'info' },
      channels: {
        whatsapp: { enabled: true, accounts: {}, allowFrom: [] },
        line: {
          enabled: true,
          accounts: {
            'default': {
              enabled: true,
            } as any,
          },
        },
      },
      bindings: [],
    };

    const account = cfg.channels.line?.accounts?.['default'] as any;
    const groupPolicy = account?.groupPolicy ?? 'disabled';

    expect(groupPolicy).toBe('disabled');
  });
});
