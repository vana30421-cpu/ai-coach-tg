const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const sw = read('sw.js');
const manifest = JSON.parse(read('manifest.json'));
const mobile = read('jarvis-mobile.js');
const css = read('jarvis-mobile.css');
const gradle = read('android/app/build.gradle');
const androidManifest = read('android/app/src/main/AndroidManifest.xml');
const activity = read('android/app/src/main/java/com/lifeos/jarvis/MainActivity.kt');
const androidStrings = read('android/app/src/main/res/values/strings.xml');

test('Jarvis mobile UI is wired into the real LIFEOS shell', () => {
  assert.match(html, /jarvis-mobile\.css\?v=/);
  assert.match(html, /jarvis-mobile\.js\?v=/);
  assert.match(mobile, /window\.navigate\('jarvis'\)/);
  assert.match(mobile, /window\.sendJarvisMessage/);
  assert.match(mobile, /params\.get\('page'\)==='jarvis'/);
});

test('Jarvis mobile assets are available in the offline shell cache', () => {
  assert.match(sw, /life-os-v179/);
  assert.match(sw, /\.\/jarvis-mobile\.js/);
  assert.match(sw, /\.\/jarvis-mobile\.css/);
});

test('PWA launcher exposes a direct Jarvis shortcut', () => {
  assert.ok(manifest.shortcuts.some((item) => item.url === './?page=jarvis'));
});

test('mobile assistant has accessible controls and reduced-motion support', () => {
  assert.match(mobile, /aria-label/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /\.lj-overlay\.is-open/);
});

test('Android companion loads the repository GitHub Pages project URL, not the account root', () => {
  assert.match(androidStrings, /https:\/\/vana30421-cpu\.github\.io\/ai-coach-tg\//);
});

test('Android companion registers a system voice interaction service', () => {
  assert.match(androidManifest, /android\.permission\.BIND_VOICE_INTERACTION/);
  assert.match(androidManifest, /android\.service\.voice\.VoiceInteractionService/);
  assert.match(activity, /RoleManager\.ROLE_ASSISTANT/);
  assert.match(activity, /SpeechRecognizer\.createSpeechRecognizer/);
});

test('Android Java and Kotlin compilation target the same supported JVM', () => {
  assert.match(gradle, /sourceCompatibility JavaVersion\.VERSION_17/);
  assert.match(gradle, /targetCompatibility JavaVersion\.VERSION_17/);
  assert.match(gradle, /jvmTarget = '17'/);
});

test('native voice input checks permission and retains a text fallback', () => {
  assert.match(activity, /checkSelfPermission\(Manifest\.permission\.RECORD_AUDIO\)/);
  assert.match(activity, /requestPermissions\(arrayOf\(Manifest\.permission\.RECORD_AUDIO\)/);
  assert.match(activity, /Можно написать команду/);
});
