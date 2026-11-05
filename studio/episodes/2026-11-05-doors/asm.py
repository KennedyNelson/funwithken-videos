import numpy as np, json, subprocess, re
from scipy.io import wavfile
SR=44100
L=json.load(open('lines.json'))
def syl(t):
    t=re.sub(r'\[.*?\]','',t).lower(); return sum(max(1,len(re.findall(r'[aeiouy]+',w))-(1 if w.endswith('e') and len(w)>3 else 0)) for w in re.findall(r"[a-z']+",t))
CAP=[.14,.16,.14,.1,.1,.12,.12,.14,.12,.22]
AFTER=[.12,.1,.05,.05,.15,.1,.12,.1,.2,.6]
out=[];T=[];W=[];t=.15
for i,(sp,txt) in enumerate(L):
    raw=f'raw/{i+1:02d}.mp3'; subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',raw,'-ac','1','-ar',str(SR),f'data/l{i}.wav'],check=True)
    _,x=wavfile.read(f'data/l{i}.wav'); x=x.astype(float)/32768
    def tight(x,cap):
        h=int(.012*SR); e=np.convolve(np.abs(x),np.ones(h)/h,'same'); th=.015*1 ; th=max(th,e.max()*.06)
        act=np.where(e>th)[0]; x=x[max(0,act[0]-400):act[-1]+1800]; e=e[max(0,act[0]-400):act[-1]+1800]
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
    y=tight(x,CAP[i]*1.3); n=syl(txt); f=min(1.5,max(1.0,4.6*len(y)/SR/n))
    wavfile.write(f'data/t{i}.wav',SR,(y*32767).astype(np.int16))
    af=f'atempo={f:.3f}'
    if sp=='g': af=f'asetrate={int(SR*1.26)},aresample={SR},atempo={f/1.26*1.0:.3f}' if f/1.26>=.5 else af
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'data/t{i}.wav','-filter:a',af,f'data/p{i}.wav'],check=True)
    _,y=wavfile.read(f'data/p{i}.wav'); y=y.astype(float)/32768; y=y/np.sqrt((y**2).mean())*.09
    if i in (0,6): y*=1.25
    print(i,sp,n,round(f,2),round(len(y)/SR,2))
    h=int(.012*SR); e=np.convolve(np.abs(y),np.ones(h)/h,'same'); voiced=e>e.max()*.07
    cum=np.cumsum(voiced)/SR; tot=cum[-1]
    words=re.sub(r'\[.*?\]','',txt).split(); w8=[len(re.sub(r'\W','',w))+1.5 for w in words]
    c=0;
    for w,g in zip(words,w8):
        a=c/sum(w8)*tot; c+=g; b=c/sum(w8)*tot
        ia=int(np.searchsorted(cum,a)); ib=int(np.searchsorted(cum,b))
        W.append(dict(w=w,line=i,s=round(t+ia/SR,3),e=round(t+ib/SR,3)))
    T.append(dict(line=i,sp=sp,start=round(t,3),end=round(t+len(y)/SR,3),text=re.sub(r'\[.*?\]\s*','',txt)))
    out+=[y,np.zeros(int(AFTER[i]*SR))]; t+=len(y)/SR+AFTER[i]
y=np.concatenate([np.zeros(int(.15*SR))]+out); y=np.clip(y/np.abs(y).max()*.89,-1,1)
wavfile.write('data/narration.wav',SR,(y*32767).astype(np.int16))
json.dump(T,open('data/timing.json','w'),indent=0); json.dump(W,open('data/words.json','w'))
h=SR//100; r=[float(np.sqrt((y[k:k+h]**2).mean())) for k in range(0,len(y)-h,h)]; m=max(r)
json.dump({'hz':100,'env':[round(v/m,3) for v in r]},open('data/env.json','w'))
print('total',round(len(y)/SR,2)); [print(d['start'],d['end'],d['text']) for d in T]
