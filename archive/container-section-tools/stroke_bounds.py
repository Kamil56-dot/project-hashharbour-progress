import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Outline stroke pixels are dark (< 100)
strokes = arr < 100
sy, sx = np.where(strokes)

print("=== STROKE PIXELS BOUNDS (< 100) ===")
print("Y min:", sy.min(), "Y max:", sy.max())
print("X min:", sx.min(), "X max:", sx.max())

# Anchor stroke bounds (Y: 140..550)
a_mask = (arr < 100) & (np.arange(1024)[:, None] >= 140) & (np.arange(1024)[:, None] <= 550)
ay, ax = np.where(a_mask)
print("\n=== ANCHOR STROKES (< 100) ===")
print(f"Y: {ay.min()} to {ay.max()} (h={ay.max()-ay.min()+1})")
print(f"X: {ax.min()} to {ax.max()} (w={ax.max()-ax.min()+1})")
print(f"Anchor Center X: {(ax.min()+ax.max())/2.0:.2f}")

# Wordmark stroke bounds (Y: 550..670)
w_mask = (arr < 100) & (np.arange(1024)[:, None] >= 550) & (np.arange(1024)[:, None] <= 670)
wy, wx = np.where(w_mask)
print("\n=== WORDMARK STROKES (< 100) ===")
print(f"Y: {wy.min()} to {wy.max()} (h={wy.max()-wy.min()+1})")
print(f"X: {wx.min()} to {wx.max()} (w={wx.max()-wx.min()+1})")
print(f"Wordmark Center X: {(wx.min()+wx.max())/2.0:.2f}")
