<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$input = json_input();
$action = (string) ($input['action'] ?? $_POST['action'] ?? $_GET['action'] ?? 'session');

try {
    if ($action === 'session') {
        json_response([
            'ok' => true,
            'authenticated' => is_authenticated(),
            'user' => current_user(),
            'csrfToken' => csrf_token(),
        ]);
    }

    $csrf = $input['csrf_token'] ?? $_POST['csrf_token'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if (!verify_csrf(is_string($csrf) ? $csrf : '')) {
        json_response(['ok' => false, 'message' => 'Your session expired. Refresh and try again.'], 419);
    }

    if ($action === 'login') {
        $user = authenticate_user($input['email'] ?? '', $input['password'] ?? '');
        json_response(['ok' => true, 'user' => login_user($user), 'csrfToken' => csrf_token()]);
    }

    if ($action === 'register') {
        if (empty($input['terms'])) {
            throw new RuntimeException('You must agree to the terms and privacy policy.');
        }

        $user = create_user($input);
        json_response(['ok' => true, 'user' => login_user($user), 'csrfToken' => csrf_token()], 201);
    }

    if ($action === 'google') {
        $user = get_or_create_google_demo_user();
        json_response(['ok' => true, 'user' => login_user($user), 'csrfToken' => csrf_token()]);
    }

    if ($action === 'logout') {
        logout_user();
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'message' => 'Unknown auth action.'], 400);
} catch (Throwable $error) {
    json_response(['ok' => false, 'message' => $error->getMessage()], 400);
}
