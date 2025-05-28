"use strict";

const SHAPE_1D_ARRAY = "shape1darray";
const SHAPE_2D_ARRAY = "shape2darray";
const SHAPE_VEC_ARRAY = "shapevecarray";
const SHAPE_GL_ARRAY = "shapeglarray";

function vec2(x, y) {
  this.x = x;
  this.y = y;
}

class ShapesKit {
  constructor(
    type = SHAPE_VEC_ARRAY,
    calcuX = (x) => {
      return x;
    },
    calcuY = (y) => {
      return y;
    }
  ) {
    this.shapesKitType = type;
    this.calcuX = calcuX;
    this.calcuY = calcuY;
    this.vec 
  }
  rect(x, y, w, h) {
    let vertices;
    if (this.shapesKitType == SHAPE_VEC_ARRAY) {
      vertices = [
        new vec2(this.calcuX(x), this.calcuY(y)),
        new vec2(this.calcuX(x + w), this.calcuY(y)),
        new vec2(this.calcuX(x + w), this.calcuY(y + h)),
        new vec2(this.calcuX(x), this.calcuY(y + h)),
        new vec2(this.calcuX(x), this.calcuY(y)),
      ];
    } else if (this.shapesKitType == SHAPE_1D_ARRAY) {
      vertices = [
        this.calcuX(x),
        this.calcuY(y),
        this.calcuX(x + w),
        this.calcuY(y),
        this.calcuX(x + w),
        this.calcuY(y + h),
        this.calcuX(x),
        this.calcuY(y + h),
        this.calcuX(x),
        this.calcuY(y),
      ];
    } else if (this.shapesKitType == SHAPE_2D_ARRAY) {
      vertices = [
        [this.calcuX(x), this.calcuY(y)],
        [this.calcuX(x + w), this.calcuY(y)],
        [this.calcuX(x + w), this.calcuY(y + h)],
        [this.calcuX(x), this.calcuY(y + h)],
        [this.calcuX(x), this.calcuY(y)],
      ];
    } else if (this.shapesKitType == SHAPE_GL_ARRAY) {
      vertices = [
        this.calcuX(x),
        this.calcuY(y),
        this.calcuX(x + w),
        this.calcuY(y),
        this.calcuX(x + w),
        this.calcuY(y + h),
        this.calcuX(x + w),
        this.calcuY(y + h),
        this.calcuX(x),
        this.calcuY(y + h),
        this.calcuX(x),
        this.calcuY(y),
      ];
    }
    return vertices;
  }

  line(x0, y0, x1, y1) {
    let vertices = [];
    if (this.shapesKitType == SHAPE_VEC_ARRAY) {
      vertices.push(
        new vec2(this.calcuX(x0), this.calcuY(y0)),
        new vec2(this.calcuX(x1), this.calcuY(y1))
      );
    } else if (this.shapesKitType == SHAPE_1D_ARRAY) {
      vertices.push(
        this.calcuX(x0),
        this.calcuY(y0),
        this.calcuX(x1),
        this.calcuY(y1)
      );
    } else if (this.shapesKitType == SHAPE_2D_ARRAY) {
      vertices.push(
        [this.calcuX(x0), this.calcuY(y0)],
        [this.calcuX(x1), this.calcuY(y1)]
      );
    }
    return vertices;
  }

  circle(x, y, s) {
    let vertices = [];
    const detail = 0.05;
    const TWO_PI = Math.PI * 2;
    for (let i = 0; i < TWO_PI - detail; i += detail) {
      let xc = Math.sin(i) * s;
      let yc = Math.cos(i) * s;
      // console.log(xc)

      if (this.shapesKitType == SHAPE_VEC_ARRAY) {
        vertices.push(new vec2(this.calcuX(x + xc), this.calcuY(y + yc)));
      } else if (this.shapesKitType == SHAPE_1D_ARRAY) {
        vertices.push(this.calcuX(x + xc), this.calcuY(y + yc));
      } else if (this.shapesKitType == SHAPE_2D_ARRAY) {
        vertices.push([this.calcuX(x + xc), this.calcuY(y + yc)]);
      }
    }
    vertices.push(vertices[0]);
    return vertices;
  }

  ellipse(x, y, w, h) {}
  quad() {}
  square() {}
  arc() {}
  triangle(x0, y0, x1, y1, x2, y2) {}
  polygon(x, y, s, n) {}
}
