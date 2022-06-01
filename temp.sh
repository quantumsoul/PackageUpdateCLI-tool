#! /usr/bin/bash
pwd
echo "inputing";
read name1;
read name2;
read name3;
read name4;
echo "op: $name1 $name2";
gh repo fork $name1 --clone=true
cd $name2
json -I -f package.json -e "this.$name3=$name4"
git add .
git commit -m "package-update"
gh pr create --repo $name1 --title "package-update from prakhar" --body "$name3 package updated"


