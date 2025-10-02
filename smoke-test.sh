#!/bin/bash

# Start HTTP server in background
python3 -m http.server 8765 > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server
sleep 1

# Capture screenshot
playwright screenshot --wait-for-timeout 2000 http://localhost:8765 smoke-test.png 2>&1 | grep -v "Navigating\|Waiting\|Capturing"

# Kill server
kill $SERVER_PID 2>/dev/null

# Check if screenshot exists and has reasonable size
if [ ! -f smoke-test.png ]; then
    echo "❌ SMOKE TEST FAILED: Screenshot not created"
    exit 1
fi

SIZE=$(wc -c < smoke-test.png)
if [ $SIZE -lt 10000 ]; then
    echo "❌ SMOKE TEST FAILED: Screenshot too small ($SIZE bytes)"
    exit 1
fi

# Simple check: if the image is mostly black pixels, likely blank canvas
# Using ImageMagick if available, otherwise just pass based on size
if command -v identify > /dev/null 2>&1; then
    # Check average pixel value (0=black, 255=white)
    AVG=$(identify -format "%[fx:mean*255]" smoke-test.png 2>/dev/null | cut -d. -f1)
    if [ "$AVG" -lt "5" ]; then
        echo "❌ SMOKE TEST FAILED: Canvas appears blank (avg brightness: $AVG/255)"
        echo "   Screenshot saved: smoke-test.png"
        exit 1
    fi
fi

echo "✓ SMOKE TEST PASSED"
echo "  Screenshot saved: smoke-test.png"
exit 0
