# PackageUpdateCLI-tool
This CLI tool is custom built with node js.
To use this: 
1. Clone this repo
2. Use npm install -g
3. There are two ways to use this tool: to generate a csv file which tells you which of the opensource repos in your csv file have outdated version of the package you are checking and second way is to generate a pull request to update the package of an opensource repository and actually update the req package in a remote repository.
4. In your terminal write: myawesometool -i yourfile.csv yourpackage@X.X.X to just generate a csv file called out.csv which tells which of the repos in your csv file has the required package version of a nodejs package.
5. In your terminal write: myawesometool -update -i yourfile.csv yourpackage@X.X.X

For reference See the dyte.csv(input) and out.csv(output)
