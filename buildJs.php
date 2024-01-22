<?php
// Function to Copy folders and files       

function rrmdir($dir)
{
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (is_dir($dir . DIRECTORY_SEPARATOR . $object) && !is_link($dir . "/" . $object))
                    rrmdir($dir . DIRECTORY_SEPARATOR . $object);
                else
                    unlink($dir . DIRECTORY_SEPARATOR . $object);
            }
        }
        rmdir($dir);
    }
}
function recurseCopy(
    string $sourceDirectory,
    string $destinationDirectory,
    string $childFolder = ''
): void {
    $directory = opendir($sourceDirectory);

    if (is_dir($destinationDirectory) === false) {
        mkdir($destinationDirectory);
    }

    if ($childFolder !== '') {
        if (is_dir("$destinationDirectory/$childFolder") === false) {
            mkdir("$destinationDirectory/$childFolder");
        }

        while (($file = readdir($directory)) !== false) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            if (is_dir("$sourceDirectory/$file") === true) {
                recurseCopy("$sourceDirectory/$file", "$destinationDirectory/$childFolder/$file");
            } else {
                copy("$sourceDirectory/$file", "$destinationDirectory/$childFolder/$file");
            }
        }

        closedir($directory);

        return;
    }

    while (($file = readdir($directory)) !== false) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        if (is_dir("$sourceDirectory/$file") === true) {
            recurseCopy("$sourceDirectory/$file", "$destinationDirectory/$file");
        } else {
            copy("$sourceDirectory/$file", "$destinationDirectory/$file");
        }
    }

    closedir($directory);
}

$foldersNeedToCopy = [
    'D:\repo_from_github\sequential-workflow-designer\automation-flow-builder\assets',
    'D:\repo_from_github\sequential-workflow-designer\designer\dist',
    // 'D:\repo_from_github\sequential-workflow-designer\designer\css'
];

$rootCopyDir = 'D:\forNewEma\ema\base\public\automation-flow-builder\\';
foreach ($foldersNeedToCopy as $folder) {

    $lastFolder = basename($folder);
    echo $lastFolder . PHP_EOL;
    if (is_dir($folder)) {
        recurseCopy($folder, 'D:\forNewEma\ema\base\public\automation-flow-builder', $lastFolder);
    } else {
        copy($folder, $rootCopyDir . $lastFolder);
    }
}
