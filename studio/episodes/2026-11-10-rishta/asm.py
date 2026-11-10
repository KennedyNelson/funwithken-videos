# Audio + timing for "Rishta / Sofa" (YouTube 2026-11-10). ElevenLabs eleven_v4_turbo; raw/l1..l8.mp3. usage: python3 asm.py
import numpy as np, json, subprocess, re, sys
from scipy.io import wavfile
sys.path.insert(0,'../..'); import bgm
SR=44100; L=json.load(open('lines.json'))
CAP=[.12]*8
SPD=[1.15,1.1,1.15,1.1,1.15,1.1,1.15,1.1]
GAIN=[.105,.08,.1,.08,.1,.08,.1,.085]
BEFORE=[.25,.2,.3,.15,.25,.3,.25,.5]
TAIL=.8
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
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'raw/l{i+1}.mp3','-ac','1','-ar',str(SR),f'data/l{i}.wav'],check=True)
    _,x=wavfile.read(f'data/l{i}.wav'); x=x.astype(float)/32768; y=tight(x,CAP[i])
    wavfile.write(f'data/t{i}.wav',SR,(y*32767).astype(np.int16))
    if SPD[i]!=1.0:
        subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'data/t{i}.wav','-filter:a',f'atempo={SPD[i]}',f'data/p{i}.wav'],check=True); _,y=wavfile.read(f'data/p{i}.wav'); y=y.astype(float)/32768
    if False:
        from scipy.signal import butter,lfilter
        bb,aa=butter(3,[320/(SR/2),3200/(SR/2)],'band'); y=lfilter(bb,aa,y)
    y=y/np.sqrt((y**2).mean())*GAIN[i]
    t+=BEFORE[i]
    h=int(.012*SR); e=np.convolve(np.abs(y),np.ones(h)/h,'same'); voiced=e>e.max()*.07; cum=np.cumsum(voiced)/SR; tot=cum[-1]
    words=txt.split(); w8=[len(re.sub(r'\W','',w))+1.5 for w in words]; c=0
    for w,g in zip(words,w8):
        a=c/sum(w8)*tot; c+=g; b=c/sum(w8)*tot
        W.append(dict(w=w,line=i,spk=sp,s=round(t+int(np.searchsorted(cum,a))/SR,3),e=round(t+int(np.searchsorted(cum,b))/SR,3)))
    T.append(dict(line=i,sp=sp,start=round(t,3),end=round(t+len(y)/SR,3),text=txt))
    segs.append((t,y,sp)); t+=len(y)/SR
DUR=round(t+TAIL,2); N=int(DUR*SR); v=np.zeros(N)
t6=segs[5][0]; R0=0; PICK=0
def ring(a,dur):
    tt=np.arange(int(dur*SR))/SR; g=((tt%.5)<.14)|(((tt%.5)>.2)&((tt%.5)<.34)); return np.sin(2*np.pi*880*tt)*.5*g*np.minimum(1,np.minimum(tt*40,(dur-tt)*40))*.05
sfx=np.zeros(N)

for s,y,sp in segs: i0=int(s*SR); v[i0:i0+len(y)]+=y
v=v/np.abs(v).max()*.89
n30=int(DUR*30)+1; env={k:[0]*n30 for k in ('k','b','m','bm')}
for s,y,sp in segs:
    f=SR//30; e=np.abs(y); h=int(.012*SR); e=np.convolve(e,np.ones(h)/h,'same')
    m=np.array([e[j*f:(j+1)*f].mean() if j*f<len(e) else 0 for j in range(int(len(y)/f)+1)]); top=np.percentile(m,95) or 1
    for j,val in enumerate(m):
        idx=int(s*30)+j
        if idx<n30: env[sp][idx]=round(float(np.clip(val/top,0,1)),3)
b=bgm.make('lofi',DUR)[:N]; b=np.pad(b,(0,N-len(b)))
duck=np.convolve((np.abs(v)>.02).astype(float),np.ones(int(.25*SR))/int(.25*SR),'same')
bedgain=.15-.06*np.clip(duck*3,0,1)
mix=np.clip(v+sfx+b*bedgain,-1,1); mix=mix/max(1,np.abs(mix).max()*1.02)
wavfile.write('data/mix.wav',SR,(mix*32767).astype(np.int16))
json.dump(W,open('data/words.json','w')); json.dump(T,open('data/timing.json','w'),indent=0)
json.dump(dict(dur=DUR,phone=dict(r0=R0,pick=PICK,l6=round(t6,3)),lines=[[d['sp'],d['start'],d['end']] for d in T]),open('data/meta.json','w')); json.dump(env,open('data/env.json','w'))
print('DUR',DUR); [print(d['start'],d['end'],d['sp'],d['text'][:40]) for d in T]
