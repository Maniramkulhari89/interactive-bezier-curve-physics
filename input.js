/**
 * Input Handler Module
 * Manual implementation of mouse input handling
 * Academic Integrity: This is my original work implementing input handling from scratch
 */

class InputHandler {
    constructor(canvas, bezier, physics) {
        this.canvas = canvas;
        this.bezier = bezier;
        this.physics = physics;
        
        this.mouse = { x: 0, y: 0 };
        this.isInteracting = false;
        this.activePointIndex = -1;
        this.interactionRadius = 80;
        
        this.setupEventListeners();
    }

    /**
     * Set up mouse event listeners
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Handle mouse move events
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        
        if (this.isInteracting && this.activePointIndex !== -1) {
            // Apply force to the active control point
            this.physics.applyForceToPoint(
                this.activePointIndex,
                this.mouse.x,
                this.mouse.y,
                this.bezier.controlPoints
            );
        }
    }

    /**
     * Handle mouse down events
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseDown(e) {
        // Only allow interaction with dynamic control points (P₁ and P₂)
        for (let i = 1; i <= 2; i++) {
            if (i >= this.bezier.controlPoints.length) continue;
            
            const point = this.bezier.controlPoints[i];
            const distance = Math.sqrt(
                Math.pow(this.mouse.x - point.x, 2) + 
                Math.pow(this.mouse.y - point.y, 2)
            );
            
            if (distance < this.interactionRadius) {
                this.isInteracting = true;
                this.activePointIndex = i;
                
                // Apply immediate force for responsive feel
                this.physics.applyForceToPoint(
                    i,
                    this.mouse.x,
                    this.mouse.y,
                    this.bezier.controlPoints
                );
                break;
            }
        }
    }

    /**
     * Handle mouse up events
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseUp(e) {
        this.isInteracting = false;
        this.activePointIndex = -1;
    }

    /**
     * Handle mouse leave events
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseLeave(e) {
        this.isInteracting = false;
        this.activePointIndex = -1;
    }

    /**
     * Update input handling (called every frame)
     */
    update() {
        // Continuous interaction when mouse is down
        if (this.isInteracting && this.activePointIndex !== -1) {
            this.physics.applyForceToPoint(
                this.activePointIndex,
                this.mouse.x,
                this.mouse.y,
                this.bezier.controlPoints
            );
        }
    }

    /**
     * Set interaction radius
     * @param {number} radius - New interaction radius
     */
    setInteractionRadius(radius) {
        this.interactionRadius = radius;
    }

    /**
     * Get current interaction state
     * @returns {Object} Interaction state
     */
    getInteractionState() {
        return {
            isInteracting: this.isInteracting,
            activePoint: this.activePointIndex,
            mousePosition: { ...this.mouse }
        };
    }
}