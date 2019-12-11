#!/bin/bash

set -x

# Pass the --fix flag in resolve fixable errors and warnings

SRC_DIR="src"
ESLINT_EXEC="$(pwd)/node_modules/.bin/eslint"

${ESLINT_EXEC} ${SRC_DIR}/* $1

