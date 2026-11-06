# Per-reel BGM generator: python3 bgm.py <preset> <seconds> <out.wav>. Rotate presets, never reuse the last reel's. Quiet, no SFX.
import numpy as np,sys
from scipy.io import wavfile
SR=44100
def nf(m): return 440*2**((m-69)/12)
def tone(f,d,kind):
    n=int(d*SR); t=np.arange(n)/SR
    if kind=='pluck': y=(np.sin(2*np.pi*f*t)+.5*np.sin(4*np.pi*f*t)+.25*np.sin(6*np.pi*f*t))*np.exp(-t*7)
    elif kind=='marimba': y=(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*4*t)*np.exp(-t*30))*np.exp(-t*9)
    elif kind=='bass': y=np.tanh(2*np.sin(2*np.pi*f*t))*np.exp(-t*5)
    elif kind=='chip': y=np.sign(np.sin(2*np.pi*f*t))*.5*np.exp(-t*8)
    elif kind=='pad': y=(np.sin(2*np.pi*f*t)+np.sin(2*np.pi*f*1.005*t))*.5*np.minimum(1,t*8)*np.exp(-t*2.5)
    else: y=np.sin(2*np.pi*f*t)*np.exp(-t*6)
    return y
def hat(d=.05,vol=1):
    n=int(d*SR); r=np.random.default_rng(1).standard_normal(n); r=np.diff(r,prepend=0); return r*np.exp(-np.arange(n)/SR*60)*vol
def kick(d=.18):
    n=int(d*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*(50+90*np.exp(-t*30))*t)*np.exp(-t*14)
P={ # bpm, root midi, chord roots (semitones from root, one per bar), scale for melody, bass kind, melody kind, drums
 'sneaky':dict(bpm=104,root=50,bars=[0,0,7,5],sc=[0,3,5,7,10,12],bass='pluck',mel='marimba',drums='hat',gain=.9),
 'sunny':dict(bpm=96,root=55,bars=[0,5,7,0],sc=[0,2,4,7,9,12],bass='pluck',mel='marimba',drums='bossa',gain=.9),
 'lofi':dict(bpm=78,root=52,bars=[0,9,5,7],sc=[0,3,5,7,10,12],bass='bass',mel='pad',drums='lofi',gain=.8),
 'chip':dict(bpm=124,root=57,bars=[0,7,5,7],sc=[0,2,4,7,9,12],bass='chip',mel='chip',drums='hat',gain=.55),
 'tense':dict(bpm=112,root=45,bars=[0,1,0,6],sc=[0,1,4,6,7,10],bass='bass',mel='pluck',drums='kickhat',gain=.8)}
def make(name,sec):
    p=P[name]; N=int(sec*SR)+SR; y=np.zeros(N); rng=np.random.default_rng(abs(hash(name))%999); beat=60/p['bpm']; t=0; bar=0
    def add(x,at,v):
        i=int(at*SR)
        if i<N: x=x[:N-i]; y[i:i+len(x)]+=x*v
    while t<sec+.5:
        r=p['root']+p['bars'][bar%4]
        for b in range(8):
            at=t+b*beat/2
            if b%2==0 or (name=='sneaky' and b in(3,7)): add(tone(nf(r-12+(7 if b==4 else 0)),beat,p['bass']),at,.5)
            if rng.random()<.55 and b%2==1: add(tone(nf(p['root']+12+int(rng.choice(p['sc']))),beat,p['mel']),at,.28)
            d=p['drums']
            if d in('hat','kickhat','bossa') and True: add(hat(),at,.35 if b%2 else .2)
            if d in('kickhat','lofi') and b in(0,4): add(kick(),at,.5)
            if d=='lofi' and b in(2,6): add(hat(.09),at,.5)
        if p['mel']=='pad': add(tone(nf(r+12),beat*4,'pad'),t,.3)
        t+=beat*4; bar+=1
    y=y[:int(sec*SR)+int(.2*SR)]; return y/np.abs(y).max()*p['gain']
if __name__=='__main__':
    y=make(sys.argv[1],float(sys.argv[2])); wavfile.write(sys.argv[3],SR,(y*32767).astype(np.int16))

def make_epic(sec):
    """Cinematic motivating build: swelling pad chords + bell arpeggio + heartbeat kicks + low bass, crescendo. Starts quiet, ends big."""
    N=int(sec*SR); y=np.zeros(N); bpm=84; beat=60/bpm
    def add(x,at,v):
        i=int(at*SR)
        if 0<=i<N: x=x[:N-i]; y[i:i+len(x)]+=x*v
    chords=[[57,60,64],[53,57,60],[48,55,64],[55,59,62]]  # Am F C G
    t=0;bar=0
    while t<sec:
        ch=chords[bar%4]; d=beat*4
        for m in ch:
            tt=np.arange(int(d*1.2*SR))/SR
            pad=sum(np.sin(2*np.pi*nf(m+o)*tt*(1+k*.003)) for o,k in[(0,0),(12,1),(0,-1)])/3
            env=np.minimum(1,tt/1.2)*np.exp(-np.maximum(0,tt-d)*4)
            add(pad*env,t,.35)
        add(tone(nf(ch[0]-24),d,'bass'),t,.5)
        for b in range(8):
            n=ch[[0,1,2,1,2,1,0,1][b]]+12
            add(tone(nf(n+12),beat,'marimba'),t+b*beat/2,.22)
        for b in range(4): add(kick(),t+b*beat,.55 if bar>=1 else .3)
        t+=d; bar+=1
    ramp=np.linspace(.35,1,N)**1.2; fade=np.minimum(1,np.arange(N)/(SR*.5))
    y=y*ramp*fade; return y/np.abs(y).max()*.9

def make_inspire(sec):
    """Uplifting 'never give up' cue that hits on the first sample: impact + rising I-V-vi-IV in C, piano arpeggio, strings, soaring bell melody, building drums."""
    N=int(sec*SR); y=np.zeros(N); bpm=96; beat=60/bpm
    def add(x,at,v):
        i=int(at*SR)
        if 0<=i<N: x=x[:N-i]; y[i:i+len(x)]+=x*v
    # impact on the cut
    n=int(1.6*SR); tt=np.arange(n)/SR
    boom=np.sin(2*np.pi*(38+70*np.exp(-tt*9))*tt)*np.exp(-tt*2.6); add(boom,0,1.0)
    nz=np.random.default_rng(3).standard_normal(n); nz=np.convolve(nz,np.ones(40)/40,'same'); add(nz*np.exp(-tt*3),0,.5)
    chords=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]   # C G Am F
    t=0;bar=0
    while t<sec:
        ch=chords[bar%4]; d=beat*4
        for m in ch:
            k=np.arange(int(d*1.15*SR))/SR
            st=sum(np.sin(2*np.pi*nf(m+o)*k*(1+j*.004)) for o,j in[(0,0),(12,1),(12,-1),(-12,0)])/4
            add(st*np.minimum(1,k/.7)*np.exp(-np.maximum(0,k-d)*5),t,.3)
        add(tone(nf(ch[0]-24),d,'bass'),t,.5)
        arp=[0,1,2,1,2,1,2,1]
        for b in range(8): add(tone(nf(ch[arp[b]]+12),beat,'marimba'),t+b*beat/2,.25)
        mel=[ch[2]+12,ch[2]+14,ch[2]+16,ch[2]+12] if bar%2==0 else [ch[1]+19,ch[2]+17,ch[2]+16,ch[2]+12]
        for b,mn in enumerate(mel): add(tone(nf(mn+12),beat*1.2,'bell' if False else 'marimba'),t+b*beat,.22+.03*b)
        for b in range(4): add(kick(),t+b*beat,.5 if bar>=1 else .35)
        if bar>=2:
            for b in range(8): add(hat(),t+b*beat/2,.3)
        t+=d; bar+=1
    ramp=np.linspace(.75,1,N); y=y*ramp; return y/np.abs(y).max()*.92
