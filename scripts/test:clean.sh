#!/bin/bash

bun clean
bun build
bun autoinstall
bun test $1
