window.onload = function (e) {
	var selected = 0;
	var palette = new ColorPalette(9);
	var generator = new ColorGenerator({seed: palette.getSeed(0)});
	var colors = document.getElementById("palette").getElementsByClassName("color");

	colorTiles(generator, colors);

	var modeSelector = document.getElementById("options");
	for (var i = 0; i < palette.size(); i++) {
		addButton(modeSelector, i, i === selected);
	}

	function addButton (parent, id, select) {
		var option = palette.createButtonHTML(id);
		if (select) {
			option.className += " selected";
		}
		option.addEventListener("click", changeColorMode, false);
		parent.appendChild(option);
		return option;
	}

	function changeColorMode (e) {
		e.preventDefault();
		var id = this.value * 1; 
		var current = this;
		if (this.value == null) {
			var c = new Color(this.getAttribute("r") * 1, this.getAttribute("g") * 1, 
													this.getAttribute("b") * 1);
			id = palette.getNextId();
			var oldColor = palette.addColor(c);
			if (oldColor == null) {
				// If we have to make a new button
				current = addButton(modeSelector, id);
			} else {
				// If we have to replace an old button
				oldColor = oldColor.seed;
				current = document.getElementById(palette.getIdByName(oldColor.toHex()));
				current.style.background = palette.getSeed(id).toHex();
				current.title = palette.getName(id);
				current.id = palette.getIdHTML(id);
			}
		}
		var old = document.getElementById(palette.getIdHTML(selected));
		old.className = "color";

		selected = id;
		current.className = "color selected";

		generator = new ColorGenerator({seed: palette.getSeed(id), parent: generator});
		colorTiles(generator, colors);
	}

	function colorTiles (generator, colors) {
		var font = "#fff";
		var seed = generator.getSeedColor();
		if (seed != null && seed.average() > 180 && seed.getLuminosity() > 225) {
			font = "#222";
		}
		for (var i = 0; i < colors.length; i++) {
			var c = generator.nextColor(10000 + i * 7);

			colors[i].style.background = c.toHex();
			colors[i].innerHTML = "<span>" + c.toHex() + "</span>";
			colors[i].setAttribute("r", c.r());
			colors[i].setAttribute("g", c.g());
			colors[i].setAttribute("b", c.b());
			colors[i].style.color = font;
			colors[i].addEventListener("dblclick", changeColorMode, false);
			colors[i].addEventListener("click", highlight, false);
		}
	}

	// Taken from: 
	// http://stackoverflow.com/questions/1173194/select-all-div-text-with-single-mouse-click
	function highlight (e) {
		if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(this.getElementsByTagName("span")[0]);
      range.select();
    } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(this.getElementsByTagName("span")[0]);
      window.getSelection().addRange(range);
    }
	}
}
