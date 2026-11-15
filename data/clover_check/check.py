import csv,re,sys,collections
S=sys.argv[1]; END='2026-10-07'
hk=[x for x in csv.DictReader(open(S+'/hackney_lines.csv')) if x['date']<=END and x['upc']]
fp=[x for x in csv.DictReader(open(S+'/fp_lines.csv')) if x['date']<=END]
cl={x['item']:x for x in csv.DictReader(open(S+'/clover_item_sales.csv'))}
F=[ # name, hackney desc regex, fp regex (to detect other source), clover item regex, units multiplier for hackney
('Marlboro Red (packs)',r'MARLBORO BOX$',None,r'^Marlboro Red$',10),
('Marlboro Gold/Light (packs)',r'MARLBORO GOLD BOX$',None,r'^Marlboro Light$',10),
('Marlboro Gold Menthol (packs)',r'MARLBORO GOLD MEN',None,r'^Marlboro Mentol Gold Pack$',10),
('Camel Crush (packs)',r'CAMEL CRUSH',None,r'^Camel Crush$',10),
('Newport short (packs)',r'NEWPORT BOX$',None,r'^Newport Short$',10),
('Newport 100 (packs)',r'NEWPORT 100',None,r'^Newport 100$',10),
('Bic lighter',r'BIC REG LIGHTER',None,r'^Bic Lighter$',1),
('Gonnella white bread',r'GONNELLA WHITE',None,r'^Gonnella White',1),
('Banana Boat sport spray 50',r'BANANA BOAT SPORT SPRAY',None,r'^Banana Boat Sport Ultra 50$',1),
('M&M Peanut king/share',r'M&M PEANUT KING',None,r'^M&M Peanuts Share',1),
('M&M Plain king/share',r'M&M PLAIN KING',None,r'^M&M Milk Chocolate Candies Share',1),
('Toblerone 3.5oz',r'TOBLERONE MILK',None,r'^Toblerone Milk',1),
('Kinder Bueno Mini',r'KINDER BUENO MINI',None,r'^Kinder Bueno Mini',1),
('Kinder Bueno single 1.5oz',r'KINDER BUENO SINGLE',None,r'^Kinder Bueno Single',1),
('Nutella B-ready',r'NUTELLA B-READY',None,r'^Nutella B-ready',1),
('Dove soap bar',r'DOVE SOAP',None,r'^Dove (Original|Bars)',1),
('Parade bath tissue',r'PARADE BATH',None,r'^Parade Soft',1),
('Always Ultra Thin',r'ALWAYS ULT THIN',None,r'^Always Ultra Thin',1),
('Kings Hawaiian rolls',r'KINGS HAWAIIAN',None,r'^Kings Hawaiian',1),
('Folgers instant 3oz',r'FOLGERS INSTANT',None,r'^Folgers Classic',1),
('Chicken Caesar salad',r'CHIC CAESAR SALAD',None,r'Chicken Cesar Salad|^Cesar Salad',1),
('Apple cran walnut salad',r'APP CRAN WAL SALAD',None,r'Apple Cramberry',1),
('Columbus pepperoni tray',r'COLUMBUS PEPPERONI',None,r'Colombus Charcuterie Snack Tray Pepperoni',1),
('Columbus genoa tray',r'COLUMBUS GENOA',None,r'^Colombus Charcuterie Snack Tray 3 Oz$',1),
('Fresh Craft Cuban',r'FRESH CRAFT CUBAN',None,r'^Fresh Craft Cuban',1),
('Wonderful pistachios 5oz',r'WONDERFUL PISTACHIOS',None,r'^Pistachios Roasted',1),
('Simply Lemonade 11.5oz',r'SIMPLY LEMONADE NFC',r'Simply Lemonade, All',r'^Simply Lemonade 11.5',1),
('Fiji Sport Cap 700ml',r'FIJI WATER W/SPORTS',r'SportCap',r'^Fiji Sport Cap',1),
]
out=[]
for name,hre,fre,cre,mult in F:
    hrows=[x for x in hk if re.search(hre,x['desc'])]
    bought=sum(float(x['units']) for x in hrows)*mult
    cost=sum(float(x['net']) for x in hrows)
    other=bool(fre and any(re.search(fre,x['name']+' '+x['text']) for x in fp))
    citems=[k for k in cl if re.search(cre,k)]
    sold=sum(int(cl[k]['units_sold']) for k in citems)
    rev=sum(float(cl[k]['net_sales']) for k in citems)
    out.append(dict(item=name,bought=int(bought),sold=sold,gap=int(bought)-sold,gap_pct=round((bought-sold)/bought*100,1) if bought else None,hackney_cost=round(cost,2),clover_revenue=round(rev,2),also_other_vendor='yes' if other else '',clover_names='; '.join(citems)))
out.sort(key=lambda r:-(r['gap']))
w=csv.DictWriter(open(S+'/clover_check_hackney.csv','w'),fieldnames=list(out[0].keys()));w.writeheader();w.writerows(out)
for r in out: print(f"{r['item'][:30]:30} bought {r['bought']:5} sold {r['sold']:5} gap {r['gap']:5} ({r['gap_pct']}%) {r['also_other_vendor']} | {r['clover_names'][:60]}")
