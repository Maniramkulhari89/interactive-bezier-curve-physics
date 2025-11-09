## Overview
This project implements an interactive cubic Bézier curve that behaves like a springy rope reacting to mouse input. The curve dynamically responds to user interaction while visualizing mathematical properties like tangents and control points.

## Features Implemented

### ✅ Core Requirements
- *Manual Bézier Mathematics*: Complete implementation of cubic Bézier curves from scratch
- *Spring-Damping Physics*: Realistic physics simulation for natural motion
- *Tangent Visualization*: Dynamic tangent lines showing curve direction and steepness
- *Real-time Interaction*: 60 FPS responsive mouse-based control
- *Modular Code Organization*: Clean separation of math, physics, rendering, and input

### ✅ Technical Implementation
- *Pure JavaScript*: No external libraries or frameworks
- *Manual Canvas Rendering*: Custom rendering without built-in curve APIs
- *Real-time Physics*: Spring-mass-damper system with Euler integration
- *Interactive Controls*: Dynamic parameter adjustment

## Mathematical Implementation

### Bézier Curve Calculation
The cubic Bézier curve is implemented using the standard formula:

\[B(t) = (1-t)^3P_0 + 3(1-t)^2tP_1 + 3(1-t)t^2P_2 + t^3P_3\]

Where:
- \(P_0, P_3\) are fixed endpoints
- \(P_1, P_2\) are dynamic control points
- \(t\) is the parameter from 0 to 1

### Tangent Calculation
Tangent vectors are computed using the derivative:

\[B'(t) = 3(1-t)^2(P_1-P_0) + 6(1-t)t(P_2-P_1) + 3t^2(P_3-P_2)\]

Tangents are normalized and visualized as directional lines along the curve.

## Physics Model

### Spring-Damping System
The dynamic control points follow a spring-damping model:

\[acceleration = -k \cdot (position - target) - damping \cdot velocity\]

Where:
- \(k\) = spring constant (stiffness)
- \(damping\) = velocity damping factor
- Integrated using Euler method for real-time simulation

### Parameters
- *Spring Constant (k)*: Controls stiffness (0.01 - 0.5)
- *Damping*: Controls oscillation reduction (0.7 - 0.99)
- Default: k=0.15, damping=0.88 for natural rope-like behavior

## Code Architecture

### Module Structure
1. *bezier.js* - Bézier mathematics and curve calculations
2. *physics.js* - Spring-damping physics simulation  
3. *renderer.js* - Canvas rendering and visualization
4. *input.js* - Mouse input handling and interaction

### Key Design Decisions
1. *Manual Implementation*: All mathematical operations implemented from first principles
2. *Separation of Concerns*: Each module handles a specific aspect of the system
3. *Performance Optimization*: Efficient point sampling and rendering for 60 FPS
4. *Interactive Design*: Real-time parameter adjustment and visual feedback

## Setup and Usage

### Running the Application
1. Open index.html in a modern web browser
2. Move mouse near control points P₁ or P₂ to interact
3. Adjust parameters using sliders for different behaviors

### Controls
- *Mouse*: Move near P₁/P₂ to deform the curve
- *Spring Constant*: Adjust curve stiffness
- *Damping*: Control oscillation damping
- *Tangent Density*: Change number of tangent lines
- *Reset Button*: Return to initial configuration

## Testing and Verification

### Functional Tests
1. *Curve Rendering*: Verify smooth Bézier curve with 200 sample points
2. *Physics Response*: Confirm springy behavior with mouse interaction
3. *Tangent Visualization*: Check accurate tangent direction and normalization
4. *Performance*: Maintain 60 FPS during interaction

### Mathematical Validation
- Curve points calculated manually match expected positions
- Tangent vectors correctly represent curve derivatives
- Physics simulation produces natural, stable motion

## Technical Specifications

### Browser Compatibility
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Requires Canvas support and ES6 classes

### Performance
- Target: 60 FPS on modern hardware
- Memory: Efficient point sampling and object reuse
- CPU: Optimized calculations with minimal allocations

## Demo Instructions
1. Record a 30-second screen capture showing:
   - Mouse interaction with control points
   - Tangent visualization during deformation
   - Parameter adjustment effects
   - Smooth 60 FPS performance

## Future Enhancements
- Touch input support for mobile devices
- Multiple interconnected Bézier segments
- 3D deformation with z-axis control
- Export functionality for curve data

---
