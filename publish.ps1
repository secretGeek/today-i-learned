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

# TODO: also deploy the staging folder
pushd ..\today-i-learned-staging\
git add *;
git commit . -m "$message";
git out;
git push;

popd;