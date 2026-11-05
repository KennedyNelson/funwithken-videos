import numpy as np, wave, json
SR=44100
def rd(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
dur={k:len(rd(f'audio/{k}.wav'))/SR for k in ['B1','K1','Bq','K2','B2','K3']}
V={}; V['B1']=0.30; V['K1']=V['B1']+dur['B1']+0.25; V['Bq']=V['K1']+dur['K1']+0.25; V['K2']=V['Bq']+dur['Bq']+0.20; V['B2']=V['K2']+dur['K2']+0.25; V['K3']=V['B2']+dur['B2']+0.45
K3e=V['K3']+dur['K3']; KICK=V["K3"]+0.30; END=K3e+0.9; DUR=END+0.05
N=int(SR*DUR)
tim={k:[round(V[k],3),round(V[k]+dur[k],3)] for k in V}
anch={'pivot':round(V['K3']-0.4,3),'kick':round(KICK,3),'end':round(END,3),'k3e':round(K3e,3)}
json.dump({'T':tim,'A':anch},open('data/timing.json','w'))
voice=np.zeros(N,np.float32)
for k,t in V.items():
    a=rd(f'audio/{k}.wav'); a=a/max(1e-6,np.abs(a).max())*0.9
    f=int(0.008*SR); a[:f]*=np.linspace(0,1,f); a[-f:]*=np.linspace(1,0,f)
    i=int(t*SR); voice[i:i+len(a)]+=a[:N-i]
# env
H=100; n=int(DUR*H); env={'K':np.zeros(n),'B':np.zeros(n)}
for k,t in V.items():
    a=rd(f'audio/{k}.wav'); win=int(SR/H)
    r=np.array([np.sqrt(np.mean(a[i:i+win]**2)) for i in range(0,len(a)-win,win)]); r=r/r.max()
    i0=int(t*H); env[k[0]][i0:i0+len(r)]=r[:n-i0]
envo={k:[round(float(x),3) for x in np.clip(np.convolve(v,np.ones(3)/3,'same')*1.4,0,1)] for k,v in env.items()}
open('data.js','w').write('ENV='+json.dumps(envo)+';TIMX='+open('data/timing.json').read()+';')
rng=np.random.default_rng(3)
sfx=np.zeros(N,np.float32)
def add(t,a,g=1.0):
    i=int(t*SR); a=a[:max(0,N-i)]; sfx[i:i+len(a)]+=a*g
def tt(d): return np.arange(int(d*SR))/SR
def whoosh(d=0.25):
    x=tt(d); n=rng.standard_normal(len(x)); 
    # bandpass sweep via cumulative smoothing
    env=np.sin(np.pi*x/d)**2
    y=np.convolve(n,np.ones(30)/30,'same')-np.convolve(n,np.ones(300)/300,'same')
    return y*env*0.9
def pop(f=600,d=0.12):
    x=tt(d); return np.sin(2*np.pi*(f+f*2*np.exp(-x*40))*x)*np.exp(-x*30)
def boing(f=200,d=0.5):
    x=tt(d); return np.sin(2*np.pi*(f*(1+0.8*np.sin(2*np.pi*9*x)*np.exp(-x*5))+80)*x)*np.exp(-x*6)
def thud(d=0.35):
    x=tt(d); return np.sin(2*np.pi*(70*np.exp(-x*8)+40)*x)*np.exp(-x*9)*1.2
def ding(f=1318,d=0.6):
    x=tt(d); return (np.sin(2*np.pi*f*x)+0.4*np.sin(2*np.pi*f*2.01*x))*np.exp(-x*6)*0.6
def splash(d=0.18):
    x=tt(d); n=rng.standard_normal(len(x)); y=n-np.convolve(n,np.ones(8)/8,'same'); return y*np.exp(-x*22)*0.5
def beep(f=1000,d=0.12):
    x=tt(d); return np.sign(np.sin(2*np.pi*f*x))*0.25*np.minimum(1,np.minimum(x*200,(d-x)*200))
def moo(d=0.9):
    x=tt(d); f=130-35*(x/d)**2+6*np.sin(2*np.pi*5*x); ph=2*np.pi*np.cumsum(f)/SR
    y=sum(np.sin(ph*h)/h for h in range(1,9)); env=np.minimum(1,x*12)*np.minimum(1,(d-x)*8); return y*env*0.35
def stretch(d=0.8):
    x=tt(d); f=300+900*(x/d)**1.5; ph=2*np.pi*np.cumsum(f)/SR; return np.sin(ph)*0.35*np.minimum(1,(d-x)*10)
def scratch(d=0.35):
    x=tt(d); n=rng.standard_normal(len(x)); f=np.linspace(3000,900,len(x)); return np.sin(2*np.pi*np.cumsum(f)/SR)*0.2+n*0.12*np.exp(-x*8)
def boom(d=0.6):
    x=tt(d); return np.sin(2*np.pi*(55*np.exp(-x*3)+30)*x)*np.exp(-x*5)*1.3
def crack(d=0.25):
    x=tt(d); n=rng.standard_normal(len(x)); return n*np.exp(-x*30)*0.7

sfx=np.zeros(N,np.float32)
def add(t,a,g=1.0):
    i=int(t*SR)
    if i>=N: return
    a=a[:max(0,N-i)]; sfx[i:i+len(a)]+=a*g
def tt(d): return np.arange(int(d*SR))/SR
# ukulele-ish bed: karplus-strong
def pluck(f,d=0.7):
    n=int(SR/f); buf=rng.uniform(-1,1,n); out=np.zeros(int(d*SR))
    for i in range(len(out)):
        out[i]=buf[i%n]; buf[i%n]=0.4975*(buf[i%n]+buf[(i+1)%n])
    return out
bed=np.zeros(N,np.float32)
def padd(t,a,g):
    i=int(t*SR); a=a[:max(0,N-i)]; bed[i:i+len(a)]+=a*g

bed=np.zeros(N,np.float32)
def padd(t,a,g):
    i=int(t*SR); a=a[:max(0,N-i)]; bed[i:i+len(a)]+=a*g

for t in [V['K1']-0.1,V['K2']-0.15,V['B2']-0.1]: add(t-0.08,whoosh(),0.5)
add(V['K2']+dur['K2']-0.9,crack(),0.8); add(V['K2']+dur['K2']-0.85,pop(250,0.15),0.6)
# the kick only
add(KICK,crack(0.12),1.0); add(KICK,pop(1100,0.07),0.8)
bed=np.zeros(N,np.float32)
def padd(t,a,g):
    i=int(t*SR); a=a[:max(0,N-i)]; bed[i:i+len(a)]+=a*g

cuts=[V['B1']-0.1,V['K2']-0.15,V['B2']-0.1,anch['pivot'],K3e]
for t in cuts: add(t-0.08,whoosh(),0.6)
add(V['K2']+dur['K2']-0.9,crack(),0.9); add(V['K2']+dur['K2']-0.85,pop(250,0.15),0.7)
add(V['K3']+0.15,ding(),0.7); add(V['K3']+0.2,stretch(0.9),0.8); add(V['K3']+1.3,boing(180,0.5),0.8)
dd=KICK-anch['pivot']; x=tt(dd); f=70+110*(x/dd)**2; add(anch['pivot'],np.sin(2*np.pi*np.cumsum(f)/SR)*0.3*np.minimum(1,x*3)*np.minimum(1,(dd-x)*20),0.6)
add(KICK-0.14,whoosh(0.16),1.0)
add(KICK,crack(),1.0); add(KICK,boom(),1.2); add(KICK,splash(0.3),0.8)
x=tt(0.4); add(KICK+0.1,np.sin(2*np.pi*np.cumsum(500+1800*x/0.4)/SR)*0.25*np.minimum(1,(0.4-x)*20),0.8)
add(KICK+0.55,ding(2093,0.4),0.5); add(KICK+0.62,ding(2637,0.4),0.5)

bed=np.zeros(N,np.float32)
def padd(t,a,g):
    i=int(t*SR)
    if i>=N: return
    a=a[:max(0,N-i)]; bed[i:i+len(a)]+=a*g
Am=[220,261.6,329.6,261.6]
t=0.0; step=0.4
seq=[Am,Am,[174.6,220,261.6,220],[196,246.9,293.7,246.9]]*4
for bar in seq:
    for f in bar:
        if t<END: padd(t,pluck(f),0.35)
        t+=step
mix=voice*1.0+bed*0.3
mix=np.clip(mix/max(1,np.abs(mix).max()*1.05),-1,1)
w=wave.open('data/mix.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
print(tim,anch)
