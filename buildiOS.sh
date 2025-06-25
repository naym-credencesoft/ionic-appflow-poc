#!/bin/zsh

if [[ $# -eq 0 ]] || [[ -z "$1" ]] ; then
    echo "Please specify a environment name"
    exit 1
fi

ENV_NAME=$1

npm install
ionic build -c $ENV_NAME
cp -r resources/ios/. ios/App/App/
ionic cap sync ios -c $ENV_NAME
ionic cap open ios