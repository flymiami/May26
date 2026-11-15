import re,sys,glob,csv
rows=[];seen=set()
for f in sorted(glob.glob(sys.argv[1]+'/*.txt')):
    t=open(f).read()
    inv=re.search(r'Invoice no\.:\s*(\d+)',t).group(1)
    if inv in seen: continue
    seen.add(inv)
    m=re.search(r'Invoice date:\s*(\d+)/(\d+)/(\d+)',t); dt=f'{m.group(3)}-{m.group(1)}-{m.group(2)}'
    tot=re.search(r'Total\s+\$([\d,]+\.\d\d)',t)
    body=t.split('Amount',1)[1]
    blocks=re.split(r'\n\s*(?=\d+\.\s+[A-Za-z])',body)
    for b in blocks:
        mm=re.match(r'\s*(\d+)\.\s+(.*)',b,re.S)
        if not mm: continue
        first=mm.group(2).splitlines()[0]
        q=re.search(r'\s(-?\d+(?:\.\d+)?)\s+\$(-?[\d,]+\.\d+)\s+\$(-?[\d,]+\.\d+)\s*$',first)
        if not q: continue
        text=' '.join(l.strip() for l in mm.group(2).splitlines()[:3])
        text=re.sub(r'\s+',' ',text)
        name=re.sub(r'\s(-?\d+(?:\.\d+)?)\s+\$.*$','',first).strip()
        pk=re.search(r'(\d+)\s*/\s*[\d.]+\s*(?:oz|Oz|OZ|ltr|Ltr|L\b|Liter|lt|Lt|ml|ML|z)',text) or re.search(r'(\d+)\s*(?:Ct|ct|CT|pk|Pk|PK|count|Count)\b',text) or re.search(r'Case\s+(\d+)\s*/',text)
        pack=int(pk.group(1)) if pk else None
        if not pack:
            m2=re.search(r'(\d+)\s*Pack\b',text) or re.search(r'(\d+)\s*/\s*1\s*Gal',text) or re.search(r'Pack\s+(\d+)\s*/',text)
            if m2: pack=int(m2.group(1))
            elif 'Coca-Cola Zero Sugar Bottles, 20' in text: pack=24
            elif re.search(r'\bUnit\b',text): pack=1
        qty=float(q.group(1))
        rows.append(dict(doc=inv,date=dt,name=name,text=text[:140],qty=qty,rate=float(q.group(2).replace(',','')),amount=float(q.group(3).replace(',','')),pack=pack,units=qty*pack if pack else None))
    print(inv,dt,'total',tot.group(1) if tot else '?','lines',sum(1 for r in rows if r['doc']==inv),'sum',round(sum(r['amount'] for r in rows if r['doc']==inv),2))
csv.DictWriter(open(sys.argv[2],'w'),fieldnames=list(rows[0].keys())).writeheader()
w=csv.DictWriter(open(sys.argv[2],'a'),fieldnames=list(rows[0].keys())); w.writerows(rows)
print('no pack:',sum(1 for r in rows if not r['pack']),'of',len(rows))
