/**
 * Otomatik çeviri bağlantısı bu sürümde yok.
 * LibreTranslate gibi bir servis sonra getTranslationProvider içine bağlanır.
 */

export type TranslationRequest = {
  text: string;
  sourceLocale: string;
  targetLocale: string;
};

export interface TranslationProvider {
  readonly id: string;
  isConfigured(): boolean;
  translate(request: TranslationRequest): Promise<string>;
}

export class TranslationNotConnectedError extends Error {
  constructor() {
    super("Çeviri servisi henüz bağlı değil.");
    this.name = "TranslationNotConnectedError";
  }
}

export class UnconfiguredTranslationProvider implements TranslationProvider {
  readonly id = "unconfigured";

  isConfigured() {
    return false;
  }

  async translate(): Promise<string> {
    throw new TranslationNotConnectedError();
  }
}

export function getTranslationProvider(): TranslationProvider {
  return new UnconfiguredTranslationProvider();
}
