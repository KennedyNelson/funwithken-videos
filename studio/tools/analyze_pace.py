import numpy as np, parselmouth, glob
from scipy.io import wavfile
SR=24000
SYL={'1a':11,'1b':11,'2':5,'3':7,'4':12,'5':4,'6':12,'7':5,'8':14}
for k,n in SYL.items():
    sr,x=wavfile.read(f'L{k}.wav'); x=x.astype(float)/32768
    env=np.convolve(np.abs(x),np.ones(240)/240,'same'); act=env>0.03
    # speech time = active time with gaps >0.2s removed
    idx=np.where(act)[0]; dur=(idx[-1]-idx[0])/SR
    gaps=np.diff(idx); big=gaps[gaps>0.2*SR]; sp=dur-(big.sum()-len(big)*0.2*SR)/SR
    s=parselmouth.Sound(f'L{k}.wav'); p=s.to_pitch().selected_array['frequency']; p=p[p>0]
    st=12*np.log2(np.percentile(p,90)/np.percentile(p,10))
    print(k,'speech',round(sp,2),'syl/s',round(n/sp,2),'F0 med',int(np.median(p)),'p90',int(np.percentile(p,90)),'range st',round(st,1),'rms dB',round(20*np.log10(np.sqrt((x[act]**2).mean())),1))
