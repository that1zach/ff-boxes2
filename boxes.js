function Boxes(boxArray) {

	this.width = 3; // minimum width
	this.height = 3; // minimum height
	this.output = '';

	this.getWidth = (arr) => {
		arr.forEach(box => {
			if(typeof box === 'object' && box.length > 0) {
				this.width += box[0] === 'h' ?  (box.length - 1) * 4 : 4;
				this.getWidth(box);
			}
		});
	};

	this.getHeight = (arr, start = true) => {
		arr.forEach(box => {
			if(typeof box === 'object' && box.length > 0) {
				this.height += start ? -1 : 0; // no natural space between like horizontal boxes
				this.height += box[0] === 'v' ?  (box.length - 1) * 2 : 2;
				this.getHeight(box, false);
			}
		});
	};

	this.getCoordinates = (x=0, y=0, w, h) => {
		let coords = [];
		coords.push({x, y});
		coords.push({x: x + w, y});
		coords.push({x, y: y + h});
		coords.push({x: x + w, y: y + h});
		return coords;
	};

	this.isCorner = (coord, coords) => {
		for (i = 0; i < coords.length; i++) {
			if (coords[i].x === coord.x && coords[i].y === coord.y) {
				return true;
			}
		}
		return false;
	};

	this.draw = () => {

		this.getWidth(boxArray);
		this.getHeight(boxArray);

		// Draw outer box
		const coords = this.getCoordinates(0, 0, this.width, this.height);
		// console.log(coords);
		let x = 0;
		let y = 0;
		while (x <= this.width && y <= this.height) {

			// Is it a corner?
			this.output += this.isCorner({x, y}, coords) ? '+' : '';

			// Horizontal line?
			if(!this.isCorner({x, y}, coords)) {
				if(x !== 0 && x !== this.width) {
					this.output += y === 0 || y === this.height ? '-' : '';
				}
			}

			// Vertical line?
			if(!this.isCorner({x, y}, coords)) {
				if(y !== 0 && y !== this.height) {
					this.output += x === 0 || x === this.width ? '|' : ' ';
				}
			}

			// Is this the end of the line?
			if(x === this.width) {
				console.log(this.output);
				this.output = '';
				x = 0;
				y++;
			} else {
				x++;
			}
		}

	};

}

// REPRESENTING COMPLEX EXAMPLE 1
const boxes1 = new Boxes([['h', ['v', ['h', [], []], [], []], [], [], ['v', [], []]]]);
boxes1.draw();
console.log('Box 1: ', boxes1.width, 'x', boxes1.height);


// REPRESENTING COMPLEX EXAMPLE 2 (VARIATION)
const boxes2 = new Boxes([['v', ['h', ['v', [], []], [], []], [], [], ['h', [], []]]]);
boxes2.draw();
console.log('Box 2: ', boxes2.width, 'x', boxes2.height);





