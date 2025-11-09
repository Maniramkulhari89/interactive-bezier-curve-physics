/**
 * Physics System Module
 * Manual implementation of spring-damping physics
 * Academic Integrity: This is my original work implementing physics from scratch
 */

class PhysicsSystem {
    constructor() {
        this.springConstant = 0.15;    // k - spring stiffness
        this.damping = 0.88;           // damping factor
        this.velocities = [];          // velocities for each control point
        this.restPositions = [];       // rest positions for spring calculation
        this.mouseInfluence = 0.8;     // how strongly mouse affects targets
    }

    /**
     * Initialize physics for control points
     * @param {Array} controlPoints - Array of control points
     */
    setupControlPoints(controlPoints) {
        this.velocities = [];
        this.restPositions = [];
        
        for (let i = 0; i < controlPoints.length; i++) {
            this.velocities.push({ x: 0, y: 0 });
            this.restPositions.push({ ...controlPoints[i] });
        }
    }

    /**
     * Update physics for all control points
     * Uses spring-damping model: acceleration = -k * (position - target) - damping * velocity
     * @param {Array} controlPoints - Array of control points to update
     */
    update(controlPoints) {
        // Only apply physics to dynamic control points (P₁ and P₂)
        for (let i = 1; i <= 2; i++) {
            if (i >= controlPoints.length) continue;
            
            const point = controlPoints[i];
            const velocity = this.velocities[i];
            const restPosition = this.restPositions[i];
            
            // Calculate spring force (F = -k * displacement)
            const displacementX = point.x - restPosition.x;
            const displacementY = point.y - restPosition.y;
            
            const springForceX = -this.springConstant * displacementX;
            const springForceY = -this.springConstant * displacementY;
            
            // Apply damping force (F = -damping * velocity)
            const dampingForceX = -this.damping * velocity.x;
            const dampingForceY = -this.damping * velocity.y;
            
            // Total acceleration (assuming mass = 1, so F = a)
            const accelerationX = springForceX + dampingForceX;
            const accelerationY = springForceY + dampingForceY;
            
            // Update velocity using Euler integration
            velocity.x += accelerationX;
            velocity.y += accelerationY;
            
            // Update position using Euler integration
            point.x += velocity.x;
            point.y += velocity.y;
            
            // Apply some friction to prevent infinite oscillation
            velocity.x *= 0.995;
            velocity.y *= 0.995;
        }
    }

    /**
     * Apply external force to a control point (for mouse interaction)
     * @param {number} index - Control point index
     * @param {number} targetX - Target X position
     * @param {number} targetY - Target Y position
     * @param {Array} controlPoints - Array of control points
     */
    applyForceToPoint(index, targetX, targetY, controlPoints) {
        if (index < 1 || index > 2 || index >= controlPoints.length) return;
        
        const point = controlPoints[index];
        const restPosition = this.restPositions[index];
        
        // Move rest position toward target with influence factor
        restPosition.x += (targetX - restPosition.x) * this.mouseInfluence;
        restPosition.y += (targetY - restPosition.y) * this.mouseInfluence;
        
        // Add some immediate velocity for responsive feel
        this.velocities[index].x += (targetX - point.x) * 0.1;
        this.velocities[index].y += (targetY - point.y) * 0.1;
    }

    /**
     * Reset control point to its original rest position
     * @param {number} index - Control point index
     */
    resetPoint(index) {
        if (index < this.restPositions.length) {
            this.velocities[index] = { x: 0, y: 0 };
        }
    }

    /**
     * Set spring constant
     * @param {number} k - New spring constant
     */
    setSpringConstant(k) {
        this.springConstant = Math.max(0.01, Math.min(0.5, k));
    }

    /**
     * Set damping factor
     * @param {number} damping - New damping factor (0-1)
     */
    setDamping(damping) {
        this.damping = Math.max(0.7, Math.min(0.99, damping));
    }
}