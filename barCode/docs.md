# Barcode Scanner Planner

When creating this project, it was intended to be a simple traditional image processing tool that only involves 1D computation. Because it's much more simple compared to other image processing algorithms, I decided to independently design and implement an algorithm that can scan and read a barcode.

# Algorithm

- Accept a video input
- Scan line(s) of video for processing
- Convert the lines of video to an array of brightness values
- Compute the delta between each brightness value array
- Use a threshold to determine large brightness changes
- Aggregate the large changes into a single array with the change and distance from previous
- Detect the starts and ends of the barcode while finding the length of each bar
  - use 10+:2:1:1 ratio provided from the specification
- Identify probable barcode areas
  - or not
- Decode barcode data
  - Detect invalid barcodes
  - Reverse upside-down barcodes
- Convert data to