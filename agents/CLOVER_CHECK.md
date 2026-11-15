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

## Update Nov 15 2026: Clover API connected, Fresh Produce check done
1. Clover connected through Composio (account alias "atelier"). Merchant ID TFQHH5R8FJE61 (13 characters; 496039270889 is the CardConnect processor number, not Clover). Environment must be Production North America; Sandbox (the form default) rejects real tokens. Token "ClaudeCloneNovember", Rest API, Read on all 6 areas. A second older token "Claude" also exists. V.
2. Sold: Clover API, 21,412 orders, 52,496 line items, Jun 17 to Nov 15 2026 (orders listed by modifiedTime, then kept only createdTime from Jun 17). File data/clover_check/clover_sold.csv. V.
3. Bought: 21 Fresh Produce invoices Jun 17 to Oct 29 (18 already parsed plus 13347 Oct 14, 13376 Oct 21, 13405 Oct 29). No FP invoice after Oct 29 in Gmail. Script data/clover_check/check_fp.py, result clover_check_freshproduce.csv. Totals rechecked a second way. V.
4. Clover stock is NOT usable: of 1,158 items with stock tracking, 772 are negative, 217 zero, 169 positive (file clover_stock.csv). Deliveries are not received into Clover. A shelf count is the only real stock number. V.

### Result (bought from FP vs sold in Clover, units)
Positive = bought more than sold (on shelf, lost, or given away). Negative = sold more than bought (Costco, Amazon or opening stock).
| Item | Bought | Sold | Gap |
|---|---|---|---|
| Zephyrhills 20oz | 1,680 | 1,560 | +120 (7.1%) |
| Fiji 0.5L | 360 | 259 | +101 (28.1%) |
| Sprite 20oz | 384 | 310 | +74 (19.3%) |
| Coke can 12oz | 700 | 640 | +60 (8.6%) |
| Diet Coke 2L | 160 | 105 | +55 (34.4%) |
| Tropicana OJ 11oz | 300 | 262 | +38 (12.7%) |
| Diet Coke 20oz | 168 | 160 | +8 |
| Tropicana Cranberry | 96 | 93 | +3 |
| Zephyrhills 1.5L | 1,896 | 2,039 | -143 |
| Gatorade 20oz all | 744 | 830 | -86 |
| Fiji 1.5L | 360 | 432 | -72 |
| Nesquik choc 14oz | 240 | 293 | -53 |
| Fiji 1L | 132 | 181 | -49 |
| Coke Zero 20oz | 624 | 669 | -45 |
| Evian 1L | 180 | 211 | -31 |
| Starbucks Frapp Caramel | 132 | 163 | -31 |
| Others within +/-20 units: Zephyrhills 1L, 23.6oz, Fiji SportCap, Coke 20oz, Coke 2L, Red Bull 8.4 and 12, Electrolit, Pocasville. |
None of these items appear on Hackney invoices in the period. V.

### Price change found
Zephyrhills 1.5L case of 12 went from $9.92 (Jun 24 to Jul 8) to $14.41 from Jul 15 (+45%), up to $16.00 some weeks. 20oz case of 28: $9.37 to $13.54 to $15.42. 1L case of 15: $10.03 to $12.21 to $16.00. V (FP invoices).

### Hackney missing invoices (third pass Nov 15)
Gmail has NO Hackney email of any kind in May 23 to Jun 11, Jul 31 to Aug 13, Sep 11 to 23 (searched all Hackney senders, invoices and statements). Hackney statements by email only start Oct 3. Whether deliveries happened in those windows: UNKNOWN; needs Hackney portal or Danny Peydro.
New Hackney docs parsed (hk_new_lines.csv): 474841 Oct 9 $294.01, credit 912156 Oct 14 $127.55, 475580 Oct 15 $2,265.36, 476867 Oct 23 $561.44, 477840 Oct 30 $1,795.59, 478672 Nov 5 $60.26. V.
