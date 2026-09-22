import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

print("Top-left 10x10 corner (0..10, 0..10):")
print(arr[0:10, 0:10])

print("\nCenter region (500..510, 500..510):")
print(arr[500:510, 500:510])

print("\nBottom-left 10x10 corner (1014..1024, 0..10):")
print(arr[1014:1024, 0:10])
