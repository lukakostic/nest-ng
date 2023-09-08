#!/bin/bash

# Check if a target zip filename is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <output_zip_file>"
    exit 1
fi

# The name of the output zip file
OUTPUT_ZIP="$1"

# Use the `find` command to gather all files and folders, excluding "node_modules", ".git", and ".gitignore",
# and then zip them into the specified output file.
find . -type f -print | grep -v "node_modules/" | grep -v "\.git/" | grep -v "\.gitignore$" | grep -v "\.vscode/" | zip $OUTPUT_ZIP -@

