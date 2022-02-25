function Get-TilCommitMessage() {

	$folders = (git stat |
		Where-Object { $_ -like '*modified:*/*' } |
		ForEach-Object {
			$_.split(':/')[1].trim();
		} );

	return ($folders | Get-unique ) -join ",";

}

get-TilCommitMessage