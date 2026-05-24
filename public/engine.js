/**
 * ScrambleFix – Client-Side Word Engine
 * Replaces the Netlify serverless function.
 * Zero server calls. Zero credits burned. Instant results.
 *
 * Depends on: words.js  (must be loaded BEFORE this script)
 * words.js must expose:  window.WORDS = ["aa","ab","ace", ...];
 * ─────────────────────────────────────────────────────────────
 */

(function (global) {
  "use strict";

  // ── Internal helpers ───────────────────────────────────────────────────────

  /**
   * Build a letter-frequency map for a string.
   * e.g. "apple" → { a:1, p:2, l:1, e:1 }
   */
  function letterFreq(str) {
    const map = {};
    for (const ch of str) map[ch] = (map[ch] || 0) + 1;
    return map;
  }

  /**
   * Returns true if every letter in `word` can be formed
   * using the available letters in `availFreq`.
   */
  function canForm(word, availFreq) {
    const wf = letterFreq(word);
    for (const [ch, count] of Object.entries(wf)) {
      if ((availFreq[ch] || 0) < count) return false;
    }
    return true;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * ScrambleEngine.solve(letters, options)
   *
   * @param {string} letters  – raw scrambled input, e.g. "retab"
   * @param {object} options
   *   @param {number}  [options.minLength=2]   – minimum word length
   *   @param {number}  [options.maxLength]      – maximum word length (default: letters.length)
   *   @param {boolean} [options.exactLength]    – only return words == letters.length
   *   @param {string}  [options.mustContain]    – word must contain this substring
   *   @param {string}  [options.startsWith]     – word must start with this
   *   @param {string}  [options.endsWith]       – word must end with this
   *   @param {string}  [options.sort]           – "length-desc" | "length-asc" | "alpha" (default: length-desc)
   *
   * @returns {{ words: string[], grouped: Object, stats: Object }}
   */
  function solve(letters, options = {}) {
    const start = performance.now();

    if (!global.WORDS || !Array.isArray(global.WORDS)) {
      console.error("[ScrambleFix] window.WORDS not found. Make sure words.js is loaded first.");
      return { words: [], grouped: {}, stats: { error: "Dictionary not loaded" } };
    }

    const clean     = letters.toLowerCase().replace(/[^a-z]/g, "");
    if (!clean) return { words: [], grouped: {}, stats: { total: 0, time: 0 } };

    const availFreq = letterFreq(clean);
    const maxLen    = options.maxLength  || clean.length;
    const minLen    = options.minLength  || 2;

    // Filter the dictionary
    let results = global.WORDS.filter((word) => {
      // Length gates (fast rejection)
      if (word.length < minLen)   return false;
      if (word.length > maxLen)   return false;
      if (options.exactLength && word.length !== clean.length) return false;

      // Optional pattern filters
      if (options.mustContain && !word.includes(options.mustContain)) return false;
      if (options.startsWith  && !word.startsWith(options.startsWith)) return false;
      if (options.endsWith    && !word.endsWith(options.endsWith))     return false;

      // Core: can this word be formed from available letters?
      return canForm(word, availFreq);
    });

    // Sort
    const sortMode = options.sort || "length-desc";
    if (sortMode === "length-desc") {
      results.sort((a, b) => b.length - a.length || a.localeCompare(b));
    } else if (sortMode === "length-asc") {
      results.sort((a, b) => a.length - b.length || a.localeCompare(b));
    } else {
      results.sort((a, b) => a.localeCompare(b));
    }

    // Group by word length
    const grouped = {};
    for (const word of results) {
      const len = word.length;
      if (!grouped[len]) grouped[len] = [];
      grouped[len].push(word);
    }

    const elapsed = (performance.now() - start).toFixed(1);

    return {
      words: results,
      grouped,
      stats: {
        total:        results.length,
        inputLength:  clean.length,
        timeMs:       elapsed,
        byLength:     Object.fromEntries(
          Object.entries(grouped).map(([k, v]) => [k, v.length])
        ),
      },
    };
  }

  // Expose globally
  global.ScrambleEngine = { solve };

})(window);
