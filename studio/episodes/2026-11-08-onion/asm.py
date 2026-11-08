import numpy as np, json, subprocess, re, sys
from scipy.io import wavfile
sys.path.insert(0,'../..'); import bgm
SR=44100; L=json.load(open('lines.json'))
CAPS=["This onion has a chemical weapon.","And today... it's aimed at Papa.","Pfft. Papa doesn't cry. Not even at weddings.","CHOP! The knife bursts the onion's tiny cells.","Two chemicals inside mix... and make a gas.","It floats up, stings his eyes, and they flood with tears to wash it out.","I'm NOT crying! The onion started it!","Tip: chill the onion first, and use a sharp knife. Less gas, fewer tears.","Good. Now cut five kilos... for the wedding."]
CAP=[.18,.2,.16,.12,.18,.12,.16,.14,.3]
SPD=[1.0,1.06,1.04,1.1,1.08,1.14,1.0,1.18,1.02]
BEFORE=[.1,.15,.12,.25,.08,.1,.2,.45,.55]
TAIL=1.5
def tight(x,cap):
    h=int(.012*SR); e=np.convolve(np.abs(x),np.ones(h)/h,'same'); th=max(.012,e.max()*.05)
    act=np.where(e>th)[0]; x=x[max(0,act[0]-300):act[-1]+1500]; e=e[max(0,act[0]-300):act[-1]+1500]
    s=e<th; o=[];k=0;n=len(x)
    while k<n:
        j=k
        if s[k]:
            while j<n and s[j]: j+=1
            o.append(x[k:k+min(j-k,int(cap*SR))])
        else:
            while j<n and not s[j]: j+=1
            o.append(x[k:j])
        k=j
    return np.concatenate(o)
segs=[];T=[];W=[];t=0
for i,(sp,txt) in enumerate(L):
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'raw/{i+1:02d}.mp3','-ac','1','-ar',str(SR),f'data/l{i}.wav'],check=True)
    _,x=wavfile.read(f'data/l{i}.wav'); x=x.astype(float)/32768; y=tight(x,CAP[i])
    wavfile.write(f'data/t{i}.wav',SR,(y*32767).astype(np.int16))
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'data/t{i}.wav','-filter:a',f'atempo={SPD[i]}',f'data/p{i}.wav'],check=True)
    _,y=wavfile.read(f'data/p{i}.wav'); y=y.astype(float)/32768
    y=y/np.sqrt((y**2).mean())*.09
    t+=BEFORE[i]
    h=int(.012*SR); e=np.convolve(np.abs(y),np.ones(h)/h,'same'); voiced=e>e.max()*.07; cum=np.cumsum(voiced)/SR; tot=cum[-1]
    words=CAPS[i].split(); w8=[len(re.sub(r'\W','',w))+1.5 for w in words]; c=0
    for w,g in zip(words,w8):
        a=c/sum(w8)*tot; c+=g; b=c/sum(w8)*tot
        W.append(dict(w=w,line=i,s=round(t+int(np.searchsorted(cum,a))/SR,3),e=round(t+int(np.searchsorted(cum,b))/SR,3)))
    T.append(dict(line=i,sp=sp,start=round(t,3),end=round(t+len(y)/SR,3),text=CAPS[i]))
    segs.append((t,y,sp)); t+=len(y)/SR
DUR=round(t+TAIL,2); N=int(DUR*SR); v=np.zeros(N); per={k:np.zeros(N) for k in 'ndm'}
for s,y,sp in segs: i0=int(s*SR); v[i0:i0+len(y)]+=y; per[sp][i0:i0+len(y)]+=y
pk=np.abs(v).max(); v=v/pk*.89
ENV={}
for k,a in per.items():
    e=np.convolve(np.abs(a/pk),np.ones(int(.04*SR))/int(.04*SR),'same')[::SR//30]; ENV[k]=(np.clip(e/ (e.max()+1e-9),0,1)).round(3).tolist()
b=bgm.make('tense',DUR)[:N]; b=np.pad(b,(0,N-len(b)))
duck=np.convolve((np.abs(v)>.02).astype(float),np.ones(int(.25*SR))/int(.25*SR),'same')
bedgain=.15-.06*np.clip(duck*3,0,1)
mix=np.clip(v+b*bedgain,-1,1); mix=mix/max(1,np.abs(mix).max()*1.02)
wavfile.write('data/mix.wav',SR,(mix*32767).astype(np.int16))
json.dump(W,open('data/words.json','w')); json.dump(T,open('data/timing.json','w'),indent=0)
json.dump(ENV,open('data/env.json','w'))
json.dump(dict(dur=DUR,lines=T,starts=[d['start'] for d in T],ends=[d['end'] for d in T]),open('data/meta.json','w'))
print('DUR',DUR); [print(d['start'],d['end'],d['sp'],d['text']) for d in T]
