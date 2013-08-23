Blarg
=====

Simple SCSS Framework for Wordpress or anything really.


Grid
____
Arguably the most important part of any framework.

Blarg's grid is based off of the [Frameless Grid](https://github.com/jonikorpi/Frameless/blob/master/frameless.scss "Frameless Grid") but, simplified.
```
@function cols($cols:1) {
	@return ($cols * ($column + $gutter) - $gutter) / $em - .03em;
}

@function offset($offset:1) {
	@return ($offset * ($column + $gutter)) / $em;
}
```