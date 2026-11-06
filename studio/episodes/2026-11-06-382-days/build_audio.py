import numpy as np, wave, json, subprocess, re
SR=44100
LINES=[('N1','N',"A man once went three hundred and eighty-two days without real food."),
('S1','S',"Day three. Hello? Anyone?"),
('N2','N',"Scottish, twenty-seven, with doctors watching the whole time."),
('S2','S',"I'd like to speak to a manager."),
('N3','N',"Water, vitamins, and not one lunch. He lost over a hundred kilos."),
('S3','S',"Day two hundred. I'm talking to a spoon."),
('N4','N',"Five years later, he'd kept most of it off."),
('N5','N',"Please don't try this. He had a hospital. You have a fridge."),
('S4','S',"Fridge?")]
GAP={'N1':0.30,'S1':0.30,'N2':0.30,'S2':0.50,'N3':0.30,'S3':0.55,'N4':0.30,'N5':0.35,'S4':0.0}
def rd(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
for k,_,_ in LINES:
    subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',f'audio/{k}.mp3','-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse','-ar',str(SR),'-ac','1',f'audio/{k}.wav'],check=True)
aud={k:rd(f'audio/{k}.wav') for k,_,_ in LINES}
t=0.25; V={}
for k,_,_ in LINES:
    V[k]=t; t+=len(aud[k])/SR+GAP[k]
END=V['S4']+len(aud['S4'])/SR+0.45; DUR=END+0.05; N=int(SR*DUR)
T={k:[round(V[k],3),round(V[k]+len(aud[k])/SR,3)] for k in V}
voice=np.zeros(N,np.float32)
for k,_,_ in LINES:
    a=aud[k]; a=a/max(1e-6,np.abs(a).max())*0.9; f=int(0.008*SR); a[:f]*=np.linspace(0,1,f); a[-f:]*=np.linspace(1,0,f)
    i=int(V[k]*SR); voice[i:i+len(a)]+=a[:N-i]
H=100; n=int(DUR*H); env=np.zeros(n)
for k,w,_ in LINES:
    if w!='S': continue
    a=aud[k]; win=int(SR/H); r=np.array([np.sqrt(np.mean(a[i:i+win]**2)) for i in range(0,len(a)-win,win)]); r=r/r.max(); i0=int(V[k]*H); env[i0:i0+len(r)]=r[:n-i0]
env=np.clip(np.convolve(env,np.ones(3)/3,'same')*1.4,0,1)
rng=np.random.default_rng(5)
def pluck(f,d=0.7):
    m=int(SR/f); buf=rng.uniform(-1,1,m); out=np.zeros(int(d*SR))
    for i in range(len(out)):
        out[i]=buf[i%m]; buf[i%m]=0.4975*(buf[i%m]+buf[(i+1)%m])
    return out
bed=np.zeros(N,np.float32)
def padd(tt,a,g):
    i=int(tt*SR)
    if i>=N: return
    a=a[:max(0,N-i)]; bed[i:i+len(a)]+=a*g
C=[261.6,329.6,392.0,329.6]; F=[174.6,220,261.6,220]; G=[196,246.9,293.7,246.9]; Am=[220,261.6,329.6,261.6]
tt=0.0
for bar in [C,Am,F,G]*6:
    for f in bar:
        if tt<END: padd(tt,pluck(f),0.35)
        tt+=0.46
mix=voice+bed*0.22; mix=np.clip(mix/max(1,np.abs(mix).max()*1.05),-1,1)
import os; os.makedirs('data',exist_ok=True)
w=wave.open('data/mix.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
fridge=round(T['N5'][1]-1.05,3)
open('src/env.js','w').write('export const ENV='+json.dumps({'S':[round(float(x),3) for x in env]})+';\nexport const TM='+json.dumps({'T':T,'A':{'end':round(END,3),'fridge':fridge}})+';\n')
# captions: 2-3 word chunks spread by length
CAPS=[]
for k,w,txt in LINES:
    parts=[x for x in re.findall(r"[^.?!,]+[.?!,]?",txt) if x.strip()]; chunks=[]
    for part in parts:
        words=part.split(); i=0
        while i<len(words):
            rem=len(words)-i; take=rem if rem<=3 else (2 if rem==4 else 3)
            chunks.append(' '.join(words[i:i+take])); i+=take
    s,e=T[k]; L=[len(c)+2 for c in chunks]; tot=sum(L); cur=s
    for c,l in zip(chunks,L):
        d=(e-s)*l/tot; CAPS.append([w,round(cur,3),round(cur+d,3),c]); cur+=d
open('src/caps.js','w').write('export const CAPS='+json.dumps(CAPS)+';\n')
print(json.dumps(T)); print('END',END,'fridge',fridge)
