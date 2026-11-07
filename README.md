# Ortak Oyuncu

## Sadece aynı ekranda oynamak için
`index.html` dosyasını Netlify Drop, GitHub Pages gibi herhangi bir statik barındırmaya yükle. Sunucu gerekmez.
Bu modda yalnızca listedeki takım ve oyuncular geçerlidir.

## Online oda ve Claude hakemi için
Node.js 18 veya üstü gerekir.

    npm install
    ANTHROPIC_API_KEY=sk-ant-... npm start

Sonra http://localhost:3000 adresini aç. API anahtarı isteğe bağlıdır; yoksa online oda çalışır, listede olmayan takımlar ve oyuncular kabul edilmez.
Render veya Railway gibi bir yerde "Web Service" oluştur, başlatma komutu `npm start`, ANTHROPIC_API_KEY'i ortam değişkeni olarak ekle.
Anahtarı asla index.html içine yazma. Sunucu dakikada en fazla 60 Claude isteği kabul eder.

## Oyuncu listesi
`index.html` içinde `CL` (takımlar) ve `P` (oyuncular) bölümlerine satır ekleyerek listeyi büyütebilirsin.
