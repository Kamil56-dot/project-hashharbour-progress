import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# White artwork strokes (> 100)
strokes = arr > 100

# Let's separate into Anchor (Y < 550) and Wordmark (Y >= 550)
ay, ax = np.where(strokes & (np.arange(1024)[:, None] < 550))
print("=== ANCHOR EMBLEM REAL STROKE BOUNDS ===")
print(f"Y: {ay.min()} to {ay.max()} (Height: {ay.max() - ay.min() + 1})")
print(f"X: {ax.min()} to {ax.max()} (Width: {ax.max() - ax.min() + 1})")
print(f"Center X: {(ax.min() + ax.max()) / 2.0:.2f}")

wy, wx = np.where(strokes & (np.arange(1024)[:, None] >= 550))
print("\n=== WORDMARK REAL STROKE BOUNDS ===")
print(f"Y: {wy.min()} to {wy.max()} (Height: {wy.max() - wy.min() + 1})")
print(f"X: {wx.min()} to {wx.max()} (Width: {wx.max() - wx.min() + 1})")
print(f"Center X: {(wx.min() + wx.max()) / 2.0:.2f}")
