import numpy as np
from PIL import Image

img_path = r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png'
img = Image.open(img_path).convert('L')
arr = np.array(img)

# Threshold: dark pixels of the drawing (e.g. gray < 200)
binary = arr < 200

# Remove small noise by counting 3x3 neighborhood
from scipy.ndimage import generate_binary_structure, binary_opening
filtered = binary_opening(binary, structure=np.ones((2,2)))

# Anchor region Y: 130 to 550
anchor_crop = filtered[130:550, :]
ay, ax = np.where(anchor_crop)
print("Anchor Y:", ay.min() + 130, "to", ay.max() + 130, "height:", ay.max() - ay.min() + 1)
print("Anchor X:", ax.min(), "to", ax.max(), "width:", ax.max() - ax.min() + 1)
print("Anchor Center X:", (ax.min() + ax.max()) / 2.0)

# Wordmark region Y: 560 to 670
wm_crop = filtered[560:670, :]
wy, wx = np.where(wm_crop)
print("Wordmark Y:", wy.min() + 560, "to", wy.max() + 560, "height:", wy.max() - wy.min() + 1)
print("Wordmark X:", wx.min(), "to", wx.max(), "width:", wx.max() - wx.min() + 1)
print("Wordmark Center X:", (wx.min() + wx.max()) / 2.0)
