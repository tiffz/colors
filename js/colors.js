function ColorGenerator (options) {
	var seed = null;
	var randomSeed = 1000000 + Math.random() * 1000000;
	var parent = null;
	if (options != null) {
		seed = options.seed;
		parent = options.parent;
	}

	this.getSeedColor = function () {
		return seed;
	}

	this.nextColor = function (subseed) {
		var s = randomSeed + subseed * 7;
		return new Color(nextRed(s), nextGreen(s + 50), nextBlue(s + 100));
	}

	var nextRed = function (s) {
		var base = randomComponent(s);
		if (seed != null) {
			if (seededRandom(s * 7) > 0.6) {
				base = randomComponent(s, seed.r());
			}
			base = average(base, seed.r());
		} else {
			base = randomComponent(s);
		}
		return base;
	}

	var nextGreen = function (s) {
		var base = randomComponent(s);
		if (seed != null) {
			if (seededRandom(s * 7) > 0.6) {
				base = randomComponent(s, seed.g());
			}
			base = average(base, seed.g());
		} else {
			base = randomComponent(s);
		}
		return base;
	}

	var nextBlue = function (s) {
		var base = randomComponent(s);
		if (seed != null) {
			if (seededRandom(s * 7) > 0.6) {
				base = randomComponent(s, seed.b());
			}
			base = average(base, seed.b());
		} 
		return base;
	}

	var randomComponent = function (s, c) {
		if (c == null) {
			return Math.floor(seededRandom(s) * 255);
		}
		var r = normalRandom(s, 2);
		r = r - 0.5;
		r = Math.floor(r * 255);
		c -= r;
		if (c > 255) {
			c = 510 - c;
		} 
		return Math.abs(c);
	}

	var normalRandom = function (s, n) {
		var sum = 0;
		for (var i = 0; i < n; i++) {
			sum += seededRandom (s + i);
		}
		return sum / n;
	}

	var seededRandom = function (s) {
		var x = Math.sin(s) * 100000;
		return x - Math.floor(x);
	}

	var average = function (a, b) {
		return Math.floor((a + b) / 2);
	}
}

function Color (r, g, b) {
	var red = r;
	var green = g;
	var blue = b;

	this.r = function () {
		return red;
	}

	this.g = function () {
		return green;
	}

	this.b = function () {
		return blue;
	}

	this.toHex = function () {
		var code = "#" + component(r) + component(g) + component(b);
		return  code.toUpperCase();
	}

	this.whiteDistance = function () {
		return 765 - red - green - blue;
	}

	this.toArray = function () {
		return [r, g, b];
	}

	var component = function (num) {
		num = num.toString(16);
		if (num.length < 2) {
			num = "0" + num;
		}
		return num;
	}
}

function ColorPalette (customCount) {
	var colors = [
		{name : 'Truly Random', seed: null},
		{name : 'Yellow', seed: new Color(255, 255, 0)},
		{name : 'Red', seed: new Color(255, 0, 0)},
		{name : 'Magenta', seed: new Color(255, 0, 255)},
		{name : 'Blue', seed: new Color(0, 0, 255)},
		{name : 'Cyan', seed: new Color(0, 255, 255)},
		{name : 'Green', seed: new Color(0, 255, 0)},
		{name : 'Light', seed: new Color(255, 255, 255)},
		{name : 'Dark', seed: new Color(0, 0, 0)}
	];

	var numDefault = colors.length;
	var numCustom = 0;
	var max = colors.length + customCount;

	this.size = function () {
		return colors.length;
	}

	this.capacity = function () {
		return max;
	}

	this.getNextId = function () {
		return numDefault + numCustom;
	}

	this.addColor = function (c) {
		var old = colors[numDefault + numCustom];
		colors[numDefault + numCustom++] = {name : c.toHex(), seed: c};
		if ((numDefault + numCustom) >= max) {
			numCustom = 0;
		}
		return old;
	}

	this.getName = function (id) {
		return getColorData(id).name;
	}

	this.getSeed = function (id) {
		return getColorData(id).seed;
	}

	this.getIdHTML = function (id) {
		var str = this.getName(id);
		return this.getIdByName(str);
	}

	this.createButtonHTML = function (id) {
		var option = document.createElement("div");
		option.value = id;
		option.className = "color";
		option.id = this.getIdHTML(id);

		if (this.getSeed(id) == null) {
			option.innerHTML = "?";
		} else {
			option.style.background = this.getSeed(id).toHex();
		}
		option.title = this.getName(id);
		return option;
	}

	this.getIdByName = function (str) {
		return "color_" + str.toLowerCase().replace(" ", "_").replace("#", "");
	}

	var getColorData = function (id) {
		if (id < colors.length) {
			return colors[id];
		}
	}
}