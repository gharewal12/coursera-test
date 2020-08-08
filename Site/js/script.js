$(function () { // same as document.addeventlistener("DOMContentLoaded"......)

	// same as document.queryselector("navabartoogle").addeventlistener
	$("#navbarToggle").blur(function(event){
		var screenwidth = window.innerWidth;
		if (screenwidth < 768) {
			$("#navbarNav").collapse('hide');
		}
	});
});



(function(global){


	var dc = {};

	var homehtmlurl = "https://gharewal12.github.io/coursera-test/Site/home-snippet.html";

	var allcategoriesurl = "https://davids-restaurant.herokuapp.com/categories.json";

	var categoriestitlehtml = "https://gharewal12.github.io/coursera-test/Site/categories-title-snippet.html";

	var categoryhtml = "https://gharewal12.github.io/coursera-test/Site/category-snippet.html";
	
	var menuitemsurl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";

	var menuitemstitlehtml = "https://gharewal12.github.io/coursera-test/Site/menu-items-title.html";

	var menuitemhtml = "https://gharewal12.github.io/coursera-test/Site/menu-item.html";
	// convinience function for inserting innerhtml for select

	var inserthtml = function(selector,html) {

		var targetelement = document.querySelector(selector);
		targetelement.innerHTML = html;
	};

	// show loading icon inside element identified by selector

	var showloading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='coursera-test/Site/image/ajax-loader.gif'></div>";
		inserthtml(selector,html);
	};


	// Return substitute of '{{propname}} with propvalue in given 'string''

	var insertproperty = function (string,propname,propvalue) {

		var proptoreplace = "{{" + propname + "}}";

		string = string.replace(new RegExp(proptoreplace,"g"),propvalue); // "g"(is a flag) means everywhere
		return string;
	};

	// on page load 
	document.addEventListener("DOMContentLoaded", function (event) {

		showloading("#main-content");
		$ajaxutils.sendgetrequest (allcategoriesurl, buildAndShowHomeHTML,true);
	});


	function buildAndShowHomeHTML (categories) {
		$ajaxutils.sendgetrequest(homehtmlurl, function (homehtml) {
			var chosenCategoryShortName = chooseRandomCategory(categories);
			// console.log(typeof(chosenCategoryShortName));
			var homeHtmlToInsertIntoMainPage = insertproperty(homehtml,"randomCategoryShortName",chosenCategoryShortName.short_name);
			// console.log(homeHtmlToInsertIntoMainPage);
			inserthtml("#main-content",homeHtmlToInsertIntoMainPage);

		},
		false);
	}


		function chooseRandomCategory (categories) {
	  // Choose a random index into the array (from 0 inclusively until array length (exclusively))
	  parsedcategory = JSON.parse(categories);
	  // console.log(typeof(categories));
	  var randomArrayIndex = Math.floor(Math.random() * parsedcategory.length);
	  console.log(parsedcategory.length);
	  // return category object with that randomArrayIndex
	  return parsedcategory[randomArrayIndex];
	}


	dc.loadmenucategories = function () {
		showloading("#main-content");
		$ajaxutils.sendgetrequest(allcategoriesurl,buildAndShowCategoriesHTML);// value of function there. no brackets
	};

	// Load the menu item view
	// categooryshort is a short name for category

	dc.loadmenuitems = function (categoryshort) {
		showloading("#main-content");
		$ajaxutils.sendgetrequest(menuitemsurl + categoryshort, buildAndShowMenuItemsHTML);
	};



	function buildAndShowCategoriesHTML (categories) {
		// console.log(categories);
		// Load title snippet of categories page 
		$ajaxutils.sendgetrequest(categoriestitlehtml,function (categoriestitlehtml) {
			// retrieve single category snippet
			$ajaxutils.sendgetrequest(categoryhtml,function (categoryhtml) {
				var categoriesviewhtml =buildcategoriesviewhtml(categories,categoriestitlehtml,categoryhtml);
				inserthtml("#main-content",categoriesviewhtml);
			},
			false);
		},
		false);
	}

	// using categories data and snippet html
	// build categories view html to be inserted into page

	function buildcategoriesviewhtml(categories,categoriestitlehtml,categoryhtml) {
		// console.log(categories);

		var finalhtml = categoriestitlehtml;
		var test = JSON.parse(categories);
		console.log(test[1].name);

		finalhtml += "<section class='row'>";

		// Loop over categories

		for (var i = 0; i < test.length; i++) {
			// insert cateogry values
			var html = categoryhtml;

			var name = "" + test[i].name;
			var short_name = test[i].short_name;
			html = insertproperty(html, "name", name);
			html = insertproperty(html, "short_name" ,short_name);
			finalhtml += html;
			// console.log(short_name);
		}

		finalhtml += "</section>";
		// console.log(finalhtml);
		return finalhtml;
	}

	// build html for the single category page based on the data from the server
    function buildAndShowMenuItemsHTML (categorymenuitems) {

		$ajaxutils.sendgetrequest(menuitemstitlehtml, 
			function (menuitemstitlehtml) {
				// retrieve single menu item snippet
				$ajaxutils.sendgetrequest(menuitemhtml, function (menuitemhtml) {
					var menuitemsviewhtml = buildmenuitemsviewhtml(categorymenuitems,menuitemstitlehtml,menuitemhtml);
					inserthtml('#main-content',menuitemsviewhtml);
				},
				false);
			},
			false);
	}
	

	function buildmenuitemsviewhtml(categorymenuitems,menuitemstitlehtml,menuitemhtml) {
		var xyz = JSON.parse(categorymenuitems);
		// console.log(typeof(xyz));
		menuitemstitlehtml = insertproperty(menuitemstitlehtml,"name",xyz.category.name);
		// console.log(menuitemstitlehtml);
		menuitemstitlehtml = insertproperty(menuitemstitlehtml,"special_instructions",xyz.category.special_instructions);
		var finalhtml = menuitemstitlehtml;
		finalhtml += "<section class='row";

		// loop over categories
		var menuitems = xyz.menu_items;
		var catshortname = xyz.category.short_name;
		for (var i = 0; i < menuitems.length; i++) {
			var html = menuitemhtml;

			html = insertproperty(html,"short_name",menuitems[i].short_name);
			html = insertproperty(html,"catshortname",catshortname);
			html = insertItemPrice(html,"price_small",menuitems[i].price_small);
			html =
     				insertItemPortionName(html,
                            "small_portion_name",
                            menuitems[i].small_portion_name);
    		html =
      				insertItemPrice(html,
                      "price_large",
                      menuitems[i].price_large);
    		html =
      				insertItemPortionName(html,
                            "large_portion_name",
                            menuitems[i].large_portion_name);
    		html =
      				insertproperty(html,
                     "name",
                     menuitems[i].name);
    		html =
      				insertproperty(html,
                     "description",
                     menuitems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    	}

    finalhtml += html;
  	}

  finalhtml += "</section>";
  return finalhtml;

}


	function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertproperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertproperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertproperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertproperty(html, portionPropName, portionValue);
  return html;
}
 
	global.$dc = dc;
})(window);
