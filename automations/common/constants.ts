import path from "path";
import type { Page } from "@playwright/test";

/* 🧭 Common constants for Playwright tests
 * ---------------------------------------------------
 * This file centralizes all timing and path constants
 * to keep the test suite consistent and easy to maintain.
 */
// ────────────────────────────────
// ⏱️ TIME - Always define time-based constants in milliseconds (ms)
// ────────────────────────────────
/**
 * Converts seconds to milliseconds.
 * Example: secondsToMs(3) → 3000
 */
export const secondsToMs = (seconds: number): number => seconds * 1000;


// ────────────────────────────────
// ⏱️ TIME CONSTANTS
// ────────────────────────────────

// Wait 3.1 seconds (used for standard waits)
export const waitThreeSeconds = secondsToMs(3.1);

// Hold 3.1 seconds (used for long-press or delayed clicks)
export const holdThreeSeconds = secondsToMs(3.1);

// Shorter and longer waits can be defined here too if needed:
export const waitOneSecond = secondsToMs(1);
export const waitFiveSeconds = secondsToMs(5);


// ────────────────────────────────
// 📂 FILE PATHS
// ────────────────────────────────

/**
 * Base path for PDF or asset files used during tests.
 * Adjust if you move your test assets to another folder.
 */
export const pdfTestPath = path.join(__dirname, '../../pdfprueba');

// ────────────────────────────────
// 🔄 PAGE LOAD STATES
// ────────────────────────────────

export async function waitForDomLoaded(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
}