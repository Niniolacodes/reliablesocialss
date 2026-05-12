<?php
declare(strict_types=1);

$isSecure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

const USERS_FILE = __DIR__ . '/../data/users.json';

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function data_dir(): string
{
    return dirname(USERS_FILE);
}

function ensure_data_dir(): void
{
    if (!is_dir(data_dir())) {
        mkdir(data_dir(), 0775, true);
    }
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function verify_csrf(?string $token): bool
{
    return is_string($token)
        && $token !== ''
        && hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

function redirect_to(string $path): never
{
    header("Location: {$path}");
    exit;
}

function safe_redirect_target(string $fallback = 'dashboard.php'): string
{
    $target = $_GET['redirect'] ?? $fallback;
    $target = is_string($target) ? trim($target) : $fallback;

    if (preg_match('/^[a-z0-9][a-z0-9-]*\.php(?:#[a-z0-9_-]+)?$/i', $target)) {
        return $target;
    }

    return $fallback;
}

function read_users(): array
{
    ensure_data_dir();

    if (!is_file(USERS_FILE)) {
        return [];
    }

    $json = file_get_contents(USERS_FILE);
    $users = json_decode($json ?: '{}', true);

    return is_array($users) ? $users : [];
}

function write_users(array $users): void
{
    ensure_data_dir();
    file_put_contents(
        USERS_FILE,
        json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function normalize_email(?string $email): string
{
    return strtolower(trim((string) $email));
}

function public_user(array $user): array
{
    return [
        'uid' => $user['uid'] ?? '',
        'email' => $user['email'] ?? '',
        'firstName' => $user['firstName'] ?? '',
        'lastName' => $user['lastName'] ?? '',
        'phone' => $user['phone'] ?? '',
    ];
}

function find_user_by_email(?string $email): ?array
{
    $users = read_users();
    $key = normalize_email($email);

    return $users[$key] ?? null;
}

function create_user(array $payload): array
{
    $email = trim((string) ($payload['email'] ?? ''));
    $password = (string) ($payload['password'] ?? '');
    $firstName = trim((string) ($payload['firstName'] ?? $payload['first_name'] ?? ''));
    $lastName = trim((string) ($payload['lastName'] ?? $payload['last_name'] ?? ''));
    $phone = trim((string) ($payload['phone'] ?? ''));

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Enter a valid email address.');
    }

    if (strlen($password) < 6) {
        throw new RuntimeException('Password must be at least 6 characters.');
    }

    $users = read_users();
    $key = normalize_email($email);

    if (isset($users[$key])) {
        throw new RuntimeException('Account already exists for this email.');
    }

    $user = [
        'uid' => 'user_' . bin2hex(random_bytes(8)),
        'email' => $email,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'phone' => $phone,
        'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
        'createdAt' => gmdate('c'),
    ];

    $users[$key] = $user;
    write_users($users);

    return $user;
}

function authenticate_user(?string $email, ?string $password): array
{
    $user = find_user_by_email($email);

    if (!$user || empty($user['passwordHash']) || !password_verify((string) $password, $user['passwordHash'])) {
        throw new RuntimeException('Invalid email or password.');
    }

    return $user;
}

function get_or_create_google_demo_user(): array
{
    $email = 'google-user@reliablesocials.local';
    $existing = find_user_by_email($email);

    if ($existing) {
        return $existing;
    }

    $users = read_users();
    $user = [
        'uid' => 'google_' . bin2hex(random_bytes(8)),
        'email' => $email,
        'firstName' => 'Google',
        'lastName' => 'User',
        'phone' => '',
        'passwordHash' => password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT),
        'createdAt' => gmdate('c'),
    ];
    $users[normalize_email($email)] = $user;
    write_users($users);

    return $user;
}

function login_user(array $user): array
{
    session_regenerate_id(true);
    $_SESSION['user'] = public_user($user);
    csrf_token();

    return $_SESSION['user'];
}

function logout_user(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool) $params['secure'], (bool) $params['httponly']);
    }

    session_destroy();
}

function current_user(): ?array
{
    return isset($_SESSION['user']) && is_array($_SESSION['user']) ? $_SESSION['user'] : null;
}

function is_authenticated(): bool
{
    return current_user() !== null;
}

function require_login(string $redirect = 'login.php'): void
{
    if (is_authenticated()) {
        return;
    }

    $current = basename(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '');
    $target = $redirect;

    if ($current !== '' && $current !== $redirect) {
        $target .= '?redirect=' . rawurlencode($current);
    }

    redirect_to($target);
}

function require_guest(string $redirect = 'dashboard.php'): void
{
    if (is_authenticated()) {
        redirect_to($redirect);
    }
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);

    return is_array($data) ? $data : [];
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function client_auth_payload(): array
{
    return [
        'authenticated' => is_authenticated(),
        'user' => current_user(),
    ];
}

function reliable_client_config_script(): string
{
    $payload = [
        'session' => client_auth_payload(),
        'config' => [
            'apiUrl' => 'auth-api.php',
            'csrfToken' => csrf_token(),
        ],
    ];

    $json = json_encode($payload, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);

    return "<script>\nwindow.ReliableAuthBootstrap = {$json};\nwindow.ReliableSession = window.ReliableAuthBootstrap.session || { authenticated: false, user: null };\nwindow.ReliableAuthConfig = window.ReliableAuthBootstrap.config || {};\n</script>";
}
