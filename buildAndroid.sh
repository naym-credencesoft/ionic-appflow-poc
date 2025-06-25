#!/bin/bash

if [[ $# -eq 0 ]] || [[ -z "$1" ]] ; then
    echo "Please specify a environment name"
    exit 1
fi

ENV_NAME=$1

npm install
ionic build -c $ENV_NAME
cp -r resources/android/res android/app/src/main/
ionic cap sync android -c $ENV_NAME
ionic cap open android