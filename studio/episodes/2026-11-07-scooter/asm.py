import numpy as np, json, subprocess, re, sys; sys.path.insert(0,"../..")
from scipy.io import wavfile
SR=44100; L=json.load(open('lines.json')); T0=1.1
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i','raw/01.mp3','-ac','1','-ar',str(SR),'data/l0.wav'],check=True)
_,x=wavfile.read('data/l0.wav'); x=x.astype(float)/32768
h=int(.012*SR); e=np.convolve(np.abs(x),np.ones(h)/h,'same'); th=max(.012,e.max()*.05)
act=np.where(e>th)[0]; x=x[max(0,act[0]-300):act[-1]+1500]; e=e[max(0,act[0]-300):act[-1]+1500]
s=e<th; o=[];k=0;n=len(x);CAP=.2
while k<n:
    j=k
    if s[k]:
        while j<n and s[j]: j+=1
        o.append(x[k:k+min(j-k,int(CAP*SR))])
    else:
        while j<n and not s[j]: j+=1
        o.append(x[k:j])
    k=j
y=np.concatenate(o); y=y/np.sqrt((y**2).mean())*.09
e=np.convolve(np.abs(y),np.ones(h)/h,'same'); voiced=e>e.max()*.07; cum=np.cumsum(voiced)/SR; tot=cum[-1]
txt=L[0][1]; words=txt.split(); w8=[len(re.sub(r'\W','',w))+1.5 for w in words]; c=0; W=[]
for w,g in zip(words,w8):
    a=c/sum(w8)*tot; c+=g; b=c/sum(w8)*tot
    W.append(dict(w=w,line=0,s=round(T0+int(np.searchsorted(cum,a))/SR,3),e=round(T0+int(np.searchsorted(cum,b))/SR,3)))
LE=T0+len(y)/SR; TB=LE+2.2; DUR=TB+8.0; N=int(DUR*SR)
v=np.zeros(N); i0=int(T0*SR); v[i0:i0+len(y)]=y
v=v/np.abs(v).max()*.89
from bgm import make
bed=make('chip',DUR)[:N]; bed=np.pad(bed,(0,max(0,N-len(bed))))
tt=np.arange(N)/SR; g=.16+.10*np.clip((tt-(LE+1.4))/.8,0,1)   # bed swells a little when the boys arrive (voice is gone)
mix=v+bed*g; mix=np.clip(mix/max(1,np.abs(mix).max()*1.05),-1,1)
wavfile.write('data/mix.wav',SR,(mix*32767).astype(np.int16))
json.dump(W,open('data/words.json','w')); json.dump(dict(ls=T0,le=LE,tb=TB,dur=DUR),open('data/meta.json','w'))
print(dict(ls=T0,le=round(LE,2),tb=round(TB,2),dur=round(DUR,2)))
