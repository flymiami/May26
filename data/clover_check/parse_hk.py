import re,sys,glob,csv,datetime
rows=[];docs=[]
line_re=re.compile(r'^\s*([A-Z0-9*])?\s+(-?\d+)\s+(\d{11,14}\s+)?(\*?\d+)\s+(.+?)\s+(\d{7})\s+(.*\d\.\d\d.*)$')
for f in sorted(glob.glob(sys.argv[1]+'/*.txt')):
    t=open(f).read()
    m=re.search(r'(Invoice|Credit Memo) #:\s+(\d+)',t); kind,num=m.group(1),m.group(2)
    d=re.search(r'Invoice Date:\s+(\d+)/(\d+)/(\d+)',t); dt=datetime.date(2000+int(d.group(3)),int(d.group(1)),int(d.group(2)))
    tv=re.search(r'Total:[ ]+(-?[\d,]*\.\d+)(-?)',t); tot=(float(tv.group(1).replace(',',''))*(-1 if tv.group(2) else 1)) if tv else 0.0
    docs.append((num,kind,dt,tot))
    seen=set()
    for ln in t.splitlines():
        mm=line_re.match(ln)
        if not mm: continue
        qty=int(mm.group(2)); pack=int(mm.group(4).lstrip('*')); nums=re.findall(r'-?[\d,]*\.\d+-?',mm.group(7))
        net=(float(nums[-1].rstrip('-').replace(',',''))*(-1 if nums[-1].endswith('-') else 1)) if nums else 0
        sign=-1 if kind=='Credit Memo' else 1
        rows.append(dict(doc=num,kind=kind,date=dt.isoformat(),upc=(mm.group(3) or '').strip(),desc=mm.group(5).strip(),size='',qty=qty*sign,pack=pack,units=qty*pack*sign,net=net*sign))
w=csv.DictWriter(open(sys.argv[2],'w'),fieldnames=list(rows[0].keys()));w.writeheader();w.writerows(rows)
for x in sorted(docs,key=lambda x:x[2]): print(x[2],x[1],x[0],x[3])
print('lines',len(rows))
