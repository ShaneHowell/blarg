##Blarg

Simple SCSS Framework for Wordpress or anything really.

###File Structure
```

1. main.scss
  + @imports:
	+ /partials/config
	+ /partials/normalize
	+ /partials/fonts
	+ /partials/header
	+ /partials/footer
2. partials
	+ _config.scss
	+ _fonts.scss
	+ _footer.scss
	+ _grid.scss
	+ _header.scss
	+ _mixins.scss
	+ _normalize.scss
	+ _variables.scss
3. templates
	+ archive.scss
	+ front-page.scss
	+ page.scss
	+ single.scss
	+ template.scss
```
*All templates only @include one file, _config*

###Grid

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

