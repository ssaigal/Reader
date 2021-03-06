EPUBJS.reader = {};
EPUBJS.reader.plugins = {}; //-- Attach extra Controllers as plugins (like search?)
var didPan = true;

(function (root, $) {

	var previousReader = root.ePubReader || {};

	var ePubReader = root.ePubReader = function (path, options) {
		return new EPUBJS.Reader(path, options);
	};

	_.extend(ePubReader, {
		noConflict: function () {
			root.ePubReader = previousReader;
			return this;
		}
	});

	//exports to multiple environments
	if (typeof define === 'function' && define.amd)
	//AMD
		define(function () {
			return Reader;
		});
	else if (typeof module != "undefined" && module.exports)
	//Node
		module.exports = ePubReader;

})(window, jQuery);

// console.log(EPUBJS);


EPUBJS.Reader = function (bookPath, _options) {
	// For current book and bookPath
	var reader = this;
	var book;
	var plugin;
	// This is the book text div where the book is displayed
	var $viewer = $("#viewer");
	var search = window.location.search;
	var parameters;
  // The settings specified within the options
	this.settings = _.defaults(_options || {}, {
		bookPath: bookPath,
		restore: true,
		reload: false,
		bookmarks: null,
		annotations: null,
		contained: null,
		bookKey: null,
		styles: null,
		sidebarReflow: false,
		generatePagination: false,
		history: true
	});

	// Overide options with search parameters
	if (search) {
		parameters = search.slice(1).split("&");
		parameters.forEach(function (p) {
			var split = p.split("=");
			var name = split[0];
			var value = split[1] || '';
			reader.settings[name] = value;
		});
	}

	this.setBookKey(this.settings.bookPath);
  // Retrieve and Apply saved settings
	if (this.settings.restore && this.isSaved()) {
		this.applySavedSettings();
	}

	this.settings.styles = this.settings.styles || {
			fontSize: "100%"
		};
  // Change options based on Stored Settings
	this.book = book = new EPUBJS.Book({
		bookPath: this.settings.bookPath,
		restore: this.settings.restore,
		reload: this.settings.reload,
		contained: this.settings.contained,
		bookKey: this.settings.bookKey,
		styles: this.settings.styles
	});
  // Go to most recent location in book
	if (this.settings.previousLocationCfi) {
		book.gotoCfi(this.settings.previousLocationCfi);
	}

	this.offline = false;
	this.sidebarOpen = false;
	//Retrieve Bookmarks
	if (!this.settings.bookmarks) {
		this.settings.bookmarks = [];
	}
  // Retrieve annotations
	if (!this.settings.annotations) {
		this.settings.annotations = [];
	}

	if (this.settings.generatePagination) {
		book.generatePagination($viewer.width(), $viewer.height());
	}

	window.mybook = book;
	window.myreader = reader;
	// book.renderTo("#viewer");

	 setTimeout(function(){
		 window.loadingscreen = document.getElementById("loadingscreen");
		 window.notepad = document.getElementById('notes');
     var controlss = document.getElementById("controls");
     var currentPage = document.getElementById("currentpg");
     var totalPages = document.getElementById("totalpg");
     var slider = document.createElement("input");
     var pageList;
		 // var db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
		 window.arrayOfTimes = [];
		 window.arrayOfPages = [];
     var slide = function(){
       console.log("Slider no sliding");
       book.gotoPage(slider.value);
     };
     // var throttledSlide = _.throttle(slide, 200);
     var mouseDown = false;
		var rendered = book.renderTo("viewer");


		// check Local storage for page List
		if(!(typeof localStorage.getItem(localStorage.getItem('bookies')) == 'undefined') &&
			!(localStorage.getItem(localStorage.getItem('bookies')) == null)){
			// If it exists load the pages from the local storage
			book.loadPagination(localStorage.getItem(localStorage.getItem('bookies')));
		}
		else {
			// generate the pageList
			book.ready.all.then(function () {
				book.generatePagination();
				// display loading screen
				window.loadingscreen.style.display = "block";
			});
		}

     book.pageListReady.then(function(pageList){
       controlss.style.display = "block";
	     window.loadingscreen.style.display = "none";
      //(JSON.stringify(pageList)); // Save the result
       localStorage.pageList = JSON.stringify(pageList);
	     localStorage.setItem(localStorage.getItem('bookies'), JSON.stringify(pageList));


	     window.resolveLocalFileSystemURL(window.mybook.spine[0].url, gotFile, fail);
	     function fail(e) {
		     console.log("FileSystem Error");
		     console.dir(e);
	     }

	     function gotFile(fileEntry) {

		     fileEntry.file(function (file) {
			     var reader = new FileReader();

			     reader.onloadend = function (e) {
				     var fulltext = this.result;
				     // console.log(fulltext);
				     var getUrlPathOfBook = window.mybook.spine[0].url;
				     var lastIndexofSlash = getUrlPathOfBook.lastIndexOf('/');
				     var baseBookUrlPath = getUrlPathOfBook.substr(0,lastIndexofSlash+1);
				     var imgSrcIndex = fulltext.lastIndexOf("<img src=");
				     var imgPartText = fulltext.substr(imgSrcIndex+ 10, fulltext.length);
				     if(imgSrcIndex== -1){
					     imgSrcIndex = fulltext.lastIndexOf("xlink:href=");
					     imgPartText = fulltext.substr(imgSrcIndex+ 12, fulltext.length);
				     }
				     // console.log(imgPartText);

				     // console.log(imgPartText);
				     var lastIndexOfImgTag = imgPartText.indexOf('"');
				     var finalImgPath = baseBookUrlPath + imgPartText.substr(0, lastIndexOfImgTag);
				     console.log(finalImgPath);
				     var db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
				     db.transaction(function (tx) {
					     tx.executeSql("Update BooksTable Set name ='"+ book.metadata.bookTitle+ "' WHERE link='"+localStorage.bookies+"' ");
					     tx.executeSql("Update BooksTable Set author ='"+ book.metadata.bookTitle+ "' WHERE link='"+localStorage.bookies+"' ");
					     tx.executeSql("Update BooksTable Set imgpath ='"+ finalImgPath+ "' WHERE link='"+localStorage.bookies+"' ");
					     tx.executeSql("Update BooksTable Set flag = 1 WHERE link='"+localStorage.bookies+"' ");
				     }, function (error) {
					     console.log('Transaction ERROR: ' + error.message);
				     }, function () {
					     console.log('Changed name');
				     });

				     // console.log("Text is: " + this.result);
			     };

			     reader.readAsText(file);
		     });
	     }
       slider.setAttribute("type", "range");
       slider.setAttribute("min", book.pagination.firstPage);
       slider.setAttribute("max", book.pagination.lastPage);
       slider.setAttribute("step", 1);
       slider.setAttribute("value", 0);
       slider.addEventListener("change", slide, false);
       slider.addEventListener("mousedown", function(){
         mouseDown = true;
       }, false);
       slider.addEventListener("mouseup", function(){
         mouseDown = false;
       }, false);
       // Wait for book to be rendered to get current page
       rendered.then(function(){
         var currentLocation = book.getCurrentLocationCfi();
         var currentPage = book.pagination.pageFromCfi(currentLocation);
         slider.value = currentPage;
         currentPage.value = currentPage;
       });
       controlss.appendChild(slider);
       totalPages.innerText = book.pagination.totalPages;
       currentPage.addEventListener("change", function(){
         book.gotoPage(currentPage.value);
	       console.log(currentPage);
       }, false);
     });
		 var db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
     book.on('book:pageChanged', function(location){

       if(!mouseDown) {
         slider.value = location.anchorPage;
	       // var currentPageTime = Date.now();
	       localStorage.first = Math.floor(Date.now()/1000);

	       if(arrayOfTimes.length==0){
	       	arrayOfTimes[0] = parseFloat(localStorage.first);
	       }
	       else{
		       arrayOfTimes[1] = parseFloat(localStorage.first);
	       }

       }
       currentPage.value = location.anchorPage;
	     if(arrayOfPages.length == 0){
		     arrayOfPages[0]=currentPage.value;
	     }
	     else{
		     arrayOfPages[1]=currentPage.value;
	     }

	     if(arrayOfTimes.length==2) {

		     db.transaction(function (tx) {
		     	tx.executeSql('CREATE TABLE IF NOT EXISTS PageTable (book, page, seconds)');
		     	var stat = "SELECT count(*) AS mycount FROM PageTable WHERE page='" + arrayOfPages[0] + "' AND book='" + book.metadata.bookTitle + "';" ;
			     tx.executeSql(stat, [], function (tx, rs) {
				     // console.log('Record count : ' + rs.rows.item(0).mycount);
				     if (rs.rows.item(0).mycount == 0) {
					     db.transaction(function (tx) {
						     tx.executeSql('INSERT INTO PageTable VALUES (?,?,?)', [book.metadata.bookTitle, arrayOfPages[0], arrayOfTimes[1] - arrayOfTimes[0] ]);

					     }, function (error) {
						     console.log('Transaction ERROR: ' + error.message);
					     }, function () {
						     console.log('Inserted New time and page values');
						     console.log(arrayOfPages[0]);
						     console.log(arrayOfTimes[1] - arrayOfTimes[0]);
						     arrayOfTimes[0] = arrayOfTimes[1];
						     arrayOfPages[0] = arrayOfPages[1];
					     });
				     }
				     else {

					     db.transaction(function (tx) {
					     	var newtime =  arrayOfTimes[1] - arrayOfTimes[0];
						     tx.executeSql("Update PageTable Set seconds = "+ newtime+" WHERE" +
							     " book='" + book.metadata.bookTitle + "' AND" +
							     " page =" + arrayOfPages[0] + ";");
							     // " page ='" + arrayOfPages[0] + "';");
					     }, function (error) {
						     console.log('Transaction ERROR: ' + error.message);
					     }, function () {
						     console.log('Incremented');
						     console.log(arrayOfPages[0]);
						     console.log(arrayOfTimes[1] - arrayOfTimes[0]);
						     arrayOfTimes[0] = arrayOfTimes[1];
						     arrayOfPages[0] = arrayOfPages[1];
					     });
				     }
			     }, function (tx, error) {
				     console.log('SELECT error: ' + error.message);
			     }, function () {
				     console.log('Recorded');
			     });
		     });
	     }




       // console.log(location.pageRange)
     });
    }, 500);


	reader.ReaderController = EPUBJS.reader.ReaderController.call(reader, book);
	reader.SettingsController = EPUBJS.reader.SettingsController.call(reader, book);
	reader.ControlsController = EPUBJS.reader.ControlsController.call(reader, book);
	reader.SidebarController = EPUBJS.reader.SidebarController.call(reader, book);
	reader.BookmarksController = EPUBJS.reader.BookmarksController.call(reader, book);
	reader.NotesController = EPUBJS.reader.NotesController.call(reader, book);
	// reader.SelectionController = EPUBJS.reader.SelectionController.call(reader, book);

	// Call Plugins
	for (plugin in EPUBJS.reader.plugins) {
		if (EPUBJS.reader.plugins.hasOwnProperty(plugin)) {
			reader[plugin] = EPUBJS.reader.plugins[plugin].call(reader, book);
		}
	}

	book.ready.all.then(function () {
		reader.ReaderController.hideLoader();
	});

	book.getMetadata().then(function (meta) {
		reader.MetaController = EPUBJS.reader.MetaController.call(reader, meta);
	});

	book.getToc().then(function (toc) {
		reader.TocController = EPUBJS.reader.TocController.call(reader, toc);
	});

	window.addEventListener("beforeunload", this.unload.bind(this), false);

	window.addEventListener("hashchange", this.hashChanged.bind(this), false);

	document.addEventListener('keydown', this.adjustFontSize.bind(this), false);

	book.on("renderer:keydown", this.adjustFontSize.bind(this));
	book.on("renderer:keydown", reader.ReaderController.arrowKeys.bind(this));

	// book.on("renderer:selected", this.selectedRange.bind(this));


	return this;
};


EPUBJS.Reader.prototype.adjustFontSize = function (e) {
	var fontSize;
	var interval = 2;
	var PLUS = 187;
	var MINUS = 189;
	var ZERO = 48;
	var MOD = (e.ctrlKey || e.metaKey );

	if (!this.settings.styles) return;

	if (!this.settings.styles.fontSize) {
		this.settings.styles.fontSize = "100%";
	}

	fontSize = parseInt(this.settings.styles.fontSize.slice(0, -1));

	if (MOD && e.keyCode == PLUS) {
		e.preventDefault();
		this.book.setStyle("fontSize", (fontSize + interval) + "%");

	}

	if (MOD && e.keyCode == MINUS) {

		e.preventDefault();
		this.book.setStyle("fontSize", (fontSize - interval) + "%");
	}

	if (MOD && e.keyCode == ZERO) {
		e.preventDefault();
		this.book.setStyle("fontSize", "100%");
	}
};

EPUBJS.Reader.prototype.addBookmark = function (cfi) {
	var present = this.isBookmarked(cfi);
	if (present > -1) return;

	this.settings.bookmarks.push(cfi);

	this.trigger("reader:bookmarked", cfi);
};

EPUBJS.Reader.prototype.removeBookmark = function (cfi) {
	var bookmark = this.isBookmarked(cfi);
	if (bookmark === -1) return;

	delete this.settings.bookmarks[bookmark];

	this.trigger("reader:unbookmarked", bookmark);
};

EPUBJS.Reader.prototype.isBookmarked = function (cfi) {
	var bookmarks = this.settings.bookmarks;

	return bookmarks.indexOf(cfi);
};

/*
 EPUBJS.Reader.prototype.searchBookmarked = function(cfi) {
 var bookmarks = this.settings.bookmarks,
 len = bookmarks.length,
 i;

 for(i = 0; i < len; i++) {
 if (bookmarks[i]['cfi'] === cfi) return i;
 }
 return -1;
 };
 */

EPUBJS.Reader.prototype.clearBookmarks = function () {
	this.settings.bookmarks = [];
};

//-- Notes
EPUBJS.Reader.prototype.addNote = function (note) {
	this.settings.annotations.push(note);
};

EPUBJS.Reader.prototype.removeNote = function (note) {
	var index = this.settings.annotations.indexOf(note);
	if (index === -1) return;

	delete this.settings.annotations[index];

};

EPUBJS.Reader.prototype.clearNotes = function () {
	this.settings.annotations = [];
};

//-- Settings
EPUBJS.Reader.prototype.setBookKey = function (identifier) {
	if (!this.settings.bookKey) {
		this.settings.bookKey = "epubjsreader:" + EPUBJS.VERSION + ":" + window.location.host + ":" + identifier;
	}
	return this.settings.bookKey;
};

//-- Checks if the book setting can be retrieved from localStorage
EPUBJS.Reader.prototype.isSaved = function (bookPath) {
	var storedSettings;

	if (!localStorage) {
		return false;
	}

	storedSettings = localStorage.getItem(this.settings.bookKey);

	if (storedSettings === null) {
		return false;
	} else {
		return true;
	}
};

EPUBJS.Reader.prototype.removeSavedSettings = function () {
	if (!localStorage) {
		return false;
	}

	localStorage.removeItem(this.settings.bookKey);
};

EPUBJS.Reader.prototype.applySavedSettings = function () {
	var stored;

	if (!localStorage) {
		return false;
	}

	stored = JSON.parse(localStorage.getItem(this.settings.bookKey));

	if (stored) {
		this.settings = _.defaults(this.settings, stored);
		return true;
	} else {
		return false;
	}
};

EPUBJS.Reader.prototype.saveSettings = function () {
	if (this.book) {
		this.settings.previousLocationCfi = this.book.getCurrentLocationCfi();
	}

	if (!localStorage) {
		return false;
	}

	localStorage.setItem(this.settings.bookKey, JSON.stringify(this.settings));
};

EPUBJS.Reader.prototype.unload = function () {
	if (this.settings.restore && localStorage) {
		this.saveSettings();
	}
};


EPUBJS.Reader.prototype.hashChanged = function () {
	var hash = window.location.hash.slice(1);
	this.book.goto(hash);
};

EPUBJS.Reader.prototype.selectedRange = function (range) {
	var epubcfi = new EPUBJS.EpubCFI();
	var cfi = epubcfi.generateCfiFromRangeAnchor(range, this.book.renderer.currentChapter.cfiBase);
	var cfiFragment = "#" + cfi;

	// Update the History Location
	if (this.settings.history &&
		window.location.hash != cfiFragment) {
		// Add CFI fragment to the history
		history.pushState({}, '', cfiFragment);
		this.currentLocationCfi = cfi;
	}
};

//-- Enable binding events to reader
RSVP.EventTarget.mixin(EPUBJS.Reader.prototype);
EPUBJS.reader.BookmarksController = function () {
	var reader = this;
	var book = this.book;

	var $bookmarks = $("#bookmarksView"),
		$list = $bookmarks.find("#bookmarks");

	var docfrag = document.createDocumentFragment();

	var show = function () {
		$bookmarks.show();
	};

	var hide = function () {
		$bookmarks.hide();
	};

	var counter = 0;

	var createBookmarkItem = function (cfi) {
		var listitem = document.createElement("li"),
			link = document.createElement("a");

		listitem.id = "bookmark-" + counter;
		listitem.classList.add('list_item');

		//-- TODO: Parse Cfi
		link.textContent = cfi;
		link.href = cfi;

		link.classList.add('bookmark_link');

		link.addEventListener("click", function (event) {
			var cfi = this.getAttribute('href');
			book.gotoCfi(cfi);
			event.preventDefault();
		}, false);

		listitem.appendChild(link);

		counter++;

		return listitem;
	};

	this.settings.bookmarks.forEach(function (cfi) {
		var bookmark = createBookmarkItem(cfi);
		docfrag.appendChild(bookmark);
	});

	$list.append(docfrag);

	this.on("reader:bookmarked", function (cfi) {
		var item = createBookmarkItem(cfi);
		$list.append(item);
	});

	this.on("reader:unbookmarked", function (index) {
		var $item = $("#bookmark-" + index);
		$item.remove();
	});

	return {
		"show": show,
		"hide": hide
	};
};


EPUBJS.reader.ControlsController = function (book) {
	var reader = this;

	var $store = $("#store"),
		$fullscreen = $("#fullscreen"),
		$fullscreenicon = $("#fullscreenicon"),
		$cancelfullscreenicon = $("#cancelfullscreenicon"),
		$slider = $("#slider"),
		$main = $("#main"),
		$sidebar = $("#sidebar"),
		$settings = $("#setting"),
		$bookmark = $("#bookmark");

	var goOnline = function () {
		reader.offline = false;
		// $store.attr("src", $icon.data("save"));
	};

	var goOffline = function () {
		reader.offline = true;
		// $store.attr("src", $icon.data("saved"));
	};

	var fullscreen = false;

	book.on("book:online", goOnline);
	book.on("book:offline", goOffline);

	$slider.on("click", function () {
		if (reader.sidebarOpen) {
			reader.SidebarController.hide();
			$slider.addClass("icon-menu");
			$slider.removeClass("icon-right");
		} else {
			reader.SidebarController.show();
			$slider.addClass("icon-right");
			$slider.removeClass("icon-menu");
		}
	});

	$fullscreen.on("click", function () {
		screenfull.toggle($('#container')[0]);
	});

	if (screenfull) {
		document.addEventListener(screenfull.raw.fullscreenchange, function () {
			fullscreen = screenfull.isFullscreen;
			if (fullscreen) {
				$fullscreen
					.addClass("icon-resize-small")
					.removeClass("icon-resize-full");
			} else {
				$fullscreen
					.addClass("icon-resize-full")
					.removeClass("icon-resize-small");
			}
		});
	}

	$settings.on("click", function () {
		reader.SettingsController.show();
	});

	$bookmark.on("click", function () {
		var cfi = reader.book.getCurrentLocationCfi();
		var bookmarked = reader.isBookmarked(cfi);

		if (bookmarked === -1) { //-- Add bookmark
			reader.addBookmark(cfi);
			$bookmark
				.addClass("icon-bookmark")
				.removeClass("icon-bookmark-empty");
		} else { //-- Remove Bookmark
			reader.removeBookmark(cfi);
			$bookmark
				.removeClass("icon-bookmark")
				.addClass("icon-bookmark-empty");
		}

	});

	book.on('renderer:locationChanged', function (cfi) {
		var cfiFragment = "#" + cfi;
		window.cfi = cfi;
		//-- Check if bookmarked
		var bookmarked = reader.isBookmarked(cfi);
		if (bookmarked === -1) { //-- Not bookmarked
			$bookmark
				.removeClass("icon-bookmark")
				.addClass("icon-bookmark-empty");
		} else { //-- Bookmarked
			$bookmark
				.addClass("icon-bookmark")
				.removeClass("icon-bookmark-empty");
		}

		reader.currentLocationCfi = cfi;

		// Update the History Location
		if (reader.settings.history &&
			window.location.hash != cfiFragment) {
			// Add CFI fragment to the history
			history.pushState({}, '', cfiFragment);
		}
	});

	book.on('book:pageChanged', function (location) {
		// console.log("page", location.page, location.percentage)
	});

	return {};
};
EPUBJS.reader.MetaController = function (meta) {
	var title = meta.bookTitle,
		author = meta.creator;
	window.bookKaMeta = meta;

	var $title = $("#book-title"),
		$author = $("#chapter-title"),
		$dash = $("#title-seperator");

	document.title = title + " – " + author;

	$title.html(title);
	$author.html(author);
	$dash.show();
};
EPUBJS.reader.NotesController = function () {
	var book = this.book;
	var reader = this;
	var $notesView = $("#notesView");
	var $notes = $("#notes");
	var $text = $("#note-text");
	var $anchor = $("#note-anchor");
	var annotations = reader.settings.annotations;
	var renderer = book.renderer;
	var popups = [];
	var epubcfi = new EPUBJS.EpubCFI();

	var show = function () {
		$notesView.show();
	};

	var hide = function () {
		$notesView.hide();
	}

	var insertAtPoint = function (e) {
		var range;
		var textNode;
		var offset;
		var doc = book.renderer.doc;
		var cfi;
		var annotation;

		// standard
		if (doc.caretPositionFromPoint) {
			range = doc.caretPositionFromPoint(e.clientX, e.clientY);
			textNode = range.offsetNode;
			offset = range.offset;
			// WebKit
		} else if (doc.caretRangeFromPoint) {
			range = doc.caretRangeFromPoint(e.clientX, e.clientY);
			textNode = range.startContainer;
			offset = range.startOffset;
		}

		if (textNode.nodeType !== 3) {
			for (var i = 0; i < textNode.childNodes.length; i++) {
				if (textNode.childNodes[i].nodeType == 3) {
					textNode = textNode.childNodes[i];
					break;
				}
			}
		}

		// Find the end of the sentance
		offset = textNode.textContent.indexOf(".", offset);
		if (offset === -1) {
			offset = textNode.length; // Last item
		} else {
			offset += 1; // After the period
		}

		cfi = epubcfi.generateCfiFromTextNode(textNode, offset, book.renderer.currentChapter.cfiBase);

		annotation = {
			annotatedAt: new Date(),
			anchor: cfi,
			body: $text.val()
		}

		// add to list
		reader.addNote(annotation);

		// attach
		addAnnotation(annotation);
		placeMarker(annotation);

		// clear
		$text.val('');
		$anchor.text("Attach");
		$text.prop("disabled", false);

		book.off("renderer:click", insertAtPoint);

	};

	var addAnnotation = function (annotation) {
		var note = document.createElement("li");
		var link = document.createElement("a");

		note.innerHTML = annotation.body;
		// note.setAttribute("ref", annotation.anchor);
		link.innerHTML = " context &#187;";
		link.href = "#" + annotation.anchor;
		link.onclick = function () {
			book.gotoCfi(annotation.anchor);
			return false;
		};

		note.appendChild(link);
		$notes.append(note);

	};

	var placeMarker = function (annotation) {
		var doc = book.renderer.doc;
		var marker = document.createElement("span");
		var mark = document.createElement("a");
		marker.classList.add("footnotesuperscript", "reader_generated");

		marker.style.verticalAlign = "super";
		marker.style.fontSize = ".75em";
		// marker.style.position = "relative";
		marker.style.lineHeight = "1em";

		// mark.style.display = "inline-block";
		mark.style.padding = "2px";
		mark.style.backgroundColor = "#fffa96";
		mark.style.borderRadius = "5px";
		mark.style.cursor = "pointer";

		marker.id = "note-" + EPUBJS.core.uuid();
		mark.innerHTML = annotations.indexOf(annotation) + 1 + "[Reader]";

		marker.appendChild(mark);
		epubcfi.addMarker(annotation.anchor, doc, marker);

		markerEvents(marker, annotation.body);
	}

	var markerEvents = function (item, txt) {
		var id = item.id;

		var showPop = function () {
			var poppos,
				iheight = renderer.height,
				iwidth = renderer.width,
				tip,
				pop,
				maxHeight = 225,
				itemRect,
				left,
				top,
				pos;


			//-- create a popup with endnote inside of it
			if (!popups[id]) {
				popups[id] = document.createElement("div");
				popups[id].setAttribute("class", "popup");

				pop_content = document.createElement("div");

				popups[id].appendChild(pop_content);

				pop_content.innerHTML = txt;
				pop_content.setAttribute("class", "pop_content");

				renderer.render.document.body.appendChild(popups[id]);

				//-- TODO: will these leak memory? - Fred 
				popups[id].addEventListener("mouseover", onPop, false);
				popups[id].addEventListener("mouseout", offPop, false);
				//-- Add hide on page change
				renderer.on("renderer:locationChanged", hidePop, this);
				renderer.on("renderer:locationChanged", offPop, this);
				// chapter.book.on("renderer:chapterDestroy", hidePop, this);
			}

			pop = popups[id];


			//-- get location of item
			itemRect = item.getBoundingClientRect();
			left = itemRect.left;
			top = itemRect.top;

			//-- show the popup
			pop.classList.add("show");

			//-- locations of popup
			popRect = pop.getBoundingClientRect();

			//-- position the popup
			pop.style.left = left - popRect.width / 2 + "px";
			pop.style.top = top + "px";


			//-- Adjust max height
			if (maxHeight > iheight / 2.5) {
				maxHeight = iheight / 2.5;
				pop_content.style.maxHeight = maxHeight + "px";
			}

			//-- switch above / below
			if (popRect.height + top >= iheight - 25) {
				pop.style.top = top - popRect.height + "px";
				pop.classList.add("above");
			} else {
				pop.classList.remove("above");
			}

			//-- switch left
			if (left - popRect.width <= 0) {
				pop.style.left = left + "px";
				pop.classList.add("left");
			} else {
				pop.classList.remove("left");
			}

			//-- switch right
			if (left + popRect.width / 2 >= iwidth) {
				//-- TEMP MOVE: 300
				pop.style.left = left - 300 + "px";

				popRect = pop.getBoundingClientRect();
				pop.style.left = left - popRect.width + "px";
				//-- switch above / below again
				if (popRect.height + top >= iheight - 25) {
					pop.style.top = top - popRect.height + "px";
					pop.classList.add("above");
				} else {
					pop.classList.remove("above");
				}

				pop.classList.add("right");
			} else {
				pop.classList.remove("right");
			}

		}

		var onPop = function () {

			popups[id].classList.add("on");
		}

		var offPop = function () {

			popups[id].classList.remove("on");
		}

		var hidePop = function () {
			setTimeout(function () {
				popups[id].classList.remove("show");
			}, 100);
		}

		var openSidebar = function () {
			// console.log("this is the sidebar");
			reader.ReaderController.slideOut();
			show();
		};

		item.addEventListener("mouseover", showPop, false);
		item.addEventListener("mouseout", hidePop, false);
		item.addEventListener("click", openSidebar, false);

	}
	$anchor.on("click", function (e) {

		$anchor.text("Cancel");
		$text.prop("disabled", "true");
		// listen for selection
		book.on("renderer:click", insertAtPoint);

	});

	annotations.forEach(function (note) {
		addAnnotation(note);
	});


	renderer.registerHook("beforeChapterDisplay", function (callback, renderer) {
		var chapter = renderer.currentChapter;
		annotations.forEach(function (note) {
			var cfi = epubcfi.parse(note.anchor);
			if (cfi.spinePos === chapter.spinePos) {
				try {
					placeMarker(note);
				} catch (e) {
					console.log("anchoring failed", note.anchor);
				}
			}
		});
		callback();
	}, true);


	return {
		"show": show,
		"hide": hide
	};
};
EPUBJS.reader.ReaderController = function (book) {
	var $main = $("#main"),
		$divider = $("#divider"),
		$loader = $("#loader"),
		$next = $("#next"),
		$prev = $("#prev");
	var reader = this;
	var book = this.book;
	var slideIn = function () {
		var currentPosition = book.getCurrentLocationCfi();
		if (reader.settings.sidebarReflow) {
			$main.removeClass('single');
			$main.one("transitionend", function () {
				book.gotoCfi(currentPosition);
			});
		} else {
			$main.removeClass("closed");
		}
	};

	var slideOut = function () {
		var currentPosition = book.getCurrentLocationCfi();
		if (reader.settings.sidebarReflow) {
			$main.addClass('single');
			$main.one("transitionend", function () {
				book.gotoCfi(currentPosition);
			});
		} else {
			$main.addClass("closed");
		}
	};
	//divider is for when book uses spreads

	var showLoader = function () {
		$loader.show();
		hideDivider();
	};

	var hideLoader = function () {
		$loader.hide();

		//-- If the book is using spreads, show the divider
		// if(book.settings.spreads) {
		// 	showDivider();
		// }
	};

	var showDivider = function () {
		$divider.addClass("show");
	};

	var hideDivider = function () {
		$divider.removeClass("show");
	};

	var keylock = false;

	var arrowKeys = function (e) {
		if (e.keyCode == 37) {
			book.prevPage();
			$prev.addClass("active");

			keylock = true;
			setTimeout(function () {
				keylock = false;
				$prev.removeClass("active");
			}, 100);

			e.preventDefault();
		}
		if (e.keyCode == 39) {
			book.nextPage();
			$next.addClass("active");

			keylock = true;
			setTimeout(function () {
				keylock = false;
				$next.removeClass("active");
			}, 100);

			e.preventDefault();
		}
	}

	document.addEventListener('keydown', arrowKeys, false);

	$next.on("click", function (e) {
		book.nextPage();
		e.preventDefault();
	});

	$prev.on("click", function (e) {
		book.prevPage();
		e.preventDefault();
	});

	book.on("renderer:spreads", function (bool) {
		if (bool) {
			showDivider();
		} else {
			hideDivider();
		}
	});

	// book.on("book:atStart", function(){
	// 	$prev.addClass("disabled");
	// });
	// 
	// book.on("book:atEnd", function(){
	// 	$next.addClass("disabled");	
	// });

	return {
		"slideOut": slideOut,
		"slideIn": slideIn,
		"showLoader": showLoader,
		"hideLoader": hideLoader,
		"showDivider": showDivider,
		"hideDivider": hideDivider,
		"arrowKeys": arrowKeys
	};
};
EPUBJS.reader.SettingsController = function () {
	var book = this.book;
	var reader = this;
	var $settings = $("#settings-modal"),
		$overlay = $(".overlay");

	var show = function () {
		$settings.addClass("md-show");
	};

	var hide = function () {
		$settings.removeClass("md-show");
	};

	var $sidebarReflowSetting = $('#sidebarReflow');

	$sidebarReflowSetting.on('click', function () {
		reader.settings.sidebarReflow = !reader.settings.sidebarReflow;
	});

	$settings.find(".closer").on("click", function () {
		hide();
	});

	$overlay.on("click", function () {
		hide();
	});

	return {
		"show": show,
		"hide": hide
	};
};
EPUBJS.reader.SidebarController = function (book) {
	var reader = this;

	var $sidebar = $("#sidebar"),
		$panels = $("#panels");

	var activePanel = "Toc";

	var changePanelTo = function (viewName) {
		var controllerName = viewName + "Controller";

		if (activePanel == viewName || typeof reader[controllerName] === 'undefined') return;
		reader[activePanel + "Controller"].hide();
		reader[controllerName].show();
		activePanel = viewName;

		$panels.find('.active').removeClass("active");
		$panels.find("#show-" + viewName).addClass("active");
	};

	var getActivePanel = function () {
		return activePanel;
	};

	var show = function () {
		reader.sidebarOpen = true;
		reader.ReaderController.slideOut();
		$sidebar.addClass("open");
	}

	var hide = function () {
		reader.sidebarOpen = false;
		reader.ReaderController.slideIn();
		$sidebar.removeClass("open");
	}

	$panels.find(".show_view").on("click", function (event) {
		var view = $(this).data("view");

		changePanelTo(view);
		event.preventDefault();
	});

	return {
		'show': show,
		'hide': hide,
		'getActivePanel': getActivePanel,
		'changePanelTo': changePanelTo
	};
};
EPUBJS.reader.TocController = function (toc) {
	var book = this.book;

	var $list = $("#tocView"),
		docfrag = document.createDocumentFragment();

	var currentChapter = false;

	var generateTocItems = function (toc, level) {
		var container = document.createElement("ul");

		if (!level) level = 1;

		toc.forEach(function (chapter) {
			var listitem = document.createElement("li"),
				link = document.createElement("a");
			toggle = document.createElement("a");

			var subitems;

			listitem.id = "toc-" + chapter.id;
			listitem.classList.add('list_item');

			link.textContent = chapter.label;
			link.href = chapter.href;

			link.classList.add('toc_link');

			listitem.appendChild(link);

			if (chapter.subitems.length > 0) {
				level++;
				subitems = generateTocItems(chapter.subitems, level);
				toggle.classList.add('toc_toggle');

				listitem.insertBefore(toggle, link);
				listitem.appendChild(subitems);
			}


			container.appendChild(listitem);

		});

		return container;
	};

	var onShow = function () {
		$list.show();
	};

	var onHide = function () {
		$list.hide();
	};

	var chapterChange = function (e) {
		var id = e.id,
			$item = $list.find("#toc-" + id),
			$current = $list.find(".currentChapter"),
			$open = $list.find('.openChapter');

		if ($item.length) {

			if ($item != $current && $item.has(currentChapter).length > 0) {
				$current.removeClass("currentChapter");
			}

			$item.addClass("currentChapter");

			// $open.removeClass("openChapter");
			$item.parents('li').addClass("openChapter");
		}
	};

	book.on('renderer:chapterDisplayed', chapterChange);

	var tocitems = generateTocItems(toc);

	docfrag.appendChild(tocitems);

	$list.append(docfrag);
	$list.find(".toc_link").on("click", function (event) {
		var url = this.getAttribute('href');

		event.preventDefault();

		//-- Provide the Book with the url to show
		//   The Url must be found in the books manifest
		book.goto(url);

		$list.find(".currentChapter")
			.addClass("openChapter")
			.removeClass("currentChapter");

		$(this).parent('li').addClass("currentChapter");

	});

	$list.find(".toc_toggle").on("click", function (event) {
		var $el = $(this).parent('li'),
			open = $el.hasClass("openChapter");

		event.preventDefault();
		if (open) {
			$el.removeClass("openChapter");
		} else {
			$el.addClass("openChapter");
		}
	});

	return {
		"show": onShow,
		"hide": onHide
	};
};

EPUBJS.Hooks.register("beforeChapterDisplay").selectword = function (callback, renderer, book) {

	var ultimate = window.mybook;
	var gettingcfi = ultimate.getCurrentLocationCfi();
	// console.log($(renderer.render.window.frameElement).parent().parent().contents());
	// console.log($(renderer.render.window.frameElement).parent().parent().parent().parent().parent().parent().contents());
	var mc = new Hammer(renderer.doc);

	mc.on("panleft", function () {

		if (didPan) {
			didPan = false;
			ultimate.nextPage();
		}
		else {
			didPan = true;
		}
	});

	// var db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
	// db.transaction(function (tx) {
	//
	// 	tx.executeSql("Select * from PageTable", [], function (tx, rs) {
	//
	// 		for (var i = 0; i < rs.rows.length; i++) {
	// 			console.log('book: ' +  ' ' + rs.rows.item(i).book);
	// 			console.log('page: ' +  ' ' + rs.rows.item(i).page);
	// 			console.log('seconds : ' + ' ' + rs.rows.item(i).seconds);
	// 			console.log("----------------------------------------------");
	// 		}
	// 	}, function (tx, error) {
	// 		console.log('SELECT error: ' + error.message);
	// 	});
	// });

	mc.on("panright", function () {
		if (didPan) {
			didPan = false;
			ultimate.prevPage();
		}
		else {
			didPan = true;
		}
	});
	//console.log($(renderer.render.window.frameElement).parent().parent().contents());
	var wrap = $(renderer.render.window.frameElement).parent().parent().contents()[5];
	var definer = $(renderer.render.window.frameElement).parent().parent().contents()[9];
	var cancelus = $(renderer.render.window.frameElement).parent().parent().contents()[11];
	var speaker = $(renderer.render.window.frameElement).parent().parent().contents()[13];
	var shutters = $(renderer.render.window.frameElement).parent().parent().contents()[15];
	var listener = $(renderer.render.window.frameElement).parent().parent().contents()[17];
	// window.loadingscreen = $(renderer.render.window.frameElement).parent().parent().contents()[19];
	localStorage.isPause = "resume";

	var textToSpeech = function (arrayOfParas, counter) {
		console.log(arrayOfParas[counter].innerText);
		TTS.speak({text: arrayOfParas[counter].innerText, rate: 0.85}, function () {
			console.log('success');
			counter = counter + 1;
			if (counter < arrayOfParas.length && localStorage.isPause == "resume") {
				setTimeout(textToSpeech(arrayOfParas, counter), 1500);
			}
		}, function (reason) {
			console.log(reason);
		});
	};


	var speakout = function () {

		var speechElements = renderer.doc.querySelectorAll('p');
		textToSpeech(speechElements, 0);
		localStorage.isPause = "resume";
	};

	var textToStop = function (counter) {

		TTS.speak('', function () {
			console.log("Stopped");
			localStorage.isPause = "pause";
		}, function (reason) {
			console.log(reason);
		});
	};

	var speakless = function () {

		textToStop(0);
		// TTS.speak('', function () {
		// 	console.log('Stopped');
		// 	setTimeout(function () {
		// 		console.log("please dont continue")
		// 	}, 3000);
		// }, function (reason) {
		// 	console.log(reason);
		// });

	};

	var hear = function(){
		window.recognition.start();
}

	if((typeof speaker =='undefined') && (typeof shutters =='undefined')){
		$(speaker).hide();
		$(shutters).hide();
		$(listener).hide();
	}

	if(!(typeof speaker =='undefined') && !(typeof shutters =='undefined')){
		$(speaker).show();
		$(shutters).show();
		speaker.addEventListener("click", speakout, false);
		shutters.addEventListener("click", speakless, false);
		listener.addEventListener("click", hear, false);
	}

	// Select p tags to attach listener to them
	var elements = renderer.doc.querySelectorAll('p'),
	//Perform actions on each of the elements. Each item is paragraph in book html
	items = Array.prototype.slice.call(elements);
	items.forEach(function (item) {
		$(item).on('dblclick', function () {
			localStorage.sentence = '';
			localStorage.meaning = '';
			localStorage.word = '';

			var elems = renderer.doc.querySelectorAll(".hilite");
			//
			[].forEach.call(elems, function(el) {
				el.classList.remove("hilite");
			});

			//get the word when user double taps on screen
			var t = '';
			if (window.getSelection && (sel = window.getSelection()).modify) {
				// Webkit, Gecko
				var s = renderer.render.window.getSelection();
				if (s.isCollapsed) {
					s.modify('move', 'forward', 'character');
					s.modify('move', 'backward', 'word');
					s.modify('extend', 'forward', 'word');
					t = s.toString();
					s.modify('move', 'forward', 'character'); //clear selection
				}
				else {
					t = s.toString();
				}
			} else if ((sel = document.selection) && sel.type != "Control") {
				// IE 4+
				var textRange = sel.createRange();
				if (!textRange.text) {
					textRange.expand("word");
				}
				// Remove trailing spaces
				while (/\s$/.test(textRange.text)) {
					textRange.moveEnd("character", -1);
				}
				t = textRange.text;

			}
			// Define replaceAll
			String.prototype.replaceAll = function (target, replacement) {
				return this.split(target).join(replacement);
			};
			var replacee = " " + t;
			var replacer = " <b class='hilite'>" + t + "</b>";

			var temp = item.innerHTML;
			var temper = item.innerHTML.replaceAll(replacee, replacer);
			item.innerHTML = temper;
			// Display Define block and cancel circle
			definer.style.display = "block";
			cancelus.style.display = "block";


			// $('#canceler').css('display', 'block');


			// Different alternatives to add elements to dom
			//var division = parent.createElement("div");
			//renderer.render.document.body.appendChild(division);
			//item.appendChild(division);
			//division.parentNode.innerHTML="<iframe height='300px' width='100%' src='../www/test.html'></iframe>";

			localStorage.word = t;

			var array_of_sentences = (item.innerText.split("."));
			for (var i = 0; i < array_of_sentences.length; i++) {

				var single = array_of_sentences[i];
				if (single.includes(t))
					localStorage.sentence = array_of_sentences[i];
			}


			var outputs = $.ajax({
				url: 'https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=' + t + '',
				type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
				data: {}, // Additional parameters here
				dataType: 'json',
				success: function (data) {
					console.log(data);

					var output = $.ajax({
						url: 'https://api.pearson.com/v2/dictionaries/ldoce5/entries?headword=' + t + '', // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
						//url: 'https://wordsapiv1.p.mashape.com/words/'+t+'/definitions',
						type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
						data: {}, // Additional parameters here
						dataType: 'json',
						success: function (r) {

							var meanings = [];
							meanings[0] = "Definition not found";
							meanings[1] = "";
							meanings[2] = "";
							var ogword = t;

							console.log(r);
							// localStorage.meaning = r.results[0].senses[0].definition[0];


							try {
								for (var i = 0; i < r.count; i++) {
									if (r.results[i].senses[0].definition) {
										meanings[i] = '[' + (i + 1) + '] ' + r.results[i].senses[0].definition[0];
										// console.log(meanings[i]);
									}
								}

							} catch (err) {
								meanings[0] = "Definition not found";
							}

							localStorage.meaning = meanings[0];


							// wrap.innerHTML = "<span id='cross'>✖</span><div class='container'><img class = 'photo' src ='" + data.value[0].thumbnailUrl + "&w=200&h=200'/><img class='photo' src ='" + data.value[1].thumbnailUrl + "&w=200&h=200'/><img class='photo' src ='" + data.value[2].thumbnailUrl + "&w=200&h=200'/><img class='photo' src ='" + data.value[3].thumbnailUrl + "&w=200&h=200'/></div><h1>" + ogword + "</h1><div id='meaningspara'>" + meanings[0] + "<br>" + meanings[1] + "</div>";
							
							wrap.innerHTML = "<span id='cross'>✖</span><div class='container'><img class = 'photo' src ='" + data.queryExpansions[0].thumbnail.thumbnailUrl + "&w=200&h=200'/><img class='photo' src ='" + data.queryExpansions[1].thumbnail.thumbnailUrl + "&w=200&h=200'/><img class='photo' src ='" + data.queryExpansions[2].thumbnail.thumbnailUrl + "&w=200&h=200'/><img class='photo' src ='" + data.queryExpansions[3].thumbnail.thumbnailUrl + "&w=200&h=200'/></div><h1>" + ogword + "</h1><div id='meaningspara'>" + meanings[0] + "<br>" + meanings[1] + "</div>";
							
							// console.log(wrap.firstChild.nextSibling.firstChild);

							//wrap.innerHTML="<span id='cross'>✖</span><div id='imagecontainer'><center><img src ='"+data.value[0].thumbnailUrl+"&w=200&h=200'/></center></div><h1>"+ogword+"</h1><div id='meaningspara'>"+meanings[0]+"<br>"+meanings[1]+"</div>";
							//mydef = data.defintinitons;
							//console.log(mydef);
							//document.getElementById("output1").innerHTML = data.definitions[0].partOfSpeech;
						},
						complete: function () {
							if(localStorage.meaning.length >1 && localStorage.meaning != "Definition not found") {
								// console.log(localStorage.meaning + "goes to db");
								var db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});

								db.transaction(function (tx) {
									tx.executeSql('CREATE TABLE IF NOT EXISTS WordsTable (word, meaning, sentence, frequency, book)');
									tx.executeSql("SELECT count(*) AS mycount FROM WordsTable where word='"+localStorage.word+"' ", [], function (tx, rs) {
										console.log('Record count : ' + rs.rows.item(0).mycount);
										console.log(rs);
										if(rs.rows.item(0).mycount == 0){
											db.transaction(function (tx) {
												//tx.executeSql('DROP TABLE IF EXISTS WordsTable');
												tx.executeSql('INSERT INTO WordsTable VALUES (?,?,?,?,?)', [localStorage.word, localStorage.meaning, localStorage.sentence,1,window.bookKaMeta.bookTitle]);
											}, function (error) {
												console.log('Transaction ERROR: ' + error.message);
											}, function () {
												console.log('Inserted');
											});
										}
										else {
											db.transaction(function (tx) {
												//tx.executeSql('DROP TABLE IF EXISTS WordsTable');
												// tx.executeSql('INSERT INTO WordsTable VALUES (?,?,?,?,?)', [localStorage.word, localStorage.meaning, localStorage.sentence,0,window.bookKaMeta.bookTitle]);
												tx.executeSql("Update WordsTable Set frequency = frequency + 1 WHERE word='"+localStorage.word+"' ");
											}, function (error) {
												console.log('Transaction ERROR: ' + error.message);
											}, function () {
												console.log('Incremented');
											});
										}
									}, function (tx, error) {
										console.log('SELECT error: ' + error.message);
									},function () {
										console.log('Recorded');
									});
								});


							}
							console.log(localStorage.meaning);
						},
						//beforeSend: function(){console.log("hey");},
						error: function (err) {
							console.log(err);
						}

					});
				},
				error: function (err) {
					console.log(err);
				},
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "457dba72ab0347b28f31e688d4a332e5");
					//xhr.setRequestHeader("Access-Control-Allow-Origin", "*");// Enter here your Mashape key
				}

			});

			var openwrap = function () {

				// $(renderer.doc).on('click', hidepope);
				wrap.style.display = "block";
				definer.style.display = "none";
				cancelus.style.display="none";
				item.innerHTML = temp;

			};

			definer.addEventListener("click", openwrap, false);


			// definer.addEventListener("click", openwrap, false);
			// var bruh = $('#canceler');

			//undefiner.addEventListener("click", hidepope, false);

			// // Clear and hide the popup div
			// var hidepope = function () {
			// 	wrap.innerHTML="";
			// 	wrap.style.display = "none";
			// 	item.innerHTML = temp;
			// 	//wrap.parentNode.removeChild(wrap);
			// };

			var onCancel = function () {
				cancelus.style.display = "none";
				definer.style.display = "none";
				item.innerHTML = temp;
			};

			var hidepope = function () {
				wrap.innerHTML = "";
				wrap.style.display = "none";
				cancelus.style.display = "none";
				definer.style.display = "none";
				item.innerHTML = temp;

				//wrap.parentNode.removeChild(wrap);
			};

			var clearHighlights = function(){
				console.log("hellp");
				item.innerHTML = temp;
				cancelus.style.display = "none";
				definer.style.display = "none";
			};

			// $(renderer.doc).on('click', clearHighlights);
			wrap.addEventListener("click", hidepope, false);
			cancelus.addEventListener("click", onCancel, false);

		});
	});

	if (callback) callback();
};

//# sourceMappingURL=reader.js.map