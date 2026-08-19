// キャッシュのバージョン名（ファイルを更新したらこの数字を v4, v5... と変えると最新化されます）
const CACHE_NAME = 'cat-report-v3';

// キャッシュ（保存）しておくファイルのリスト
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './unnamed.png', // 耳カットのサンプル画像
  
  // ネコ柄の画像ファイル（index.htmlの指定に合わせたもの）
  './kijitora.png',
  './kijisiro.png',
  './sabatora.png',
  './sabasiro.png',
  './tyatora.png',
  './tyasiro.png',
  './kuro.png',
  './siro.png',
  './gray.png',
  './kurosiro.png',
  './syamu.png',
  './graysiro.png',
  './sabi.png',
  './mike.png',
  
  // 地図（Leaflet）のプログラムとデザイン
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 【インストール時】指定したファイルをすべてスマホに保存する
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// 【アクティベート時】古いバージョンのキャッシュ（v1やv2）があれば削除して容量を空ける
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 【ネットワーク通信時】圏外ならキャッシュから返す、通信できれば通常通り取得
self.addEventListener('fetch', event => {
  // GASへのデータ送信（POSTリクエスト）はキャッシュを通さない（エラーになるため）
  if (event.request.method === 'POST') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュの中にデータがあればそれを返す
      if (response) {
        return response;
      }
      // キャッシュになければネットワーク（インターネット）から取得する
      return fetch(event.request).catch(() => {
        // 完全にオフラインで、かつキャッシュにもない場合の処理（何もしない）
        console.log('Offline and resource not found in cache.');
      });
    })
  );
});
