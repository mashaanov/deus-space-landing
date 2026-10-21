# Administration review

The feature was implemented on `feature/block-content-admin`, with separate agents for the public content integration, backend and independent review.

The independent reviewer checked authentication and password hashing, session expiry and cookies, CSRF and Origin checks, persistent lockout and concurrent attempts, upload signatures and traversal, JSON structure validation and escaped public output.

Findings and resolutions:

- The URL heuristic classified the video label as a URL and prevented saving the seed. Removed that heuristic and added a regression integration test that saves the complete production seed, restarts storage and reads it back.
- Social-network labels containing spaces were also classified as URLs. URL checks now distinguish `groupLabels`/`form` text from address fields; regression coverage includes edited social labels.
- Duplicate entries could reuse identifiers and group slugs. New and duplicated objects now receive distinct `id`, `slug` and `popupId` values.
- Editing while a save/upload was pending could lose changes or incorrectly clear the dirty indicator. Fields, section navigation and mutation controls are disabled while an operation is pending.
- Browser smoke found the editor's missing React import under the project's classic JSX setup. Added the import and rebuilt.

Empty collections can be restored from the bundled schema, including empty string lists and all supported home block types. Uploaded media and saved content live outside tracked files and build artifacts. Resetting credentials is an operator action through the provisioning script; restarting the server invalidates all sessions.

Automated checks: `npm test` covers login/origin/CSRF, persistence/session expiry/logout, concurrent 20-attempt lockout across restart and expiry, upload type/traversal checks, content limits/URL/prototype validation, structural validation and full seed save/read after restart. Run `npm run build` for frontend compilation. CI runs these checks for every push.

The review accepted the requested HTTP deployment. Browser smoke is performed separately before production deployment. Existing calendar CSS and dependency bundling warnings are unrelated to this change.
