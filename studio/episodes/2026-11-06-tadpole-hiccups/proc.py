import subprocess,json,re
import numpy as np
from scipy.io import wavfile
# id, speaker, tempo, gap-after, source file
L=[(0,'N',1.3,.12),(1,'G',1.12,.12),(2,'N',1.25,.1),(3,'N',1.22,.15),(4,'N',1.25,.1),(5,'N',1.25,.1),(6,'G',1.1,.1),(7,'N',1.22,.1),(8,'G',1.1,.12),(9,'N',1.25,.1),(10,'G',1.0,.12),(11,'N',1.15,.08),(1,'G',1.12,0)]
SR=44100
out=[];t=.15;lines=[]
for k,(i,sp,tp,gap) in enumerate(L):
    af=f"silenceremove=start_periods=1:start_threshold=-42dB:stop_periods=-1:stop_duration=0.14:stop_threshold=-42dB,atempo={tp}"
    if sp=='G': af+=",asetrate=44100*1.22,aresample=44100,atempo=1.0"
    af+=",loudnorm=I=-16:TP=-2"
    f=f"p{k:02d}.wav"
    subprocess.run(f"ffmpeg -nostdin -v error -y -i audio/l{i:02d}.mp3 -af '{af}' -ar 44100 -ac 1 {f}",shell=True,check=True)
    sr,x=wavfile.read(f);x=x.astype(float)/32768
    lines.append(dict(i=k,sp=sp,start=round(t,3),end=round(t+len(x)/SR,3)));out.append((t,x));t+=len(x)/SR+gap
dur=t+0.25
m=np.zeros(int(dur*SR)+SR)
for a,x in out: s=int(a*SR); m[s:s+len(x)]+=x
m=m[:int(dur*SR)]
wavfile.write('narration.wav',SR,(np.clip(m,-1,1)*32767).astype(np.int16))
# 50 Hz envelope per speaker
env={'N':[0]*int(dur*50+1),'G':[0]*int(dur*50+1)}
for (a,x),l in zip(out,lines):
    w=882
    for j in range(len(x)//w):
        e=float(np.sqrt(np.mean(x[j*w:(j+1)*w]**2)))
        env[l['sp']][min(int(a*50)+j,len(env['N'])-1)]=round(min(1,e*5),3)
json.dump(dict(dur=round(dur,3),lines=lines),open('timing.json','w'),indent=0)
json.dump(env,open('env.json','w'))
print(dur);[print(l) for l in lines]
