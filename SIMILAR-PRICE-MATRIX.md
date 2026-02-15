# Similar-Price Matrix Draft

## Concept

Instead of "Good/Better/Best at different prices," show **"3 ways to spend ~$X"**

User selects:
1. Genre (same as now)
2. Crowd size (same as now)
3. **NEW:** "Show me similar-priced options" vs "Show me Good/Better/Best tiers"

If they choose "similar-priced," we show 3 systems at roughly the same price point but with different philosophies.

---

## Budget Tiers

| Tier | Budget Range | Target Crowd |
|------|-------------|--------------|
| Entry | $8k - $12k | Under 100 |
| Starter | $15k - $25k | 100-300 |
| Pro | $30k - $50k | 300-500 |
| Large | $50k - $80k | 500-1,500 |
| Festival | $100k+ | 1,500+ |

---

## Philosophies (The 3 Options)

### Option A: "More Tops" 🔈🔈🔈
- More speaker coverage, less sub weight
- Best for: Wide venues, corporate, spoken word + music
- Trade-off: Less deep bass, more even coverage

### Option B: "More Subs" 🔊🔊🔊
- Fewer tops, more sub power
- Best for: Bass music, clubs, DJ events
- Trade-off: Less coverage width, more bass impact

### Option C: "Balanced / Portable" ⚖️
- Middle ground or emphasis on transportability
- Best for: Mobile DJs, versatile operators
- Trade-off: Jack of all trades

---

## Example Matrices

### ~$20k Budget (Starter Tier)

| Philosophy | Tops | Subs | Total | Best For |
|------------|------|------|-------|----------|
| More Tops | 4× DV12 | 2× SSP118 | ~$22k | Wide coverage |
| More Subs | 2× DV12 | 4× DJ18S | ~$21k | Bass-heavy |
| Balanced | 2× AT212 | 2× VS21 | ~$20k | Versatile |

### ~$40k Budget (Pro Tier)

| Philosophy | Tops | Subs | Total | Best For |
|------------|------|------|-------|----------|
| More Tops | 4× AT212 | 2× SSP218 | ~$32k | Wide throw |
| More Subs | 2× AT212 | 4× Makara | ~$42k | Festival bass |
| Balanced | 2× AT312 | 2× ZV28 + 2× SSP218 | ~$35k | All-rounder |

---

## Questions for Lian

1. **Do these philosophies make sense?** Or different angles?
   - More tops / More subs / Balanced
   - Or: Deep bass / Balanced / Easy transport?
   - Or: Club / Festival / Mobile?

2. **Budget tiers right?** Should we adjust the ranges?

3. **Which combos make sense at each budget?**
   - I can calculate prices, but you know which *systems* actually make sense together

4. **Any "never do this" combos?** Like SV9 with Kraken?

5. **Should this replace the current flow or be a toggle?**
   - Current: Always show 3 tiers at different prices
   - New option: Let user choose "similar price" or "price range"

---

## Implementation Notes

If we do this, the UI flow becomes:

```
Step 1: Genre
Step 2: Crowd Size
Step 3: Transport (optional)
Step 4: NEW → "How would you like to see options?"
        [ ] Compare similar-priced systems (same budget, different setups)
        [ ] See Good/Better/Best range (different budgets)
Step 5: Results
```

The "similar-priced" matrix would be genre × crowd-size × philosophy.

---

## Ready to Fill In?

Once you confirm the approach, I can:
1. Build out the full matrix
2. Add the UI toggle
3. Create the new recommendation logic

Let me know what resonates! 🐦
