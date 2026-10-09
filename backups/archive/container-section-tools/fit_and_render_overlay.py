import numpy as np
from PIL import Image, ImageDraw
import xml.etree.ElementTree as ET

# Load master reference
ref_img = Image.open(r'C:\Users\Admin\.gemini\antigravity\brain\eef3bb7d-7e12-4170-a9ca-d4042ce0681a\media__1785496984637.png').convert('L')
ref_arr = np.array(ref_img)

# Let's inspect the original image outline stroke coordinates by extracting contours!
# Binary artwork mask (white strokes on black background)
bw = (ref_arr > 100).astype(np.uint8)

print("Artwork total active pixels:", bw.sum())

# Let's write an initial precision SVG for the Anchor Emblem
def build_anchor_svg():
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <path d="
    M 511.5 152
    A 29 29 0 1 1 511.4 152 Z
    M 511.5 168
    A 13 13 0 1 0 511.6 168 Z
    
    M 499.5 210
    L 523.5 210
    L 523.5 250
    L 608 255
    L 608 270
    L 523.5 280
    L 523.5 290
    L 568 290
    L 568 430
    L 542 430
    L 542 370
    L 523.5 370
    L 523.5 485
    C 523.5 500 560 480 610 440
    C 635 415 643 385 643 385
    C 643 385 630 425 600 460
    C 565 500 535 525 511.5 549
    C 488 525 458 500 423 460
    C 393 425 380 385 380 385
    C 380 385 388 415 413 440
    C 463 480 499.5 500 499.5 485
    L 499.5 370
    L 481 370
    L 481 430
    L 455 430
    L 455 290
    L 499.5 290
    L 499.5 280
    L 415 270
    L 415 255
    L 499.5 250
    Z
  " fill="none" stroke="white" stroke-width="2"/>
</svg>'''
    return svg

with open('test_logo.svg', 'w') as f:
    f.write(build_anchor_svg())

print("Saved test_logo.svg")
