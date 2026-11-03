# CodeRabbit Review Standards (Krushi Drushti)

Every commit, pull request, or feature branch must pass the CodeRabbit review gate.

## Critical Checks
1. **Model Pipeline**: Ensure image buffers from camera or upload are handled asynchronously without blocking the UI thread.
2. **Offline Resilience**: Essential features (local disease diagnostics, cached advisory tips) must not throw uncaught errors when disconnected from the internet.
3. **Data Sanitization**: Weather and Mandi market payloads must be validated against expected schemas before rendering into the DOM.
4. **Mobile Usability**: Any new component must render properly on viewports down to 360px width.
