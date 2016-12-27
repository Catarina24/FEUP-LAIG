class Coord2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

    toArray() {
		return [this.x, this.y];
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}
}


class Coord3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toArray() {
		return [this.x, this.y, this.z];
	}

	set(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}