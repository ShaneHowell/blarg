##Blarg

Simple SCSS Framework for Wordpress or anything really.

####File Structure
```

- main.scss
  + @imports:
	+ /partials/config
	+ /partials/normalize
	+ /partials/fonts
	+ /partials/header
	+ /partials/footer
- partials
	+ _config.scss
	+ _fonts.scss
	+ _footer.scss
	+ _grid.scss
	+ _header.scss
	+ _mixins.scss
	+ _normalize.scss
	+ _variables.scss
- templates
	+ archive.scss
	+ front-page.scss
	+ page.scss
	+ single.scss
	+ template.scss
```
*All templates only @import one file, _config.scss*

####Grid

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

Then, to use the grid, just head into your file of choice and add:
```
.something {
	width: cols(#);
}
```
*# being the number of columns you'd like*

#####Important notes on the Grid

This is a very bare bones "grid" that gives you full control.
Meaning, you can choose to float the columns or inline-block the columns.
The columns do not automatically group together.
The columns do not automatically size down.

You. Have. All. The. Control.

*Special Note*

If using inline-block then you must add a margin of $col-gut (in which ever direction you want) to remove the space added by inline-block.








