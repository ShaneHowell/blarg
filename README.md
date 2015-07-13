## Blarg

A simple SCSS framework.

#### Structure

1. Move `blarg-starter-scss` to your assets folder and rename.
2. Override default variables in `blarg-starter-scss/partials/_bootstrap`.
3. Update `blarg-starter-scss/partials/_bootstrap` with the path to the `blarg/scss/_blarg` file.


#### Gulp
1. Example GulpJS file is included.
2. Add paths within gulpfile.js.
3. Add your proxy to the gulpfile.js. ex: `local.airtype.com`
4. Run `gulp`.

###### Available Gulp commands
* `gulp`          - Start gulp, run sass compiler, run build compiler, start Browser Sync.

* `gulp sass`     - Run SASS compiler only.

* `gulp img`      - Minimize images.

* `gulp build`    - Concatinate CSS and JS. (does not run SASS compiler)