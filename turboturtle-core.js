TURBO TURTLE — V2 MINIMAL MOON BOUNCE + INITIAL SCROLL INPUT GUARD
2026-10-24

IMPORTANT: This version is based EXACTLY on the two files in the rollback package that you recovered to.
No other modules, reveal, fixed logo, navbar, yellow ball, Lenis, or ScrollTrigger have been changed.

WHAT CHANGED (ONLY):
1. Core JS: home1_moon starts 0.5 seconds after the tt-loading class is cleared.
   Moon bounce duration is +15% (0.45 -> 0.5175 seconds; 0.6 -> 0.69 seconds).
   Repeat delay is reduced to keep the ~4-second repeat period.
2. Footer: homepage only, blocks wheel/touchmove/page-scroll keys while the
   preloader is running, during the reveal, and for 500ms after reveal completion.
   Then removes these event listeners. Emergency auto-release after 20 seconds.
   DOES NOT add any lenis.stop()/lenis.start(), or change CSS overflow.

INSTALL:
1. Back up current published Core and Webflow Before </body> Footer.
2. Replace GitHub turboturtle-core.js with TT_Core_MoonBounce_Only_v2_20261024.js.
3. Commit and copy the new SHA.
4. Replace Webflow Before </body> Footer with TT_Footer_ScrollInputGuard_Only_v2_20261024.txt.
5. In the Footer, change var commitSHA = "e66d731"; to the NEW Git SHA.
6. Publish and hard refresh. Leave Head and Electricity V4 unchanged.

TEST:
- Immediately try scrolling during preloader and during reveal: page should not move.
- 0.5 seconds after the wrapper reveal completes, scrolling should work.
- Moon first bounce should start at that time and last about 1.21 seconds.
- Verify mobile, desktop, and internal pages.

ROLLBACK: Restore the two original Core and Footer files (or old SHA/Footer).

NOTE: This is a low-risk first-step experiment, not a proven fix for all scroll rebound.
The existing delayed ScrollTrigger.refresh() 1450ms after reveal is intentionally unchanged.
Static syntax check passed, but no real-device browser test was possible.
