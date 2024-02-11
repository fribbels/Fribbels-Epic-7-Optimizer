#!/bin/bash

# Get the directory of the current script
DIR="$(dirname "$0")"
# Run the Python script using pkexec
pkexec python3 "$DIR/scanner.py"
