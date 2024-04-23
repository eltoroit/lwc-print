#!/bin/zsh
exe() { echo "\$ $@" ; "$@" ; }
# Do not use sf project deploy start because it does not detect if this is a sorce-tracked org and you could accidentally deploy to production!
# exe sf project deploy start --target-org soPackageTester --ignore-conflicts --verbose --json 
exe sfdx force source push --forceoverwrite --json
if [ $? -eq 0 ] 
then 
    print "\u001b[42m\u001b[1;30m*** *** SUCCESS *** ***\u001b[0m"
else 
    print "\u001b[43m\u001b[1;31m*** *** FAILED *** ***\u001b[0m"
fi
date