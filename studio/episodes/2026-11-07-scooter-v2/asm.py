import numpy as np, json, subprocess, re
from scipy.io import wavfile
SR=44100; L=json.load(open('lines.json')); T0=.4; SPD=1.2; TB=4.0; BRAKE=10.0; DUR=14.6
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i','raw/01.mp3','-ac','1','-ar',str(SR),'data/l0.wav'],check=True)
_,x=wavfile.read('data/l0.wav'); x=x.astype(float)/32768
h=int(.012*SR); e=np.convolve(np.abs(x),np.ones(h)/h,'same'); th=max(.012,e.max()*.05)
act=np.where(e>th)[0]; a0=max(0,act[0]-200); a1=act[-1]+900; x=x[a0:a1]; e=e[a0:a1]
s=e<th; o=[];k=0;n=len(x);CAP=.12
while k<n:
    j=k
    if s[k]:
        while j<n and s[j]: j+=1
        o.append(x[k:k+min(j-k,int(CAP*SR))])
    else:
        while j<n and not s[j]: j+=1
        o.append(x[k:j])
    k=j
y=np.concatenate(o)
wavfile.write('data/sp_in.wav',SR,(y*32767).astype(np.int16)); subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i','data/sp_in.wav','-filter:a',f'atempo={SPD}','data/sp_out.wav'],check=True)
_,y=wavfile.read('data/sp_out.wav'); y=y.astype(float)/32768; y=y/np.sqrt((y**2).mean())*.09
e=np.convolve(np.abs(y),np.ones(h)/h,'same'); voiced=e>e.max()*.07; cum=np.cumsum(voiced)/SR; tot=cum[-1]
words=L[0][1].split(); w8=[len(re.sub(r'\W','',w))+1.5 for w in words]; c=0; W=[]
for w,g in zip(words,w8):
    a=c/sum(w8)*tot; c+=g; b=c/sum(w8)*tot
    W.append(dict(w=w,line=0,s=round(T0+int(np.searchsorted(cum,a))/SR,3),e=round(T0+int(np.searchsorted(cum,b))/SR,3)))
LE=T0+len(y)/SR; N=int(DUR*SR); v=np.zeros(N); i0=int(T0*SR); v[i0:i0+len(y)]=y; v=v/np.abs(v).max()*.89
wavfile.write('data/mix.wav',SR,(v*32767).astype(np.int16))   # voice only: NO BGM (owner adds an Instagram audio later)
json.dump(W,open('data/words.json','w')); json.dump(dict(ls=T0,le=LE,tb=TB,brake=BRAKE,dur=DUR),open('data/meta.json','w'))
print(dict(ls=T0,le=round(LE,2),dur=DUR))
