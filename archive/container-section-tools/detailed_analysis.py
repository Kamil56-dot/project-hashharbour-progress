import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Let's inspect the anchor emblem boundaries more precisely by removing edge noise
# Mask out pixels near outer border (margin of 10px)
clean_arr = arr.copy()
clean_arr[:10, :] = 255
clean_arr[-10:, :] = 255
clean_arr[:, :10] = 255
clean_arr[:, -10:] = 255

dark = clean_arr < 200

# Anchor region Y: 130 to 550
anchor_mask = dark[130:550, :]
ay, ax = np.where(anchor_mask)
print("=== ANCHOR REAL BOUNDS ===")
print("Anchor Y:", ay.min() + 130, "to", ay.max() + 130, "height:", ay.max() - ay.min() + 1)
print("Anchor X:", ax.min(), "to", ax.max(), "width:", ax.max() - ax.min() + 1)
print("Anchor Center X:", (ax.min() + ax.max()) / 2.0)

# Wordmark region Y: 550 to 680
wm_mask = dark[550:680, :]
wy, wx = np.where(wm_mask)
print("\n=== WORDMARK REAL BOUNDS ===")
print("Wordmark Y:", wy.min() + 550, "to", wy.max() + 550, "height:", wy.max() - wy.min() + 1)
print("Wordmark X:", wx.min(), "to", wx.max(), "width:", wx.max() - wx.min() + 1)
print("Wordmark Center X:", (wx.min() + wx.max()) / 2.0)

# Save cropped reference images for deep inspection
anchor_crop = Image.fromarray(clean_arr[ay.min()+130 : ay.max()+131, ax.min() : ax.max()+1])
anchor_crop.save('anchor_crop.png')

wm_crop = Image.fromarray(clean_arr[wy.min()+550 : wy.max()+551, wx.min() : wx.max()+1])
wm_crop.save('wm_crop.png')
print("\nCropped images saved successfully.")
