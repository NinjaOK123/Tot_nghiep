# 🎓 Giao Diện Chúc Mừng Tốt Nghiệp - Minecraft Edition

Dự án trang web chúc mừng tốt nghiệp chủ đề Minecraft dành cho **Trần Nguyễn Minh Thiên** (11/07/2026). Trang web mô phỏng cuộc hành trình vượt qua các thử thách đại học (Boss Deadline) giống như Steve đánh bại Rồng Ender Dragon, tiếp nối bằng bài thơ cuộn chữ "The End Poem" đầy ý nghĩa về chặng đường 4 năm tại Đại học An Giang (AGU).

---

## 🚀 Hướng dẫn đưa trang web lên GitHub & chạy GitHub Pages

Để chia sẻ trang web này cho gia đình, thầy cô và bạn bè vào xem cũng như để lại lời chúc, bạn có thể tải mã nguồn lên GitHub và kích hoạt tính năng **GitHub Pages** (hoàn toàn miễn phí) theo các bước đơn giản sau:

### Bước 1: Khởi tạo Git và Commit mã nguồn trên máy tính của bạn
Mở phần mềm Terminal/Git Bash trong thư mục `d:\Tot_nghiep` và chạy các lệnh sau:

```bash
# 1. Khởi tạo Git trong thư mục
git init

# 2. Add tất cả các file vào khu vực chuẩn bị commit
git add .

# 3. Tiến hành commit phiên bản đầu tiên
git commit -m "feat: Minecraft Graduation Website Initial Commit"

# 4. Đặt tên nhánh chính là main
git branch -M main
```

---

### Bước 2: Tạo kho chứa (Repository) mới trên GitHub
1. Truy cập vào trang web [GitHub](https://github.com/) và đăng nhập tài khoản của bạn.
2. Click vào nút **New** (Mới) bên góc trái hoặc góc phải để tạo một repo mới.
3. Nhập tên kho chứa (ví dụ: `Tot_nghiep` hoặc `graduation-2026`).
4. Để chế độ **Public** (Công khai - Bắt buộc để dùng được GitHub Pages miễn phí).
5. Không cần chọn tạo README hay .gitignore mới vì bạn đã có sẵn.
6. Nhấp vào **Create repository** (Tạo kho chứa).

---

### Bước 3: Đẩy code từ máy tính lên GitHub
Sau khi tạo repo, GitHub sẽ hiển thị đường link repo của bạn. Hãy copy dòng lệnh sau và chạy trong Terminal trên máy của bạn (thay thế URL bằng link repo thật của bạn):

```bash
# Liên kết thư mục cục bộ với GitHub
git remote add origin https://github.com/Tên_Tài_Khoản_Của_Bạn/Tên_Repo_Của_Bạn.git

# Đẩy code lên nhánh main
git push -u origin main
```

---

### Bước 4: Kích hoạt GitHub Pages (Share Link Web)
Khi code đã được đẩy lên GitHub thành công:
1. Tại trang repo của bạn trên website GitHub, click vào mục **Settings** (Cài đặt) ở thanh menu trên cùng.
2. Tại cột menu bên trái, tìm và chọn mục **Pages**.
3. Tại phần **Build and deployment** -> mục **Branch**:
   - Chọn nhánh **main** (thay vì None).
   - Ô bên cạnh giữ nguyên là `/ (root)`.
4. Nhấn nút **Save** (Lưu).
5. Đợi khoảng 1 - 2 phút, load lại trang. Bạn sẽ thấy một dòng thông báo màu xanh lá hiện lên ở đầu trang Pages kèm theo đường link web của bạn:
   👉 **`Your site is live at https://<username>.github.io/<repo-name>/`**

Hãy copy link đó và gửi cho bạn bè để cùng trải nghiệm và viết lưu bút nhé! 🎉
