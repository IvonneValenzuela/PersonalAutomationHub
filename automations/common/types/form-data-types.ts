/**
 * -----------------------------------------------------------
 * Checkout Types — Data Models for Guest User & Billing Info
 * -----------------------------------------------------------
 * 
 * This file stores the TypeScript interfaces used across the
 * checkout flow. These interfaces define the structure of the
 * data required for:
 * 
 *  - Guest user details (email, first name, last name)
 *  - Billing address information (street, city, country, etc.)
 * 
 * Keeping these data models in a dedicated `types` directory 
 * ensures:
 *   • Clear separation of concerns
 *   • Reusability across Page Objects and tests
 *   • Cleaner, more maintainable project architecture
 * 
 * These types are reusable for:
 *   - Form filling in Page Objects
 *   - Test data fixtures
 *   - Validation of user or address objects
 * 
 * -----------------------------------------------------------
 */

export interface GuestUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}
