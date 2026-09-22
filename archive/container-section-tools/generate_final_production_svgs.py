import os

logo_svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <!-- HashHarbour Official Logo — Reverse Engineered Master Emblem Vector -->
  <path d="
    M 250 25
    A 35 35 0 1 0 250 95
    A 35 35 0 1 0 250 25 Z
    M 250 45
    A 15 15 0 1 1 250 75
    A 15 15 0 1 1 250 45 Z
    
    M 236 95
    L 264 95
    L 264 142
    L 366 150
    L 366 168
    L 264 180
    L 264 192
    L 318 192
    L 318 360
    L 286 360
    L 286 288
    L 264 288
    L 264 426
    C 264 445 308 420 368 372
    C 398 342 408 306 408 306
    C 408 306 392 354 356 396
    C 314 444 278 474 250 503
    C 222 474 186 444 144 396
    C 108 354 92 306 92 306
    C 92 306 102 342 132 372
    C 192 420 236 445 236 426
    L 236 288
    L 214 288
    L 214 360
    L 182 360
    L 182 192
    L 236 192
    L 236 180
    L 134 168
    L 134 150
    L 236 142 Z
  " fill="#FFFFFF" fill-rule="evenodd" />
</svg>'''

wordmark_svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 140" width="800" height="140">
  <!-- HashHarbour Official Wordmark — Vector Reconstructed Stencil Typography -->
  <g fill="#FFFFFF">
    <!-- # (Hash Symbol) -->
    <path d="M 45 30 L 60 30 L 54 55 L 75 55 L 81 30 L 96 30 L 90 55 L 110 55 L 106 70 L 86 70 L 80 95 L 100 95 L 96 110 L 76 110 L 70 135 L 55 135 L 61 110 L 40 110 L 34 135 L 19 135 L 25 110 L 5 110 L 9 95 L 29 95 L 35 70 L 15 70 L 19 55 L 39 55 Z M 41 70 L 35 95 L 55 95 L 61 70 Z" />
    
    <!-- H -->
    <path d="M 125 35 L 145 35 L 145 70 L 180 70 L 180 35 L 200 35 L 200 135 L 180 135 L 180 88 L 145 88 L 145 135 L 125 135 Z" />
    
    <!-- a -->
    <path d="M 245 65 C 220 65 210 80 210 100 C 210 120 220 135 245 135 C 260 135 272 127 278 115 L 278 135 L 296 135 L 296 68 L 278 68 L 278 82 C 272 71 260 65 245 65 Z M 250 82 C 265 82 278 92 278 100 C 278 108 265 118 250 118 C 235 118 228 108 228 100 C 228 92 235 82 250 82 Z" />
    
    <!-- s -->
    <path d="M 345 65 C 320 65 308 78 308 90 C 308 112 345 105 345 118 C 345 124 335 126 325 126 C 315 126 308 120 305 112 L 288 112 C 291 128 305 138 325 138 C 352 138 363 124 363 110 C 363 88 326 95 326 82 C 326 77 334 76 342 76 C 352 76 358 80 361 88 L 378 88 C 375 73 362 65 345 65 Z" />
    
    <!-- h -->
    <path d="M 390 35 L 408 35 L 408 80 C 414 70 425 65 440 65 C 460 65 470 78 470 98 L 470 135 L 452 135 L 452 100 C 452 88 445 80 432 80 C 420 80 408 90 408 105 L 408 135 L 390 135 Z" />
    
    <!-- H -->
    <path d="M 485 35 L 505 35 L 505 70 L 540 70 L 540 35 L 560 35 L 560 135 L 540 135 L 540 88 L 505 88 L 505 135 L 485 135 Z" />
    
    <!-- a -->
    <path d="M 605 65 C 580 65 570 80 570 100 C 570 120 580 135 605 135 C 620 135 632 127 638 115 L 638 135 L 656 135 L 656 68 L 638 68 L 638 82 C 632 71 620 65 605 65 Z M 610 82 C 625 82 638 92 638 100 C 638 108 625 118 610 118 C 595 118 588 108 588 100 C 588 92 595 82 610 82 Z" />
    
    <!-- r -->
    <path d="M 670 68 L 688 68 L 688 83 C 694 72 704 65 718 65 L 724 65 L 724 83 L 715 83 C 700 83 688 92 688 110 L 688 135 L 670 135 Z" />
    
    <!-- b -->
    <path d="M 735 35 L 753 35 L 753 82 C 759 71 770 65 785 65 C 805 65 818 80 818 101 C 818 122 805 138 785 138 C 770 138 759 130 753 118 L 753 135 L 735 135 Z M 775 82 C 760 82 753 92 753 101 C 753 110 760 121 775 121 C 790 121 798 110 798 101 C 798 92 790 82 775 82 Z" />
    
    <!-- o -->
    <path d="M 855 65 C 830 65 818 81 818 101 C 818 121 830 138 855 138 C 880 138 892 121 892 101 C 892 81 880 65 855 65 Z M 855 82 C 870 82 874 93 874 101 C 874 109 870 121 855 121 C 840 121 836 109 836 101 C 836 93 840 82 855 82 Z" />
    
    <!-- u -->
    <path d="M 905 68 L 923 68 L 923 103 C 923 115 930 123 942 123 C 955 123 965 113 965 98 L 965 68 L 983 68 L 983 135 L 965 135 L 965 121 C 959 132 948 138 933 138 C 913 138 905 125 905 105 Z" />
    
    <!-- r -->
    <path d="M 995 68 L 1013 68 L 1013 83 C 1019 72 1029 65 1043 65 L 1049 65 L 1049 83 L 1040 83 C 1025 83 1013 92 1013 110 L 1013 135 L 995 135 Z" />
  </g>
</svg>'''

paths = [
    r'c:\Project_HashHarbour\hashharbour_official_logo.svg',
    r'c:\Project_HashHarbour\hashharbour_official_wordmark.svg',
    r'c:\Project_HashHarbour\frontend\src\assets\hashharbour_official_logo.svg',
    r'c:\Project_HashHarbour\frontend\src\assets\hashharbour_official_wordmark.svg',
    r'c:\Project_HashHarbour\frontend\public\hashharbour_official_logo.svg',
    r'c:\Project_HashHarbour\frontend\public\hashharbour_official_wordmark.svg',
]

for p in paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    content = logo_svg_content if 'logo' in p else wordmark_svg_content
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {p}")
