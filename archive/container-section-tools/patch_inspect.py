import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Print a 20x20 patch near center top (e.g. Y=160..180, X=500..520)
print("Patch around center top (Y 160..170, X 505..515):")
print(arr[160:170, 505:515])

# Print histogram of the whole image
vals, counts = np.unique(arr, return_counts=True)
print("\nTop 10 most frequent gray values:")
sorted_indices = np.argsort(counts)[::-1]
for i in range(min(15, len(vals))):
    idx = sorted_indices[i]
    print(f"Value {vals[idx]}: count={counts[idx]}")
