<?php
/**
 * File-based failed-attempt counter (no database). Used for login throttling.
 */

declare(strict_types=1);

function rate_limit_path(string $key): ?string
{
    static $warned = false;

    $dir = rtrim(sys_get_temp_dir(), "\\/") . DIRECTORY_SEPARATOR . 'hh_rl';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        if (!$warned) {
            error_log('Rate limiter: cannot create directory ' . $dir);
            $warned = true;
        }
        return null;
    }

    return $dir . DIRECTORY_SEPARATOR . hash('sha256', $key) . '.json';
}

function rate_limit_active(string $path, int $windowSeconds): array
{
    if (!is_file($path)) {
        return [];
    }
    $raw = @file_get_contents($path);
    $list = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($list)) {
        return [];
    }
    $cutoff = time() - $windowSeconds;
    $active = [];
    foreach ($list as $ts) {
        if (is_int($ts) && $ts > $cutoff) {
            $active[] = $ts;
        }
    }
    return $active;
}

function rate_limit_too_many(string $key, int $max, int $windowSeconds): bool
{
    $path = rate_limit_path($key);
    if ($path === null) {
        return false;
    }
    return count(rate_limit_active($path, $windowSeconds)) >= $max;
}

function rate_limit_retry_after(string $key, int $windowSeconds): int
{
    $path = rate_limit_path($key);
    if ($path === null) {
        return $windowSeconds;
    }
    $active = rate_limit_active($path, $windowSeconds);
    if ($active === []) {
        return 1;
    }
    return max(1, min($active) + $windowSeconds - time());
}

function rate_limit_register_failure(string $key, int $windowSeconds): void
{
    $path = rate_limit_path($key);
    if ($path === null) {
        return;
    }

    $fp = @fopen($path, 'c+');
    if ($fp === false) {
        return;
    }

    if (flock($fp, LOCK_EX)) {
        $raw = stream_get_contents($fp);
        $list = (is_string($raw) && $raw !== '') ? json_decode($raw, true) : [];
        $cutoff = time() - $windowSeconds;
        $active = [];
        if (is_array($list)) {
            foreach ($list as $ts) {
                if (is_int($ts) && $ts > $cutoff) {
                    $active[] = $ts;
                }
            }
        }
        $active[] = time();
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($active));
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

function rate_limit_clear(string $key): void
{
    $path = rate_limit_path($key);
    if ($path !== null && is_file($path)) {
        @unlink($path);
    }
}
