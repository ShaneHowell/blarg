## Blarg

A simple SCSS framework.

#### Structure

1. Move `blarg-starter-scss` to your assets folder and rename.
2. Override default variables in `blarg-starter-scss/partials/_bootstrap`.
3. Update `blarg-starter-scss/partials/_bootstrap` with the path to the `blarg/scss/_blarg` file.

#### Gulp
1. Example GulpJS file is included.
2. Add paths within gulpfile.js.
3. Add your proxy to the gulpfile.js. ex: `local.mysite.com`
4. Run `gulp`.

###### Available Gulp commands
* `gulp`          - Start gulp, run sass compiler, run build compiler, start Browser Sync.

* `gulp sass`     - Run SASS compiler only.

* `gulp img`      - Minimize images.

* `gulp build`    - Concatinate CSS and JS. (does not run SASS compiler)

#### Grid
The Blarg grid is rather flexible. You can set you Base Font Size, Grid Column 
width and your Grid Gutter width within `scss > partials > _grid.scss`.

You may also choose which unit your grid should be based off of in `scss > partials > _grid.scss`.
The default is `rem` but you may set it to either `rem, em or px`.

Then within your SCSS file you can set the column size like so: `width: cols(8)`.

#### Media Queries
Blarg comes with your basic media queries:
```
$mq-smallest:  "screen";                                           // Phone Portrait - Default
$mq-small:     "screen and (min-width: 480px)";                    // Phone Landscape
$mq-medium:    "screen and (min-width: 720px)";                    // Tablet Portrait
$mq-large:     "screen and (min-width: 960px)";                    // Desktop Regular
$mq-largest:   "screen and (min-width: 1200px)";                   // Desktop Large
$mq-retina:    "screen and (-webkit-min-device-pixel-ratio: 1.5),
                screen and (min--moz-device-pixel-ratio: 1.5),
                screen and (min-device-pixel-ratio: 1.5)";         // Retina Screens
```
You can see their use in the template files.

#### Mixins
Blarg comes with a few handy dandy mixins for you to use which can be found at `scss > partials > _mixins.scss`.

*Note: If you're using the included Gulp file then the mixins marked with `**` are not needed as their 
intended function is automatically done upon compile.*