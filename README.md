# music-ai

Web demo tạo nhạc AI với **server thật** và **tài khoản người dùng**.

## Tính năng

- Đăng ký / đăng nhập tài khoản.
- API server nội bộ (`server.js`) cho generate và publish.
- Tự động tổng hợp nhạc trên server (không cần tệp `.wav` có sẵn).
- Chặn model `v1.0 Pro` với thông báo: `Upgrade to Pro to use this model.`
- Publish bài hát và lưu lịch sử đã đăng theo từng tài khoản.
- Có mục "Đề xuất thay đổi" kèm nút copy nhanh để bạn sao chép đề xuất.

## Chạy nhanh

```bash
node server.js
```

Sau đó mở `http://localhost:8080`.
