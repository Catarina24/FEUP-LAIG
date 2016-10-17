class Point2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}


class Point3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toArray() {
		return [this.x, this.y, this.z];
	}
}


class Point3W {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
}


class ColorRGBA {
	constructor(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
	  this.a = a;
	}
}





class Illumination {
  constructor(doublesided, local, ambient, background) {
    this.doublesided = doublesided;
    this.local = local;
    this.ambient = ambient;
    this.background = background;
  }
}


class Light {
  constructor(id, enabled, ambient, diffuse, specular) {
    this.id = id;
    this.enabled = enabled;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
  }
}


class Omni extends Light {
  constructor(light, location) {
    super(light.id, light.enabled, light.ambient, light.diffuse, light.specular);
    this.location = location;
  }
}


class Spot extends Light{
  constructor(light, angle, exponent, target, location) {
    super(light.id, light.enabled, light.ambient, light.diffuse, light.specular);
    this.angle = angle;
    this.exponent = exponent;
    this.location = location;
    this.direction = new Point3(target.x - location.x, target.y - location.y, target.z - location.z);
  }
}


class Texture {
  constructor(id, texture, lengthS, lengthT) {
    this.id = id;
    this.texture = texture;
    this.lengthS = lengthS;
    this.lengthT = lengthT;
  }
}


class  Component {
  constructor(id, transformationID, materialIDs, textureID, childrenIDs) {
		this.id = id;
		this.transformationID = transformationID;
		this.materialIDs = materialIDs;
		this.textureID = textureID;
		this.childrenIDs = childrenIDs ;
  }
}
