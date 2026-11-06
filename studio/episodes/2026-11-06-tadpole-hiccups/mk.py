import json,re
T=json.load(open('timing.json'));env=json.load(open('env.json'))
R=[("There's a tadpole in your throat, and it just ruined your meeting.","THERE'S A *TADPOLE | IN YOUR *THROAT | AND IT JUST *RUINED | YOUR *MEETING"),
("Water incoming! Shut the gate!","WATER *INCOMING! | SHUT THE *GATE!"),
("This is Grandpa Tadpole. Well, sort of.","THIS IS *GRANDPA | *TADPOLE | WELL, SORT *OF"),
("A hiccup is one sharp gulp of air, then your throat slams shut. Hic!","A *HICCUP IS | ONE SHARP *GULP | OF *AIR | THEN YOUR *THROAT | *SLAMS SHUT | *HIC!"),
("Tadpoles do that exact move. They close a little gate, so water stays out of their lungs while their gills work.","*TADPOLES DO | THAT EXACT *MOVE | THEY *CLOSE | A LITTLE *GATE | SO *WATER | STAYS *OUT | OF THEIR *LUNGS | WHILE THEIR *GILLS | *WORK"),
("Scientists think we inherited that ancient wiring, and it never got the memo that you live on land.","*SCIENTISTS THINK | WE *INHERITED | THAT ANCIENT *WIRING | AND IT *NEVER | GOT THE *MEMO | THAT YOU LIVE | ON *LAND"),
("What's land?","WHAT'S *LAND?"),
("One farmer hiccuped for sixty-eight years. That's over four hundred million hics.","ONE *FARMER | *HICCUPED FOR | 68 *YEARS | THAT'S *OVER | 400 *MILLION | *HICS"),
("My best work.","MY BEST *WORK"),
("But here's the twist. Babies start hiccuping in the womb, at nine weeks. And one small study suggests each hic may teach a newborn's brain how to breathe.","BUT HERE'S THE *TWIST | *BABIES START | *HICCUPING | IN THE *WOMB | AT NINE *WEEKS | AND ONE *SMALL | STUDY *SUGGESTS | EACH HIC *MAY | *TEACH A | NEWBORN'S *BRAIN | HOW TO *BREATHE"),
("You're welcome.","YOU'RE *WELCOME"),
("So next time your meeting goes silent...","SO NEXT *TIME | YOUR *MEETING | GOES *SILENT"),
("Water incoming! Shut the gate!","WATER *INCOMING! | SHUT THE *GATE!")]
lines=[];words=[]
for l,(tx,cap) in zip(T['lines'],R):
    lines.append(dict(i=l['i'],text=tx,start=l['start'],end=l['end']))
    # split into phrases at punctuation, then fit phrases to the biggest silences in the voice envelope
    ph=[p.strip() for p in re.findall(r"[^.,!?]+[.,!?]*",tx) if p.strip()]
    e=env[l['sp']];a=int(l['start']*50);b=int(l['end']*50)
    # silent runs
    runs=[];j=a
    while j<b:
        if e[j]<0.05:
            k=j
            while k<b and e[k]<0.05:k+=1
            if k-j>=3 and j>a+5 and k<b-5: runs.append((k-j,(j+k)/2/50))
            j=k
        else:j+=1
    w=[len(re.sub(r"\W","",p))+2 for p in ph];tot=sum(w)
    # expected boundaries, then snap to nearest silence
    dur=l['end']-l['start'];c=0;bd=[l['start']]
    for x in w[:-1]:
        c+=x;t=l['start']+dur*c/tot
        if runs:
            n=min(runs,key=lambda r:abs(r[1]-t))
            if abs(n[1]-t)<.45:t=n[1]
        bd.append(t)
    bd.append(l['end'])
    for p,s,en in zip(ph,bd,bd[1:]):
        ws=p.split();wl=[len(x)+1.5 for x in ws];tw=sum(wl);c=0;d=en-s
        for x,y in zip(ws,wl):
            words.append(dict(w=x,line=l['i'],s=round(s+d*c/tw,3),e=round(s+d*(c+y)/tw,3)));c+=y
json.dump(dict(duration=T['dur'],voice='11labs',speed=1,lines=lines),open('proj/data/lines.json','w'))
json.dump(words,open('proj/data/words.json','w'))
sc=dict(title="A Tadpole Is Causing Your Hiccups",voice="Liam + Bill (ElevenLabs)",speed=1,lead=.15,outro=.25,gap=.1,music="bed",
 sources=["Straus et al., BioEssays 2003, 'A phylogenetic hypothesis for the origin of hiccough' (gill-ventilation motor pattern, glottal closure)",
 "Neil Shubin, Your Inner Fish, excerpt on hiccups and tadpoles (Panda's Thumb, 2008)",
 "Scientific American, 'What causes hiccups?' (Whitelaw)",
 "UCL News, 12 Nov 2019, 'Newborn baby hiccups could be key to brain development' (Whitehead et al., Clinical Neurophysiology; 13 infants; womb from nine weeks)",
 "Smithsonian Magazine, Charles Osborne hiccuped 1922-1990, est. 430 million; Guinness World Records 2023, more than 420 million"],
 lines=[dict(text=t,caps=c) for t,c in R])
json.dump(sc,open('proj/script.json','w'),indent=1)
open('proj/src/env.js','w').write('export const ENV='+json.dumps(env)+';export const SP='+json.dumps([l['sp'] for l in T['lines']])+';')
