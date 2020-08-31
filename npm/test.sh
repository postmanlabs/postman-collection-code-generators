#!/bin/bash
set -e;

echo "Running root tests:"

node npm/test.js

if [ -n "$1" ];
then
    SDKGEN=$1;
    if [ ! -d "./sdkgen/$SDKGEN" ]; 
    then
        echo "Sdkgen $SDKGEN doesn't exist, please enter valid name";
        exit 1;
    fi
    echo "$1 : npm test";
    pushd ./sdkgen/$SDKGEN &>/dev/null;
    npm test;
    popd &>/dev/null;
else
    echo -e "\nRunning npm test on all the SDKGENs";
    for directory in ./sdkgen/*; do
        if [ -d ${directory} ];
        then
            sdkname=${directory:9} # directory contains sdkgen/nodejs-request, we need to pass nodejs-request
            echo "$sdkname : npm test";
            pushd $directory &>/dev/null;
            npm test;
            popd &>/dev/null;
        else
            echo "No SDKGEN folders present";
            exit 0;
        fi
    done

fi
