# go to the til folder...
$tilSource = "C:\users\leonb\Dropbox\secretGeek\all_someday_projects\git_playground\today-i-learned-staging";
$tilTarget = "C:\users\leonb\Dropbox\secretGeek\all_someday_projects\git_playground\today-i-learned";
$clowncarExe = "C:\users\leonb\Dropbox\secretGeek\all_someday_projects\git_playground\clowncar\clowncar\bin\Release\netcoreapp2.1\win10-x64\publish\clowncar.exe";

# cd $tilSource;
## bring all markdowns and other files from util/til into staging repo, and use pre to create TOC files etc.
# .\quick.ps1;
# cd $tilTarget;

# now run clowncar to publish the markdowns as htmls
$template = "C:\users\leonb\Dropbox\secretGeek\all_someday_projects\git_playground\today-i-learned\template.clowntent";
& $clowncarExe -p="$tilSource" -o="$tilTarget" -t="$template" -r; # rebuild!
move-item .\readme.html .\index.html -force