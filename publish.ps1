param(
	[Parameter(Mandatory,
                ValueFromPipeline=$false,
                HelpMessage='Commit message',
                Position=0)]
  [string]
	$message
);

if ($null -eq $message) {
  write-host "no message" -foregroundcolor Red;
	return;
}

git add *;
git commit . -m "$message";
git out;
git push;

Push-Location ..\today-i-learned-staging\

git add *;
git commit . -m "$message";
git out;
git push;

Pop-Location;