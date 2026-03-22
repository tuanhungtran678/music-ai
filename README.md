# music-ai

Trang web demo tạo nhạc bằng AI (giao diện mô phỏng phía client).

## Tính năng

- Đổi ngôn ngữ giao diện: Tiếng Việt, English, Français.
- Chọn model AI: `v1.0` (mặc định) hoặc `v1.0 Pro`.
- Nếu chọn `v1.0 Pro`, hệ thống hiển thị thông báo: `Upgrade to Pro to use this model.`.
- Sinh bản nhạc demo bằng âm thanh WAV tạo trực tiếp trong trình duyệt (không còn track trống).
- Đăng bài hát bằng nút **Publish** và lưu danh sách bài đã đăng.

## Chạy nhanh

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080`.
