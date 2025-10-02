# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal product configurator with live 3D visualization for CNC-milled aluminum build plates (5083 series). Single-file HTML application using Three.js for real-time rendering.

## Primary Workflow: GitHub Issues

All changes to the application should follow this issue-based workflow:

### Creating Issues

**Via GitHub Web UI**:
1. Navigate to repository Issues tab
2. Click "New Issue"
3. Provide title and description of requested change

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

## Development Commands

Since this is a static HTML file with no build process, development is straightforward:

- **Local development**: Open `index.html` directly in a browser using `file://` protocol
- **Local server** (if needed): `python3 -m http.server 8000` then visit `http://localhost:8000`
- **No build, lint, or test commands** - this is a pure HTML/CSS/JavaScript application

## Deployment

GitHub Pages deployment is the intended hosting method:
1. Repository must be named `build-plate-configurator`
2. Upload `index.html` to repository root
3. Enable GitHub Pages in repository settings
4. Access via `https://[username].github.io/build-plate-configurator/`

## Architecture

### Single-File Structure
Everything is contained in `index.html`:
- HTML structure with left sidebar controls and right 3D canvas
- Embedded CSS with responsive layout (desktop-first, mobile breakpoint at 768px)
- Embedded JavaScript using Three.js r128 from CDN

### Key Components

**3D Scene Setup** (lines 198-225):
- Black background, perspective camera at (0, 300, 400)
- Ambient light (0.3 intensity) + 2 directional lights (0.6, 0.3)
- WebGL renderer with shadow mapping and high DPI support

**Plate Generation** (`createPlate` function, lines 242-338):
- Main plate: BoxGeometry with aluminum material (0.8 metalness, 0.2 roughness)
- Thread holes: CylinderGeometry array based on grid spacing and thread type
- Mounting holes: Fixed positions determined by plate dimensions

**Interaction Model** (lines 374-426):
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
- Thickness ≤9.8mm: Full through-holes
- Thickness >9.8mm: 80% depth threaded holes

**Mounting Hole Patterns** (`getMountingHoleCount`, lines 340-346):
- 100x200: 2 holes at ±50mm on X-axis
- 200x200: 4 holes in ±50mm grid
- 200x300: 6 holes at ±50mm X, ±100mm Z
- 300x400: 12 holes in distributed pattern
- Other sizes: Default to 4 holes

### Material Properties

**Aluminum 5083** (`aluminumMaterial`, lines 227-232):
- Color: 0xc0c0c0 (silver-gray)
- Metalness: 0.8, Roughness: 0.2

**Thread Holes** (lines 273-277):
- Color: 0x1a1a1a (dark), Metalness: 0.9, Roughness: 0.4

**Mounting Holes** (lines 293-297):
- Color: 0x0a0a0a (darker), Metalness: 0.95, Roughness: 0.3

## Development Rules

1. **No emojis** - Remove them if encountered in any files
2. **Local testing workflow** - Provide file:// or localhost URLs for verification before deployment
3. **No markdown commits** until final README.md is ready - this will be the only .md file committed
4. **No celebrations** - Remain skeptical until user confirms functionality
