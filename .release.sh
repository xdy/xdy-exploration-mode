SEARCH_PATTERN='(\s\"(manifest|download)\"\: \"https:\/\/github.com\/xdy\/xdy-exploration-mode\/releases\/).*(\/(module.json|xdy-exploration-mode.zip)\",)'
DEVELOPMENT_REPLACE="\1download/v$1\3"
MAIN_REPLACE="\1latest/download\3"

sed -i -e 's|\(.*"version"\): "\(.*\)",.*|\1: '"\"$1\",|" src/module.json &&
  sed -i -r s"~$SEARCH_PATTERN~$MAIN_REPLACE~" src/module.json &&
  cp src/module.json dist &&
  sed -i -e 's|\(.*"version"\): "\(.*\)",.*|\1: '"\"$1\",|" package.json &&
  npm install &&
  cd dist || exit &&
  zip -r xdy-exploration-mode.zip ./* &&
  cd ..
