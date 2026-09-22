import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Let's inspect rows 140..550 in columns 50..970
sub = arr[140:550, 50:970]
dark = sub < 100
sy, sx = np.where(dark)

print("Anchor real bounding box in 50..970 range:")
print("Y:", sy.min() + 140, "to", sy.max() + 140, "height:", sy.max() - sy.min() + 1)
print("X:", sx.min() + 50, "to", sx.max() + 50, "width:", sx.max() - sx.min() + 1)
print("Center X:", (sx.min() + sx.max() + 100) / 2.0)

# Wordmark real bounding box in 50..970 range
wm_sub = arr[550:670, 50:970]
w_dark = wm_sub < 100
wy, wx = np.where(w_dark)

print("\nWordmark real bounding box in 50..970 range:")
print("Y:", wy.min() + 550, "to", wy.max() + 550, "height:", wy.max() - wy.min() + 1)
print("X:", wx.min() + 50, "to", wx.max() + 50, "width:", wx.max() - wx.min() + 1)
print("Center X:", (wx.min() + wx.max() + 100) / 2.0)
