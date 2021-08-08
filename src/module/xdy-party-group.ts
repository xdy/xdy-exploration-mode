/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: Jonas Karlsson
 * Content License: MIT
 * Software License: MIT
 */

// Import TypeScript modules
import { registerSettings } from './settings';
import { preloadTemplates } from './preloadTemplates';

// Initialize module
Hooks.once('init', async () => {
  console.log('xdy-party-group | Initializing xdy-party-group');

  // Assign custom classes and constants here

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
});

// Setup module
Hooks.once('setup', async () => {
  // Do anything after initialization but before ready
});

// When ready
Hooks.once('ready', async () => {
  // Do anything once the module is ready
});

// Add any additional hooks if necessary
