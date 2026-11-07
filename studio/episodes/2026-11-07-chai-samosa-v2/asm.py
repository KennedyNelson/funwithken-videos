# Chai-samosa reel audio: trim each line, cap inner pauses, place on a timeline, words.json + meta.json + per-speaker lip envelope, voices + quiet 'sunny' BGM.
# The BGM cuts out on the wallet reveal so the silence lands the joke.
import numpy as np, json, subprocess, re, sys
from scipy.io import wavfile
sys.path.insert(0, '../..'); import bgm
SR = 44100; L = json.load(open('lines.json'))
GAP = [1.3, 0.22, 0.12, -0.08, 1.75, 0.12, 0.9]   # start of line i relative to end of line i-1 (first = lead-in ride)
TAIL = 1.5
CAP = [.2, .3, .2, .12, .18, .12, .14]
h = int(.012 * SR)
def load(i):
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', f'raw/{i+1:02d}.mp3', '-ac', '1', '-ar', str(SR), f'data/l{i}.wav'], check=True)
    _, x = wavfile.read(f'data/l{i}.wav'); x = x.astype(float) / 32768
    e = np.convolve(np.abs(x), np.ones(h) / h, 'same'); th = max(.01, e.max() * .05)
    act = np.where(e > th)[0]; x = x[max(0, act[0] - 300):act[-1] + 1500]; e = e[max(0, act[0] - 300):act[-1] + 1500]
    s = e < th; o = []; k = 0; n = len(x)
    while k < n:
        j = k
        if s[k]:
            while j < n and s[j]: j += 1
            o.append(x[k:k + min(j - k, int(CAP[i] * SR))])
        else:
            while j < n and not s[j]: j += 1
            o.append(x[k:j])
        k = j
    y = np.concatenate(o); return y / np.sqrt((y ** 2).mean()) * .09
clips = [load(i) for i in range(len(L))]
starts = []; t = 0
for i, y in enumerate(clips):
    t = (t + GAP[i]); starts.append(t); t += len(y) / SR
DUR = round(t + TAIL, 2); N = int(DUR * SR)
v = np.zeros(N); W = []; spk = {'k': np.zeros(N), 'd': np.zeros(N), 'c': np.zeros(N)}
for i, (y, s0) in enumerate(zip(clips, starts)):
    a = int(s0 * SR); v[a:a + len(y)] += y; spk[L[i][0]][a:a + len(y)] += np.abs(y)
    e = np.convolve(np.abs(y), np.ones(h) / h, 'same'); vo = e > e.max() * .07; cum = np.cumsum(vo) / SR; tot = cum[-1]
    ws = L[i][1].split(); w8 = [len(re.sub(r'\W', '', w)) + 1.5 for w in ws]; c = 0
    for w, g in zip(ws, w8):
        p = c / sum(w8) * tot; c += g; q = c / sum(w8) * tot
        W.append(dict(w=w, line=i, spk=L[i][0], s=round(s0 + int(np.searchsorted(cum, p)) / SR, 3), e=round(s0 + int(np.searchsorted(cum, q)) / SR, 3)))
ends = [round(s + len(y) / SR, 3) for s, y in zip(starts, clips)]
# BGM: sunny bed ~14% under the voices, hard cut at the wallet reveal (end of line 5)
b = bgm.make('sunny', DUR); b = b[:N]; b = np.pad(b, (0, N - len(b)))
cut = int((ends[5] + .05) * SR); fade = np.ones(N); fade[cut:] = 0; fade[cut - int(.06 * SR):cut] = np.linspace(1, 0, int(.06 * SR))
vr = np.sqrt((v[v != 0] ** 2).mean()); b = b / np.sqrt((b ** 2).mean() + 1e-9) * vr * .14 * fade
mix = v + b; mix = mix / np.abs(mix).max() * .89
wavfile.write('data/mix.wav', SR, (mix * 32767).astype(np.int16))
# lip envelope per speaker at 30 fps
env = {}
for k, a in spk.items():
    f = int(SR / 30); m = np.array([a[i:i + f].mean() for i in range(0, N, f)]); env[k] = np.round(np.clip(m / (m.max() + 1e-9) * 1.6, 0, 1), 3).tolist()
json.dump(env, open('data/env.json', 'w'))
json.dump(W, open('data/words.json', 'w'))
meta = dict(dur=DUR, starts=[round(s, 3) for s in starts], ends=ends)
json.dump(meta, open('data/meta.json', 'w')); print(meta)
