#!/usr/bin/env python3
import http.server
import socketserver
import threading
import sys
import time
from pathlib import Path

def start_server(port):
    """Start a simple HTTP server in a background thread"""
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass  # Suppress server logs

    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", port), Handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd

def main():
    port = 8765
    server = start_server(port)
    time.sleep(0.5)  # Let server start

    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            console_messages = []
            page.on("console", lambda msg: console_messages.append(f"[{msg.type}] {msg.text}"))

            # Navigate and wait
            page.goto(f"http://localhost:{port}", wait_until="networkidle")
            time.sleep(2)  # Wait for 3D rendering

            # Screenshot
            page.screenshot(path="smoke-test.png")

            # Check canvas exists
            canvas = page.query_selector("#plate-canvas")
            if not canvas:
                print("❌ SMOKE TEST FAILED: Canvas element not found")
                return 1

            # Check for JS errors
            errors = [msg for msg in console_messages if msg.startswith("[error]")]
            if errors:
                print("❌ SMOKE TEST FAILED: Console errors detected:")
                for err in errors:
                    print(f"  {err}")
                return 1

            # Check canvas dimensions
            canvas_size = page.evaluate("""() => {
                const canvas = document.getElementById('plate-canvas');
                return { width: canvas.width, height: canvas.height };
            }""")

            if canvas_size['width'] == 0 or canvas_size['height'] == 0:
                print("❌ SMOKE TEST FAILED: Canvas has zero dimensions")
                return 1

            # Check if canvas is blank
            is_blank = page.evaluate("""() => {
                const canvas = document.getElementById('plate-canvas');
                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const firstR = data[0], firstG = data[1], firstB = data[2];

                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] !== firstR || data[i+1] !== firstG || data[i+2] !== firstB) {
                        return false;
                    }
                }
                return true;
            }""")

            if is_blank:
                print("❌ SMOKE TEST FAILED: Canvas is blank (no rendering detected)")
                print(f"  Screenshot saved to: smoke-test.png")
                return 1

            print("✓ SMOKE TEST PASSED")
            print(f"  Canvas size: {canvas_size['width']}x{canvas_size['height']}")
            print(f"  Screenshot saved: smoke-test.png")

            browser.close()
            return 0

    except ImportError:
        print("❌ Playwright not available for Python")
        print("Install with: pip install playwright && playwright install chromium")
        return 1
    except Exception as e:
        print(f"❌ SMOKE TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return 1
    finally:
        server.shutdown()

if __name__ == "__main__":
    sys.exit(main())
