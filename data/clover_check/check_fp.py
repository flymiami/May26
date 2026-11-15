# Fresh Produce bought (Jun 17 to last invoice) vs Clover sold (Jun 17 to pull date) + current Clover stock.
import csv,re,sys,collections
D=sys.argv[1]  # folder with fp_lines.csv, fp_new_lines.csv, clover_sold.csv, clover_stock.csv, hackney_lines.csv
fp=[r for f in ('fp_lines.csv','fp_new_lines.csv') for r in csv.DictReader(open(D+'/'+f,encoding='utf-8')) if r['date']>='2026-06-17']
sold=list(csv.DictReader(open(D+'/clover_sold.csv',encoding='utf-8')))
stock=list(csv.DictReader(open(D+'/clover_stock.csv',encoding='utf-8')))
hk=[r for r in csv.DictReader(open(D+'/hackney_lines.csv',encoding='utf-8')) if r['date']>='2026-06-17']
M=[ # label, FP regex on text, pack override, Clover name regex, Hackney regex (other source check)
('Zephyrhills 1.5L',r'Zephyrhills.*12/1\.5',None,r'^Zephyrhills 1\.5 L$',r'ZEPHYRHILLS.*1\.5'),
('Zephyrhills 1L',r'Zephyrhills.*15/1 Liter',None,r'^Zephyhills\s+1 Litro$',r'ZEPHYRHILLS.*1 ?L'),
('Zephyrhills 20oz',r'Zephyrhills.*28/20 Oz',None,r'^Zephyrhills 20 OZ$',r'ZEPHYRHILLS.*20'),
('Zephyrhills 23.6oz sport',r'Zephyrhills.*23\.6',None,r'^Zephyrhill 23\.7',r'ZEPHYRHILLS.*23'),
('Fiji 1.5L',r'(?i)fiji water - 12/1\.5',None,r'^Fiji Water\s+1\.5',r'FIJI.*1\.5'),
('Fiji 1L',r'(?i)fiji water - 12/1L',None,r'^Fiji Natural Artesian Water 1 LT',r'FIJI.*1 ?L'),
('Fiji 0.5L',r'(?i)fiji water - 24/0\.5',None,r'^Fiji Natural Artesian Water 05',r'FIJI.*(500|\.5L)'),
('Fiji SportCap',r'(?i)fiji water sportcap',None,r'^Fiji Sport Cap',r'FIJI.*SPORT'),
('Evian 1L',r'(?i)evian.*12/1L',None,r'^Evian\s+1 L$',r'EVIAN'),
('Coke 20oz',r'Coca Cola Classic, 20 Oz',24,r'^Coke 20 Oz$',r'COKE.*20|COCA.*20'),
('Coke Zero 20oz',r'Coca-Cola Zero Sugar Bottles, 20',None,r'^Coke Zero Sugar 20 Oz$',r'COKE ZERO.*20'),
('Diet Coke 20oz',r'Diet Coke Bottle, 20',None,r'^Diet Coke 20oz',r'DIET COKE.*20'),
('Coke 2L',r'Coca-Cola Bottles, 2 Liters',None,r'^Coke\s+2L$',r'COKE.*2 ?L'),
('Diet Coke 2L',r'Diet Coke - 8/2L',None,r'^Diet Coke 2 L$',r'DIET COKE.*2 ?L'),
('Coke can 12oz',r'Coca-Cola Cans 12',None,r'^Coke Can$',r'COKE.*12 ?OZ|COCA.*CAN'),
('Sprite 20oz',r'Sprite - 24/20',None,r'^Sprite 20oz$',r'SPRITE.*20'),
('Gatorade 20oz (all flavors)',r'Gatorade',None,r'^Gatorade .*20',r'GATORADE'),
('Red Bull 8.4oz',r'Red Bull Energy Drink - 24/8\.4',None,r'^Red Bull 8\.4oz$',r'RED BULL.*8\.4'),
('Red Bull 12oz',r'Red Bull Energy Drink - 24/12',None,r'^Red Bull 12 Oz$',r'RED BULL.*12'),
('Electrolit Fruit Punch',r'Electrolit Fruit Punch',None,r'^Electrolit Fruit Punch',r'ELECTROLIT'),
('Electrolit Orange',r'Electrolit Orange',None,r'^Electrolit Orange',r'ELECTROLIT'),
('Tropicana OJ 11oz',r'Tropicana 100% Orange juice - 11',None,r'^Tropicana Orange Ju(ic|c)e.* 11 Oz$',r'TROPICANA'),
('Tropicana Cranberry 10oz',r'Tropicana - Cranberry',24,r'^Tropicana Cranberry 10',r'TROPICANA'),
('Starbucks Frapp Caramel 13.7',r'Frappuccino Caramel',None,r'^Starbucks Frappuccino Caramel 13\.7',r'FRAPP'),
('Nesquik chocolate 14oz',r'Nesquik - Double Chocolate',None,r'^Nesquik Chocolate 14',r'NESQUIK'),
('Pocasville nectars',r'Pocasville',24,r'Pocasville',r'POCAS'),
]
def units(r,pk):
    q=float(r['qty']); p=pk or (int(r['pack']) if r['pack'] not in ('','0','None') else None)
    return q*p if p else None
out=[]
for lab,fr,pk,cr,hr in M:
    L=[r for r in fp if re.search(fr,r['text'])]
    b=sum(units(r,pk) or 0 for r in L); nopack=sum(1 for r in L if units(r,pk) is None)
    cost=sum(float(r['amount']) for r in L)
    S_=[s for s in sold if re.search(cr,s['name'])]
    s=sum(int(x['units']) for x in S_)
    ST=[x for x in stock if re.search(cr,x['name'])]
    st=sum(float(x['stock']) for x in ST if x['stock'] not in ('',))
    h=sorted(set(r['desc'] for r in hk if re.search(hr,r['desc'])))
    gap=b-s
    out.append(dict(item=lab,fp_units_bought=int(b),clover_units_sold=s,gap=int(gap),gap_pct=round(100*gap/b,1) if b else '',clover_stock_now=int(st) if ST else 'no item',fp_cost=round(cost,2),last_fp=max(r['date'] for r in L) if L else '',lines_without_pack=nopack,clover_names='; '.join(x['name'] for x in S_),hackney_also=('; '.join(h))[:80]))
w=csv.DictWriter(open(D+'/clover_check_freshproduce.csv','w',newline='',encoding='utf-8'),fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
for o in out: print(o['item'],'|',o['fp_units_bought'],'|',o['clover_units_sold'],'|',o['gap'],'|',o['gap_pct'],'|',o['clover_stock_now'],'|',o['last_fp'],'|',o['lines_without_pack'],'|',o['hackney_also'],'|',o['clover_names'])
