const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const db = require("../config/db"); 

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập.", 401)
    );
  }

  // 2. Xác thực Token (Kiểm tra chữ ký và xem có hết hạn chưa)
  // Lưu ý: Đảm bảo file .env của bạn có biến JWT_SECRET
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Kiểm tra xem User sở hữu Token này có còn tồn tại trong DB không
  const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [decoded.id]);
  const currentUser = rows[0];

  if (!currentUser) {
    return next(
      new AppError("Người dùng sở hữu Token này không còn tồn tại.", 401)
    );
  }

  // 4. Nếu mọi thứ hợp lệ, gán thông tin User vào req để các hàm phía sau dùng
  req.user = currentUser;
  
  next();
});