# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal product configurator with live 3D visualization for CNC-milled aluminum build plates (5083 series). Single-file HTML application using Three.js for real-time rendering.

## Primary Workflow: GitHub Issues

All changes to the application should follow this issue-based workflow:

### Creating Issues

**Via Chat** (Preferred):
- User describes issue to Claude in conversation
- Claude translates vague descriptions into concise, professionally-worded issue descriptions
- Claude creates issue using `gh issue create -t "title" -b "description"`
- Claude implements immediately after creating issue

**Via GitHub Web UI**:
1. Navigate to repository Issues tab
2. Click "New Issue"
3. Provide title and description

**Via Command Line**:
```bash
gh issue create -t "Issue title" -b "Detailed description"
```

### Implementation Process

1. Claude implements the requested change
2. Claude commits with reference to issue number: `fixes #123` or `closes #123`
3. GitHub automatically closes the issue when commit is pushed
4. User tests the deployed change at https://yuktalind.github.io/build-plate-configurator/
5. If issues persist, user reopens the issue with feedback

### Viewing Issues

```bash
gh issue list                    # List all open issues
gh issue view 123                # View specific issue
gh issue status                  # View your issues
```

## Smoke Test Requirement

**MANDATORY**: Run smoke test before every commit to ensure rendering works.

```bash
./smoke-test.sh
```

The smoke test:
- Starts local HTTP server on port 8765
- Captures screenshot using playwright CLI
- Verifies screenshot is not blank
- Fails if canvas fails to render

**Never commit changes that fail the smoke test.**

## Development Commands

Since this is a static HTML file with no build process, development is straightforward:

- **Local development**: Open `index.html` directly in a browser using `file://` protocol
- **Local server** (if needed): `python3 -m http.server 8000` then visit `http://localhost:8000`
- **No build, lint, or test commands** - this is a pure HTML/CSS/JavaScript application
- **Smoke test**: `./smoke-test.sh` - Run before every commit

## Deployment

GitHub Pages deployment is the intended hosting method:
1. Repository must be named `build-plate-configurator`
2. Upload `index.html` to repository root
3. Enable GitHub Pages in repository settings
4. Access via `https://[username].github.io/build-plate-configurator/`

## German CNC Terminology

**UI Language**: All user-facing text must be in German. Code remains in English.

**Key Terms**:
- **Gewinde** = thread/threading
- **Sackloch** = blind hole (doesn't go through)
- **Durchgangsloch** = through-hole (goes all the way through)
- **Gewindebohrung** = threaded hole
- **Senkung** = counterbore (flat-bottomed recess)
- **Rastergewinde** = grid thread holes
- **Befestigungslöcher** = mounting holes
- **Gewindetiefe** = thread depth
- **Plattengröße** = plate size
- **Dicke** = thickness
- **Gewindeart** = thread type
- **Gewinderaster** = thread grid
- **Randabstand** = edge margin

## Architecture

### Single-File Structure
Everything is contained in `index.html`:
- HTML structure with left sidebar controls and right 3D canvas
- Embedded CSS with responsive layout (desktop-first, mobile breakpoint at 768px)
- Embedded JavaScript using Three.js r128 and three-bvh-csg from CDN

### Key Components

**3D Scene Setup**:
- Adjustable background (grayscale slider)
- Perspective camera at (0, 300, 400)
- Adjustable ambient light (slider 0-1, default 0.3) + 2 directional lights
- WebGL renderer with shadow mapping and high DPI support

**Plate Generation** (`createPlate` function):
- Uses CSG boolean subtraction (three-bvh-csg library)
- Main plate: BoxGeometry with aluminum material (0.8 metalness, 0.2 roughness)
- Thread holes: Actual geometry subtraction with simplified thread ridges (torus rings)
- Mounting holes: Counterbore (Senkung) with through-threaded holes for thick plates
- Edge margin detection prevents holes too close to boundaries

**Hole Types**:
- **Rastergewinde**: Grid pattern, thickness ≤9.8mm = Durchgangsgewinde, >9.8mm = Sacklochgewinde at 9.8mm depth
- **Befestigungslöcher**: Fixed positions, always Senkung mit Durchgangsgewinde (counterbore with through-thread)
- Senkung depth = thickness - 9.8mm (for plates >9.8mm thick)

**Interaction Model**:
- Mouse/touch drag for manual rotation with momentum physics
- Auto-rotate when idle (0.005 rad/frame on Y-axis)
- Velocity damping factor: 0.95
- Z-rotation clamped between -90° and +90°

### Configuration Parameters

**Plate Sizes**: 100x200, 200x200, 200x300, 250x250, 300x300, 300x400, 400x400, 300x500, 400x500 (mm)

**Thickness Options**: 9.8, 10, 12.7, 15 (mm)

**Thread Types and Diameters**:
- M5: 4.2mm thread hole, 5.2mm mounting hole
- M6: 5.0mm thread hole, 6.2mm mounting hole
- M8: 6.8mm thread hole, 8.2mm mounting hole

**Thread Depth Logic**:
- Rastergewinde: ≤9.8mm = Durchgangsgewinde (through), >9.8mm = Sacklochgewinde at 9.8mm depth
- Befestigungslöcher: Always through-threaded with Senkung for plates >9.8mm

**Mounting Hole Patterns** (`getMountingHoleCount`):
- 100x200: 2 holes at ±50mm on X-axis
- 200x200: 4 holes in ±50mm grid
- 200x300: 6 holes at ±50mm X, ±100mm Z
- 300x400: 12 holes in distributed pattern
- Other sizes: Default to 4 holes

**Edge Margin**:
- Configurable distance from plate edge (default 10mm)
- Rastergewinde skipped if hole radius + margin exceeds plate boundary
- Does not apply to fixed Befestigungslöcher

### Material Properties

**Aluminum 5083** (`aluminumMaterial`):
- Color: 0xc0c0c0 (silver-gray)
- Metalness: 0.8, Roughness: 0.2

## Development Rules

1. **No emojis** - Remove them if encountered in any files
2. **Local testing workflow** - Provide file:// or localhost URLs for verification before deployment
3. **No markdown commits** until final README.md is ready - this will be the only .md file committed
4. **No celebrations** - Remain skeptical until user confirms functionality
