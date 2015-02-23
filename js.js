var colorModes = [
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

window.onload = function (e) {
	var selected = 0;
	var generator = new ColorGenerator({seed: colorModes[selected].seed});
	var colors = document.getElementById("palette").getElementsByClassName("color");

	colorTiles(generator, colors);

	var modeSelector = document.getElementById("options");
	for (var i = 0; i < colorModes.length; i++) {
		var option = document.createElement("div");
		option.value = i;
		option.className = "color";
		option.id = makeColorId(colorModes[i].name);

		if (i == selected) {
			option.className += " selected";
		}

		if (colorModes[i].seed == null) {
			option.innerHTML = "?";
		} else {
			option.style.background = colorModes[i].seed.toHex();
		}
		option.title = colorModes[i].name;
		option.addEventListener("click", changeColorMode, false);
		modeSelector.appendChild(option);
	}

	function changeColorMode (e) {
		var id = this.value * 1;
		var old = document.getElementById(makeColorId(colorModes[selected].name));
		selected = id;
		old.className = "color";
		this.className = "color selected";
		var c = colorModes[id].seed;
		generator = new ColorGenerator({seed: c, parent: generator});
		colorTiles(generator, colors);
	}
}

function makeColorId (str) {
	return "color_" + str.toLowerCase().replace(" ", "_");
}

function colorTiles (generator, colors) {
	var font = "#fff";
	var seed = generator.getSeedColor();
	if (seed != null && seed.whiteDistance() < 50) {
		font = "#222";
	}
	for (var i = 0; i < colors.length; i++) {
		var c = generator.nextColor(10000 + i * 7);

		colors[i].style.background = c.toHex();
		colors[i].innerHTML = c.toHex();
		colors[i].style.color = font;
	}
}

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
		return new Color(nextRed(s), nextGreen(s + 1), nextBlue(s + 2));
	}

	var nextRed = function (s) {
		var base = randomComponent(s);
		if (seed != null) {
			base = average(base, seed.r());
		}
		return base;
	}

	var nextGreen = function (s) {
		var base = randomComponent(s);
		if (seed != null) {
			base = average(base, seed.g());
		}
		return base;
	}

	var nextBlue = function (s) {
		var base = randomComponent(s);
		if (seed != null) {
			base = average(base, seed.b());
		}
		return base;
	}

	var randomComponent = function (s) {
		return Math.floor(seededRandom(s) * 255);
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