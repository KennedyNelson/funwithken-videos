import numpy as np, json, subprocess, re, sys; sys.path.insert(0,"../..")
from scipy.io import wavfile
SR=44100
L=json.load(open('lines.json'))
CAP=[.18,.2,.15,.2,.15,.2]; GAP=[.1,.1,.08,.1,.04,.0]   # gap AFTER line; l2->l3 is immediate
T=[];W=[];out=[];t=.5
for i,(sp,txt) in enumerate(L):
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'raw/{i+1:02d}.mp3','-ac','1','-ar',str(SR),f'data/l{i}.wav'],check=True)
    _,x=wavfile.read(f'data/l{i}.wav'); x=x.astype(float)/32768
    h=int(.012*SR); e=np.convolve(np.abs(x),np.ones(h)/h,'same'); th=max(.012,e.max()*.05)
    act=np.where(e>th)[0]; a0=max(0,act[0]-300); a1=act[-1]+(300 if i==4 else 1500)
    x=x[a0:a1]; e=e[a0:a1]; s=e<th; o=[];k=0;n=len(x)
    while k<n:
        j=k
        if s[k]:
            while j<n and s[j]: j+=1
            o.append(x[k:k+min(j-k,int(CAP[i]*SR))])
        else:
            while j<n and not s[j]: j+=1
            o.append(x[k:j])
        k=j
    y=np.concatenate(o)
    if i==4: y[-int(.02*SR):]*=np.linspace(1,0,int(.02*SR))  # hard cut-off
    SPD=[1,1,1,1.18,1,1]
    if SPD[i]!=1:
        wavfile.write('data/sp_in.wav',SR,(y*32767).astype(np.int16)); subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i','data/sp_in.wav','-filter:a',f'atempo={SPD[i]}','data/sp_out.wav'],check=True)
        _,y=wavfile.read('data/sp_out.wav'); y=y.astype(float)/32768
    y=y/np.sqrt((y**2).mean())*.09
    e=np.convolve(np.abs(y),np.ones(h)/h,'same'); voiced=e>e.max()*.07; cum=np.cumsum(voiced)/SR; tot=cum[-1]
    words=txt.split(); w8=[len(re.sub(r'\W','',w))+1.5 for w in words]; c=0
    for w,g in zip(words,w8):
        a=c/sum(w8)*tot; c+=g; b=c/sum(w8)*tot
        W.append(dict(w=w,line=i,s=round(t+int(np.searchsorted(cum,a))/SR,3),e=round(t+int(np.searchsorted(cum,b))/SR,3)))
    T.append(dict(line=i,sp=sp,start=round(t,3),end=round(t+len(y)/SR,3),text=txt))
    out+=[y,np.zeros(int(GAP[i]*SR))]; t+=len(y)/SR+GAP[i]
y=np.concatenate([np.zeros(int(.5*SR))]+out+[np.zeros(int(.35*SR))]); N=len(y)
y=np.clip(y/np.abs(y).max()*.89,-1,1); from bgm import make; bed=make(sys.argv[1] if len(sys.argv)>1 else "sneaky",N/SR)[:N]; bed=np.pad(bed,(0,max(0,N-len(bed)))); mix=y+bed*.16; mix=np.clip(mix/max(1,np.abs(mix).max()*1.05),-1,1)
wavfile.write('data/mix.wav',SR,(mix*32767).astype(np.int16))
json.dump(T,open('data/timing.json','w'),indent=0); json.dump(W,open('data/words.json','w'))
print('total',round(N/SR,2)); [print(d) for d in T]
