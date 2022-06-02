#! /usr/bin/bash
pwd
gh repo fork "name1" --clone=true
pause
cd "name2"
json -I -f package.json -e "this.name3=0.23.0"
git add .
git commit -m "package-update"
gh pr create --repo $name1 --title "package-update from prakhar" --body "$name3 package updated"


