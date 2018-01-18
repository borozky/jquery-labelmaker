/* eslint-disable */
import $ from 'jquery';


export function isUndefined(a) {
    return a === undefined;
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
export function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
};


/** @param {HTMLElement} element */
export function getElementCornerCoordinates(element) {
    //Parse CSS matrix
    var matrix = [];
    var matrixVal = $(element).css('transform');

    if(matrixVal != "none"){
        var matrixParsed = matrixVal.substr(7, matrixVal.length - 8).split(',');
        for(var i in matrixParsed) matrix[i] = parseFloat(matrixParsed[i]);
    } else {
        matrix = [1, 0, 0, 1, 0, 0];
    }

    var hW = element.offsetWidth / 2; //Half of width
    var hH = element.offsetHeight / 2; //Half of height
    var o = { x: element.offsetLeft + hW, y: element.offsetTop + element.offsetHeight / 2} //Transform origin

    //Define shape points and transform by matrix
    var p1 = {
        x: o.x + matrix[0] * -hW + matrix[2] * -hH + matrix[4],
        y: o.y + matrix[1] * -hW + matrix[3] * -hH + matrix[5]
    }; //Left top

    var p2 = {
        x: o.x + matrix[0] * +hW + matrix[2] * -hH + matrix[4],
        y: o.y + matrix[1] * +hW + matrix[3] * -hH + matrix[5]
    }; //Right top

    var p3 = {
        x: o.x + matrix[0] * +hW + matrix[2] * +hH + matrix[4],
        y: o.y + matrix[1] * +hW + matrix[3] * +hH + matrix[5]
    }; //Right bottom

    var p4 = {
        x: o.x + matrix[0] * -hW + matrix[2] * +hH + matrix[4],
        y: o.y + matrix[1] * -hW + matrix[3] * +hH + matrix[5]
    }; //Left bottom

    return [p1, p2, p3, p4];
}

/**
 * Gets element angle of rotation in degress. If element is not rotated, return 0
 * @param {HTMLElement} element
 * @return {number}
 */
export function getElementRotation(element) {

    // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    let computedStyle = window.getComputedStyle(element, null);
    let transformMatrix = computedStyle.getPropertyValue("transform");
    
    if(transformMatrix === null) {
        return 0;
    }

    let matrixValues = transformMatrix.split("(")[1].split(")")[0].split(",");
    let a = matrixValues[0];
    let b = matrixValues[1];
    let c = matrixValues[2];
    let d = matrixValues[3];

    let scale = Math.sqrt(a*a + b*b);
    let sin = b/scale;
    let angle = Math.atan2(b,a) * (180/Math.PI);

    return angle;
}