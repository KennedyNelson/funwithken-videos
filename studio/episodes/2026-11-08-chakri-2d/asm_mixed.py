# Mixed audio: Kalu = the owner's own recorded voice (raw/owner-k1.wav, owner-k2.wav cut from owner-voice.m4a), shopkeeper = ElevenLabs v4 (raw/s1.mp3). Ends on 3 s of the shopkeeper's disappointed face.
# usage: python3 asm_mixed.py -> data/mix.wav, words.json, env.json, meta.json
import numpy as np, json, re, subprocess
from scipy.io import wavfile
L = json.load(open('lines.json')); SR = 16000
files = ['raw/owner-k1.wav', 'raw/s1.mp3', 'raw/owner-k2.wav']; tempo = [1.0, 1.0, 1.0]
def load(f, tp):
    af = f'silenceremove=start_periods=1:start_threshold=-38dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-38dB:start_silence=0.05,areverse,atempo={tp},loudnorm=I=-15:TP=-1.5'
    p = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', f, '-af', af, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(p, dtype=np.float32)
clips = [load(f, t) for f, t in zip(files, tempo)]
d = [len(c) / SR for c in clips]; print('trimmed durations', d)
starts = [.6]; starts.append(starts[0] + d[0] + .2); starts.append(starts[1] + d[1] + .15)
DUR = round(starts[2] + d[2] + 3.0, 2)
mix = np.zeros(int(DUR * SR) + SR, dtype=np.float32)
for s, c in zip(starts, clips): i = int(s * SR); mix[i:i + len(c)] += c * .9
wavfile.write('data/mix16.wav', SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', 'data/mix16.wav', '-ar', '44100', '-ac', '2', 'data/mix.wav'])
n = int(DUR * 30) + 1; env = {'k': [0] * n, 's': [0] * n}; W = []; f = SR // 30
for i, ((spk, txt), s, c) in enumerate(zip(L, starts, clips)):
    e = np.abs(c); h = int(.012 * SR); e = np.convolve(e, np.ones(h) / h, 'same'); voiced = e > max(e.max() * .12, e.mean() * .5)
    cum = np.cumsum(voiced) / SR; tot = max(cum[-1], .25); ws = txt.split(); w8 = [len(re.sub(r'\W', '', w)) + 1.5 for w in ws]; cu = 0
    for w, g in zip(ws, w8):
        p = cu / sum(w8) * tot; cu += g; q = cu / sum(w8) * tot
        W.append(dict(w=w, line=i, spk=spk, s=round(s + int(np.searchsorted(cum, p)) / SR, 3), e=round(s + int(np.searchsorted(cum, q)) / SR, 3)))
    m = np.array([e[j * f:(j + 1) * f].mean() if j * f < len(e) else 0 for j in range(int(len(c) / f) + 1)]); top = np.percentile(m, 95) or 1
    for j, v in enumerate(m):
        idx = int(s * 30) + j
        if idx < n: env[spk][idx] = round(float(np.clip(v / top, 0, 1)), 3)
json.dump(env, open('data/env.json', 'w')); json.dump(W, open('data/words.json', 'w'))
json.dump(dict(dur=DUR, lines=[[L[i][0], round(starts[i], 3), round(starts[i] + d[i], 3)] for i in range(3)]), open('data/meta.json', 'w'))
print(DUR, [[L[i][0], round(starts[i], 2), round(starts[i] + d[i], 2)] for i in range(3)])
