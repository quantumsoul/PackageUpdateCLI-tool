#! /usr/bin/env node
const getPackage = require('get-repo-package-json')
const cmp = require('compare-versions')
const csv = require('csv-parser')
const csvWriter = require('csv-write-stream')
const fs = require('fs')
const { execSync } = require("child_process");
var wr = []
if(process.argv[2] =="-i"){
    fs.createWriteStream('out.csv')
    var writer = csvWriter({headers:['name','repo','version','satisfy']})
    writer.pipe(fs.createWriteStream('out.csv', {flags: 'a'}));
    fs.createReadStream(`${process.argv[3]}`)
    .pipe(csv())
    .on('data', (row) => {
        const url = row.repo
        getPackage(`${url}`).then((pkg) => { 
            const operationType = process.argv[2]
            var dep = process.argv[4]
            var arr = dep.split("@")
            var obj = {}
            obj.name = row.name
            obj.repo = row.repo
            obj.version = pkg.dependencies[`${arr[0]}`]
            if(cmp(pkg.dependencies[`${arr[0]}`], arr[1]) == 1){
                obj.satisfy = true
            } else if(cmp(pkg.dependencies[`${arr[0]}`], arr[1]) == 0) {
                obj.satisfy = true
            } else {
                obj.satisfy = false
            }
            writer.write(obj)
        }).catch((error)=>{
            console.log(error)
        })
    });
}
else if(process.argv[2] == "-update"){
    fs.createWriteStream('out.csv')
    var writer = csvWriter({headers:['name','repo','version','satisfy','update_pr']})
    writer.pipe(fs.createWriteStream('out.csv', {flags: 'a'}));
    fs.createReadStream(`${process.argv[4]}`)
    .pipe(csv())
    .on('data', (row) => {
        const url = row.repo
        getPackage(`${url}`).then((pkg) => { 
            const operationType = process.argv[2]
            var dep = process.argv[5]
            var arr = dep.split("@")
            var obj = {}
            obj.name = row.name
            obj.repo = row.repo
            obj.version = pkg.dependencies[`${arr[0]}`]
            if(cmp(pkg.dependencies[`${arr[0]}`], arr[1]) == 1){
                obj.satisfy = true
            } else if(cmp(pkg.dependencies[`${arr[0]}`], arr[1]) == 0) {
                obj.satisfy = true
            } else {
                obj.satisfy = false
            }
            if(obj.satisfy == false){
                var a = url.split('/')
                var b = a[4].split('.')
                var vg = "this." + `${arr[0]}`
                execSync(`git config --global core.autocrlf input`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                execSync(`gh repo fork ${url} --clone=true --remote=true`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });          
                execSync(`cd ${b[0]}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                execSync(`json -I -f package.json -e "${vg} = '${arr[1]}'"`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                execSync(`git add .`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                execSync(`git commit -m "package-update"`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                execSync(`git remote set-url origin https://github.com/quantumsoul/`+`${b[0]}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                execSync(`git pull origin main`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                execSync(`git push origin main`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });                
                execSync(`gh pr create --repo ${url} --title "package-update from prakhar" --body " relevent package updated"`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });                              
            }
            else{
                obj.update_pr = ""
            }
            writer.write(obj)
        }).catch((error)=>{
            console.log(error)
        })
    });
}

