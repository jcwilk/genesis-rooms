/*
 * kM - Tile Map Editor
 *
 * Copyright 2012, Matt Ross
 * Licensed under the Creative Commons CC BY-SA 3.0
 * See http://creativecommons.org/licenses/by-sa/3.0/ for details.
 */

initializeKM = function(){
(function (window, undefined) {
    "use strict";

    var kM = {};

(function (kM) {

    kM.utils = {
        addEventListener: function (eventName, callback, obj) {
            var elem = obj || window,
                func = elem.addEventListener;

            if (func === undefined) {
                elem.attachEvent("on" + eventName, callback);
            } else {
                elem.addEventListener(eventName, callback, false);
            }
        },

        removeEventListener: function (eventName, callback, obj) {
            var elem = obj || window,
                func = elem.removeEventListener;

            if (func === undefined) {
                elem.detachEvent("on" + eventName, callback);
            } else {
                elem.removeEventListener(eventName, callback, false);
            }
        },

        Class: function () {}
    };

    kM.utils.Class.create = function (ctor) {
        var Parent = this,
        C = function () {
            this._super = Parent;
            var pubs = ctor.apply(this, arguments),
                self = this,
                func = function(fn, sfn) {
                    return function () {
                        this._super = sfn;
                        return fn.apply(this, arguments);
                    };
                };

            for (var key in pubs) {
                if (typeof pubs[key] !== "function" ||
                        typeof self[key] !== "function") {
                    self[key] = pubs[key];
                } else {
                    self[key] = func(pubs[key], self[key]);
                }
            }
        };

        C.prototype = new Parent();
        C.prototype.constructor = C;
        C.extend = this.extend || this.create;

        return C;
    };
    
    // Shim for indexOf method on arrays.
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, fromIndex) {
            if (fromIndex === null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, this.length + fromIndex);
            }

            for (var i = fromIndex, j = this.length; i < j; ++i) {
                if (this[i] === obj) {
                    return i;
                }
            }

            return -1;
        };
    }

    // Shim for trim method on strings.
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
        };
    }

})(kM);

(function (kM) {

    kM.Button = kM.utils.Class.create(function (params) {
        params = (params !== undefined) ? params : {};

        var cvs = document.createElement("canvas"),
            ctx = cvs.getContext("2d"),
            imgL = document.createElement("img"),
            imgR = document.createElement("img"),
            img = document.createElement("img"),
            inp = document.createElement("input"),
            enabled = true,
            loadedImages = 0,
            timer,
            events = [],

            clickEvent = function () {
                for (var i = 0, l = events.length; i < l; i++) {
                    events[i]();
                }
            },

            incLoaded = function () { loadedImages += 1; },

            wait = function () {
                if (loadedImages >= 3) {
                    clearTimeout(timer);
                    createButtonImage();
                    return;
                }
                setTimeout(wait, 1);
            },

            createButtonImage = function () {
                cvs.height = 32;
                cvs.width = (params.width !== undefined) ? params.width : 32;
                cvs.rt = cvs.width - 6;
                ctx.drawImage(imgL, 0, 0, cvs.rt, 32,
                                    0, 0, cvs.rt, 32);
                ctx.drawImage(imgR, cvs.rt, 0);
                if (!enabled) { ctx.globalAlpha = 0.3; }
                ctx.drawImage(img, (cvs.width / 2) - (img.width / 2),
                                   (cvs.height / 2) - (img.height / 2));
                ctx.globalAlpha = 1;
                inp.src = cvs.toDataURL();
            };

        inp.type = "image";
        inp.alt = params.alt;
        inp.title = params.alt;
        imgL.src = "/images/kM/btnLeft.png";
        imgL.onload = incLoaded;
        imgR.src = "/images/kM/btnRight.png";
        imgR.onload = incLoaded;
        img.src = params.img;
        img.onload = incLoaded;

        timer = setTimeout(wait, 1);

        kM.utils.addEventListener("click", function (e) {
            if (enabled) {
                clickEvent();
            }
        }, inp);
        kM.utils.addEventListener("mouseover", function (e) {
            inp.style.cursor = "auto";
            if (!enabled) {
                inp.style.cursor = "default";
            }
        }, inp);

        params.parent.appendChild(inp);

        return {
            disable: function () {
                enabled = false;
                createButtonImage();

                return this;
            },

            enable: function () {
                enabled = true;
                createButtonImage();

                return this;
            },

            isEnabled: function () {
                return enabled;
            },

            addEventListener: function (func) {
                if (typeof func !== "function") {
                    throw "Event listener must be a function";
                }

                events.push(func);
            }
        };
    });

})(kM);

(function (kM) {

    kM.TiledBG = kM.utils.Class.create(function (params) {
        params = (params !== undefined) ? params : {};

        if (params.width === undefined || params.height === undefined) {
            throw "TiledBG must have width and height parameters";
        }
        if (params.elem === undefined) {
            throw "TiledBG must have elem parameter to append canvas";
        }
        if (params.tiles === undefined) {
            throw "TiledBG must have tiles parameter to provide tiles";
        }

        var cvs = document.createElement("canvas"),
            ctx = cvs.getContext("2d"),
            scroll = document.getElementById("cvsContainer"),
            tiles = params.tiles,
            tileSize = tiles.getTileSize(),
            clear = params.elem.getElementsByTagName("canvas"),
            img, i, x, y,
            tileMap = [],
            mousePos = {x: 0, y: 0},
            offset = {x: 0, y: 0},
            showGrid = true,
            isMouseDown = false,

            updateOffset = function () {
                var xO, yO, element;

                xO = yO = 0;
                element = cvs;

                while (element) {
                    xO += element.offsetLeft;
                    yO += element.offsetTop;
                    element = element.offsetParent;
                }

                offset.x = xO - scroll.scrollLeft;
                offset.y = yO - scroll.scrollTop;
            },

            updateMousePosition = function (e) {
                updateOffset();

                if (e.touches) {
                    // Only handle the first touch
                    mousePos.x = e.touches[0].pageX;
                    mousePos.y = e.touches[0].pageY;
                } else {
                    mousePos.x = e.pageX;
                    mousePos.y = e.pageY;
                }

                mousePos.x -= offset.x;
                mousePos.y -= offset.y;
            },

            mouseDown = function () {
                isMouseDown = true;
            },
            mouseUp = function () {
                isMouseDown = false;
            },

            clearMap = function () {
                for (y = 0; y < params.height; y++) {
                    for (x = 0; x < params.width; x++) {
                        tileMap[x + y * params.width] = 0;
                    }
                }

                draw();
            },

            updateTile = function (e) {
                if (isMouseDown || e.type === "click") {
                    x = Math.floor(mousePos.x / tileSize.width);
                    y = Math.floor(mousePos.y / tileSize.height);
        
                    tileMap[x + y * params.width] = tiles.getTile();
                    draw();
                }
            },

            draw = function() {
                ctx.clearRect(0, 0, cvs.width, cvs.height);

                ctx.strokeStyle = "#22475d";
                // Outline
                ctx.strokeRect(0, 0, cvs.width, cvs.height);
                if (showGrid) {
                    for (x = 0; x < cvs.width; x += tileSize.width) {
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, cvs.height);
                        ctx.closePath();
                        ctx.stroke();
                    }
                    for (y = 0; y < cvs.height; y += tileSize.height) {
                        ctx.beginPath();
                        ctx.moveTo(0, y);
                        ctx.lineTo(cvs.width, y);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }

                // Draw tiles
                for (x = 0; x < params.width; x++) {
                    for (y = 0; y < params.height; y++) {
                        img = tiles.getTileImage(tileMap[x + y * params.width]);

                        ctx.drawImage(img, 0, 0, img.width, img.height,
                          x * img.width, y * img.height, img.width, img.height);
                    }
                }

                // Highlight cell around mouse
                ctx.strokeStyle = "#accfe3";
                x = mousePos.x - (mousePos.x % tileSize.width);
                y = mousePos.y - (mousePos.y % tileSize.height);
                ctx.strokeRect(x, y, tileSize.width, tileSize.height);
            };

        cvs.width = tileSize.width * params.width;
        cvs.height = tileSize.height * params.height;
        // Prevent double-click on canvas from selecting
        cvs.onselectstart = function () {
            return false;
        };
        clearMap();

        // Clear the container of other canvas elements and add this one
        i = clear.length;
        while (i--) {
            params.elem.removeChild(clear[i]);
        }
        params.elem.appendChild(cvs);

        kM.utils.addEventListener("mousemove", updateMousePosition, cvs);
        kM.utils.addEventListener("mousemove", draw, cvs);
        kM.utils.addEventListener("mousemove", updateTile, cvs);
        kM.utils.addEventListener("click", updateTile, cvs);
        kM.utils.addEventListener("mousedown", mouseDown, cvs);
        kM.utils.addEventListener("mouseup", mouseUp, cvs);

        return {
            reset: function () {
                clearMap();

                return this;
            },

            getTileMap: function () {
                return tileMap;
            },

            setTileMap: function (newMap) {
                if (newMap instanceof Array) {
                    if (tileMap.length === newMap.length) {
                        tileMap.length = 0;
                        tileMap = newMap;
                    } else {
                        var l = tileMap.length;
                        tileMap.length = 0;
                        while (l--) {
                            if (newMap[l] !== undefined) {
                                tileMap[l] = newMap[l];
                            } else {
                                tileMap[l] = 0;
                            }
                        }
                    }
                    draw();
                }

                return this;
            },

            toggleGrid: function () {
                showGrid = !showGrid;
                draw();

                return this;
            }
        };
    });

})(kM);

(function (kM) {

    kM.TilePicker = kM.utils.Class.create(function (image, tileW, tileH, elem) {
        if (image === undefined || tileW === undefined ||
            tileH === undefined || elem === undefined) {
            throw "Can not create TilePicker without all parameters.";
        }

        var cvs = document.createElement("canvas"),
            ctx = cvs.getContext("2d"),
            images = [],
            tileNum = 0,
            rows = image.height / tileH,
            cols = image.width / tileW,
            numTiles = rows * cols,
            clear = [],
            i = 0,

            mover = function () {
                this.classList.add("hoverTile");
            },

            mout = function () {
                this.classList.remove("hoverTile");
            },

            click = function () {
                var l = images.length;

                while (l--) {
                    images[l].classList.remove("selectedTile");
                    if (images[l] === this) {
                        tileNum = l;
                        images[l].classList.add("selectedTile");
                    }
                }
            };

        cvs.width = tileW;
        cvs.height = tileH;

        clear = elem.getElementsByTagName("img");
        i = clear.length;
        while (i--) {
            elem.removeChild(clear[i]);
        }

        for (i = 0; i < numTiles; i++) {
            ctx.clearRect(0, 0, cvs.width, cvs.height);

            var row = 0, tile = i;

            while (tile > cols - 1) {
                tile -= cols;
                row += 1;
            }

            ctx.drawImage(image, tile * tileW, row * tileH, tileW, tileH,
                                 0, 0, tileW, tileH);
            images[i] = document.createElement("img");
            images[i].src = cvs.toDataURL();
            elem.appendChild(images[i]);

            images[i].onmouseover = mover;
            images[i].onmouseout = mout;
            images[i].onclick = click;
        }
        images[0].classList.add("selectedTile");

        return {
            getTile: function () {
                return tileNum;
            },

            getTileImage: function (tileNum) {
                return images[tileNum];
            },

            getTileSize: function () {
                return {width: tileW, height: tileH};
            }
        };
    });

})(kM);

(function (kM) {

    var cvsContainer = document.getElementById("cvsContainer"),
        loadTileSheet = document.getElementById("loadTileSheet"),
        tileLoader = document.getElementById("tileLoader"),
        mapLoader = document.getElementById("mapLoader"),
        tileSheetFile = document.getElementById("tileSheetFile"),
        tileMapFile = document.getElementById("tileMapFile"),
        tileWidth = document.getElementById("tileWidth"),
        tileHeight = document.getElementById("tileHeight"),
        saveTileMap = document.getElementById("saveTileMap"),
        tile = document.getElementById("tile"),
        file = document.getElementById("file"),
        options = document.getElementById("options"),
        help = document.getElementById("help"),
        helpText = document.getElementById("helpText"),
        tilePicker = document.getElementById("tilePicker"),
        newTileMap = document.getElementById("newTileMap"),
        loadTileMap = document.getElementById("loadTileMap"),
        mapCreator = document.getElementById("mapCreator"),
        mapWidth = document.getElementById("mapWidth"),
        mapHeight = document.getElementById("mapHeight"),
        loadWidth = document.getElementById("loadWidth"),
        loadHeight = document.getElementById("loadHeight"),
        mapSaver = document.getElementById("mapSaver"),
        //mapData = document.getElementById("mapData"),
        navButtons = [],
        oldState = [],

        //genesis stuff
        mapData = document.getElementById("room_tiles_csv"),
        formMapWidth = document.getElementById("room_w"),

        disableNav = function () {
            var l = navButtons.length;
            oldState.length = 0;

            while (l--) {
                oldState[l] = navButtons[l].isEnabled();
                navButtons[l].disable();
            }
        },

        lastNavState = function () {
            var l = navButtons.length;

            while (l--) {
                if (oldState[l]) {
                    navButtons[l].enable();
                } else {
                    navButtons[l].disable();  
                }
            }
        };


    // Public members
    //
    kM.ui = {};
    kM.ui.picker = {}; // When a tile sheet is loaded this is a TilePicker 
    kM.ui.tileMap = {}; // When a map is created/loaded this is a TiledBG


    // Form reset
    //
    kM.ui.resetDialog = function (section, form) {
        kM.ui.toggleSection(section);
        form.reset();
        lastNavState();
    };


    // Public methods
    //
    kM.ui.toggleSection = function (section, visible) {
        // Allow setting visibility by pre-setting to opposite of desired.
        if (visible !== undefined) {
            section.style.display = visible ? "none" : "block";
        }

        if (section.style.display === "none") {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    };

    kM.ui.loadTiles = function () {
        // Validate input
        if (!tileSheetFile.files.length) {
            window.alert("You must select a tile sheet file to load.");
            tileSheetFile.focus();

            return;
        } else if (!tileSheetFile.files[0].type.match(/image.*/)) {
            window.alert("Selected file must be an image type.");
            tileSheetFile.focus();

            return;
        }

        if (tileWidth.value === "") {
            window.alert("Set a tile width before loading a tile sheet.");
            tileWidth.focus();

            return;
        } else if (parseInt(tileWidth.value, 10) < 1 ||
                   parseInt(tileWidth.value, 10) > 128 ) {
            window.alert("Tile width must be between 1 and 128.");
            tileWidth.focus();
            tileWidth.select();

            return;
        }

        if (tileHeight.value === "") {
            window.alert("Set a tile height before loading a tile sheet.");
            tileHeight.focus();

            return;
        } else if (parseInt(tileHeight.value, 10) < 1 ||
                   parseInt(tileHeight.value, 10) > 128 ) {
            window.alert("Tile height must be between 1 and 128.");
            tileHeight.focus();
            tileHeight.select();

            return;
        }

        // Input validated, use it
        var img = document.createElement("img"),
            file = tileSheetFile.files[0],
            reader = new window.FileReader();

        img.classList.add("obj");

        img.onload = function () {
            console.log(tileWidth.value);
            kM.ui.toggleSection(tilePicker, true);
            kM.ui.picker = new kM.TilePicker(img,
                parseInt(tileWidth.value, 10),
                parseInt(tileHeight.value, 10),
                tilePicker);

            kM.ui.resetDialog(loadTileSheet, tileLoader);
            kM.ui.btnNewMap.enable();
            kM.ui.btnLoadMap.enable();
        };

        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.onerror = function (e) {
            window.alert("Error reading file " + e.target);
            kM.ui.resetDialog(loadTileSheet, tileLoader);
        };
        reader.readAsDataURL(file);
    };

    kM.ui.loadTileMap = function () {
        if (!tileMapFile.files.length) {
            window.alert("You must select a tile map file to load.");
            tileMapFile.focus();

            return;
        }

        if (loadWidth.value === "") {
            window.alert("Set a map width before loading a map.");
            loadWidth.focus();

            return;
        } else if (parseInt(loadWidth.value, 10) < 1) {
            window.alert("Map width must be greater than zero.");
            loadWidth.focus();
            loadWidth.select();

            return;
        }

        if (loadHeight.value === "") {
            window.alert("Set a map height before loading a map.");
            loadHeight.focus();

            return;
        } else if (parseInt(loadHeight.value, 10) < 1) {
            window.alert("Map height must be greater than zero.");
            loadHeight.focus();
            loadHeight.select();

            return;
        }

        var overwrite = true,
            params = {width: parseInt(loadWidth.value, 10),
                      height: parseInt(loadHeight.value, 10),
                      elem: cvsContainer,
                      tiles: kM.ui.picker};

        if (kM.ui.tileMap instanceof kM.TiledBG) {
            overwrite = window.confirm("Overwrite existing tile map?");
        }

        if (overwrite) {
            var reader = new window.FileReader();
            reader.onload = function (e) {
                kM.ui.tileMap = new kM.TiledBG(params);
                kM.ui.tileMap.setTileMap(JSON.parse(e.target.result));

                kM.ui.resetDialog(loadTileMap, mapLoader);

                kM.ui.btnGridToggle.enable();
                kM.ui.btnClearMap.enable();
                kM.ui.btnSaveMap.enable();
            };
            reader.onerror = function (e) {
                window.alert("Error reading file " + e.target);
                kM.ui.resetDialog(loadTileMap, mapLoader);
            };
            reader.readAsText(tileMapFile.files[0]);
        }
    };

    kM.ui.createMap = function () {
        if (mapWidth.value === "") {
            window.alert("Set a map width before creating a new map.");
            mapWidth.focus();

            return;
        } else if (parseInt(mapWidth.value, 10) < 1) {
            window.alert("Map width must be greater than zero.");
            mapWidth.focus();
            mapWidth.select();

            return;
        }

        if (mapHeight.value === "") {
            window.alert("Set a map height before creating a new map.");
            mapHeight.focus();

            return;
        } else if (parseInt(mapHeight.value, 10) < 1) {
            window.alert("Map height must be greater than zero.");
            mapHeight.focus();
            mapHeight.select();

            return;
        }

        var overwrite = true,
            params = {width: parseInt(mapWidth.value, 10),
                      height: parseInt(mapHeight.value, 10),
                      elem: cvsContainer,
                      tiles: kM.ui.picker};

        if (kM.ui.tileMap instanceof kM.TiledBG) {
            overwrite = window.confirm("Overwrite existing tile map?");
        }

        kM.ui.resetDialog(newTileMap, mapCreator);

        if (overwrite) {
            kM.ui.tileMap = new kM.TiledBG(params);
            formMapWidth.value = params.width;
            kM.ui.btnGridToggle.enable();
            kM.ui.btnClearMap.enable();
            kM.ui.btnSaveMap.enable();
        }
    };

    kM.ui.saveMap = function () {
        var uriContent = "data:application/octet-stream," + 
                encodeURIComponent(JSON.stringify(kM.ui.tileMap.getTileMap()));
        location.href = uriContent;

        kM.ui.resetDialog(saveTileMap, mapSaver);
    };


    // Buttons
    //
    kM.ui.btnLoadTiles = new kM.Button({parent: tile,
                                        img: "/images/kM/loadTiles.png",
                                        alt: "Load Tile Sheet"});
    kM.ui.btnLoadTiles.addEventListener(
        function () {
            kM.ui.toggleSection(loadTileSheet);
            disableNav();
            tileSheetFile.focus();
        });

    kM.ui.btnNewMap = new kM.Button({parent: file,
                                        img: "/images/kM/new.png",
                                        alt: "New Tile Map"});
    kM.ui.btnNewMap.addEventListener(
        function () {
            kM.ui.toggleSection(newTileMap);
            disableNav();
            mapWidth.focus();
        });

    kM.ui.btnLoadMap = new kM.Button({parent: file,
                                        img: "/images/kM/open.png",
                                        alt: "Load Tile Map"});
    kM.ui.btnLoadMap.addEventListener(
        function () {
            kM.ui.toggleSection(loadTileMap);
            disableNav();
            tileMapFile.focus();
        });

    kM.ui.btnSaveMap = new kM.Button({parent: file,
                                        img: "/images/kM/save.png",
                                        alt: "Save Tile Map"});
    kM.ui.btnSaveMap.addEventListener(
        function () {
            mapData.textContent = JSON.stringify(kM.ui.tileMap.getTileMap());
            //kM.ui.toggleSection(saveTileMap);
            //disableNav();
            mapData.focus();
            mapData.select();
        });

    kM.ui.btnHelp = new kM.Button({parent: help,
                                        img: "/images/kM/help.png",
                                        alt: "Help"});
    kM.ui.btnHelp.addEventListener(
        function () {
            kM.ui.toggleSection(helpText);
        });

    kM.ui.btnGridToggle = new kM.Button({parent: options,
                                        img: "/images/kM/grid.png",
                                        alt: "Toggle Grid"});
    kM.ui.btnGridToggle.addEventListener(
        function () {
            kM.ui.tileMap.toggleGrid();
        });

    kM.ui.btnClearMap = new kM.Button({parent: options,
                                        img: "/images/kM/clearGrid.png",
                                        alt: "Clear Tile Map"});
    kM.ui.btnClearMap.addEventListener(
        function () {
            var overwrite = window.confirm("Clear existing tile map?");
            if (overwrite) {
                kM.ui.tileMap.reset();
            }
        });

    // Help is not added here because it never needs to be disabled.
    navButtons.push(kM.ui.btnLoadTiles);
    navButtons.push(kM.ui.btnNewMap);
    navButtons.push(kM.ui.btnLoadMap);
    navButtons.push(kM.ui.btnSaveMap);
    navButtons.push(kM.ui.btnGridToggle);
    navButtons.push(kM.ui.btnClearMap);

    // Initialize UI
    //

    // Adjust the container, and add an event so it is updated with resize
    cvsContainer.style.height = window.innerHeight - 125 + "px";
    kM.utils.addEventListener("resize", function () {
        cvsContainer.style.height = window.innerHeight - 125 + "px";
    });

    // Hide sections
    kM.ui.toggleSection(loadTileSheet);
    kM.ui.toggleSection(newTileMap);
    kM.ui.toggleSection(tilePicker);
    kM.ui.toggleSection(helpText);
    kM.ui.toggleSection(saveTileMap);
    kM.ui.toggleSection(loadTileMap);

    // Disable buttons
    kM.ui.btnNewMap.disable();
    kM.ui.btnLoadMap.disable();
    kM.ui.btnSaveMap.disable();
    kM.ui.btnGridToggle.disable();
    kM.ui.btnClearMap.disable();

    document.body.style.visibility = "visible";

})(kM);

// Export kM to the global window object.
(function (kM) {
    window.kM = kM;
})(kM);

})(window);
}