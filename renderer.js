/**
 * Renderer Module
 * Manual rendering of Bézier curves, control points, and tangents
 * Academic Integrity: This is my original work implementing rendering from scratch
 */

class Renderer {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.tangentDensity = 8;      // Number of tangents to display
        this.tangentLength = 40;      // Length of tangent lines
        this.controlPointRadius = 6;  // Size of control points
    }

    /**
     * Render the complete Bézier curve visualization
     * @param {BezierCurve} bezier - Bézier curve instance
     */
    render(bezier) {
        this.renderCurve(bezier);
        this.renderControlPoints(bezier.controlPoints);
        this.renderTangents(bezier);
        this.renderLabels(bezier.controlPoints);
    }

    /**
     * Render the Bézier curve path
     * @param {BezierCurve} bezier - Bézier curve instance
     */
    renderCurve(bezier) {
        const points = bezier.sampleCurvePoints();
        
        if (points.length < 2) return;
        
        this.ctx.strokeStyle = '#4fc3f7';
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.stroke();
        
        // Add glow effect
        this.ctx.strokeStyle = 'rgba(79, 195, 247, 0.3)';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();
    }

    /**
     * Render control points as interactive circles
     * @param {Array} controlPoints - Array of control points
     */
    renderControlPoints(controlPoints) {
        // Draw lines between control points
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(controlPoints[0].x, controlPoints[0].y);
        for (let i = 1; i < controlPoints.length; i++) {
            this.ctx.lineTo(controlPoints[i].x, controlPoints[i].y);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw control points
        controlPoints.forEach((point, index) => {
            // Different colors for fixed vs dynamic points
            let color;
            if (index === 0 || index === 3) {
                color = '#ff5252'; // Red for fixed endpoints
            } else {
                color = '#69f0ae'; // Green for dynamic control points
            }
            
            // Draw point circle
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, this.controlPointRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw outline
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }

    /**
     * Render tangent lines along the curve
     * @param {BezierCurve} bezier - Bézier curve instance
     */
    renderTangents(bezier) {
        const tangents = bezier.getTangentPoints(this.tangentDensity);
        
        tangents.forEach(({ point, tangent }) => {
            const endX = point.x + tangent.x * this.tangentLength;
            const endY = point.y + tangent.y * this.tangentLength;
            
            // Draw tangent line
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(point.x, point.y);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            
            // Draw tangent point
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw arrowhead
            this.renderArrowhead(point.x, point.y, endX, endY);
        });
    }

    /**
     * Render arrowhead for tangent lines
     * @param {number} startX - Start X coordinate
     * @param {number} startY - Start Y coordinate  
     * @param {number} endX - End X coordinate
     * @param {number} endY - End Y coordinate
     */
    renderArrowhead(startX, startY, endX, endY) {
        const arrowSize = 6;
        const angle = Math.atan2(endY - startY, endX - startX);
        
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI/6),
            endY - arrowSize * Math.sin(angle - Math.PI/6)
        );
        this.ctx.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI/6), 
            endY - arrowSize * Math.sin(angle + Math.PI/6)
        );
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Render labels for control points
     * @param {Array} controlPoints - Array of control points
     */
    renderLabels(controlPoints) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const labels = ['P₀', 'P₁', 'P₂', 'P₃'];
        
        controlPoints.forEach((point, index) => {
            this.ctx.fillText(labels[index], point.x, point.y - 20);
        });
    }

    /**
     * Render interaction hint when mouse is near control points
     * @param {Object} mouse - Mouse position {x, y}
     * @param {Array} controlPoints - Array of control points
     * @param {number} interactionRadius - Interaction radius
     */
    renderInteractionHint(mouse, controlPoints, interactionRadius) {
        let nearPoint = false;
        
        // Check if mouse is near any dynamic control point
        for (let i = 1; i <= 2; i++) {
            if (i >= controlPoints.length) continue;
            
            const point = controlPoints[i];
            const distance = Math.sqrt(
                Math.pow(mouse.x - point.x, 2) + 
                Math.pow(mouse.y - point.y, 2)
            );
            
            if (distance < interactionRadius) {
                nearPoint = true;
                break;
            }
        }
        
        if (nearPoint) {
            // Draw interaction radius hint
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(mouse.x, mouse.y, interactionRadius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
}