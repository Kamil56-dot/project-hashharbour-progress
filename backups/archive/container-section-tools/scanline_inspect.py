import numpy as np
from PIL import Image

img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
arr = np.array(img)

# Print values across row Y=200 from X=300 to X=700
print("Values at Y=200, X=350..650 (step 10):")
print(arr[200, 350:650:10])

# Print values across column X=510 from Y=100 to Y=600 (step 10)
print("\nValues at X=510, Y=100..600 (step 10):")
print(arr[100:600:10, 510])

# Find min pixel value in the image
print("\nMin value in image:", arr.min())
print("Max value in image:", arr.max())

# Where are pixels < 50 located?
p_dark = arr < 50
print("\nNumber of pixels < 50:", p_dark.sum())
dy, dx = np.where(p_dark)
print(f"Y range (<50): {dy.min()} to {dy.max()}")
print(f"X range (<50): {dx.min()} to {dx.max()}")
