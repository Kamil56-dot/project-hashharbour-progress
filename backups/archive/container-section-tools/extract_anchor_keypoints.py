import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

mask = (arr > 100)
mask[:, :20] = False
mask[:, 1000:] = False
mask[:20, :] = False
mask[1000:, :] = False

center_x = 511.5

# Let's slice every row Y from 150 to 555 and print min X, max X, and internal segments (gaps)
print("=== Y-SLICES OF ANCHOR EMBLEM ===")
for y in range(152, 550):
    row = mask[y, :]
    xs = np.where(row)[0]
    if len(xs) > 0:
        # find contiguous segments in row
        diffs = np.diff(xs)
        split_points = np.where(diffs > 1)[0]
        segments = []
        start = xs[0]
        for sp in split_points:
            segments.append((start, xs[sp]))
            start = xs[sp+1]
        segments.append((start, xs[-1]))
        
        # print summary for key rows or when segment count changes
        seg_str = " | ".join([f"[{s[0]}..{s[1]}] (w={s[1]-s[0]+1})" for s in segments])
        if y in [152, 160, 170, 180, 190, 200, 210, 220, 230, 240, 245, 250, 255, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 549]:
            print(f"Y={y:3d} (nseg={len(segments)}): {seg_str}")
