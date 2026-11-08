# Timing for the cafe reel: speaker windows from the owner's script + the clip's own speech bursts (envelope of the clip audio).
# usage: python3 asm.py <path to 16k mono wav of the clip>  (the third-party audio stays out of the repo)
import numpy as np, json, re, sys
from scipy.io import wavfile
L = json.load(open('lines.json')); DUR = 15.31
sr, x = wavfile.read(sys.argv[1]); x = x.astype(float) / 32768
h = int(.012 * sr); e = np.convolve(np.abs(x), np.ones(h) / h, 'same')
W = []
for i, (spk, a, b, txt) in enumerate(L):
    A, B = int(a * sr), int(b * sr); seg = e[A:B]; voiced = seg > max(seg.max() * .12, e.mean() * .6)
    cum = np.cumsum(voiced) / sr; tot = max(cum[-1], .25)
    ws = txt.split(); w8 = [len(re.sub(r'\W', '', w)) + 1.5 for w in ws]; c = 0
    for w, g in zip(ws, w8):
        p = c / sum(w8) * tot; c += g; q = c / sum(w8) * tot
        W.append(dict(w=w, line=i, spk=spk, s=round(a + int(np.searchsorted(cum, p)) / sr, 3), e=round(a + int(np.searchsorted(cum, q)) / sr, 3)))
f = sr // 30; n = int(DUR * 30) + 1; env = {'k': [0] * n, 'b': [0] * n}
m = np.array([e[i * f:(i + 1) * f].mean() if i * f < len(e) else 0 for i in range(n)])
for spk, a, b, _ in L:
    mm = m[int(a * 30):int(b * 30) + 1]; top = np.percentile(mm, 95) or 1
    for i in range(int(a * 30), min(n, int(b * 30) + 1)): env[spk][i] = round(float(np.clip(m[i] / top, 0, 1)), 3)
json.dump(env, open('data/env.json', 'w')); json.dump(W, open('data/words.json', 'w'))
json.dump(dict(dur=DUR, lines=[[l[0], l[1], l[2]] for l in L]), open('data/meta.json', 'w'))
print(len(W), 'words'); print([(w['w'], w['s'], w['e']) for w in W])
