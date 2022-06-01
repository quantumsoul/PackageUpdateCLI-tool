#! /usr/bin/env node
const getPackage = require('get-repo-package-json')
const cmp = require('compare-versions')
const csv = require('csv-parser')
const csvWriter = require('csv-write-stream')
const fs = require('fs')
const cprocess = require('child_process')
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
                const ls = cprocess.exec('temp.sh')
                ls.stdout.on('data', function(data){
                    ls.stdin.write('test\n')
                    var a = url.split('/')
                    var b = a[4].split('.')
                    ls.stdin.write(`${b[0]}\n`)
                    ls.stdin.write(`${arr[0]}\n`)
                    ls.stdin.write(`${arr[1]}\n`)
                    obj.update_pr = data
                })
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
