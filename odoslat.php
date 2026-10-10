<?php
/* Jungle House · rezervačný formulár
   Pošle dopyt aj s fotkami e-mailom cez mail() hostingu Websupport
   (odosielateľ na vlastnej doméne, SPF junglehouse.sk ho pokrýva). */

const RECIPIENT = 'samuelkontros@gmail.com'; // TEST — po overení zmeniť na junglehouse.tattoo@gmail.com
const SENDER = 'web@junglehouse.sk'; // schránka musí na Websupporte EXISTOVAŤ, inak mail() potichu nedoručí
const PAUSED = false;
const SENDER_NAME = 'Web Jungle House';
const MAX_FILE_BYTES = 10485760;  // 10 MB na fotku
const MAX_TOTAL_BYTES = 26214400; // 25 MB spolu

function finish($ok)
{
    header('Location: ' . ($ok ? 'dakujeme.html' : './?formular=chyba#rezervacia'), true, 303);
    exit;
}

function field($name, $max)
{
    $v = isset($_POST[$name]) ? (string) $_POST[$name] : '';
    $v = str_replace(array("\r\n", "\r", "\0"), array("\n", "\n", ''), $v);
    return trim(mb_substr($v, 0, $max, 'UTF-8'));
}

function one_line($v)
{
    return trim(preg_replace('/\s+/u', ' ', $v));
}

function header_text($v)
{
    return mb_encode_mimeheader(one_line($v), 'UTF-8', 'B', "\r\n");
}

/* nahrané fotky z jedného poľa (jednoduché aj name="x[]") */
function uploads($name, $limit)
{
    if (empty($_FILES[$name])) return array();
    $f = $_FILES[$name];
    $list = array();
    foreach ((array) $f['tmp_name'] as $i => $tmp) {
        $err = is_array($f['error']) ? $f['error'][$i] : $f['error'];
        if ($err === UPLOAD_ERR_NO_FILE) continue;
        if ($err !== UPLOAD_ERR_OK || !is_uploaded_file($tmp)) finish(false);
        $size = filesize($tmp);
        if ($size > MAX_FILE_BYTES) finish(false);
        $type = function_exists('finfo_open')
            ? finfo_file(finfo_open(FILEINFO_MIME_TYPE), $tmp)
            : (is_array($f['type']) ? $f['type'][$i] : $f['type']);
        if (strpos((string) $type, 'image/') !== 0) continue;
        $orig = is_array($f['name']) ? $f['name'][$i] : $f['name'];
        $safe = preg_replace('/[^A-Za-z0-9._-]+/', '-', basename($orig));
        $list[] = array('path' => $tmp, 'type' => $type, 'size' => $size, 'name' => $safe !== '' ? $safe : 'foto.jpg');
        if (count($list) >= $limit) break;
    }
    return $list;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') finish(false);
if (PAUSED) finish(false);
// honeypot: boti vyplnia skryté pole, tvárime sa, že prešlo
if (field('_honey', 200) !== '') finish(true);

$meno = one_line(field('Meno', 200));
$email = one_line(field('E-mail', 200));
$tel = one_line(field('Telefon', 60));
$tater = one_line(field('Tater', 60));
$predstava = field('Predstava', 5000);
$umiestnenie = one_line(field('Umiestnenie', 300));

if ($meno === '' || $predstava === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) finish(false);

$ref = uploads('referencie', 4);
$miesto = uploads('miesto', 1);
foreach ($miesto as $k => $m) $miesto[$k]['name'] = 'miesto-na-tele-' . $m['name'];
$files = array_merge($ref, $miesto);
$total = 0;
foreach ($files as $f) $total += $f['size'];
if ($total > MAX_TOTAL_BYTES) finish(false);

$text = "Nová rezervácia z webu junglehouse.sk\n\n"
    . "Meno: $meno\n"
    . "E-mail: $email\n"
    . "Telefón: " . ($tel !== '' ? $tel : '-') . "\n"
    . "Tatér: " . ($tater !== '' ? $tater : '-') . "\n"
    . "Umiestnenie na tele: " . ($umiestnenie !== '' ? $umiestnenie : '-') . "\n\n"
    . "Predstava:\n$predstava\n\n"
    . "Fotky v prílohe: referencie " . count($ref) . ", miesto na tele " . count($miesto) . "\n\n"
    . "Na tento e-mail stačí odpovedať, odpoveď pôjde priamo klientovi.\n";

$boundary = 'jh-' . bin2hex(random_bytes(12));
$headers = array(
    'Date: ' . date(DATE_RFC2822),
    'Message-ID: <' . bin2hex(random_bytes(16)) . '@junglehouse.sk>',
    'From: ' . header_text(SENDER_NAME) . ' <' . SENDER . '>',
    'Reply-To: ' . $email, // bez mena: zátvorky či úvodzovky v mene rozbijú parsovanie adresy
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
);
$body = "--$boundary\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: quoted-printable\r\n\r\n"
    . quoted_printable_encode(str_replace("\n", "\r\n", $text)) . "\r\n";
foreach ($files as $f) {
    $body .= "--$boundary\r\n"
        . 'Content-Type: ' . $f['type'] . '; name="' . $f['name'] . "\"\r\n"
        . "Content-Transfer-Encoding: base64\r\n"
        . 'Content-Disposition: attachment; filename="' . $f['name'] . "\"\r\n\r\n"
        . chunk_split(base64_encode(file_get_contents($f['path'])));
}
$body .= "--$boundary--\r\n";

$subject = header_text('Nová rezervácia z webu: ' . $meno);
$sent = mail(RECIPIENT, $subject, $body, implode("\r\n", $headers), '-f' . SENDER);
finish($sent);
