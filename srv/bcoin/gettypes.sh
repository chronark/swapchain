#!/bin/sh

bcoin_dir=$(dirname $(realpath $0))
bcoin_git_clone="$bcoin_dir/tmp_clone"


echo $bcoin_git_clone

git clone https://github.com/bcoin-org/bcoin.git $bcoin_git_clone

cd $bcoin_git_clone
npm install typescript

$bcoin_git_clone/node_modules/.bin/tsc --allowJs -d --outDir ./types --emitDeclarationOnly ./lib/**/*.js || true

cp -r $bcoin_git_clone/types $bcoin_dir/

rm -rf $bcoin_git_clone

echo "\e[42m\e[30mYou can ignore TS9006 errors above, that issue won't be resolved until typescript4.0\e[0m"
echo "See here: https://github.com/microsoft/TypeScript/issues/37832"