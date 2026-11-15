# Clover check: bought vs sold (built Nov 15 2026)
Owner order Nov 15 2026 (HOW_I_DECIDE answer 16). Data and scripts: data/clover_check/.

## Sources
1. Sold: Clover "02 Item Sales Jan-Oct 2026" (Drive, Clover Reports), Jan 1 to about Oct 7 2026, totals per item, no dates. V.
2. Bought: 45 H.T. Hackney invoices and credit memos from Gmail, Jan 2 to Oct 1 2026, 2,474 lines parsed; parsed lines match each invoice total except fuel and delivery fees. V.
3. Bought: 18 Fresh Produce Solutions invoices from Gmail (Jan 8, then Jun 17 to Oct 8 2026), 643 lines. V.
4. Southern Glazer's liquor orders ship to The Alexander Hotel, not Atelier. Excluded. V.

## Result, Hackney items (bought Jan 2 to Oct 1 vs sold Jan 1 to Oct 7)
Positive gap = bought more than sold (still on the shelf, expired, or lost). Negative = sold more than bought (opening stock, another vendor, or a missing invoice).
| Item | Bought | Sold | Gap |
|---|---|---|---|
| Bic lighter | 650 | 577 | +73 (11%) |
| Banana Boat Sport spray SPF 50 | 115 | 68 | +47 (41%) |
| Dove soap bar | 153 | 123 | +30 (20%) |
| Apple cranberry walnut salad | 119 | 90 | +29 (24%) |
| Folgers instant 3oz | 120 | 98 | +22 (18%) |
| Columbus pepperoni tray | 80 | 65 | +15 (19%) |
| Columbus genoa tray | 80 | 67 | +13 (16%) |
| Kings Hawaiian rolls | 84 | 73 | +11 (13%) |
| Marlboro Red packs | 300 | 290 | +10 (3%) |
| Kinder Bueno single | 260 | 364 | -104 |
| M&M Peanut share | 240 | 305 | -65 |
| Camel Crush packs | 60 | 86 | -26 |
Full table: data/clover_check/clover_check_hackney.csv.

## Limits (UNKNOWN until fixed)
1. No Hackney invoices found for May 23 to Jun 11, Jul 31 to Aug 13, Sep 11 to 23. Missing invoices make sold look higher than bought.
2. Stock on hand Jan 1 and today: unknown. Gaps are not proof of loss until a shelf count.
3. Fresh Produce items (water, Coke, Gatorade, juices, the biggest volume) only started Jun 17, but the Clover file covers Jan to Oct. Needs a Clover Item Sales export for Jun 17 to Oct 7 to compare.
4. Liquor and Costco purchases for Atelier: source not found in Gmail.
