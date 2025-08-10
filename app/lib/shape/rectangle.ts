export type Color = { r: number; g: number; b: number; a: number };

export class Rectangle {
  public color: Color = {
    b: 255,
    g: 255,
    r: 255,
    a: 1,
  };

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    option?: { color?: Partial<Color> }
  ) {
    if (option) {
      if (option.color) {
        const { r, g, b, a } = option.color;
        if (r) this.color.r = r;
        if (g) this.color.g = g;
        if (b) this.color.b = b;
        if (a) this.color.a = a;
      }
    }
  }
}
