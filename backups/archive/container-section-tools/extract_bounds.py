import numpy as np
from PIL import Image

img_path = r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png'
img = Image.open(img_path)
arr = np.array(img)

# Grayscale intensity
if arr.ndim == 3:
    gray = arr[:, :, :3].mean(axis=2)
else:
    gray = arr.copy()

# The strokes are dark line art on a light background.
# Threshold to find dark pixels (< 200)
dark = gray < 200

# Let's filter out noise by taking connected components or thresholding line density
# Row sums in logo region
logo_mask = dark.copy()
logo_mask[:130, :] = False
logo_mask[680:, :] = False

print("=== ANCHOR EMBLEM REGION (Y 130 to 550) ===")
anchor_mask = dark.copy()
anchor_mask[:130, :] = False
anchor_mask[550:, :] = False
anchor_y, anchor_x = np.where(anchor_mask)
print(f"Anchor Y: min={anchor_y.min()}, max={anchor_y.max()}, height={anchor_y.max()-anchor_y.min()+1}")
print(f"Anchor X: min={anchor_x.min()}, max={anchor_x.max()}, width={anchor_x.max()-anchor_x.min()+1}")
print(f"Anchor Center X: {(anchor_x.min() + anchor_x.max()) / 2.0}")

print("\n=== WORDMARK REGION (Y 560 to 670) ===")
wordmark_mask = dark.copy()
wordmark_mask[:560, :] = False
wordmark_mask[670:, :] = False
wm_y, wm_x = np.where(wordmark_mask)
print(f"Wordmark Y: min={wm_y.min()}, max={wm_y.max()}, height={wm_y.max()-wm_y.min()+1}")
print(f"Wordmark X: min={wm_x.min()}, max={wm_x.max()}, width={wm_x.max()-wm_x.min()+1}")
print(f"Wordmark Center X: {(wm_x.min() + wm_x.max()) / 2.0}")
