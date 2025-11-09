/**
 * Bézier Curve Mathematics Module
 * Manual implementation of cubic Bézier curve calculations
 * Academic Integrity: This is my original work implementing all math from scratch
 */

class BezierCurve {
    constructor() {
        this.controlPoints = [];
        this.curvePoints = [];
        this.sampleDensity = 200; // Number of points to sample along the curve
    }

    /**
     * Calculate a point on the cubic Bézier curve at parameter t
     * B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
     * @param {number} t - Parameter between 0 and 1
     * @returns {Object} {x, y} coordinates
     */
    calculatePoint(t) {
        if (this.controlPoints.length !== 4) {
            throw new Error('Bezier curve requires exactly 4 control points');
        }

        const p0 = this.controlPoints[0];
        const p1 = this.controlPoints[1];
        const p2 = this.controlPoints[2];
        const p3 = this.controlPoints[3];

        // Manual calculation using the cubic Bézier formula
        const u = 1 - t;
        const u2 = u * u;
        const u3 = u2 * u;
        const t2 = t * t;
        const t3 = t2 * t;

        const x = u3 * p0.x + 
                 3 * u2 * t * p1.x + 
                 3 * u * t2 * p2.x + 
                 t3 * p3.x;

        const y = u3 * p0.y + 
                 3 * u2 * t * p1.y + 
                 3 * u * t2 * p2.y + 
                 t3 * p3.y;

        return { x, y };
    }

    /**
     * Calculate the tangent vector at parameter t using the derivative
     * B'(t) = 3(1-t)²(P₁-P₀) + 6(1-t)t(P₂-P₁) + 3t²(P₃-P₂)
     * @param {number} t - Parameter between 0 and 1
     * @returns {Object} {x, y} tangent vector
     */
    calculateTangent(t) {
        if (this.controlPoints.length !== 4) {
            throw new Error('Bezier curve requires exactly 4 control points');
        }

        const p0 = this.controlPoints[0];
        const p1 = this.controlPoints[1];
        const p2 = this.controlPoints[2];
        const p3 = this.controlPoints[3];

        const u = 1 - t;
        const u2 = u * u;
        const t2 = t * t;

        // Manual derivative calculation
        const dx = 3 * u2 * (p1.x - p0.x) + 
                   6 * u * t * (p2.x - p1.x) + 
                   3 * t2 * (p3.x - p2.x);

        const dy = 3 * u2 * (p1.y - p0.y) + 
                   6 * u * t * (p2.y - p1.y) + 
                   3 * t2 * (p3.y - p2.y);

        return { x: dx, y: dy };
    }

    /**
     * Calculate the normalized tangent vector at parameter t
     * @param {number} t - Parameter between 0 and 1
     * @returns {Object} {x, y} normalized tangent vector
     */
    calculateNormalizedTangent(t) {
        const tangent = this.calculateTangent(t);
        const length = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
        
        if (length === 0) return { x: 0, y: 0 };
        
        return {
            x: tangent.x / length,
            y: tangent.y / length
        };
    }

    /**
     * Sample multiple points along the curve for rendering
     * @returns {Array} Array of {x, y} points
     */
    sampleCurvePoints() {
        this.curvePoints = [];
        
        for (let i = 0; i <= this.sampleDensity; i++) {
            const t = i / this.sampleDensity;
            const point = this.calculatePoint(t);
            this.curvePoints.push(point);
        }
        
        return this.curvePoints;
    }

    /**
     * Get tangent points at regular intervals for visualization
     * @param {number} density - Number of tangents to display
     * @returns {Array} Array of {point, tangent} objects
     */
    getTangentPoints(density) {
        const tangents = [];
        
        for (let i = 0; i <= density; i++) {
            const t = i / density;
            const point = this.calculatePoint(t);
            const tangent = this.calculateNormalizedTangent(t);
            
            tangents.push({
                point: point,
                tangent: tangent
            });
        }
        
        return tangents;
    }

    /**
     * Calculate the length of the curve (approximation)
     * @returns {number} Approximate length of the curve
     */
    calculateLength() {
        const points = this.sampleCurvePoints();
        let length = 0;
        
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i-1].x;
            const dy = points[i].y - points[i-1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        
        return length;
    }
}