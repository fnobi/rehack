rehack
==============

rename project.

## install

### from npm

```
npm install rehack
```

### from github

```
git clone git://github.com/fnobi/rehack.git
```

## usage

```
$ cd ~/your/project/path/old-project

$ rehack old-project new-project
[default]  ./.gitignore
[update]   ./src/README.md
[default]  ./src/aws-credentials.json.sample
[update]   ./src/bower.json
[update]   ./src/gulpfile.js
[update]   ./src/package.json
[default]  ./src/task-util.js
[default]  ./src/test/basic-test.js
[default]  ./src/sass/_definitions.scss
[default]  ./src/sass/_keyframes.scss
[default]  ./src/sass/new-project-test.scss
[default]  ./src/sass/new-project.scss
[default]  ./src/sass/lib/_animation.scss
[default]  ./src/sass/lib/_apply-prefixes.scss
[default]  ./src/sass/components/_wrapper.scss
[default]  ./src/js/BrowserFeature.js
[default]  ./src/js/CSSUtil.js
[update]   ./src/js/newProject.js
[default]  ./src/js/newProjectTest.js
[default]  ./src/jade/index.jade
[update]   ./src/jade/test.jade
[default]  ./src/jade/partial/share.jade
[update]   ./src/jade/layout/DefaultLayout.jade
[update]   ./src/jade/layout/TestLayout.jade
[default]  ./src/jade/helper/SNSHelper.js
[update]   ./src/data/config.yaml
```
