---
title: Coding Style
parent: Development
nav_order: 2
---

# Coding Style

BUG makes heavy use of the open-source Material UI framework, but in terms of code mostly follows the Airbnb Node.js style guide: https://github.com/airbnb/javascript

This page covers both coding conventions and frontend UI guidelines specific to BUG modules and panels.

---

## Naming Conventions

- The core service is called the system.
- Settings refer to global system configuration.
- Panels are edited, and changes are saved.
- A module represents a capability of BUG, usually device control.
- A panel is an instance of a module.
- Config refers to an individual panel's configuration.

---

## General Coding Guidelines

- Return early from functions where possible to avoid deeply nested conditionals. Follow the principle: Return Early, Return Simple.
- Destructure props and objects early to improve readability.
- Use clear and descriptive variable names, e.g., returnedDeviceDetails instead of item.
- Write code that is self-explanatory; comments are only necessary for non-obvious logic or clarifications.
- Keep functions small and focused; ideally, each function should do one thing.
- Prefer async/await syntax over raw promises for clarity in asynchronous code.
- Consistently handle errors by logging and rethrowing or returning structured error objects.

---

## Material Design Guidelines

As Material UI implements Google's Material Design guidelines, we recommend following these to help keep BUG modules consistent and usable:

### Layout and Structure

- Use a consistent grid system (Material UI Grid) to align elements.
- Keep panels visually distinct using cards, dividers, and padding.
- Ensure responsive design; panels should look good on different screen sizes.
- Group related controls together; avoid scattering unrelated items.

### Form Controls

- Use the standard variant for configuration pages and forms.
- Use the outlined variant for controls in main pages or for direct device interactions.
- Keep labels consistent and visible; provide helper text or placeholders when needed.
- Validate forms and clearly show errors using Material UI components.

### Buttons and Actions

- Keep actions predictable and consistent (e.g., Save / Cancel).
- Use primary color for main actions and secondary color for less important actions.
- When performing significant destructive actions, show a confirmation dialog.
- Consider if a confirmation is really necessary; avoid dialogs if the item is easily re-added or created.
- Reuse existing BUG Core UI controls wherever possible; avoid developing your own custom controls.

### Feedback and Status

- Provide loading indicators when performing asynchronous operations.
- Use Snackbars or alerts to inform users of success, errors, or other status changes.
- Separate UI state from config state; save operations should have their own feedback.

### Icons and Visual Language

- Use Material UI icons consistently. Each module may have its own icon, but style should match the rest of BUG.
- Do not rely solely on color; always provide text labels for accessibility.

### Accessibility

- Ensure all interactive elements are keyboard-navigable.
- Provide aria labels for buttons and controls where needed.
- Maintain high contrast for readability.

---

Following these conventions ensures BUG code and UI is **readable, maintainable, consistent, and user-friendly** across all modules and panels.
