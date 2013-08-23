Blarg
_____

Simple SCSS Framework for Wordpress or anything really.


Grid
======

Blarg's grid is based off of the [Frameless Grid](https://github.com/jonikorpi/Frameless/blob/master/frameless.scss "Frameless Grid") but, simplified.
	```
	@function cols($cols:1) {
		@return ($cols * ($column + $gutter) - $gutter) / $em - .03em;
	}

	@function offset($offset:1) {
		@return ($offset * ($column + $gutter)) / $em;
	}
	```
To use the grid, first set your column and gutter variables in the [_variables.scss](https://github.com/ShaneHowell/blarg/blob/master/scss/partials/_variables.scss) file.

Defaults:
	```
	$base-font-size: 16px;
	$em: $base-font-size / 1em;

	$column: 60px;
	$gutter: 20px;
	$col-gut: ($gutter - 4px) / $em;
	```