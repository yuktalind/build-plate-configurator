# 🛠️ CNC Build Plate Configurator

An interactive 3D web configurator for CNC-milled aluminum build plates (5083 series).

## 🎯 Project Goal

Create a real-time visualization tool for custom build plate configurations with:
- Multiple plate sizes (100x200mm to 400x500mm)
- Variable thickness options (9.8mm, 10mm, 12.7mm, 15mm)
- Thread types (M5, M6, M8) with configurable grid spacing
- Accurate visualization of threaded holes and mounting holes
- Material-accurate aluminum rendering with proper lighting

## ⚙️ Implementation

### Technology Stack
- **Three.js (r128)** - 3D rendering engine for WebGL-based visualization
- **Pure HTML/CSS/JavaScript** - No frameworks, maximum compatibility
- **Responsive Design** - Desktop-first, mobile-ready layout

### Key Features
- **Real-time 3D Rendering** - Aluminum material (0.8 metalness, 0.2 roughness)
- **Interactive Rotation** - Auto-rotate with momentum-based manual control
- **Dynamic Specifications** - Auto-calculates thread depth, through-hole status, mounting hole count
- **Accurate Geometry** - Threaded holes based on grid spacing, mounting holes per spec

### Technical Details
```
Scene: Black background, perspective camera at (0, 300, 400)
Lighting: Ambient (0.3) + 2 directional lights (0.6, 0.3)
Material: MeshStandardMaterial with aluminum properties
Interaction: Mouse/touch drag with momentum physics (0.95 damping)
Initial rotation: Y=0°, Z=-20° with auto-rotate at 0.005 rad/frame
```

## 🚀 Deployment

### Recommended: GitHub Pages (100% Free)

**Why GitHub Pages?**
- Completely free with no traffic limits
- Clean URLs (username.github.io/project-name)
- HTTPS included automatically
- Code remains accessible and version-controlled
- Perfect for demonstrating technical capability

**Deployment Steps (5 minutes):**
1. Ensure you have access to my github account yuktalind@gmail.com
2. Create new repository: `build-plate-configurator`
3. Upload HTML file as `index.html`
4. Enable GitHub Pages
5. Live at: `https://[username].github.io/build-plate-configurator/`

## 📋 Technical Specifications

### Plate Configurations
- Sizes: 100x200, 200x200, 200x300, 250x250, 300x300, 300x400, 400x400, 300x500, 400x500 (mm)
- Thickness: 9.8, 10, 12.7, 15 (mm)
- Thread types: M5, M6, M8
- Thread grid: Configurable (default 25mm)

### Hole Specifications
- **M5:** 4.2mm thread diameter, 5.2mm mounting holes
- **M6:** 5.0mm thread diameter, 6.2mm mounting holes
- **M8:** 6.8mm thread diameter, 8.2mm mounting holes

### Through-hole Logic
- ≤9.8mm thickness: Full through-holes
- >9.8mm thickness: 80% depth threaded holes

### Mounting Holes
- 100x200: 2 holes (±50mm on X-axis)
- 200x200: 4 holes (±50mm grid)
- 200x300: 6 holes (±50mm X, ±100mm Z)
- 300x400: 12 holes (distributed pattern)

## 🔧 Material Properties

```javascript
Aluminum 5083 Material:
- Color: 0xc0c0c0 (silver-gray)
- Metalness: 0.8
- Roughness: 0.2
- Environment map intensity: 1.0

Thread Holes:
- Color: 0x1a1a1a (dark)
- Metalness: 0.9
- Roughness: 0.4

Mounting Holes:
- Color: 0x0a0a0a (darker)
- Metalness: 0.95
- Roughness: 0.3
```

## 📱 Mobile Support

Fully responsive with:
- Touch-based rotation control
- Momentum physics on mobile
- Optimized layout (controls on top, 3D view below)
- High DPI support via `devicePixelRatio`

## 🎨 Design Philosophy

- **Minimalist Interface:** Black background, gray controls, aluminum centerpiece
- **Professional Aesthetic:** Clean typography, proper spacing, no clutter
- **User-Focused:** Intuitive controls, real-time feedback, smooth interactions

## 📄 License
Feel free to adapt and customize for your business needs :)
