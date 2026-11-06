import numpy as np, json, subprocess, re
from scipy.io import wavfile
SR=44100
L=json.load(open('lines.json'))
def syl(t):
    t=re.sub(r'\[.*?\]','',t).lower(); return sum(max(1,len(re.findall(r'[aeiouy]+',w))-(1 if w.endswith('e') and len(w)>3 else 0)) for w in re.findall(r"[a-z']+",t))
CAP=[.14,.14,.12,.12,.14,.12,.14,.12,.12,.2]
AFTER=[.10,.12,.08,.12,.08,.14,.12,.08,.12,.45]
out=[];T=[];W=[];t=.15
for i,(sp,txt) in enumerate(L):
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'raw/{i+1:02d}.mp3','-ac','1','-ar',str(SR),f'data/l{i}.wav'],check=True)
    _,x=wavfile.read(f'data/l{i}.wav'); x=x.astype(float)/32768
    def tight(x,cap):
        h=int(.012*SR); e=np.convolve(np.abs(x),np.ones(h)/h,'same'); th=max(.015,e.max()*.06)
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
    y=tight(x,CAP[i]*1.3); n=syl(txt); lo=1.0
    f=min(1.2 if sp=='s' else 1.5,max(lo,4.6*len(y)/SR/n))
    wavfile.write(f'data/t{i}.wav',SR,(y*32767).astype(np.int16))
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'data/t{i}.wav','-filter:a',f'atempo={f:.3f}',f'data/p{i}.wav'],check=True)
    _,y=wavfile.read(f'data/p{i}.wav'); y=y.astype(float)/32768; y=y/np.sqrt((y**2).mean())*.09
    print(i,sp,n,round(f,2),round(len(y)/SR,2))
    h=int(.012*SR); e=np.convolve(np.abs(y),np.ones(h)/h,'same'); voiced=e>e.max()*.07
    cum=np.cumsum(voiced)/SR; tot=cum[-1]
    words=re.sub(r'\[.*?\]','',txt).split(); w8=[len(re.sub(r'\W','',w))+1.5 for w in words]
    c=0
    for w,g in zip(words,w8):
        a=c/sum(w8)*tot; c+=g; b=c/sum(w8)*tot
        ia=int(np.searchsorted(cum,a)); ib=int(np.searchsorted(cum,b))
        W.append(dict(w=w,line=i,s=round(t+ia/SR,3),e=round(t+ib/SR,3)))
    T.append(dict(line=i,sp=sp,start=round(t,3),end=round(t+len(y)/SR,3),text=re.sub(r'\[.*?\]\s*','',txt)))
    out+=[y,np.zeros(int(AFTER[i]*SR))]; t+=len(y)/SR+AFTER[i]
y=np.concatenate([np.zeros(int(.15*SR))]+out); y=np.clip(y/np.abs(y).max()*.89,-1,1)
# light ukulele bed
rng=np.random.default_rng(5)
def pluck(f,d=0.7):
    m=int(SR/f); buf=rng.uniform(-1,1,m); o=np.zeros(int(d*SR))
    for k in range(len(o)):
        o[k]=buf[k%m]; buf[k%m]=0.4975*(buf[k%m]+buf[(k+1)%m])
    return o
N=len(y); bed=np.zeros(N)
C=[261.6,329.6,392.0,329.6]; F=[174.6,220,261.6,220]; G=[196,246.9,293.7,246.9]; Am=[220,261.6,329.6,261.6]
tt=0.0
for bar in [C,Am,F,G]*8:
    for fr in bar:
        if tt<N/SR-0.3:
            a=pluck(fr); i0=int(tt*SR); a=a[:N-i0]; bed[i0:i0+len(a)]+=a*0.3
        tt+=0.36
mix=y+bed*0.2; mix=np.clip(mix/max(1,np.abs(mix).max()*1.05),-1,1)
wavfile.write('data/narration.wav',SR,(y*32767).astype(np.int16)); wavfile.write('data/mix.wav',SR,(mix*32767).astype(np.int16))
json.dump(T,open('data/timing.json','w'),indent=0); json.dump(W,open('data/words.json','w'))
print('total',round(N/SR,2)); [print(d['start'],d['end'],d['sp'],d['text']) for d in T]
