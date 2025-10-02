const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple HTTP server
function startServer(port) {
  const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  });
  server.listen(port);
  return server;
}

(async () => {
  const port = 8765;
  const server = startServer(port);

  let browser;
  let exitCode = 0;

  try {
    browser = await chromium.launch();
    const page = await browser.newPage();

    // Collect console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Navigate and wait for load
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });

    // Wait a bit for 3D rendering
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'smoke-test.png' });

    // Check for canvas
    const canvas = await page.$('#plate-canvas');
    if (!canvas) {
      console.error('❌ SMOKE TEST FAILED: Canvas element not found');
      exitCode = 1;
    }

    // Check for JS errors
    const errors = consoleMessages.filter(msg => msg.startsWith('[error]'));
    if (errors.length > 0) {
      console.error('❌ SMOKE TEST FAILED: Console errors detected:');
      errors.forEach(err => console.error('  ', err));
      exitCode = 1;
    }

    // Check canvas dimensions (should not be 0x0)
    const canvasSize = await page.evaluate(() => {
      const canvas = document.getElementById('plate-canvas');
      return { width: canvas.width, height: canvas.height };
    });

    if (canvasSize.width === 0 || canvasSize.height === 0) {
      console.error('❌ SMOKE TEST FAILED: Canvas has zero dimensions');
      exitCode = 1;
    }

    // Check if canvas is blank (all pixels same color = likely render failure)
    const isBlank = await page.evaluate(() => {
      const canvas = document.getElementById('plate-canvas');
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample first pixel
      const firstR = data[0], firstG = data[1], firstB = data[2];

      // Check if all pixels match (simple blank check)
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== firstR || data[i+1] !== firstG || data[i+2] !== firstB) {
          return false; // Found different pixel, not blank
        }
      }
      return true; // All pixels same = blank
    });

    if (isBlank) {
      console.error('❌ SMOKE TEST FAILED: Canvas is blank (no rendering detected)');
      exitCode = 1;
    }

    if (exitCode === 0) {
      console.log('✓ SMOKE TEST PASSED');
      console.log(`  Canvas size: ${canvasSize.width}x${canvasSize.height}`);
      console.log(`  Screenshot saved: smoke-test.png`);
    }

  } catch (error) {
    console.error('❌ SMOKE TEST FAILED:', error.message);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(exitCode);
  }
})();
