import numpy as np, json, subprocess
from scipy.io import wavfile
SR=24000
SYL={'1a':11,'2':5,'3':7,'4':12,'5':4,'6':12,'7':5,'8':14}
SP={'1a':3.05,'2':1.55,'3':1.84,'4':3.59,'5':1.25,'6':2.8,'7':1.82,'8':2.99}
TARGET=4.6
CAP={1:.25,2:.28,3:.3,4:.25,5:.2,6:.25,7:.3,8:.3}
AFTER={1:.35,2:.4,3:.35,4:.5,5:.45,6:.6,7:.7,8:0}
GAIN={2:3,4:3,6:3,8:3,7:2}
keys=['1a','2','3','4','5','6','7','8']
for i,k in enumerate(keys,1):
    f=min(1.7 if k=='7' else 1.5,max(0.9,TARGET*SP[k]/SYL[k]))
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'L{k}.wav','-filter:a',f'atempo={f:.3f}',f'N{i}.wav'],check=True); print(i,k,round(f,2))
def load(n):
    sr,x=wavfile.read(f'N{n}.wav'); return x.astype(float)/32768
def tighten(x,cap):
    env=np.convolve(np.abs(x),np.ones(240)/240,'same'); act=np.where(env>0.03)[0]
    x=x[max(0,act[0]-int(.02*SR)):act[-1]+int(.06*SR)]; env=np.convolve(np.abs(x),np.ones(240)/240,'same')
    sil=env<0.02; out=[]; i=0; n=len(x)
    while i<n:
        j=i
        if sil[i]:
            while j<n and sil[j]: j+=1
            out.append(x[i:i+min(j-i,int(cap*SR))])
        else:
            while j<n and not sil[j]: j+=1
            out.append(x[i:j])
        i=j
    y=np.concatenate(out); f=int(.012*SR); y[:f]*=np.linspace(0,1,f); y[-f:]*=np.linspace(1,0,f); return y
parts=[];timing=[];t=0.35
for n in range(1,9):
    y=tighten(load(n),CAP[n])*10**(GAIN.get(n,0)/20)
    timing.append(dict(line=n,speaker='ENGINEER' if n%2 else 'CLAUDE',start=round(t,3),end=round(t+len(y)/SR,3)))
    parts+=[y,np.zeros(int(AFTER[n]*SR))]; t+=len(y)/SR+AFTER[n]
y=np.concatenate([np.zeros(int(.35*SR))]+parts+[np.zeros(int(.7*SR))]); y=y/np.abs(y).max()*0.89
wavfile.write('dialogue.wav',SR,(y*32767).astype(np.int16)); json.dump(timing,open('timing.json','w'),indent=1)
print('total',round(len(y)/SR,2)); [print(d) for d in timing]
h=int(.01*SR); r=[float(np.sqrt((y[i:i+h]**2).mean())) for i in range(0,len(y)-h,h)]
env=[]
for d in timing:
    a,b=int(d['start']*100),int(d['end']*100); m=max(r[a:b]) or 1
    for i in range(a,min(b,len(r))): r[i]=min(1.2,r[i]/m*1.0)
for d in timing: pass
# zero outside lines is already tiny; keep simple
json.dump({'hz':100,'env':[round(v,3) for v in r]},open('env.json','w'))
