// Danh sách tỉnh/thành phố và phường/xã Việt Nam
// Được tạo tự động từ file Excel: Danh-muc-Phuong-xa_moi.xlsx

export const provinces = [
  {
    "id": 1,
    "name": "Thành phố Hà Nội"
  },
  {
    "id": 2,
    "name": "Tỉnh Bắc Ninh"
  },
  {
    "id": 3,
    "name": "Tỉnh Quảng Ninh"
  },
  {
    "id": 4,
    "name": "Tp Hải Phòng"
  },
  {
    "id": 5,
    "name": "Tỉnh Hưng Yên"
  },
  {
    "id": 6,
    "name": "Tỉnh Ninh Bình"
  },
  {
    "id": 7,
    "name": "Tỉnh Cao Bằng"
  },
  {
    "id": 8,
    "name": "Tỉnh Tuyên Quang"
  },
  {
    "id": 9,
    "name": "Tỉnh Lào Cai"
  },
  {
    "id": 10,
    "name": "Tỉnh Thái Nguyên"
  },
  {
    "id": 11,
    "name": "Tỉnh Lạng Sơn"
  },
  {
    "id": 12,
    "name": "Tỉnh Phú Thọ"
  },
  {
    "id": 13,
    "name": "Tỉnh Điện Biên"
  },
  {
    "id": 14,
    "name": "Tỉnh Lai Châu"
  },
  {
    "id": 15,
    "name": "Tỉnh Sơn La"
  },
  {
    "id": 16,
    "name": "Tỉnh Thanh Hóa"
  },
  {
    "id": 17,
    "name": "Tỉnh Nghệ An"
  },
  {
    "id": 18,
    "name": "Tỉnh Hà Tĩnh"
  },
  {
    "id": 19,
    "name": "Tỉnh Quảng Trị"
  },
  {
    "id": 20,
    "name": "Thành phố Huế"
  },
  {
    "id": 21,
    "name": "Tp Đà Nẵng"
  },
  {
    "id": 22,
    "name": "Tỉnh Quảng Ngãi"
  },
  {
    "id": 23,
    "name": "Tỉnh Khánh Hòa"
  },
  {
    "id": 24,
    "name": "Tỉnh Gia Lai"
  },
  {
    "id": 25,
    "name": "Tỉnh Đắk Lắk"
  },
  {
    "id": 26,
    "name": "Tỉnh Lâm Đồng"
  },
  {
    "id": 27,
    "name": "Tỉnh Tây Ninh"
  },
  {
    "id": 28,
    "name": "Tỉnh Đồng Nai"
  },
  {
    "id": 29,
    "name": "Tp Hồ Chí Minh"
  },
  {
    "id": 30,
    "name": "Tỉnh Vĩnh Long"
  },
  {
    "id": 31,
    "name": "Tỉnh Đồng Tháp"
  },
  {
    "id": 32,
    "name": "Tỉnh An Giang"
  },
  {
    "id": 33,
    "name": "Tp Cần Thơ"
  },
  {
    "id": 34,
    "name": "Tỉnh Cà Mau"
  }
];

// Mapping phường/xã theo tỉnh/thành phố
export const wardsByProvince = {
  "1": [
    {
      "id": 1,
      "name": "Phường Hoàn Kiếm"
    },
    {
      "id": 2,
      "name": "Phường Cửa Nam"
    },
    {
      "id": 3,
      "name": "Phường Ba Đình"
    },
    {
      "id": 4,
      "name": "Phường Ngọc Hà"
    },
    {
      "id": 5,
      "name": "Phường Giảng Võ"
    },
    {
      "id": 6,
      "name": "Phường Hai Bà Trưng"
    },
    {
      "id": 7,
      "name": "Phường Vĩnh Tuy"
    },
    {
      "id": 8,
      "name": "Phường Bạch Mai"
    },
    {
      "id": 9,
      "name": "Phường Đống Đa"
    },
    {
      "id": 10,
      "name": "Phường Kim Liên"
    },
    {
      "id": 11,
      "name": "Phường Văn Miếu - Quốc Tử Giám"
    },
    {
      "id": 12,
      "name": "Phường Láng"
    },
    {
      "id": 13,
      "name": "Phường Ô Chợ Dừa"
    },
    {
      "id": 14,
      "name": "Phường Hồng Hà"
    },
    {
      "id": 15,
      "name": "Phường Lĩnh Nam"
    },
    {
      "id": 16,
      "name": "Phường Hoàng Mai"
    },
    {
      "id": 17,
      "name": "Phường Vĩnh Hưng"
    },
    {
      "id": 18,
      "name": "Phường Tương Mai"
    },
    {
      "id": 19,
      "name": "Phường Định Công"
    },
    {
      "id": 20,
      "name": "Phường Hoàng Liệt"
    },
    {
      "id": 21,
      "name": "Phường Yên Sở"
    },
    {
      "id": 22,
      "name": "Phường Thanh Xuân"
    },
    {
      "id": 23,
      "name": "Phường Khương Đình"
    },
    {
      "id": 24,
      "name": "Phường Phương Liệt"
    },
    {
      "id": 25,
      "name": "Phường Cầu Giấy"
    },
    {
      "id": 26,
      "name": "Phường Nghĩa Đô"
    },
    {
      "id": 27,
      "name": "Phường Yên Hoà"
    },
    {
      "id": 28,
      "name": "Phường Tây Hồ"
    },
    {
      "id": 29,
      "name": "Phường Phú Thượng"
    },
    {
      "id": 30,
      "name": "Phường Tây Tựu"
    },
    {
      "id": 31,
      "name": "Phường Phú Diễn"
    },
    {
      "id": 32,
      "name": "Phường Xuân Đỉnh"
    },
    {
      "id": 33,
      "name": "Phường Đông Ngạc"
    },
    {
      "id": 34,
      "name": "Phường Thượng Cát"
    },
    {
      "id": 35,
      "name": "Phường Từ Liêm"
    },
    {
      "id": 36,
      "name": "Phường Xuân Phương"
    },
    {
      "id": 37,
      "name": "Phường Tây Mỗ"
    },
    {
      "id": 38,
      "name": "Phường Đại Mỗ"
    },
    {
      "id": 39,
      "name": "Phường Long Biên"
    },
    {
      "id": 40,
      "name": "Phường Bồ Đề"
    },
    {
      "id": 41,
      "name": "Phường Việt Hưng"
    },
    {
      "id": 42,
      "name": "Phường Phúc Lợi"
    },
    {
      "id": 43,
      "name": "Phường Hà Đông"
    },
    {
      "id": 44,
      "name": "Phường Dương Nội"
    },
    {
      "id": 45,
      "name": "Phường Yên Nghĩa"
    },
    {
      "id": 46,
      "name": "Phường Phú Lương"
    },
    {
      "id": 47,
      "name": "Phường Kiến Hưng"
    },
    {
      "id": 48,
      "name": "Xã Thanh Trì"
    },
    {
      "id": 49,
      "name": "Xã Đại Thanh"
    },
    {
      "id": 50,
      "name": "Xã Nam Phù"
    },
    {
      "id": 51,
      "name": "Xã Ngọc Hồi"
    },
    {
      "id": 52,
      "name": "Phường Thanh Liệt"
    },
    {
      "id": 53,
      "name": "Xã Thượng Phúc"
    },
    {
      "id": 54,
      "name": "Xã Thường Tín"
    },
    {
      "id": 55,
      "name": "Xã Chương Dương"
    },
    {
      "id": 56,
      "name": "Xã Hồng Vân"
    },
    {
      "id": 57,
      "name": "Xã Phú Xuyên"
    },
    {
      "id": 58,
      "name": "Xã Phượng Dực"
    },
    {
      "id": 59,
      "name": "Xã Chuyên Mỹ"
    },
    {
      "id": 60,
      "name": "Xã Đại Xuyên"
    },
    {
      "id": 61,
      "name": "Xã Thanh Oai"
    },
    {
      "id": 62,
      "name": "Xã Bình Minh"
    },
    {
      "id": 63,
      "name": "Xã Tam Hưng"
    },
    {
      "id": 64,
      "name": "Xã Dân Hoà"
    },
    {
      "id": 65,
      "name": "Xã Vân Đình"
    },
    {
      "id": 66,
      "name": "Xã Ứng Thiên"
    },
    {
      "id": 67,
      "name": "Xã Hoà Xá"
    },
    {
      "id": 68,
      "name": "Xã Ứng Hoà"
    },
    {
      "id": 69,
      "name": "Xã Mỹ Đức"
    },
    {
      "id": 70,
      "name": "Xã Hồng Sơn"
    },
    {
      "id": 71,
      "name": "Xã Phúc Sơn"
    },
    {
      "id": 72,
      "name": "Xã Hương Sơn"
    },
    {
      "id": 73,
      "name": "Phường Chương Mỹ"
    },
    {
      "id": 74,
      "name": "Xã Phú Nghĩa"
    },
    {
      "id": 75,
      "name": "Xã Xuân Mai"
    },
    {
      "id": 76,
      "name": "Xã Trần Phú"
    },
    {
      "id": 77,
      "name": "Xã Hoà Phú"
    },
    {
      "id": 78,
      "name": "Xã Quảng Bị"
    },
    {
      "id": 79,
      "name": "Xã Minh Châu"
    },
    {
      "id": 80,
      "name": "Xã Quảng Oai"
    },
    {
      "id": 81,
      "name": "Xã Vật Lại"
    },
    {
      "id": 82,
      "name": "Xã Cổ Đô"
    },
    {
      "id": 83,
      "name": "Xã Bất Bạt"
    },
    {
      "id": 84,
      "name": "Xã Suối Hai"
    },
    {
      "id": 85,
      "name": "Xã Ba Vì"
    },
    {
      "id": 86,
      "name": "Xã Yên Bài"
    },
    {
      "id": 87,
      "name": "Phường Sơn Tây"
    },
    {
      "id": 88,
      "name": "Phường Tùng Thiện"
    },
    {
      "id": 89,
      "name": "Xã Đoài Phương"
    },
    {
      "id": 90,
      "name": "Xã Phúc Thọ"
    },
    {
      "id": 91,
      "name": "Xã Phúc Lộc"
    },
    {
      "id": 92,
      "name": "Xã Hát Môn"
    },
    {
      "id": 93,
      "name": "Xã Thạch Thất"
    },
    {
      "id": 94,
      "name": "Xã Hạ Bằng"
    },
    {
      "id": 95,
      "name": "Xã Tây Phương"
    },
    {
      "id": 96,
      "name": "Xã Hoà Lạc"
    },
    {
      "id": 97,
      "name": "Xã Yên Xuân"
    },
    {
      "id": 98,
      "name": "Xã Quốc Oai"
    },
    {
      "id": 99,
      "name": "Xã Hưng Đạo"
    },
    {
      "id": 100,
      "name": "Xã Kiều Phú"
    },
    {
      "id": 101,
      "name": "Xã Phú Cát"
    },
    {
      "id": 102,
      "name": "Xã Hoài Đức"
    },
    {
      "id": 103,
      "name": "Xã Dương Hoà"
    },
    {
      "id": 104,
      "name": "Xã Sơn Đồng"
    },
    {
      "id": 105,
      "name": "Xã An Khánh"
    },
    {
      "id": 106,
      "name": "Xã Đan Phượng"
    },
    {
      "id": 107,
      "name": "Xã Ô Diên"
    },
    {
      "id": 108,
      "name": "Xã Liên Minh"
    },
    {
      "id": 109,
      "name": "Xã Gia Lâm"
    },
    {
      "id": 110,
      "name": "Xã Thuận An"
    },
    {
      "id": 111,
      "name": "Xã Bát Tràng"
    },
    {
      "id": 112,
      "name": "Xã Phù Đổng"
    },
    {
      "id": 113,
      "name": "Xã Thư Lâm"
    },
    {
      "id": 114,
      "name": "Xã Đông Anh"
    },
    {
      "id": 115,
      "name": "Xã Phúc Thịnh"
    },
    {
      "id": 116,
      "name": "Xã Thiên Lộc"
    },
    {
      "id": 117,
      "name": "Xã Vĩnh Thanh"
    },
    {
      "id": 118,
      "name": "Xã Mê Linh"
    },
    {
      "id": 119,
      "name": "Xã Yên Lãng"
    },
    {
      "id": 120,
      "name": "Xã Tiến Thắng"
    },
    {
      "id": 121,
      "name": "Xã Quang Minh"
    },
    {
      "id": 122,
      "name": "Xã Sóc Sơn"
    },
    {
      "id": 123,
      "name": "Xã Đa Phúc"
    },
    {
      "id": 124,
      "name": "Xã Nội Bài"
    },
    {
      "id": 125,
      "name": "Xã Trung Giã"
    },
    {
      "id": 126,
      "name": "Xã Kim Anh"
    }
  ],
  "2": [
    {
      "id": 127,
      "name": "Xã Đại Sơn"
    },
    {
      "id": 128,
      "name": "Xã Sơn Động"
    },
    {
      "id": 129,
      "name": "Xã Tây Yên Tử"
    },
    {
      "id": 130,
      "name": "Xã Dương Hưu"
    },
    {
      "id": 131,
      "name": "Xã Yên Định"
    },
    {
      "id": 132,
      "name": "Xã An Lạc"
    },
    {
      "id": 133,
      "name": "Xã Vân Sơn"
    },
    {
      "id": 134,
      "name": "Xã Biển Động"
    },
    {
      "id": 135,
      "name": "Xã Lục Ngạn"
    },
    {
      "id": 136,
      "name": "Xã Đèo Gia"
    },
    {
      "id": 137,
      "name": "Xã Sơn Hải"
    },
    {
      "id": 138,
      "name": "Xã Tân Sơn"
    },
    {
      "id": 139,
      "name": "Xã Biên Sơn"
    },
    {
      "id": 140,
      "name": "Xã Sa Lý"
    },
    {
      "id": 141,
      "name": "Xã Nam Dương"
    },
    {
      "id": 142,
      "name": "Xã Kiên Lao"
    },
    {
      "id": 143,
      "name": "Phường Chũ"
    },
    {
      "id": 144,
      "name": "Phường Phượng Sơn"
    },
    {
      "id": 145,
      "name": "Xã Lục Sơn"
    },
    {
      "id": 146,
      "name": "Xã Trường Sơn"
    },
    {
      "id": 147,
      "name": "Xã Cẩm Lý"
    },
    {
      "id": 148,
      "name": "Xã Đông Phú"
    },
    {
      "id": 149,
      "name": "Xã Nghĩa Phương"
    },
    {
      "id": 150,
      "name": "Xã Lục Nam"
    },
    {
      "id": 151,
      "name": "Xã Bắc Lũng"
    },
    {
      "id": 152,
      "name": "Xã Bảo Đài"
    },
    {
      "id": 153,
      "name": "Xã Lạng Giang"
    },
    {
      "id": 154,
      "name": "Xã Mỹ Thái"
    },
    {
      "id": 155,
      "name": "Xã Kép"
    },
    {
      "id": 156,
      "name": "Xã Tân Dĩnh"
    },
    {
      "id": 157,
      "name": "Xã Tiên Lục"
    },
    {
      "id": 158,
      "name": "Xã Yên Thế"
    },
    {
      "id": 159,
      "name": "Xã Bố Hạ"
    },
    {
      "id": 160,
      "name": "Xã Đồng Kỳ"
    },
    {
      "id": 161,
      "name": "Xã Xuân Lương"
    },
    {
      "id": 162,
      "name": "Xã Tam Tiến"
    },
    {
      "id": 163,
      "name": "Xã Tân Yên"
    },
    {
      "id": 164,
      "name": "Xã Ngọc Thiện"
    },
    {
      "id": 165,
      "name": "Xã Nhã Nam"
    },
    {
      "id": 166,
      "name": "Xã Phúc Hoà"
    },
    {
      "id": 167,
      "name": "Xã Quang Trung"
    },
    {
      "id": 168,
      "name": "Xã Hợp Thịnh"
    },
    {
      "id": 169,
      "name": "Xã Hiệp Hoà"
    },
    {
      "id": 170,
      "name": "Xã Hoàng Vân"
    },
    {
      "id": 171,
      "name": "Xã Xuân Cẩm"
    },
    {
      "id": 172,
      "name": "Phường Tự Lạn"
    },
    {
      "id": 173,
      "name": "Phường Việt Yên"
    },
    {
      "id": 174,
      "name": "Phường Nếnh"
    },
    {
      "id": 175,
      "name": "Phường Vân Hà"
    },
    {
      "id": 176,
      "name": "Xã Đồng Việt"
    },
    {
      "id": 177,
      "name": "Phường Bắc Giang"
    },
    {
      "id": 178,
      "name": "Phường Đa Mai"
    },
    {
      "id": 179,
      "name": "Phường Tiền Phong"
    },
    {
      "id": 180,
      "name": "Phường Tân An"
    },
    {
      "id": 181,
      "name": "Phường Yên Dũng"
    },
    {
      "id": 182,
      "name": "Phường Tân Tiến"
    },
    {
      "id": 183,
      "name": "Phường Cảnh Thụy"
    },
    {
      "id": 184,
      "name": "Phường Kinh Bắc"
    },
    {
      "id": 185,
      "name": "Phường Võ Cường"
    },
    {
      "id": 186,
      "name": "Phường Vũ Ninh"
    },
    {
      "id": 187,
      "name": "Phường Hạp Lĩnh"
    },
    {
      "id": 188,
      "name": "Phường Nam Sơn"
    },
    {
      "id": 189,
      "name": "Phường Từ Sơn"
    },
    {
      "id": 190,
      "name": "Phường Tam Sơn"
    },
    {
      "id": 191,
      "name": "Phường Đồng Nguyên"
    },
    {
      "id": 192,
      "name": "Phường Phù Khê"
    },
    {
      "id": 193,
      "name": "Phường Thuận Thành"
    },
    {
      "id": 194,
      "name": "Phường Mão Điền"
    },
    {
      "id": 195,
      "name": "Phường Trạm Lộ"
    },
    {
      "id": 196,
      "name": "Phường Trí Quả"
    },
    {
      "id": 197,
      "name": "Phường Song Liễu"
    },
    {
      "id": 198,
      "name": "Phường Ninh Xá"
    },
    {
      "id": 199,
      "name": "Phường Quế Võ"
    },
    {
      "id": 200,
      "name": "Phường Phương Liễu"
    },
    {
      "id": 201,
      "name": "Phường Nhân Hoà"
    },
    {
      "id": 202,
      "name": "Phường Đào Viên"
    },
    {
      "id": 203,
      "name": "Phường Bồng Lai"
    },
    {
      "id": 204,
      "name": "Xã Chi Lăng"
    },
    {
      "id": 205,
      "name": "Xã Phù Lãng"
    },
    {
      "id": 206,
      "name": "Xã Yên Phong"
    },
    {
      "id": 207,
      "name": "Xã Văn Môn"
    },
    {
      "id": 208,
      "name": "Xã Tam Giang"
    },
    {
      "id": 209,
      "name": "Xã Yên Trung"
    },
    {
      "id": 210,
      "name": "Xã Tam Đa"
    },
    {
      "id": 211,
      "name": "Xã Tiên Du"
    },
    {
      "id": 212,
      "name": "Xã Liên Bão"
    },
    {
      "id": 213,
      "name": "Xã Tân Chi"
    },
    {
      "id": 214,
      "name": "Xã Đại Đồng"
    },
    {
      "id": 215,
      "name": "Xã Phật Tích"
    },
    {
      "id": 216,
      "name": "Xã Gia Bình"
    },
    {
      "id": 217,
      "name": "Xã Nhân Thắng"
    },
    {
      "id": 218,
      "name": "Xã Đại Lai"
    },
    {
      "id": 219,
      "name": "Xã Cao Đức"
    },
    {
      "id": 220,
      "name": "Xã Đông Cứu"
    },
    {
      "id": 221,
      "name": "Xã Lương Tài"
    },
    {
      "id": 222,
      "name": "Xã Lâm Thao"
    },
    {
      "id": 223,
      "name": "Xã Trung Chính"
    },
    {
      "id": 224,
      "name": "Xã Trung Kênh"
    },
    {
      "id": 225,
      "name": "Xã Tuấn Đạo"
    }
  ],
  "3": [
    {
      "id": 226,
      "name": "Phường An Sinh"
    },
    {
      "id": 227,
      "name": "Phường Đông Triều"
    },
    {
      "id": 228,
      "name": "Phường Bình Khê"
    },
    {
      "id": 229,
      "name": "Phường Mạo Khê"
    },
    {
      "id": 230,
      "name": "Phường Hoàng Quế"
    },
    {
      "id": 231,
      "name": "Phường Yên Tử"
    },
    {
      "id": 232,
      "name": "Phường Vàng Danh"
    },
    {
      "id": 233,
      "name": "Phường Uông Bí"
    },
    {
      "id": 234,
      "name": "Phường Đông Mai"
    },
    {
      "id": 235,
      "name": "Phường Hiệp Hoà"
    },
    {
      "id": 236,
      "name": "Phường Quảng Yên"
    },
    {
      "id": 237,
      "name": "Phường Hà An"
    },
    {
      "id": 238,
      "name": "Phường Phong Cốc"
    },
    {
      "id": 239,
      "name": "Phường Liên Hoà"
    },
    {
      "id": 240,
      "name": "Phường Tuần Châu"
    },
    {
      "id": 241,
      "name": "Phường Việt Hưng"
    },
    {
      "id": 242,
      "name": "Phường Bãi Cháy"
    },
    {
      "id": 243,
      "name": "Phường Hà Tu"
    },
    {
      "id": 244,
      "name": "Phường Hà Lầm"
    },
    {
      "id": 245,
      "name": "Phường Cao Xanh"
    },
    {
      "id": 246,
      "name": "Phường Hồng Gai"
    },
    {
      "id": 247,
      "name": "Phường Hạ Long"
    },
    {
      "id": 248,
      "name": "Phường Hoành Bồ"
    },
    {
      "id": 249,
      "name": "Xã Quảng La"
    },
    {
      "id": 250,
      "name": "Xã Thống Nhất"
    },
    {
      "id": 251,
      "name": "Phường Mông Dương"
    },
    {
      "id": 252,
      "name": "Phường Quang Hanh"
    },
    {
      "id": 253,
      "name": "Phường Cẩm Phả"
    },
    {
      "id": 254,
      "name": "Phường Cửa Ông"
    },
    {
      "id": 255,
      "name": "Xã Hải Hoà"
    },
    {
      "id": 256,
      "name": "Xã Tiên Yên"
    },
    {
      "id": 257,
      "name": "Xã Điền Xá"
    },
    {
      "id": 258,
      "name": "Xã Đông Ngũ"
    },
    {
      "id": 259,
      "name": "Xã Hải Lạng"
    },
    {
      "id": 260,
      "name": "Xã Lương Minh"
    },
    {
      "id": 261,
      "name": "Xã Kỳ Thượng"
    },
    {
      "id": 262,
      "name": "Xã Ba Chẽ"
    },
    {
      "id": 263,
      "name": "Xã Quảng Tân"
    },
    {
      "id": 264,
      "name": "Xã Đầm Hà"
    },
    {
      "id": 265,
      "name": "Xã Quảng Hà"
    },
    {
      "id": 266,
      "name": "Xã Đường Hoa"
    },
    {
      "id": 267,
      "name": "Xã Quảng Đức"
    },
    {
      "id": 268,
      "name": "Xã Hoành Mô"
    },
    {
      "id": 269,
      "name": "Xã Lục Hồn"
    },
    {
      "id": 270,
      "name": "Xã Bình Liêu"
    },
    {
      "id": 271,
      "name": "Xã Hải Sơn"
    },
    {
      "id": 272,
      "name": "Xã Hải Ninh"
    },
    {
      "id": 273,
      "name": "Xã Vĩnh Thực"
    },
    {
      "id": 274,
      "name": "Phường Móng Cái 1"
    },
    {
      "id": 275,
      "name": "Phường Móng Cái 2"
    },
    {
      "id": 276,
      "name": "Phường Móng Cái 3"
    },
    {
      "id": 277,
      "name": "Đặc khu Vân Đồn"
    },
    {
      "id": 278,
      "name": "Đặc khu Cô Tô"
    },
    {
      "id": 279,
      "name": "Xã Cái Chiên"
    }
  ],
  "4": [
    {
      "id": 280,
      "name": "Phường Thuỷ Nguyên"
    },
    {
      "id": 281,
      "name": "Phường Thiên Hương"
    },
    {
      "id": 282,
      "name": "Phường Hoà Bình"
    },
    {
      "id": 283,
      "name": "Phường Nam Triệu"
    },
    {
      "id": 284,
      "name": "Phường Bạch Đằng"
    },
    {
      "id": 285,
      "name": "Phường Lưu Kiếm"
    },
    {
      "id": 286,
      "name": "Phường Lê Ích Mộc"
    },
    {
      "id": 287,
      "name": "Phường Hồng Bàng"
    },
    {
      "id": 288,
      "name": "Phường Hồng An"
    },
    {
      "id": 289,
      "name": "Phường Ngô Quyền"
    },
    {
      "id": 290,
      "name": "Phường Gia Viên"
    },
    {
      "id": 291,
      "name": "Phường Lê Chân"
    },
    {
      "id": 292,
      "name": "Phường An Biên"
    },
    {
      "id": 293,
      "name": "Phường Hải An"
    },
    {
      "id": 294,
      "name": "Phường Đông Hải"
    },
    {
      "id": 295,
      "name": "Phường Kiến An"
    },
    {
      "id": 296,
      "name": "Phường Phù Liễn"
    },
    {
      "id": 297,
      "name": "Phường Nam Đồ Sơn"
    },
    {
      "id": 298,
      "name": "Phường Đồ Sơn"
    },
    {
      "id": 299,
      "name": "Phường Hưng Đạo"
    },
    {
      "id": 300,
      "name": "Phường Dương Kinh"
    },
    {
      "id": 301,
      "name": "Phường An Dương"
    },
    {
      "id": 302,
      "name": "Phường An Hải"
    },
    {
      "id": 303,
      "name": "Phường An Phong"
    },
    {
      "id": 304,
      "name": "Xã An Hưng"
    },
    {
      "id": 305,
      "name": "Xã An Khánh"
    },
    {
      "id": 306,
      "name": "Xã An Quang"
    },
    {
      "id": 307,
      "name": "Xã An Trường"
    },
    {
      "id": 308,
      "name": "Xã An Lão"
    },
    {
      "id": 309,
      "name": "Xã Kiến Thụy"
    },
    {
      "id": 310,
      "name": "Xã Kiến Minh"
    },
    {
      "id": 311,
      "name": "Xã Kiến Hải"
    },
    {
      "id": 312,
      "name": "Xã Kiến Hưng"
    },
    {
      "id": 313,
      "name": "Xã Nghi Dương"
    },
    {
      "id": 314,
      "name": "Xã Quyết Thắng"
    },
    {
      "id": 315,
      "name": "Xã Tiên Lãng"
    },
    {
      "id": 316,
      "name": "Xã Tân Minh"
    },
    {
      "id": 317,
      "name": "Xã Tiên Minh"
    },
    {
      "id": 318,
      "name": "Xã Chấn Hưng"
    },
    {
      "id": 319,
      "name": "Xã Hùng Thắng"
    },
    {
      "id": 320,
      "name": "Xã Vĩnh Bảo"
    },
    {
      "id": 321,
      "name": "Xã Nguyễn Bỉnh Khiêm"
    },
    {
      "id": 322,
      "name": "Xã Vĩnh Am"
    },
    {
      "id": 323,
      "name": "Xã Vĩnh Hải"
    },
    {
      "id": 324,
      "name": "Xã Vĩnh Hoà"
    },
    {
      "id": 325,
      "name": "Xã Vĩnh Thịnh"
    },
    {
      "id": 326,
      "name": "Xã Vĩnh Thuận"
    },
    {
      "id": 327,
      "name": "Xã Việt Khê"
    },
    {
      "id": 328,
      "name": "Đặc khu Cát Hải"
    },
    {
      "id": 329,
      "name": "Đặc khu Bạch Long Vĩ"
    },
    {
      "id": 330,
      "name": "Phường Hải Dương"
    },
    {
      "id": 331,
      "name": "Phường Lê Thanh Nghị"
    },
    {
      "id": 332,
      "name": "Phường Việt Hoà"
    },
    {
      "id": 333,
      "name": "Phường Thành Đông"
    },
    {
      "id": 334,
      "name": "Phường Nam Đồng"
    },
    {
      "id": 335,
      "name": "Phường Tân Hưng"
    },
    {
      "id": 336,
      "name": "Phường Thạch Khôi"
    },
    {
      "id": 337,
      "name": "Phường Tứ Minh"
    },
    {
      "id": 338,
      "name": "Phường Ái Quốc"
    },
    {
      "id": 339,
      "name": "Phường Chu Văn An"
    },
    {
      "id": 340,
      "name": "Phường Chí Linh"
    },
    {
      "id": 341,
      "name": "Phường Trần Hưng Đạo"
    },
    {
      "id": 342,
      "name": "Phường Nguyễn Trãi"
    },
    {
      "id": 343,
      "name": "Phường Trần Nhân Tông"
    },
    {
      "id": 344,
      "name": "Phường Lê Đại Hành"
    },
    {
      "id": 345,
      "name": "Phường Kinh Môn"
    },
    {
      "id": 346,
      "name": "Phường Nguyễn Đại Năng"
    },
    {
      "id": 347,
      "name": "Phường Trần Liễu"
    },
    {
      "id": 348,
      "name": "Phường Bắc An Phụ"
    },
    {
      "id": 349,
      "name": "Phường Phạm Sư Mạnh"
    },
    {
      "id": 350,
      "name": "Phường Nhị Chiểu"
    },
    {
      "id": 351,
      "name": "Xã Nam An Phụ"
    },
    {
      "id": 352,
      "name": "Xã Nam Sách"
    },
    {
      "id": 353,
      "name": "Xã Thái Tân"
    },
    {
      "id": 354,
      "name": "Xã Hợp Tiến"
    },
    {
      "id": 355,
      "name": "Xã Trần Phú"
    },
    {
      "id": 356,
      "name": "Xã An Phú"
    },
    {
      "id": 357,
      "name": "Xã Thanh Hà"
    },
    {
      "id": 358,
      "name": "Xã Hà Tây"
    },
    {
      "id": 359,
      "name": "Xã Hà Bắc"
    },
    {
      "id": 360,
      "name": "Xã Hà Nam"
    },
    {
      "id": 361,
      "name": "Xã Hà Đông"
    },
    {
      "id": 362,
      "name": "Xã Cẩm Giang"
    },
    {
      "id": 363,
      "name": "Xã Tuệ Tĩnh"
    },
    {
      "id": 364,
      "name": "Xã Mao Điền"
    },
    {
      "id": 365,
      "name": "Xã Cẩm Giàng"
    },
    {
      "id": 366,
      "name": "Xã Kẻ Sặt"
    },
    {
      "id": 367,
      "name": "Xã Bình Giang"
    },
    {
      "id": 368,
      "name": "Xã Đường An"
    },
    {
      "id": 369,
      "name": "Xã Thượng Hồng"
    },
    {
      "id": 370,
      "name": "Xã Gia Lộc"
    },
    {
      "id": 371,
      "name": "Xã Yết Kiêu"
    },
    {
      "id": 372,
      "name": "Xã Gia Phúc"
    },
    {
      "id": 373,
      "name": "Xã Trường Tân"
    },
    {
      "id": 374,
      "name": "Xã Tứ Kỳ"
    },
    {
      "id": 375,
      "name": "Xã Tân Kỳ"
    },
    {
      "id": 376,
      "name": "Xã Đại Sơn"
    },
    {
      "id": 377,
      "name": "Xã Chí Minh"
    },
    {
      "id": 378,
      "name": "Xã Lạc Phượng"
    },
    {
      "id": 379,
      "name": "Xã Nguyên Giáp"
    },
    {
      "id": 380,
      "name": "Xã Ninh Giang"
    },
    {
      "id": 381,
      "name": "Xã Vĩnh Lại"
    },
    {
      "id": 382,
      "name": "Xã Khúc Thừa Dụ"
    },
    {
      "id": 383,
      "name": "Xã Tân An"
    },
    {
      "id": 384,
      "name": "Xã Hồng Châu"
    },
    {
      "id": 385,
      "name": "Xã Thanh Miện"
    },
    {
      "id": 386,
      "name": "Xã Bắc Thanh Miện"
    },
    {
      "id": 387,
      "name": "Xã Hải Hưng"
    },
    {
      "id": 388,
      "name": "Xã Nguyễn Lương Bằng"
    },
    {
      "id": 389,
      "name": "Xã Nam Thanh Miện"
    },
    {
      "id": 390,
      "name": "Xã Phú Thái"
    },
    {
      "id": 391,
      "name": "Xã Lai Khê"
    },
    {
      "id": 392,
      "name": "Xã An Thành"
    },
    {
      "id": 393,
      "name": "Xã Kim Thành"
    }
  ],
  "5": [
    {
      "id": 394,
      "name": "Phường Phố Hiến"
    },
    {
      "id": 395,
      "name": "Phường Sơn Nam"
    },
    {
      "id": 396,
      "name": "Phường Hồng Châu"
    },
    {
      "id": 397,
      "name": "Phường Mỹ Hào"
    },
    {
      "id": 398,
      "name": "Phường Đường Hào"
    },
    {
      "id": 399,
      "name": "Phường Thượng Hồng"
    },
    {
      "id": 400,
      "name": "Xã Tân Hưng"
    },
    {
      "id": 401,
      "name": "Xã Hoàng Hoa Thám"
    },
    {
      "id": 402,
      "name": "Xã Tiên Lữ"
    },
    {
      "id": 403,
      "name": "Xã Tiên Hoa"
    },
    {
      "id": 404,
      "name": "Xã Quang Hưng"
    },
    {
      "id": 405,
      "name": "Xã Đoàn Đào"
    },
    {
      "id": 406,
      "name": "Xã Tiên Tiến"
    },
    {
      "id": 407,
      "name": "Xã Tống Trân"
    },
    {
      "id": 408,
      "name": "Xã Lương Bằng"
    },
    {
      "id": 409,
      "name": "Xã Nghĩa Dân"
    },
    {
      "id": 410,
      "name": "Xã Hiệp Cường"
    },
    {
      "id": 411,
      "name": "Xã Đức Hợp"
    },
    {
      "id": 412,
      "name": "Xã Ân Thi"
    },
    {
      "id": 413,
      "name": "Xã Xuân Trúc"
    },
    {
      "id": 414,
      "name": "Xã Phạm Ngũ Lão"
    },
    {
      "id": 415,
      "name": "Xã Nguyễn Trãi"
    },
    {
      "id": 416,
      "name": "Xã Hồng Quang"
    },
    {
      "id": 417,
      "name": "Xã Khoái Châu"
    },
    {
      "id": 418,
      "name": "Xã Triệu Việt Vương"
    },
    {
      "id": 419,
      "name": "Xã Việt Tiến"
    },
    {
      "id": 420,
      "name": "Xã Chí Minh"
    },
    {
      "id": 421,
      "name": "Xã Châu Ninh"
    },
    {
      "id": 422,
      "name": "Xã Yên Mỹ"
    },
    {
      "id": 423,
      "name": "Xã Việt Yên"
    },
    {
      "id": 424,
      "name": "Xã Hoàn Long"
    },
    {
      "id": 425,
      "name": "Xã Nguyễn Văn Linh"
    },
    {
      "id": 426,
      "name": "Xã Như Quỳnh"
    },
    {
      "id": 427,
      "name": "Xã Lạc Đạo"
    },
    {
      "id": 428,
      "name": "Xã Đại Đồng"
    },
    {
      "id": 429,
      "name": "Xã Nghĩa Trụ"
    },
    {
      "id": 430,
      "name": "Xã Phụng Công"
    },
    {
      "id": 431,
      "name": "Xã Văn Giang"
    },
    {
      "id": 432,
      "name": "Xã Mễ Sở"
    },
    {
      "id": 433,
      "name": "Phường Thái Bình"
    },
    {
      "id": 434,
      "name": "Phường Trần Lãm"
    },
    {
      "id": 435,
      "name": "Phường Trần Hưng Đạo"
    },
    {
      "id": 436,
      "name": "Phường Trà Lý"
    },
    {
      "id": 437,
      "name": "Phường Vũ Phúc"
    },
    {
      "id": 438,
      "name": "Xã Thái Thụy"
    },
    {
      "id": 439,
      "name": "Xã Đông Thụy Anh"
    },
    {
      "id": 440,
      "name": "Xã Bắc Thụy Anh"
    },
    {
      "id": 441,
      "name": "Xã Thụy Anh"
    },
    {
      "id": 442,
      "name": "Xã Nam Thụy Anh"
    },
    {
      "id": 443,
      "name": "Xã Bắc Thái Ninh"
    },
    {
      "id": 444,
      "name": "Xã Thái Ninh"
    },
    {
      "id": 445,
      "name": "Xã Đông Thái Ninh"
    },
    {
      "id": 446,
      "name": "Xã Nam Thái Ninh"
    },
    {
      "id": 447,
      "name": "Xã Tây Thái Ninh"
    },
    {
      "id": 448,
      "name": "Xã Tây Thụy Anh"
    },
    {
      "id": 449,
      "name": "Xã Tiền Hải"
    },
    {
      "id": 450,
      "name": "Xã Tây Tiền Hải"
    },
    {
      "id": 451,
      "name": "Xã Ái Quốc"
    },
    {
      "id": 452,
      "name": "Xã Đồng Châu"
    },
    {
      "id": 453,
      "name": "Xã Đông Tiền Hải"
    },
    {
      "id": 454,
      "name": "Xã Nam Cường"
    },
    {
      "id": 455,
      "name": "Xã Hưng Phú"
    },
    {
      "id": 456,
      "name": "Xã Nam Tiền Hải"
    },
    {
      "id": 457,
      "name": "Xã Quỳnh Phụ"
    },
    {
      "id": 458,
      "name": "Xã Minh Thọ"
    },
    {
      "id": 459,
      "name": "Xã Nguyễn Du"
    },
    {
      "id": 460,
      "name": "Xã Quỳnh An"
    },
    {
      "id": 461,
      "name": "Xã Ngọc Lâm"
    },
    {
      "id": 462,
      "name": "Xã Đồng Bằng"
    },
    {
      "id": 463,
      "name": "Xã A Sào"
    },
    {
      "id": 464,
      "name": "Xã Phụ Dực"
    },
    {
      "id": 465,
      "name": "Xã Tân Tiến"
    },
    {
      "id": 466,
      "name": "Xã Hưng Hà"
    },
    {
      "id": 467,
      "name": "Xã Tiên La"
    },
    {
      "id": 468,
      "name": "Xã Lê Quý Đôn"
    },
    {
      "id": 469,
      "name": "Xã Hồng Minh"
    },
    {
      "id": 470,
      "name": "Xã Thần Khê"
    },
    {
      "id": 471,
      "name": "Xã Diên Hà"
    },
    {
      "id": 472,
      "name": "Xã Ngự Thiên"
    },
    {
      "id": 473,
      "name": "Xã Long Hưng"
    },
    {
      "id": 474,
      "name": "Xã Đông Hưng"
    },
    {
      "id": 475,
      "name": "Xã Bắc Tiên Hưng"
    },
    {
      "id": 476,
      "name": "Xã Đông Tiên Hưng"
    },
    {
      "id": 477,
      "name": "Xã Nam Đông Hưng"
    },
    {
      "id": 478,
      "name": "Xã Bắc Đông Quan"
    },
    {
      "id": 479,
      "name": "Xã Bắc Đông Hưng"
    },
    {
      "id": 480,
      "name": "Xã Đông Quan"
    },
    {
      "id": 481,
      "name": "Xã Nam Tiên Hưng"
    },
    {
      "id": 482,
      "name": "Xã Tiên Hưng"
    },
    {
      "id": 483,
      "name": "Xã Lê Lợi"
    },
    {
      "id": 484,
      "name": "Xã Kiến Xương"
    },
    {
      "id": 485,
      "name": "Xã Quang Lịch"
    },
    {
      "id": 486,
      "name": "Xã Vũ Quý"
    },
    {
      "id": 487,
      "name": "Xã Bình Thanh"
    },
    {
      "id": 488,
      "name": "Xã Bình Định"
    },
    {
      "id": 489,
      "name": "Xã Hồng Vũ"
    },
    {
      "id": 490,
      "name": "Xã Bình Nguyên"
    },
    {
      "id": 491,
      "name": "Xã Trà Giang"
    },
    {
      "id": 492,
      "name": "Xã Vũ Thư"
    },
    {
      "id": 493,
      "name": "Xã Thư Trì"
    },
    {
      "id": 494,
      "name": "Xã Tân Thuận"
    },
    {
      "id": 495,
      "name": "Xã Thư Vũ"
    },
    {
      "id": 496,
      "name": "Xã Vũ Tiên"
    },
    {
      "id": 497,
      "name": "Xã Vạn Xuân"
    }
  ],
  "6": [
    {
      "id": 498,
      "name": "Xã Gia Viễn"
    },
    {
      "id": 499,
      "name": "Xã Đại Hoàng"
    },
    {
      "id": 500,
      "name": "Xã Gia Hưng"
    },
    {
      "id": 501,
      "name": "Xã Gia Phong"
    },
    {
      "id": 502,
      "name": "Xã Gia Vân"
    },
    {
      "id": 503,
      "name": "Xã Gia Trấn"
    },
    {
      "id": 504,
      "name": "Xã Nho Quan"
    },
    {
      "id": 505,
      "name": "Xã Gia Lâm"
    },
    {
      "id": 506,
      "name": "Xã Gia Tường"
    },
    {
      "id": 507,
      "name": "Xã Phú Sơn"
    },
    {
      "id": 508,
      "name": "Xã Cúc Phương"
    },
    {
      "id": 509,
      "name": "Xã Phú Long"
    },
    {
      "id": 510,
      "name": "Xã Thanh Sơn"
    },
    {
      "id": 511,
      "name": "Xã Quỳnh Lưu"
    },
    {
      "id": 512,
      "name": "Xã Yên Khánh"
    },
    {
      "id": 513,
      "name": "Xã Khánh Nhạc"
    },
    {
      "id": 514,
      "name": "Xã Khánh Thiện"
    },
    {
      "id": 515,
      "name": "Xã Khánh Hội"
    },
    {
      "id": 516,
      "name": "Xã Khánh Trung"
    },
    {
      "id": 517,
      "name": "Xã Yên Mô"
    },
    {
      "id": 518,
      "name": "Xã Yên Từ"
    },
    {
      "id": 519,
      "name": "Xã Yên Mạc"
    },
    {
      "id": 520,
      "name": "Xã Đồng Thái"
    },
    {
      "id": 521,
      "name": "Xã Chất Bình"
    },
    {
      "id": 522,
      "name": "Xã Kim Sơn"
    },
    {
      "id": 523,
      "name": "Xã Quang Thiện"
    },
    {
      "id": 524,
      "name": "Xã Phát Diệm"
    },
    {
      "id": 525,
      "name": "Xã Lai Thành"
    },
    {
      "id": 526,
      "name": "Xã Định Hóa"
    },
    {
      "id": 527,
      "name": "Xã Bình Minh"
    },
    {
      "id": 528,
      "name": "Xã Kim Đông"
    },
    {
      "id": 529,
      "name": "Xã Bình Lục"
    },
    {
      "id": 530,
      "name": "Xã Bình Mỹ"
    },
    {
      "id": 531,
      "name": "Xã Bình An"
    },
    {
      "id": 532,
      "name": "Xã Bình Giang"
    },
    {
      "id": 533,
      "name": "Xã Bình Sơn"
    },
    {
      "id": 534,
      "name": "Xã Liêm Hà"
    },
    {
      "id": 535,
      "name": "Xã Tân Thanh"
    },
    {
      "id": 536,
      "name": "Xã Thanh Bình"
    },
    {
      "id": 537,
      "name": "Xã Thanh Lâm"
    },
    {
      "id": 538,
      "name": "Xã Thanh Liêm"
    },
    {
      "id": 539,
      "name": "Xã Lý Nhân"
    },
    {
      "id": 540,
      "name": "Xã Nam Xang"
    },
    {
      "id": 541,
      "name": "Xã Bắc Lý"
    },
    {
      "id": 542,
      "name": "Xã Vĩnh Trụ"
    },
    {
      "id": 543,
      "name": "Xã Trần Thương"
    },
    {
      "id": 544,
      "name": "Xã Nhân Hà"
    },
    {
      "id": 545,
      "name": "Xã Nam Lý"
    },
    {
      "id": 546,
      "name": "Xã Nam Trực"
    },
    {
      "id": 547,
      "name": "Xã Nam Minh"
    },
    {
      "id": 548,
      "name": "Xã Nam Đồng"
    },
    {
      "id": 549,
      "name": "Xã Nam Ninh"
    },
    {
      "id": 550,
      "name": "Xã Nam Hồng"
    },
    {
      "id": 551,
      "name": "Xã Minh Tân"
    },
    {
      "id": 552,
      "name": "Xã Hiển Khánh"
    },
    {
      "id": 553,
      "name": "Xã Vụ Bản"
    },
    {
      "id": 554,
      "name": "Xã Liên Minh"
    },
    {
      "id": 555,
      "name": "Xã Ý Yên"
    },
    {
      "id": 556,
      "name": "Xã Yên Đồng"
    },
    {
      "id": 557,
      "name": "Xã Yên Cường"
    },
    {
      "id": 558,
      "name": "Xã Vạn Thắng"
    },
    {
      "id": 559,
      "name": "Xã Vũ Dương"
    },
    {
      "id": 560,
      "name": "Xã Tân Minh"
    },
    {
      "id": 561,
      "name": "Xã Phong Doanh"
    },
    {
      "id": 562,
      "name": "Xã Cổ Lễ"
    },
    {
      "id": 563,
      "name": "Xã Ninh Giang"
    },
    {
      "id": 564,
      "name": "Xã Cát Thành"
    },
    {
      "id": 565,
      "name": "Xã Trực Ninh"
    },
    {
      "id": 566,
      "name": "Xã Quang Hưng"
    },
    {
      "id": 567,
      "name": "Xã Minh Thái"
    },
    {
      "id": 568,
      "name": "Xã Ninh Cường"
    },
    {
      "id": 569,
      "name": "Xã Xuân Trường"
    },
    {
      "id": 570,
      "name": "Xã Xuân Hưng"
    },
    {
      "id": 571,
      "name": "Xã Xuân Giang"
    },
    {
      "id": 572,
      "name": "Xã Xuân Hồng"
    },
    {
      "id": 573,
      "name": "Xã Hải Hậu"
    },
    {
      "id": 574,
      "name": "Xã Hải Anh"
    },
    {
      "id": 575,
      "name": "Xã Hải Tiến"
    },
    {
      "id": 576,
      "name": "Xã Hải Hưng"
    },
    {
      "id": 577,
      "name": "Xã Hải An"
    },
    {
      "id": 578,
      "name": "Xã Hải Quang"
    },
    {
      "id": 579,
      "name": "Xã Hải Xuân"
    },
    {
      "id": 580,
      "name": "Xã Hải Thịnh"
    },
    {
      "id": 581,
      "name": "Xã Giao Minh"
    },
    {
      "id": 582,
      "name": "Xã Giao Hoà"
    },
    {
      "id": 583,
      "name": "Xã Giao Thuỷ"
    },
    {
      "id": 584,
      "name": "Xã Giao Phúc"
    },
    {
      "id": 585,
      "name": "Xã Giao Hưng"
    },
    {
      "id": 586,
      "name": "Xã Giao Bình"
    },
    {
      "id": 587,
      "name": "Xã Giao Ninh"
    },
    {
      "id": 588,
      "name": "Xã Đồng Thịnh"
    },
    {
      "id": 589,
      "name": "Xã Nghĩa Hưng"
    },
    {
      "id": 590,
      "name": "Xã Nghĩa Sơn"
    },
    {
      "id": 591,
      "name": "Xã Hồng Phong"
    },
    {
      "id": 592,
      "name": "Xã Quỹ Nhất"
    },
    {
      "id": 593,
      "name": "Xã Nghĩa Lâm"
    },
    {
      "id": 594,
      "name": "Xã Rạng Đông"
    },
    {
      "id": 595,
      "name": "Phường Tây Hoa Lư"
    },
    {
      "id": 596,
      "name": "Phường Hoa Lư"
    },
    {
      "id": 597,
      "name": "Phường Nam Hoa Lư"
    },
    {
      "id": 598,
      "name": "Phường Đông Hoa Lư"
    },
    {
      "id": 599,
      "name": "Phường Tam Điệp"
    },
    {
      "id": 600,
      "name": "Phường Yên Sơn"
    },
    {
      "id": 601,
      "name": "Phường Trung Sơn"
    },
    {
      "id": 602,
      "name": "Phường Yên Thắng"
    },
    {
      "id": 603,
      "name": "Phường Hà Nam"
    },
    {
      "id": 604,
      "name": "Phường Phủ Lý"
    },
    {
      "id": 605,
      "name": "Phường Phù Vân"
    },
    {
      "id": 606,
      "name": "Phường Châu Sơn"
    },
    {
      "id": 607,
      "name": "Phường Liêm Tuyền"
    },
    {
      "id": 608,
      "name": "Phường Duy Tiên"
    },
    {
      "id": 609,
      "name": "Phường Duy Tân"
    },
    {
      "id": 610,
      "name": "Phường Đồng Văn"
    },
    {
      "id": 611,
      "name": "Phường Duy Hà"
    },
    {
      "id": 612,
      "name": "Phường Tiên Sơn"
    },
    {
      "id": 613,
      "name": "Phường Lê Hồ"
    },
    {
      "id": 614,
      "name": "Phường Nguyễn Úy"
    },
    {
      "id": 615,
      "name": "Phường Lý Thường Kiệt"
    },
    {
      "id": 616,
      "name": "Phường Kim Thanh"
    },
    {
      "id": 617,
      "name": "Phường Tam Chúc"
    },
    {
      "id": 618,
      "name": "Phường Kim Bảng"
    },
    {
      "id": 619,
      "name": "Phường Nam Định"
    },
    {
      "id": 620,
      "name": "Phường Thiên Trường"
    },
    {
      "id": 621,
      "name": "Phường Đông A"
    },
    {
      "id": 622,
      "name": "Phường Vị Khê"
    },
    {
      "id": 623,
      "name": "Phường Thành Nam"
    },
    {
      "id": 624,
      "name": "Phường Trường Thi"
    },
    {
      "id": 625,
      "name": "Phường Hồng Quang"
    },
    {
      "id": 626,
      "name": "Phường Mỹ Lộc"
    }
  ],
  "7": [
    {
      "id": 627,
      "name": "Phường Thục Phán"
    },
    {
      "id": 628,
      "name": "Phường Nùng Trí Cao"
    },
    {
      "id": 629,
      "name": "Phường Tân Giang"
    },
    {
      "id": 630,
      "name": "Xã Quảng Lâm"
    },
    {
      "id": 631,
      "name": "Xã Nam Quang"
    },
    {
      "id": 632,
      "name": "Xã Lý Bôn"
    },
    {
      "id": 633,
      "name": "Xã Bảo Lâm"
    },
    {
      "id": 634,
      "name": "Xã Yên Thổ"
    },
    {
      "id": 635,
      "name": "Xã Sơn Lộ"
    },
    {
      "id": 636,
      "name": "Xã Hưng Đạo"
    },
    {
      "id": 637,
      "name": "Xã Bảo Lạc"
    },
    {
      "id": 638,
      "name": "Xã Cốc Pàng"
    },
    {
      "id": 639,
      "name": "Xã Cô Ba"
    },
    {
      "id": 640,
      "name": "Xã Khánh Xuân"
    },
    {
      "id": 641,
      "name": "Xã Xuân Trường"
    },
    {
      "id": 642,
      "name": "Xã Huy Giáp"
    },
    {
      "id": 643,
      "name": "Xã Ca Thành"
    },
    {
      "id": 644,
      "name": "Xã Phan Thanh"
    },
    {
      "id": 645,
      "name": "Xã Thành Công"
    },
    {
      "id": 646,
      "name": "Xã Tĩnh Túc"
    },
    {
      "id": 647,
      "name": "Xã Tam Kim"
    },
    {
      "id": 648,
      "name": "Xã Nguyên Bình"
    },
    {
      "id": 649,
      "name": "Xã Minh Tâm"
    },
    {
      "id": 650,
      "name": "Xã Thanh Long"
    },
    {
      "id": 651,
      "name": "Xã Cần Yên"
    },
    {
      "id": 652,
      "name": "Xã Thông Nông"
    },
    {
      "id": 653,
      "name": "Xã Trường Hà"
    },
    {
      "id": 654,
      "name": "Xã Hà Quảng"
    },
    {
      "id": 655,
      "name": "Xã Lũng Nặm"
    },
    {
      "id": 656,
      "name": "Xã Tổng Cọt"
    },
    {
      "id": 657,
      "name": "Xã Nam Tuấn"
    },
    {
      "id": 658,
      "name": "Xã Hoà An"
    },
    {
      "id": 659,
      "name": "Xã Bạch Đằng"
    },
    {
      "id": 660,
      "name": "Xã Nguyễn Huệ"
    },
    {
      "id": 661,
      "name": "Xã Minh Khai"
    },
    {
      "id": 662,
      "name": "Xã Canh Tân"
    },
    {
      "id": 663,
      "name": "Xã Kim Đồng"
    },
    {
      "id": 664,
      "name": "Xã Thạch An"
    },
    {
      "id": 665,
      "name": "Xã Đông Khê"
    },
    {
      "id": 666,
      "name": "Xã Đức Long"
    },
    {
      "id": 667,
      "name": "Xã Phục Hoà"
    },
    {
      "id": 668,
      "name": "Xã Bế Văn Đàn"
    },
    {
      "id": 669,
      "name": "Xã Độc Lập"
    },
    {
      "id": 670,
      "name": "Xã Quảng Uyên"
    },
    {
      "id": 671,
      "name": "Xã Hạnh Phúc"
    },
    {
      "id": 672,
      "name": "Xã Quang Hán"
    },
    {
      "id": 673,
      "name": "Xã Trà Lĩnh"
    },
    {
      "id": 674,
      "name": "Xã Quang Trung"
    },
    {
      "id": 675,
      "name": "Xã Đoài Dương"
    },
    {
      "id": 676,
      "name": "Xã Trùng Khánh"
    },
    {
      "id": 677,
      "name": "Xã Đàm Thuỷ"
    },
    {
      "id": 678,
      "name": "Xã Đình Phong"
    },
    {
      "id": 679,
      "name": "Xã Lý Quốc"
    },
    {
      "id": 680,
      "name": "Xã Hạ Lang"
    },
    {
      "id": 681,
      "name": "Xã Vinh Quý"
    },
    {
      "id": 682,
      "name": "Xã Quang Long"
    }
  ],
  "8": [
    {
      "id": 683,
      "name": "Xã Thượng Lâm"
    },
    {
      "id": 684,
      "name": "Xã Lâm Bình"
    },
    {
      "id": 685,
      "name": "Xã Minh Quang"
    },
    {
      "id": 686,
      "name": "Xã Bình An"
    },
    {
      "id": 687,
      "name": "Xã Côn Lôn"
    },
    {
      "id": 688,
      "name": "Xã Yên Hoa"
    },
    {
      "id": 689,
      "name": "Xã Thượng Nông"
    },
    {
      "id": 690,
      "name": "Xã Hồng Thái"
    },
    {
      "id": 691,
      "name": "Xã Nà Hang"
    },
    {
      "id": 692,
      "name": "Xã Tân Mỹ"
    },
    {
      "id": 693,
      "name": "Xã Yên Lập"
    },
    {
      "id": 694,
      "name": "Xã Tân An"
    },
    {
      "id": 695,
      "name": "Xã Chiêm Hoá"
    },
    {
      "id": 696,
      "name": "Xã Hoà An"
    },
    {
      "id": 697,
      "name": "Xã Kiên Đài"
    },
    {
      "id": 698,
      "name": "Xã Tri Phú"
    },
    {
      "id": 699,
      "name": "Xã Kim Bình"
    },
    {
      "id": 700,
      "name": "Xã Yên Nguyên"
    },
    {
      "id": 701,
      "name": "Xã Trung Hà"
    },
    {
      "id": 702,
      "name": "Xã Yên Phú"
    },
    {
      "id": 703,
      "name": "Xã Bạch Xa"
    },
    {
      "id": 704,
      "name": "Xã Phù Lưu"
    },
    {
      "id": 705,
      "name": "Xã Hàm Yên"
    },
    {
      "id": 706,
      "name": "Xã Bình Xa"
    },
    {
      "id": 707,
      "name": "Xã Thái Sơn"
    },
    {
      "id": 708,
      "name": "Xã Thái Hoà"
    },
    {
      "id": 709,
      "name": "Xã Hùng Đức"
    },
    {
      "id": 710,
      "name": "Xã Hùng Lợi"
    },
    {
      "id": 711,
      "name": "Xã Trung Sơn"
    },
    {
      "id": 712,
      "name": "Xã Thái Bình"
    },
    {
      "id": 713,
      "name": "Xã Tân Long"
    },
    {
      "id": 714,
      "name": "Xã Xuân Vân"
    },
    {
      "id": 715,
      "name": "Xã Lực Hành"
    },
    {
      "id": 716,
      "name": "Xã Yên Sơn"
    },
    {
      "id": 717,
      "name": "Xã Nhữ Khê"
    },
    {
      "id": 718,
      "name": "Xã Kiến Thiết"
    },
    {
      "id": 719,
      "name": "Xã Tân Trào"
    },
    {
      "id": 720,
      "name": "Xã Minh Thanh"
    },
    {
      "id": 721,
      "name": "Xã Sơn Dương"
    },
    {
      "id": 722,
      "name": "Xã Bình Ca"
    },
    {
      "id": 723,
      "name": "Xã Tân Thanh"
    },
    {
      "id": 724,
      "name": "Xã Sơn Thuỷ"
    },
    {
      "id": 725,
      "name": "Xã Phú Lương"
    },
    {
      "id": 726,
      "name": "Xã Trường Sinh"
    },
    {
      "id": 727,
      "name": "Xã Hồng Sơn"
    },
    {
      "id": 728,
      "name": "Xã Đông Thọ"
    },
    {
      "id": 729,
      "name": "Phường Mỹ Lâm"
    },
    {
      "id": 730,
      "name": "Phường Minh Xuân"
    },
    {
      "id": 731,
      "name": "Phường Nông Tiến"
    },
    {
      "id": 732,
      "name": "Phường An Tường"
    },
    {
      "id": 733,
      "name": "Phường Bình Thuận"
    },
    {
      "id": 734,
      "name": "Xã Lũng Cú"
    },
    {
      "id": 735,
      "name": "Xã Đồng Văn"
    },
    {
      "id": 736,
      "name": "Xã Sà Phìn"
    },
    {
      "id": 737,
      "name": "Xã Phố Bảng"
    },
    {
      "id": 738,
      "name": "Xã Lũng Phìn"
    },
    {
      "id": 739,
      "name": "Xã Sủng Máng"
    },
    {
      "id": 740,
      "name": "Xã Sơn Vĩ"
    },
    {
      "id": 741,
      "name": "Xã Mèo Vạc"
    },
    {
      "id": 742,
      "name": "Xã Khâu Vai"
    },
    {
      "id": 743,
      "name": "Xã Niêm Sơn"
    },
    {
      "id": 744,
      "name": "Xã Tát Ngà"
    },
    {
      "id": 745,
      "name": "Xã Thắng Mố"
    },
    {
      "id": 746,
      "name": "Xã Bạch Đích"
    },
    {
      "id": 747,
      "name": "Xã Yên Minh"
    },
    {
      "id": 748,
      "name": "Xã Mậu Duệ"
    },
    {
      "id": 749,
      "name": "Xã Ngọc Long"
    },
    {
      "id": 750,
      "name": "Xã Du Già"
    },
    {
      "id": 751,
      "name": "Xã Đường Thượng"
    },
    {
      "id": 752,
      "name": "Xã Lùng Tám"
    },
    {
      "id": 753,
      "name": "Xã Cán Tỷ"
    },
    {
      "id": 754,
      "name": "Xã Nghĩa Thuận"
    },
    {
      "id": 755,
      "name": "Xã Quản Bạ"
    },
    {
      "id": 756,
      "name": "Xã Tùng Vài"
    },
    {
      "id": 757,
      "name": "Xã Yên Cường"
    },
    {
      "id": 758,
      "name": "Xã Đường Hồng"
    },
    {
      "id": 759,
      "name": "Xã Bắc Mê"
    },
    {
      "id": 760,
      "name": "Xã Giáp Trung"
    },
    {
      "id": 761,
      "name": "Xã Minh Sơn"
    },
    {
      "id": 762,
      "name": "Xã Minh Ngọc"
    },
    {
      "id": 763,
      "name": "Xã Ngọc Đường"
    },
    {
      "id": 764,
      "name": "Phường Hà Giang 1"
    },
    {
      "id": 765,
      "name": "Phường Hà Giang 2"
    },
    {
      "id": 766,
      "name": "Xã Lao Chải"
    },
    {
      "id": 767,
      "name": "Xã Thanh Thuỷ"
    },
    {
      "id": 768,
      "name": "Xã Minh Tân"
    },
    {
      "id": 769,
      "name": "Xã Thuận Hoà"
    },
    {
      "id": 770,
      "name": "Xã Tùng Bá"
    },
    {
      "id": 771,
      "name": "Xã Phú Linh"
    },
    {
      "id": 772,
      "name": "Xã Linh Hồ"
    },
    {
      "id": 773,
      "name": "Xã Bạch Ngọc"
    },
    {
      "id": 774,
      "name": "Xã Vị Xuyên"
    },
    {
      "id": 775,
      "name": "Xã Việt Lâm"
    },
    {
      "id": 776,
      "name": "Xã Cao Bồ"
    },
    {
      "id": 777,
      "name": "Xã Thượng Sơn"
    },
    {
      "id": 778,
      "name": "Xã Tân Quang"
    },
    {
      "id": 779,
      "name": "Xã Đồng Tâm"
    },
    {
      "id": 780,
      "name": "Xã Liên Hiệp"
    },
    {
      "id": 781,
      "name": "Xã Bằng Hành"
    },
    {
      "id": 782,
      "name": "Xã Bắc Quang"
    },
    {
      "id": 783,
      "name": "Xã Hùng An"
    },
    {
      "id": 784,
      "name": "Xã Vĩnh Tuy"
    },
    {
      "id": 785,
      "name": "Xã Đồng Yên"
    },
    {
      "id": 786,
      "name": "Xã Tiên Yên"
    },
    {
      "id": 787,
      "name": "Xã Xuân Giang"
    },
    {
      "id": 788,
      "name": "Xã Bằng Lang"
    },
    {
      "id": 789,
      "name": "Xã Yên Thành"
    },
    {
      "id": 790,
      "name": "Xã Quang Bình"
    },
    {
      "id": 791,
      "name": "Xã Tân Trịnh"
    },
    {
      "id": 792,
      "name": "Xã Tiên Nguyên"
    },
    {
      "id": 793,
      "name": "Xã Thông Nguyên"
    },
    {
      "id": 794,
      "name": "Xã Hồ Thầu"
    },
    {
      "id": 795,
      "name": "Xã Nậm Dịch"
    },
    {
      "id": 796,
      "name": "Xã Tân Tiến"
    },
    {
      "id": 797,
      "name": "Xã Hoàng Su Phì"
    },
    {
      "id": 798,
      "name": "Xã Thàng Tín"
    },
    {
      "id": 799,
      "name": "Xã Bản Máy"
    },
    {
      "id": 800,
      "name": "Xã Pờ Ly Ngài"
    },
    {
      "id": 801,
      "name": "Xã Xín Mần"
    },
    {
      "id": 802,
      "name": "Xã Pà Vầy Sủ"
    },
    {
      "id": 803,
      "name": "Xã Nấm Dẩn"
    },
    {
      "id": 804,
      "name": "Xã Trung Thịnh"
    },
    {
      "id": 805,
      "name": "Xã Quảng Nguyên"
    },
    {
      "id": 806,
      "name": "Xã Khuôn Lùng"
    }
  ],
  "9": [
    {
      "id": 807,
      "name": "Xã Khao Mang"
    },
    {
      "id": 808,
      "name": "Xã Mù Cang Chải"
    },
    {
      "id": 809,
      "name": "Xã Púng Luông"
    },
    {
      "id": 810,
      "name": "Xã Tú Lệ"
    },
    {
      "id": 811,
      "name": "Xã Trạm Tấu"
    },
    {
      "id": 812,
      "name": "Xã Hạnh Phúc"
    },
    {
      "id": 813,
      "name": "Xã Phình Hồ"
    },
    {
      "id": 814,
      "name": "Phường Nghĩa Lộ"
    },
    {
      "id": 815,
      "name": "Phường Trung Tâm"
    },
    {
      "id": 816,
      "name": "Phường Cầu Thia"
    },
    {
      "id": 817,
      "name": "Xã Liên Sơn"
    },
    {
      "id": 818,
      "name": "Xã Gia Hội"
    },
    {
      "id": 819,
      "name": "Xã Sơn Lương"
    },
    {
      "id": 820,
      "name": "Xã Thượng Bằng La"
    },
    {
      "id": 821,
      "name": "Xã Chấn Thịnh"
    },
    {
      "id": 822,
      "name": "Xã Nghĩa Tâm"
    },
    {
      "id": 823,
      "name": "Xã Văn Chấn"
    },
    {
      "id": 824,
      "name": "Xã Phong Dụ Hạ"
    },
    {
      "id": 825,
      "name": "Xã Châu Quế"
    },
    {
      "id": 826,
      "name": "Xã Lâm Giang"
    },
    {
      "id": 827,
      "name": "Xã Đông Cuông"
    },
    {
      "id": 828,
      "name": "Xã Tân Hợp"
    },
    {
      "id": 829,
      "name": "Xã Mậu A"
    },
    {
      "id": 830,
      "name": "Xã Xuân Ái"
    },
    {
      "id": 831,
      "name": "Xã Mỏ Vàng"
    },
    {
      "id": 832,
      "name": "Xã Lâm Thượng"
    },
    {
      "id": 833,
      "name": "Xã Lục Yên"
    },
    {
      "id": 834,
      "name": "Xã Tân Lĩnh"
    },
    {
      "id": 835,
      "name": "Xã Khánh Hoà"
    },
    {
      "id": 836,
      "name": "Xã Phúc Lợi"
    },
    {
      "id": 837,
      "name": "Xã Mường Lai"
    },
    {
      "id": 838,
      "name": "Xã Cảm Nhân"
    },
    {
      "id": 839,
      "name": "Xã Yên Thành"
    },
    {
      "id": 840,
      "name": "Xã Thác Bà"
    },
    {
      "id": 841,
      "name": "Xã Yên Bình"
    },
    {
      "id": 842,
      "name": "Xã Bảo Ái"
    },
    {
      "id": 843,
      "name": "Phường Văn Phú"
    },
    {
      "id": 844,
      "name": "Phường Yên Bái"
    },
    {
      "id": 845,
      "name": "Phường Nam Cường"
    },
    {
      "id": 846,
      "name": "Phường Âu Lâu"
    },
    {
      "id": 847,
      "name": "Xã Trấn Yên"
    },
    {
      "id": 848,
      "name": "Xã Hưng Khánh"
    },
    {
      "id": 849,
      "name": "Xã Lương Thịnh"
    },
    {
      "id": 850,
      "name": "Xã Việt Hồng"
    },
    {
      "id": 851,
      "name": "Xã Quy Mông"
    },
    {
      "id": 852,
      "name": "Xã Phong Hải"
    },
    {
      "id": 853,
      "name": "Xã Xuân Quang"
    },
    {
      "id": 854,
      "name": "Xã Bảo Thắng"
    },
    {
      "id": 855,
      "name": "Xã Tằng Lỏong"
    },
    {
      "id": 856,
      "name": "Xã Gia Phú"
    },
    {
      "id": 857,
      "name": "Xã Cốc San"
    },
    {
      "id": 858,
      "name": "Xã Hợp Thành"
    },
    {
      "id": 859,
      "name": "Phường Cam Đường"
    },
    {
      "id": 860,
      "name": "Phường Lào Cai"
    },
    {
      "id": 861,
      "name": "Xã Mường Hum"
    },
    {
      "id": 862,
      "name": "Xã Dền Sáng"
    },
    {
      "id": 863,
      "name": "Xã Y Tý"
    },
    {
      "id": 864,
      "name": "Xã A Mú Sung"
    },
    {
      "id": 865,
      "name": "Xã Trịnh Tường"
    },
    {
      "id": 866,
      "name": "Xã Bản Xèo"
    },
    {
      "id": 867,
      "name": "Xã Bát Xát"
    },
    {
      "id": 868,
      "name": "Xã Nghĩa Đô"
    },
    {
      "id": 869,
      "name": "Xã Thượng Hà"
    },
    {
      "id": 870,
      "name": "Xã Bảo Yên"
    },
    {
      "id": 871,
      "name": "Xã Xuân Hoà"
    },
    {
      "id": 872,
      "name": "Xã Phúc Khánh"
    },
    {
      "id": 873,
      "name": "Xã Bảo Hà"
    },
    {
      "id": 874,
      "name": "Xã Võ Lao"
    },
    {
      "id": 875,
      "name": "Xã Khánh Yên"
    },
    {
      "id": 876,
      "name": "Xã Văn Bàn"
    },
    {
      "id": 877,
      "name": "Xã Dương Quỳ"
    },
    {
      "id": 878,
      "name": "Xã Chiềng Ken"
    },
    {
      "id": 879,
      "name": "Xã Minh Lương"
    },
    {
      "id": 880,
      "name": "Xã Nậm Chày"
    },
    {
      "id": 881,
      "name": "Xã Mường Bo"
    },
    {
      "id": 882,
      "name": "Xã Bản Hồ"
    },
    {
      "id": 883,
      "name": "Xã Tả Phìn"
    },
    {
      "id": 884,
      "name": "Xã Tả Van"
    },
    {
      "id": 885,
      "name": "Phường Sa Pa"
    },
    {
      "id": 886,
      "name": "Xã Cốc Lầu"
    },
    {
      "id": 887,
      "name": "Xã Bảo Nhai"
    },
    {
      "id": 888,
      "name": "Xã Bản Liền"
    },
    {
      "id": 889,
      "name": "Xã Bắc Hà"
    },
    {
      "id": 890,
      "name": "Xã Tả Củ Tỷ"
    },
    {
      "id": 891,
      "name": "Xã Lùng Phình"
    },
    {
      "id": 892,
      "name": "Xã Pha Long"
    },
    {
      "id": 893,
      "name": "Xã Mường Khương"
    },
    {
      "id": 894,
      "name": "Xã Bản Lầu"
    },
    {
      "id": 895,
      "name": "Xã Cao Sơn"
    },
    {
      "id": 896,
      "name": "Xã Si Ma Cai"
    },
    {
      "id": 897,
      "name": "Xã Sín Chéng"
    },
    {
      "id": 898,
      "name": "Xã Lao Chải"
    },
    {
      "id": 899,
      "name": "Xã Chế Tạo"
    },
    {
      "id": 900,
      "name": "Xã Nậm Có"
    },
    {
      "id": 901,
      "name": "Xã Tà Xi Láng"
    },
    {
      "id": 902,
      "name": "Xã Phong Dụ Thượng"
    },
    {
      "id": 903,
      "name": "Xã Cát Thịnh"
    },
    {
      "id": 904,
      "name": "Xã Nậm Xé"
    },
    {
      "id": 905,
      "name": "Xã Ngũ Chỉ Sơn"
    }
  ],
  "10": [
    {
      "id": 906,
      "name": "Phường Phan Đình Phùng"
    },
    {
      "id": 907,
      "name": "Phường Linh Sơn"
    },
    {
      "id": 908,
      "name": "Phường Tích Lương"
    },
    {
      "id": 909,
      "name": "Phường Gia Sàng"
    },
    {
      "id": 910,
      "name": "Phường Quyết Thắng"
    },
    {
      "id": 911,
      "name": "Phường Quan Triều"
    },
    {
      "id": 912,
      "name": "Xã Tân Cương"
    },
    {
      "id": 913,
      "name": "Xã Đại Phúc"
    },
    {
      "id": 914,
      "name": "Xã Đại Từ"
    },
    {
      "id": 915,
      "name": "Xã Đức Lương"
    },
    {
      "id": 916,
      "name": "Xã Phú Thịnh"
    },
    {
      "id": 917,
      "name": "Xã La Bằng"
    },
    {
      "id": 918,
      "name": "Xã Phú Lạc"
    },
    {
      "id": 919,
      "name": "Xã An Khánh"
    },
    {
      "id": 920,
      "name": "Xã Quân Chu"
    },
    {
      "id": 921,
      "name": "Xã Vạn Phú"
    },
    {
      "id": 922,
      "name": "Xã Phú Xuyên"
    },
    {
      "id": 923,
      "name": "Phường Phổ Yên"
    },
    {
      "id": 924,
      "name": "Phường Vạn Xuân"
    },
    {
      "id": 925,
      "name": "Phường Trung Thành"
    },
    {
      "id": 926,
      "name": "Phường Phúc Thuận"
    },
    {
      "id": 927,
      "name": "Xã Thành Công"
    },
    {
      "id": 928,
      "name": "Xã Phú Bình"
    },
    {
      "id": 929,
      "name": "Xã Tân Thành"
    },
    {
      "id": 930,
      "name": "Xã Điềm Thụy"
    },
    {
      "id": 931,
      "name": "Xã Kha Sơn"
    },
    {
      "id": 932,
      "name": "Xã Tân Khánh"
    },
    {
      "id": 933,
      "name": "Xã Đồng Hỷ"
    },
    {
      "id": 934,
      "name": "Xã Quang Sơn"
    },
    {
      "id": 935,
      "name": "Xã Trại Cau"
    },
    {
      "id": 936,
      "name": "Xã Nam Hoà"
    },
    {
      "id": 937,
      "name": "Xã Văn Hán"
    },
    {
      "id": 938,
      "name": "Xã Văn Lăng"
    },
    {
      "id": 939,
      "name": "Phường Sông Công"
    },
    {
      "id": 940,
      "name": "Phường Bá Xuyên"
    },
    {
      "id": 941,
      "name": "Phường Bách Quang"
    },
    {
      "id": 942,
      "name": "Xã Phú Lương"
    },
    {
      "id": 943,
      "name": "Xã Vô Tranh"
    },
    {
      "id": 944,
      "name": "Xã Yên Trạch"
    },
    {
      "id": 945,
      "name": "Xã Hợp Thành"
    },
    {
      "id": 946,
      "name": "Xã Định Hóa"
    },
    {
      "id": 947,
      "name": "Xã Bình Yên"
    },
    {
      "id": 948,
      "name": "Xã Trung Hội"
    },
    {
      "id": 949,
      "name": "Xã Phượng Tiến"
    },
    {
      "id": 950,
      "name": "Xã Phú Đình"
    },
    {
      "id": 951,
      "name": "Xã Bình Thành"
    },
    {
      "id": 952,
      "name": "Xã Kim Phượng"
    },
    {
      "id": 953,
      "name": "Xã Lam Vỹ"
    },
    {
      "id": 954,
      "name": "Xã Võ Nhai"
    },
    {
      "id": 955,
      "name": "Xã Dân Tiến"
    },
    {
      "id": 956,
      "name": "Xã Nghinh Tường"
    },
    {
      "id": 957,
      "name": "Xã Thần Sa"
    },
    {
      "id": 958,
      "name": "Xã La Hiên"
    },
    {
      "id": 959,
      "name": "Xã Tràng Xá"
    },
    {
      "id": 960,
      "name": "Xã Bằng Thành"
    },
    {
      "id": 961,
      "name": "Xã Nghiên Loan"
    },
    {
      "id": 962,
      "name": "Xã Cao Minh"
    },
    {
      "id": 963,
      "name": "Xã Ba Bể"
    },
    {
      "id": 964,
      "name": "Xã Chợ Rã"
    },
    {
      "id": 965,
      "name": "Xã Phúc Lộc"
    },
    {
      "id": 966,
      "name": "Xã Thượng Minh"
    },
    {
      "id": 967,
      "name": "Xã Đồng Phúc"
    },
    {
      "id": 968,
      "name": "Xã Yên Bình"
    },
    {
      "id": 969,
      "name": "Xã Bằng Vân"
    },
    {
      "id": 970,
      "name": "Xã Ngân Sơn"
    },
    {
      "id": 971,
      "name": "Xã Nà Phặc"
    },
    {
      "id": 972,
      "name": "Xã Hiệp Lực"
    },
    {
      "id": 973,
      "name": "Xã Nam Cường"
    },
    {
      "id": 974,
      "name": "Xã Quảng Bạch"
    },
    {
      "id": 975,
      "name": "Xã Yên Thịnh"
    },
    {
      "id": 976,
      "name": "Xã Chợ Đồn"
    },
    {
      "id": 977,
      "name": "Xã Yên Phong"
    },
    {
      "id": 978,
      "name": "Xã Nghĩa Tá"
    },
    {
      "id": 979,
      "name": "Xã Phủ Thông"
    },
    {
      "id": 980,
      "name": "Xã Cẩm Giàng"
    },
    {
      "id": 981,
      "name": "Xã Vĩnh Thông"
    },
    {
      "id": 982,
      "name": "Xã Bạch Thông"
    },
    {
      "id": 983,
      "name": "Xã Phong Quang"
    },
    {
      "id": 984,
      "name": "Phường Đức Xuân"
    },
    {
      "id": 985,
      "name": "Phường Bắc Kạn"
    },
    {
      "id": 986,
      "name": "Xã Văn Lang"
    },
    {
      "id": 987,
      "name": "Xã Cường Lợi"
    },
    {
      "id": 988,
      "name": "Xã Na Rì"
    },
    {
      "id": 989,
      "name": "Xã Trần Phú"
    },
    {
      "id": 990,
      "name": "Xã Côn Minh"
    },
    {
      "id": 991,
      "name": "Xã Xuân Dương"
    },
    {
      "id": 992,
      "name": "Xã Tân Kỳ"
    },
    {
      "id": 993,
      "name": "Xã Thanh Mai"
    },
    {
      "id": 994,
      "name": "Xã Thanh Thịnh"
    },
    {
      "id": 995,
      "name": "Xã Chợ Mới"
    },
    {
      "id": 996,
      "name": "Xã Sảng Mộc"
    },
    {
      "id": 997,
      "name": "Xã Thượng Quan"
    }
  ],
  "11": [
    {
      "id": 998,
      "name": "Xã Thất Khê"
    },
    {
      "id": 999,
      "name": "Xã Đoàn Kết"
    },
    {
      "id": 1000,
      "name": "Xã Tân Tiến"
    },
    {
      "id": 1001,
      "name": "Xã Tràng Định"
    },
    {
      "id": 1002,
      "name": "Xã Quốc Khánh"
    },
    {
      "id": 1003,
      "name": "Xã Kháng Chiến"
    },
    {
      "id": 1004,
      "name": "Xã Quốc Việt"
    },
    {
      "id": 1005,
      "name": "Xã Bình Gia"
    },
    {
      "id": 1006,
      "name": "Xã Tân Văn"
    },
    {
      "id": 1007,
      "name": "Xã Hồng Phong"
    },
    {
      "id": 1008,
      "name": "Xã Hoa Thám"
    },
    {
      "id": 1009,
      "name": "Xã Quý Hoà"
    },
    {
      "id": 1010,
      "name": "Xã Thiện Hoà"
    },
    {
      "id": 1011,
      "name": "Xã Thiện Thuật"
    },
    {
      "id": 1012,
      "name": "Xã Thiện Long"
    },
    {
      "id": 1013,
      "name": "Xã Bắc Sơn"
    },
    {
      "id": 1014,
      "name": "Xã Hưng Vũ"
    },
    {
      "id": 1015,
      "name": "Xã Vũ Lăng"
    },
    {
      "id": 1016,
      "name": "Xã Nhất Hoà"
    },
    {
      "id": 1017,
      "name": "Xã Vũ Lễ"
    },
    {
      "id": 1018,
      "name": "Xã Tân Tri"
    },
    {
      "id": 1019,
      "name": "Xã Văn Quan"
    },
    {
      "id": 1020,
      "name": "Xã Điềm He"
    },
    {
      "id": 1021,
      "name": "Xã Tri Lễ"
    },
    {
      "id": 1022,
      "name": "Xã Yên Phúc"
    },
    {
      "id": 1023,
      "name": "Xã Tân Đoàn"
    },
    {
      "id": 1024,
      "name": "Xã Khánh Khê"
    },
    {
      "id": 1025,
      "name": "Xã Na Sầm"
    },
    {
      "id": 1026,
      "name": "Xã Văn Lãng"
    },
    {
      "id": 1027,
      "name": "Xã Hội Hoan"
    },
    {
      "id": 1028,
      "name": "Xã Thụy Hùng"
    },
    {
      "id": 1029,
      "name": "Xã Hoàng Văn Thụ"
    },
    {
      "id": 1030,
      "name": "Xã Lộc Bình"
    },
    {
      "id": 1031,
      "name": "Xã Mẫu Sơn"
    },
    {
      "id": 1032,
      "name": "Xã Na Dương"
    },
    {
      "id": 1033,
      "name": "Xã Lợi Bác"
    },
    {
      "id": 1034,
      "name": "Xã Thống Nhất"
    },
    {
      "id": 1035,
      "name": "Xã Xuân Dương"
    },
    {
      "id": 1036,
      "name": "Xã Khuất Xá"
    },
    {
      "id": 1037,
      "name": "Xã Đình Lập"
    },
    {
      "id": 1038,
      "name": "Xã Châu Sơn"
    },
    {
      "id": 1039,
      "name": "Xã Kiên Mộc"
    },
    {
      "id": 1040,
      "name": "Xã Thái Bình"
    },
    {
      "id": 1041,
      "name": "Xã Hữu Lũng"
    },
    {
      "id": 1042,
      "name": "Xã Tuấn Sơn"
    },
    {
      "id": 1043,
      "name": "Xã Tân Thành"
    },
    {
      "id": 1044,
      "name": "Xã Vân Nham"
    },
    {
      "id": 1045,
      "name": "Xã Thiện Tân"
    },
    {
      "id": 1046,
      "name": "Xã Yên Bình"
    },
    {
      "id": 1047,
      "name": "Xã Hữu Liên"
    },
    {
      "id": 1048,
      "name": "Xã Cai Kinh"
    },
    {
      "id": 1049,
      "name": "Xã Chi Lăng"
    },
    {
      "id": 1050,
      "name": "Xã Nhân Lý"
    },
    {
      "id": 1051,
      "name": "Xã Chiến Thắng"
    },
    {
      "id": 1052,
      "name": "Xã Quan Sơn"
    },
    {
      "id": 1053,
      "name": "Xã Bằng Mạc"
    },
    {
      "id": 1054,
      "name": "Xã Vạn Linh"
    },
    {
      "id": 1055,
      "name": "Xã Đồng Đăng"
    },
    {
      "id": 1056,
      "name": "Xã Cao Lộc"
    },
    {
      "id": 1057,
      "name": "Xã Công Sơn"
    },
    {
      "id": 1058,
      "name": "Xã Ba Sơn"
    },
    {
      "id": 1059,
      "name": "Phường Tam Thanh"
    },
    {
      "id": 1060,
      "name": "Phường Lương Văn Tri"
    },
    {
      "id": 1061,
      "name": "Phường Kỳ Lừa"
    },
    {
      "id": 1062,
      "name": "Phường Đông Kinh"
    }
  ],
  "12": [
    {
      "id": 1063,
      "name": "Phường Việt Trì"
    },
    {
      "id": 1064,
      "name": "Phường Nông Trang"
    },
    {
      "id": 1065,
      "name": "Phường Thanh Miếu"
    },
    {
      "id": 1066,
      "name": "Phường Vân Phú"
    },
    {
      "id": 1067,
      "name": "Xã Hy Cương"
    },
    {
      "id": 1068,
      "name": "Xã Lâm Thao"
    },
    {
      "id": 1069,
      "name": "Xã Xuân Lũng"
    },
    {
      "id": 1070,
      "name": "Xã Phùng Nguyên"
    },
    {
      "id": 1071,
      "name": "Xã Bản Nguyên"
    },
    {
      "id": 1072,
      "name": "Phường Phong Châu"
    },
    {
      "id": 1073,
      "name": "Phường Phú Thọ"
    },
    {
      "id": 1074,
      "name": "Phường Âu Cơ"
    },
    {
      "id": 1075,
      "name": "Xã Phù Ninh"
    },
    {
      "id": 1076,
      "name": "Xã Dân Chủ"
    },
    {
      "id": 1077,
      "name": "Xã Phú Mỹ"
    },
    {
      "id": 1078,
      "name": "Xã Trạm Thản"
    },
    {
      "id": 1079,
      "name": "Xã Bình Phú"
    },
    {
      "id": 1080,
      "name": "Xã Thanh Ba"
    },
    {
      "id": 1081,
      "name": "Xã Quảng Yên"
    },
    {
      "id": 1082,
      "name": "Xã Hoàng Cương"
    },
    {
      "id": 1083,
      "name": "Xã Đông Thành"
    },
    {
      "id": 1084,
      "name": "Xã Chí Tiên"
    },
    {
      "id": 1085,
      "name": "Xã Liên Minh"
    },
    {
      "id": 1086,
      "name": "Xã Đoan Hùng"
    },
    {
      "id": 1087,
      "name": "Xã Tây Cốc"
    },
    {
      "id": 1088,
      "name": "Xã Chân Mộng"
    },
    {
      "id": 1089,
      "name": "Xã Chí Đám"
    },
    {
      "id": 1090,
      "name": "Xã Bằng Luân"
    },
    {
      "id": 1091,
      "name": "Xã Hạ Hòa"
    },
    {
      "id": 1092,
      "name": "Xã Đan Thượng"
    },
    {
      "id": 1093,
      "name": "Xã Yên Kỳ"
    },
    {
      "id": 1094,
      "name": "Xã Vĩnh Chân"
    },
    {
      "id": 1095,
      "name": "Xã Văn Lang"
    },
    {
      "id": 1096,
      "name": "Xã Hiền Lương"
    },
    {
      "id": 1097,
      "name": "Xã Cẩm Khê"
    },
    {
      "id": 1098,
      "name": "Xã Phú Khê"
    },
    {
      "id": 1099,
      "name": "Xã Hùng Việt"
    },
    {
      "id": 1100,
      "name": "Xã Đồng Lương"
    },
    {
      "id": 1101,
      "name": "Xã Tiên Lương"
    },
    {
      "id": 1102,
      "name": "Xã Vân Bán"
    },
    {
      "id": 1103,
      "name": "Xã Tam Nông"
    },
    {
      "id": 1104,
      "name": "Xã Thọ Văn"
    },
    {
      "id": 1105,
      "name": "Xã Vạn Xuân"
    },
    {
      "id": 1106,
      "name": "Xã Hiền Quan"
    },
    {
      "id": 1107,
      "name": "Xã Thanh Thuỷ"
    },
    {
      "id": 1108,
      "name": "Xã Đào Xá"
    },
    {
      "id": 1109,
      "name": "Xã Tu Vũ"
    },
    {
      "id": 1110,
      "name": "Xã Thanh Sơn"
    },
    {
      "id": 1111,
      "name": "Xã Võ Miếu"
    },
    {
      "id": 1112,
      "name": "Xã Văn Miếu"
    },
    {
      "id": 1113,
      "name": "Xã Cự Đồng"
    },
    {
      "id": 1114,
      "name": "Xã Hương Cần"
    },
    {
      "id": 1115,
      "name": "Xã Yên Sơn"
    },
    {
      "id": 1116,
      "name": "Xã Khả Cửu"
    },
    {
      "id": 1117,
      "name": "Xã Tân Sơn"
    },
    {
      "id": 1118,
      "name": "Xã Minh Đài"
    },
    {
      "id": 1119,
      "name": "Xã Lai Đồng"
    },
    {
      "id": 1120,
      "name": "Xã Thu Cúc"
    },
    {
      "id": 1121,
      "name": "Xã Xuân Đài"
    },
    {
      "id": 1122,
      "name": "Xã Long Cốc"
    },
    {
      "id": 1123,
      "name": "Xã Yên Lập"
    },
    {
      "id": 1124,
      "name": "Xã Thượng Long"
    },
    {
      "id": 1125,
      "name": "Xã Sơn Lương"
    },
    {
      "id": 1126,
      "name": "Xã Xuân Viên"
    },
    {
      "id": 1127,
      "name": "Xã Minh Hòa"
    },
    {
      "id": 1128,
      "name": "Xã Trung Sơn"
    },
    {
      "id": 1129,
      "name": "Xã Tam Sơn"
    },
    {
      "id": 1130,
      "name": "Xã Sông Lô"
    },
    {
      "id": 1131,
      "name": "Xã Hải Lựu"
    },
    {
      "id": 1132,
      "name": "Xã Yên Lãng"
    },
    {
      "id": 1133,
      "name": "Xã Lập Thạch"
    },
    {
      "id": 1134,
      "name": "Xã Tiên Lữ"
    },
    {
      "id": 1135,
      "name": "Xã Thái Hòa"
    },
    {
      "id": 1136,
      "name": "Xã Liên Hòa"
    },
    {
      "id": 1137,
      "name": "Xã Hợp Lý"
    },
    {
      "id": 1138,
      "name": "Xã Sơn Đông"
    },
    {
      "id": 1139,
      "name": "Xã Tam Đảo"
    },
    {
      "id": 1140,
      "name": "Xã Đại Đình"
    },
    {
      "id": 1141,
      "name": "Xã Đạo Trù"
    },
    {
      "id": 1142,
      "name": "Xã Tam Dương"
    },
    {
      "id": 1143,
      "name": "Xã Hội Thịnh"
    },
    {
      "id": 1144,
      "name": "Xã Hoàng An"
    },
    {
      "id": 1145,
      "name": "Xã Tam Dương Bắc"
    },
    {
      "id": 1146,
      "name": "Xã Vĩnh Tường"
    },
    {
      "id": 1147,
      "name": "Xã Thổ Tang"
    },
    {
      "id": 1148,
      "name": "Xã Vĩnh Hưng"
    },
    {
      "id": 1149,
      "name": "Xã Vĩnh An"
    },
    {
      "id": 1150,
      "name": "Xã Vĩnh Phú"
    },
    {
      "id": 1151,
      "name": "Xã Vĩnh Thành"
    },
    {
      "id": 1152,
      "name": "Xã Yên Lạc"
    },
    {
      "id": 1153,
      "name": "Xã Tề Lỗ"
    },
    {
      "id": 1154,
      "name": "Xã Liên Châu"
    },
    {
      "id": 1155,
      "name": "Xã Tam Hồng"
    },
    {
      "id": 1156,
      "name": "Xã Nguyệt Đức"
    },
    {
      "id": 1157,
      "name": "Xã Bình Nguyên"
    },
    {
      "id": 1158,
      "name": "Xã Xuân Lãng"
    },
    {
      "id": 1159,
      "name": "Xã Bình Xuyên"
    },
    {
      "id": 1160,
      "name": "Xã Bình Tuyền"
    },
    {
      "id": 1161,
      "name": "Phường Vĩnh Phúc"
    },
    {
      "id": 1162,
      "name": "Phường Vĩnh Yên"
    },
    {
      "id": 1163,
      "name": "Phường Phúc Yên"
    },
    {
      "id": 1164,
      "name": "Phường Xuân Hòa"
    },
    {
      "id": 1165,
      "name": "Xã Cao Phong"
    },
    {
      "id": 1166,
      "name": "Xã Mường Thàng"
    },
    {
      "id": 1167,
      "name": "Xã Thung Nai"
    },
    {
      "id": 1168,
      "name": "Xã Đà Bắc"
    },
    {
      "id": 1169,
      "name": "Xã Cao Sơn"
    },
    {
      "id": 1170,
      "name": "Xã Đức Nhàn"
    },
    {
      "id": 1171,
      "name": "Xã Quy Đức"
    },
    {
      "id": 1172,
      "name": "Xã Tân Pheo"
    },
    {
      "id": 1173,
      "name": "Xã Tiền Phong"
    },
    {
      "id": 1174,
      "name": "Xã Kim Bôi"
    },
    {
      "id": 1175,
      "name": "Xã Mường Động"
    },
    {
      "id": 1176,
      "name": "Xã Dũng Tiến"
    },
    {
      "id": 1177,
      "name": "Xã Hợp Kim"
    },
    {
      "id": 1178,
      "name": "Xã Nật Sơn"
    },
    {
      "id": 1179,
      "name": "Xã Lạc Sơn"
    },
    {
      "id": 1180,
      "name": "Xã Mường Vang"
    },
    {
      "id": 1181,
      "name": "Xã Đại Đồng"
    },
    {
      "id": 1182,
      "name": "Xã Ngọc Sơn"
    },
    {
      "id": 1183,
      "name": "Xã Nhân Nghĩa"
    },
    {
      "id": 1184,
      "name": "Xã Quyết Thắng"
    },
    {
      "id": 1185,
      "name": "Xã Thượng Cốc"
    },
    {
      "id": 1186,
      "name": "Xã Yên Phú"
    },
    {
      "id": 1187,
      "name": "Xã Lạc Thủy"
    },
    {
      "id": 1188,
      "name": "Xã An Bình"
    },
    {
      "id": 1189,
      "name": "Xã An Nghĩa"
    },
    {
      "id": 1190,
      "name": "Xã Lương Sơn"
    },
    {
      "id": 1191,
      "name": "Xã Cao Dương"
    },
    {
      "id": 1192,
      "name": "Xã Liên Sơn"
    },
    {
      "id": 1193,
      "name": "Xã Mai Châu"
    },
    {
      "id": 1194,
      "name": "Xã Bao La"
    },
    {
      "id": 1195,
      "name": "Xã Mai Hạ"
    },
    {
      "id": 1196,
      "name": "Xã Pà Cò"
    },
    {
      "id": 1197,
      "name": "Xã Tân Mai"
    },
    {
      "id": 1198,
      "name": "Xã Tân Lạc"
    },
    {
      "id": 1199,
      "name": "Xã Mường Bi"
    },
    {
      "id": 1200,
      "name": "Xã Mường Hoa"
    },
    {
      "id": 1201,
      "name": "Xã Toàn Thắng"
    },
    {
      "id": 1202,
      "name": "Xã Vân Sơn"
    },
    {
      "id": 1203,
      "name": "Xã Yên Thủy"
    },
    {
      "id": 1204,
      "name": "Xã Lạc Lương"
    },
    {
      "id": 1205,
      "name": "Xã Yên Trị"
    },
    {
      "id": 1206,
      "name": "Xã Thịnh Minh"
    },
    {
      "id": 1207,
      "name": "Phường Hoà Bình"
    },
    {
      "id": 1208,
      "name": "Phường Kỳ Sơn"
    },
    {
      "id": 1209,
      "name": "Phường Tân Hoà"
    },
    {
      "id": 1210,
      "name": "Phường Thống Nhất"
    }
  ],
  "13": [
    {
      "id": 1211,
      "name": "Xã Mường Phăng"
    },
    {
      "id": 1212,
      "name": "Phường Điện Biên Phủ"
    },
    {
      "id": 1213,
      "name": "Phường Mường Thanh"
    },
    {
      "id": 1214,
      "name": "Phường Mường Lay"
    },
    {
      "id": 1215,
      "name": "Xã Thanh Nưa"
    },
    {
      "id": 1216,
      "name": "Xã Thanh An"
    },
    {
      "id": 1217,
      "name": "Xã Thanh Yên"
    },
    {
      "id": 1218,
      "name": "Xã Sam Mứn"
    },
    {
      "id": 1219,
      "name": "Xã Núa Ngam"
    },
    {
      "id": 1220,
      "name": "Xã Mường Nhà"
    },
    {
      "id": 1221,
      "name": "Xã Tuần Giáo"
    },
    {
      "id": 1222,
      "name": "Xã Quài Tở"
    },
    {
      "id": 1223,
      "name": "Xã Mường Mùn"
    },
    {
      "id": 1224,
      "name": "Xã Pú Nhung"
    },
    {
      "id": 1225,
      "name": "Xã Chiềng Sinh"
    },
    {
      "id": 1226,
      "name": "Xã Tủa Chùa"
    },
    {
      "id": 1227,
      "name": "Xã Sín Chải"
    },
    {
      "id": 1228,
      "name": "Xã Sính Phình"
    },
    {
      "id": 1229,
      "name": "Xã Tủa Thàng"
    },
    {
      "id": 1230,
      "name": "Xã Sáng Nhè"
    },
    {
      "id": 1231,
      "name": "Xã Na Sang"
    },
    {
      "id": 1232,
      "name": "Xã Mường Tùng"
    },
    {
      "id": 1233,
      "name": "Xã Pa Ham"
    },
    {
      "id": 1234,
      "name": "Xã Nậm Nèn"
    },
    {
      "id": 1235,
      "name": "Xã Mường Pồn"
    },
    {
      "id": 1236,
      "name": "Xã Na Son"
    },
    {
      "id": 1237,
      "name": "Xã Xa Dung"
    },
    {
      "id": 1238,
      "name": "Xã Pu Nhi"
    },
    {
      "id": 1239,
      "name": "Xã Mường Luân"
    },
    {
      "id": 1240,
      "name": "Xã Tìa Dình"
    },
    {
      "id": 1241,
      "name": "Xã Phình Giàng"
    },
    {
      "id": 1242,
      "name": "Xã Mường Chà"
    },
    {
      "id": 1243,
      "name": "Xã Nà Hỳ"
    },
    {
      "id": 1244,
      "name": "Xã Nà Bủng"
    },
    {
      "id": 1245,
      "name": "Xã Chà Tở"
    },
    {
      "id": 1246,
      "name": "Xã Si Pa Phìn"
    },
    {
      "id": 1247,
      "name": "Xã Mường Nhé"
    },
    {
      "id": 1248,
      "name": "Xã Sín Thầu"
    },
    {
      "id": 1249,
      "name": "Xã Mường Toong"
    },
    {
      "id": 1250,
      "name": "Xã Nậm Kè"
    },
    {
      "id": 1251,
      "name": "Xã Quảng Lâm"
    },
    {
      "id": 1252,
      "name": "Xã Mường Ảng"
    },
    {
      "id": 1253,
      "name": "Xã Nà Tấu"
    },
    {
      "id": 1254,
      "name": "Xã Búng Lao"
    },
    {
      "id": 1255,
      "name": "Xã Mường Lạn"
    }
  ],
  "14": [
    {
      "id": 1256,
      "name": "Xã Mường Kim"
    },
    {
      "id": 1257,
      "name": "Xã Khoen On"
    },
    {
      "id": 1258,
      "name": "Xã Than Uyên"
    },
    {
      "id": 1259,
      "name": "Xã Mường Than"
    },
    {
      "id": 1260,
      "name": "Xã Pắc Ta"
    },
    {
      "id": 1261,
      "name": "Xã Nậm Sỏ"
    },
    {
      "id": 1262,
      "name": "Xã Tân Uyên"
    },
    {
      "id": 1263,
      "name": "Xã Mường Khoa"
    },
    {
      "id": 1264,
      "name": "Xã Bản Bo"
    },
    {
      "id": 1265,
      "name": "Xã Bình Lư"
    },
    {
      "id": 1266,
      "name": "Xã Tả Lèng"
    },
    {
      "id": 1267,
      "name": "Xã Khun Há"
    },
    {
      "id": 1268,
      "name": "Phường Tân Phong"
    },
    {
      "id": 1269,
      "name": "Phường Đoàn Kết"
    },
    {
      "id": 1270,
      "name": "Xã Sin Suối Hồ"
    },
    {
      "id": 1271,
      "name": "Xã Phong Thổ"
    },
    {
      "id": 1272,
      "name": "Xã Sì Lở Lầu"
    },
    {
      "id": 1273,
      "name": "Xã Dào San"
    },
    {
      "id": 1274,
      "name": "Xã Khổng Lào"
    },
    {
      "id": 1275,
      "name": "Xã Tủa Sín Chải"
    },
    {
      "id": 1276,
      "name": "Xã Sìn Hồ"
    },
    {
      "id": 1277,
      "name": "Xã Hồng Thu"
    },
    {
      "id": 1278,
      "name": "Xã Nậm Tăm"
    },
    {
      "id": 1279,
      "name": "Xã Pu Sam Cáp"
    },
    {
      "id": 1280,
      "name": "Xã Nậm Cuổi"
    },
    {
      "id": 1281,
      "name": "Xã Nậm Mạ"
    },
    {
      "id": 1282,
      "name": "Xã Lê Lợi"
    },
    {
      "id": 1283,
      "name": "Xã Nậm Hàng"
    },
    {
      "id": 1284,
      "name": "Xã Mường Mô"
    },
    {
      "id": 1285,
      "name": "Xã Hua Bum"
    },
    {
      "id": 1286,
      "name": "Xã Pa Tần"
    },
    {
      "id": 1287,
      "name": "Xã Bum Nưa"
    },
    {
      "id": 1288,
      "name": "Xã Bum Tở"
    },
    {
      "id": 1289,
      "name": "Xã Mường Tè"
    },
    {
      "id": 1290,
      "name": "Xã Thu Lũm"
    },
    {
      "id": 1291,
      "name": "Xã Pa Ủ"
    },
    {
      "id": 1292,
      "name": "Xã Tà Tổng"
    },
    {
      "id": 1293,
      "name": "Xã Mù Cả"
    }
  ],
  "15": [
    {
      "id": 1294,
      "name": "Phường Tô Hiệu"
    },
    {
      "id": 1295,
      "name": "Phường Chiềng An"
    },
    {
      "id": 1296,
      "name": "Phường Chiềng Cơi"
    },
    {
      "id": 1297,
      "name": "Phường Chiềng Sinh"
    },
    {
      "id": 1298,
      "name": "Phường Mộc Châu"
    },
    {
      "id": 1299,
      "name": "Phường Mộc Sơn"
    },
    {
      "id": 1300,
      "name": "Phường Vân Sơn"
    },
    {
      "id": 1301,
      "name": "Phường Thảo Nguyên"
    },
    {
      "id": 1302,
      "name": "Xã Đoàn Kết"
    },
    {
      "id": 1303,
      "name": "Xã Lóng Sập"
    },
    {
      "id": 1304,
      "name": "Xã Chiềng Sơn"
    },
    {
      "id": 1305,
      "name": "Xã Vân Hồ"
    },
    {
      "id": 1306,
      "name": "Xã Song Khủa"
    },
    {
      "id": 1307,
      "name": "Xã Tô Múa"
    },
    {
      "id": 1308,
      "name": "Xã Xuân Nha"
    },
    {
      "id": 1309,
      "name": "Xã Quỳnh Nhai"
    },
    {
      "id": 1310,
      "name": "Xã Mường Chiên"
    },
    {
      "id": 1311,
      "name": "Xã Mường Giôn"
    },
    {
      "id": 1312,
      "name": "Xã Mường Sại"
    },
    {
      "id": 1313,
      "name": "Xã Thuận Châu"
    },
    {
      "id": 1314,
      "name": "Xã Chiềng La"
    },
    {
      "id": 1315,
      "name": "Xã Nậm Lầu"
    },
    {
      "id": 1316,
      "name": "Xã Muổi Nọi"
    },
    {
      "id": 1317,
      "name": "Xã Mường Khiêng"
    },
    {
      "id": 1318,
      "name": "Xã Co Mạ"
    },
    {
      "id": 1319,
      "name": "Xã Bình Thuận"
    },
    {
      "id": 1320,
      "name": "Xã Mường É"
    },
    {
      "id": 1321,
      "name": "Xã Long Hẹ"
    },
    {
      "id": 1322,
      "name": "Xã Mường La"
    },
    {
      "id": 1323,
      "name": "Xã Chiềng Lao"
    },
    {
      "id": 1324,
      "name": "Xã Mường Bú"
    },
    {
      "id": 1325,
      "name": "Xã Chiềng Hoa"
    },
    {
      "id": 1326,
      "name": "Xã Bắc Yên"
    },
    {
      "id": 1327,
      "name": "Xã Tà Xùa"
    },
    {
      "id": 1328,
      "name": "Xã Tạ Khoa"
    },
    {
      "id": 1329,
      "name": "Xã Xím Vàng"
    },
    {
      "id": 1330,
      "name": "Xã Pắc Ngà"
    },
    {
      "id": 1331,
      "name": "Xã Chiềng Sại"
    },
    {
      "id": 1332,
      "name": "Xã Phù Yên"
    },
    {
      "id": 1333,
      "name": "Xã Gia Phù"
    },
    {
      "id": 1334,
      "name": "Xã Tường Hạ"
    },
    {
      "id": 1335,
      "name": "Xã Mường Cơi"
    },
    {
      "id": 1336,
      "name": "Xã Mường Bang"
    },
    {
      "id": 1337,
      "name": "Xã Tân Phong"
    },
    {
      "id": 1338,
      "name": "Xã Kim Bon"
    },
    {
      "id": 1339,
      "name": "Xã Yên Châu"
    },
    {
      "id": 1340,
      "name": "Xã Chiềng Hặc"
    },
    {
      "id": 1341,
      "name": "Xã Lóng Phiêng"
    },
    {
      "id": 1342,
      "name": "Xã Yên Sơn"
    },
    {
      "id": 1343,
      "name": "Xã Chiềng Mai"
    },
    {
      "id": 1344,
      "name": "Xã Mai Sơn"
    },
    {
      "id": 1345,
      "name": "Xã Phiêng Pằn"
    },
    {
      "id": 1346,
      "name": "Xã Chiềng Mung"
    },
    {
      "id": 1347,
      "name": "Xã Phiêng Cằm"
    },
    {
      "id": 1348,
      "name": "Xã Mường Chanh"
    },
    {
      "id": 1349,
      "name": "Xã Tà Hộc"
    },
    {
      "id": 1350,
      "name": "Xã Chiềng Sung"
    },
    {
      "id": 1351,
      "name": "Xã Bó Sinh"
    },
    {
      "id": 1352,
      "name": "Xã Chiềng Khương"
    },
    {
      "id": 1353,
      "name": "Xã Mường Hung"
    },
    {
      "id": 1354,
      "name": "Xã Chiềng Khoong"
    },
    {
      "id": 1355,
      "name": "Xã Mường Lầm"
    },
    {
      "id": 1356,
      "name": "Xã Nậm Ty"
    },
    {
      "id": 1357,
      "name": "Xã Sông Mã"
    },
    {
      "id": 1358,
      "name": "Xã Huổi Một"
    },
    {
      "id": 1359,
      "name": "Xã Chiềng Sơ"
    },
    {
      "id": 1360,
      "name": "Xã Sốp Cộp"
    },
    {
      "id": 1361,
      "name": "Xã Púng Bánh"
    },
    {
      "id": 1362,
      "name": "Xã Tân Yên"
    },
    {
      "id": 1363,
      "name": "Xã Mường Bám"
    },
    {
      "id": 1364,
      "name": "Xã Ngọc Chiến"
    },
    {
      "id": 1365,
      "name": "Xã Suối Tọ"
    },
    {
      "id": 1366,
      "name": "Xã Phiêng Khoài"
    },
    {
      "id": 1367,
      "name": "Xã Mường Lạn"
    },
    {
      "id": 1368,
      "name": "Xã Mường Lèo"
    }
  ],
  "16": [
    {
      "id": 1369,
      "name": "Phường Hạc Thành"
    },
    {
      "id": 1370,
      "name": "Phường Quảng Phú"
    },
    {
      "id": 1371,
      "name": "Phường Đông Quang"
    },
    {
      "id": 1372,
      "name": "Phường Đông Sơn"
    },
    {
      "id": 1373,
      "name": "Phường Đông Tiến"
    },
    {
      "id": 1374,
      "name": "Phường Hàm Rồng"
    },
    {
      "id": 1375,
      "name": "Phường Nguyệt Viên"
    },
    {
      "id": 1376,
      "name": "Phường Sầm Sơn"
    },
    {
      "id": 1377,
      "name": "Phường Nam Sầm Sơn"
    },
    {
      "id": 1378,
      "name": "Phường Bỉm Sơn"
    },
    {
      "id": 1379,
      "name": "Phường Quang Trung"
    },
    {
      "id": 1380,
      "name": "Phường Ngọc Sơn"
    },
    {
      "id": 1381,
      "name": "Phường Tân Dân"
    },
    {
      "id": 1382,
      "name": "Phường Hải Lĩnh"
    },
    {
      "id": 1383,
      "name": "Phường Tĩnh Gia"
    },
    {
      "id": 1384,
      "name": "Phường Đào Duy Tư"
    },
    {
      "id": 1385,
      "name": "Phường Hải Bình"
    },
    {
      "id": 1386,
      "name": "Phường Trúc Lâm"
    },
    {
      "id": 1387,
      "name": "Phường Nghi Sơn"
    },
    {
      "id": 1388,
      "name": "Xã Các Sơn"
    },
    {
      "id": 1389,
      "name": "Xã Trường Lâm"
    },
    {
      "id": 1390,
      "name": "Xã Hà Trung"
    },
    {
      "id": 1391,
      "name": "Xã Tống Sơn"
    },
    {
      "id": 1392,
      "name": "Xã Hà Long"
    },
    {
      "id": 1393,
      "name": "Xã Hoạt Giang"
    },
    {
      "id": 1394,
      "name": "Xã Lĩnh Toại"
    },
    {
      "id": 1395,
      "name": "Xã Triệu Lộc"
    },
    {
      "id": 1396,
      "name": "Xã Đông Thành"
    },
    {
      "id": 1397,
      "name": "Xã Hậu Lộc"
    },
    {
      "id": 1398,
      "name": "Xã Hoa Lộc"
    },
    {
      "id": 1399,
      "name": "Xã Vạn Lộc"
    },
    {
      "id": 1400,
      "name": "Xã Nga Sơn"
    },
    {
      "id": 1401,
      "name": "Xã Nga Thắng"
    },
    {
      "id": 1402,
      "name": "Xã Hồ Vương"
    },
    {
      "id": 1403,
      "name": "Xã Tân Tiến"
    },
    {
      "id": 1404,
      "name": "Xã Nga An"
    },
    {
      "id": 1405,
      "name": "Xã Ba Đình"
    },
    {
      "id": 1406,
      "name": "Xã Hoằng Hóa"
    },
    {
      "id": 1407,
      "name": "Xã Hoằng Tiến"
    },
    {
      "id": 1408,
      "name": "Xã Hoằng Thanh"
    },
    {
      "id": 1409,
      "name": "Xã Hoằng Lộc"
    },
    {
      "id": 1410,
      "name": "Xã Hoằng Châu"
    },
    {
      "id": 1411,
      "name": "Xã Hoằng Sơn"
    },
    {
      "id": 1412,
      "name": "Xã Hoằng Phú"
    },
    {
      "id": 1413,
      "name": "Xã Hoằng Giang"
    },
    {
      "id": 1414,
      "name": "Xã Lưu Vệ"
    },
    {
      "id": 1415,
      "name": "Xã Quảng Yên"
    },
    {
      "id": 1416,
      "name": "Xã Quảng Ngọc"
    },
    {
      "id": 1417,
      "name": "Xã Quảng Ninh"
    },
    {
      "id": 1418,
      "name": "Xã Quảng Bình"
    },
    {
      "id": 1419,
      "name": "Xã Tiên Trang"
    },
    {
      "id": 1420,
      "name": "Xã Quảng Chính"
    },
    {
      "id": 1421,
      "name": "Xã Nông Cống"
    },
    {
      "id": 1422,
      "name": "Xã Thắng Lợi"
    },
    {
      "id": 1423,
      "name": "Xã Trung Chính"
    },
    {
      "id": 1424,
      "name": "Xã Trường Văn"
    },
    {
      "id": 1425,
      "name": "Xã Thăng Bình"
    },
    {
      "id": 1426,
      "name": "Xã Tượng Lĩnh"
    },
    {
      "id": 1427,
      "name": "Xã Công Chính"
    },
    {
      "id": 1428,
      "name": "Xã Thiệu Hóa"
    },
    {
      "id": 1429,
      "name": "Xã Thiệu Quang"
    },
    {
      "id": 1430,
      "name": "Xã Thiệu Tiến"
    },
    {
      "id": 1431,
      "name": "Xã Thiệu Toán"
    },
    {
      "id": 1432,
      "name": "Xã Thiệu Trung"
    },
    {
      "id": 1433,
      "name": "Xã Yên Định"
    },
    {
      "id": 1434,
      "name": "Xã Yên Trường"
    },
    {
      "id": 1435,
      "name": "Xã Yên Phú"
    },
    {
      "id": 1436,
      "name": "Xã Quý Lộc"
    },
    {
      "id": 1437,
      "name": "Xã Yên Ninh"
    },
    {
      "id": 1438,
      "name": "Xã Định Tân"
    },
    {
      "id": 1439,
      "name": "Xã Định Hoà"
    },
    {
      "id": 1440,
      "name": "Xã Thọ Xuân"
    },
    {
      "id": 1441,
      "name": "Xã Thọ Long"
    },
    {
      "id": 1442,
      "name": "Xã Xuân Hoà"
    },
    {
      "id": 1443,
      "name": "Xã Sao Vàng"
    },
    {
      "id": 1444,
      "name": "Xã Lam Sơn"
    },
    {
      "id": 1445,
      "name": "Xã Thọ Lập"
    },
    {
      "id": 1446,
      "name": "Xã Xuân Tín"
    },
    {
      "id": 1447,
      "name": "Xã Xuân Lập"
    },
    {
      "id": 1448,
      "name": "Xã Vĩnh Lộc"
    },
    {
      "id": 1449,
      "name": "Xã Tây Đô"
    },
    {
      "id": 1450,
      "name": "Xã Biện Thượng"
    },
    {
      "id": 1451,
      "name": "Xã Triệu Sơn"
    },
    {
      "id": 1452,
      "name": "Xã Thọ Bình"
    },
    {
      "id": 1453,
      "name": "Xã Thọ Ngọc"
    },
    {
      "id": 1454,
      "name": "Xã Thọ Phú"
    },
    {
      "id": 1455,
      "name": "Xã Hợp Tiến"
    },
    {
      "id": 1456,
      "name": "Xã An Nông"
    },
    {
      "id": 1457,
      "name": "Xã Tân Ninh"
    },
    {
      "id": 1458,
      "name": "Xã Đồng Tiến"
    },
    {
      "id": 1459,
      "name": "Xã Mường Chanh"
    },
    {
      "id": 1460,
      "name": "Xã Quang Chiểu"
    },
    {
      "id": 1461,
      "name": "Xã Tam chung"
    },
    {
      "id": 1462,
      "name": "Xã Mường Lát"
    },
    {
      "id": 1463,
      "name": "Xã Pù Nhi"
    },
    {
      "id": 1464,
      "name": "Xã Nhi Sơn"
    },
    {
      "id": 1465,
      "name": "Xã Mường Lý"
    },
    {
      "id": 1466,
      "name": "Xã Trung Lý"
    },
    {
      "id": 1467,
      "name": "Xã Hồi Xuân"
    },
    {
      "id": 1468,
      "name": "Xã Nam Xuân"
    },
    {
      "id": 1469,
      "name": "Xã Thiên Phủ"
    },
    {
      "id": 1470,
      "name": "Xã Hiền Kiệt"
    },
    {
      "id": 1471,
      "name": "Xã Phú Xuân"
    },
    {
      "id": 1472,
      "name": "Xã Phú Lệ"
    },
    {
      "id": 1473,
      "name": "Xã Trung Thành"
    },
    {
      "id": 1474,
      "name": "Xã Trung Sơn"
    },
    {
      "id": 1475,
      "name": "Xã Na Mèo"
    },
    {
      "id": 1476,
      "name": "Xã Sơn Thủy"
    },
    {
      "id": 1477,
      "name": "Xã Sơn Điện"
    },
    {
      "id": 1478,
      "name": "Xã Mường Mìn"
    },
    {
      "id": 1479,
      "name": "Xã Tam Thanh"
    },
    {
      "id": 1480,
      "name": "Xã Tam Lư"
    },
    {
      "id": 1481,
      "name": "Xã Quan Sơn"
    },
    {
      "id": 1482,
      "name": "Xã Trung Hạ"
    },
    {
      "id": 1483,
      "name": "Xã Linh Sơn"
    },
    {
      "id": 1484,
      "name": "Xã Đồng Lương"
    },
    {
      "id": 1485,
      "name": "Xã Văn Phú"
    },
    {
      "id": 1486,
      "name": "Xã Giao An"
    },
    {
      "id": 1487,
      "name": "Xã Yên Khương"
    },
    {
      "id": 1488,
      "name": "Xã Yên Thắng"
    },
    {
      "id": 1489,
      "name": "Xã Văn Nho"
    },
    {
      "id": 1490,
      "name": "Xã Thiết Ống"
    },
    {
      "id": 1491,
      "name": "Xã Bá Thước"
    },
    {
      "id": 1492,
      "name": "Xã Cổ Lũng"
    },
    {
      "id": 1493,
      "name": "Xã Pù Luông"
    },
    {
      "id": 1494,
      "name": "Xã Điền Lư"
    },
    {
      "id": 1495,
      "name": "Xã Điền Quang"
    },
    {
      "id": 1496,
      "name": "Xã Quý Lương"
    },
    {
      "id": 1497,
      "name": "Xã Ngọc Lặc"
    },
    {
      "id": 1498,
      "name": "Xã Thạch Lập"
    },
    {
      "id": 1499,
      "name": "Xã Ngọc Liên"
    },
    {
      "id": 1500,
      "name": "Xã Minh Sơn"
    },
    {
      "id": 1501,
      "name": "Xã Nguyệt Ấn"
    },
    {
      "id": 1502,
      "name": "Xã Kiên Thọ"
    },
    {
      "id": 1503,
      "name": "Xã Cẩm Thạch"
    },
    {
      "id": 1504,
      "name": "Xã Cẩm Thủy"
    },
    {
      "id": 1505,
      "name": "Xã Cẩm Tú"
    },
    {
      "id": 1506,
      "name": "Xã Cẩm Vân"
    },
    {
      "id": 1507,
      "name": "Xã Cẩm Tân"
    },
    {
      "id": 1508,
      "name": "Xã Kim Tân"
    },
    {
      "id": 1509,
      "name": "Xã Vân Du"
    },
    {
      "id": 1510,
      "name": "Xã Ngọc Trạo"
    },
    {
      "id": 1511,
      "name": "Xã Thạch Bình"
    },
    {
      "id": 1512,
      "name": "Xã Thành Vinh"
    },
    {
      "id": 1513,
      "name": "Xã Thạch Quảng"
    },
    {
      "id": 1514,
      "name": "Xã Như Xuân"
    },
    {
      "id": 1515,
      "name": "Xã Thượng Ninh"
    },
    {
      "id": 1516,
      "name": "Xã Xuân Bình"
    },
    {
      "id": 1517,
      "name": "Xã Hóa Quỳ"
    },
    {
      "id": 1518,
      "name": "Xã Thanh Quân"
    },
    {
      "id": 1519,
      "name": "Xã Thanh Phong"
    },
    {
      "id": 1520,
      "name": "Xã Xuân Du"
    },
    {
      "id": 1521,
      "name": "Xã Mậu Lâm"
    },
    {
      "id": 1522,
      "name": "Xã Như Thanh"
    },
    {
      "id": 1523,
      "name": "Xã Yên Thọ"
    },
    {
      "id": 1524,
      "name": "Xã Xuân Thái"
    },
    {
      "id": 1525,
      "name": "Xã Thanh Kỳ"
    },
    {
      "id": 1526,
      "name": "Xã Bát Mọt"
    },
    {
      "id": 1527,
      "name": "Xã Yên Nhân"
    },
    {
      "id": 1528,
      "name": "Xã Lương Sơn"
    },
    {
      "id": 1529,
      "name": "Xã Thường Xuân"
    },
    {
      "id": 1530,
      "name": "Xã Luận Thành"
    },
    {
      "id": 1531,
      "name": "Xã Tân Thành"
    },
    {
      "id": 1532,
      "name": "Xã Vạn Xuân"
    },
    {
      "id": 1533,
      "name": "Xã Thắng Lộc"
    },
    {
      "id": 1534,
      "name": "Xã Xuân Chinh"
    }
  ],
  "17": [
    {
      "id": 1535,
      "name": "Xã Anh Sơn"
    },
    {
      "id": 1536,
      "name": "Xã Yên Xuân"
    },
    {
      "id": 1537,
      "name": "Xã Nhân Hoà"
    },
    {
      "id": 1538,
      "name": "Xã Anh Sơn Đông"
    },
    {
      "id": 1539,
      "name": "Xã Vĩnh Tường"
    },
    {
      "id": 1540,
      "name": "Xã Thành Bình Thọ"
    },
    {
      "id": 1541,
      "name": "Xã Con Cuông"
    },
    {
      "id": 1542,
      "name": "Xã Môn Sơn"
    },
    {
      "id": 1543,
      "name": "Xã Mậu Thạch"
    },
    {
      "id": 1544,
      "name": "Xã Cam Phục"
    },
    {
      "id": 1545,
      "name": "Xã Châu Khê"
    },
    {
      "id": 1546,
      "name": "Xã Bình Chuẩn"
    },
    {
      "id": 1547,
      "name": "Xã Diễn Châu"
    },
    {
      "id": 1548,
      "name": "Xã Đức Châu"
    },
    {
      "id": 1549,
      "name": "Xã Quảng Châu"
    },
    {
      "id": 1550,
      "name": "Xã Hải Châu"
    },
    {
      "id": 1551,
      "name": "Xã Tân Châu"
    },
    {
      "id": 1552,
      "name": "Xã An Châu"
    },
    {
      "id": 1553,
      "name": "Xã Minh Châu"
    },
    {
      "id": 1554,
      "name": "Xã Hùng Châu"
    },
    {
      "id": 1555,
      "name": "Xã Đô Lương"
    },
    {
      "id": 1556,
      "name": "Xã Bạch Ngọc"
    },
    {
      "id": 1557,
      "name": "Xã Văn Hiến"
    },
    {
      "id": 1558,
      "name": "Xã Bạch Hà"
    },
    {
      "id": 1559,
      "name": "Xã Thuần Trung"
    },
    {
      "id": 1560,
      "name": "Xã Lương Sơn"
    },
    {
      "id": 1561,
      "name": "Phường Hoàng Mai"
    },
    {
      "id": 1562,
      "name": "Phường Tân Mai"
    },
    {
      "id": 1563,
      "name": "Phường Quỳnh Mai"
    },
    {
      "id": 1564,
      "name": "Xã Hưng Nguyên"
    },
    {
      "id": 1565,
      "name": "Xã Yên Trung"
    },
    {
      "id": 1566,
      "name": "Xã Hưng Nguyên Nam"
    },
    {
      "id": 1567,
      "name": "Xã Lam Thành"
    },
    {
      "id": 1568,
      "name": "Xã Mường Xén"
    },
    {
      "id": 1569,
      "name": "Xã Hữu Kiệm"
    },
    {
      "id": 1570,
      "name": "Xã Nậm Cắn"
    },
    {
      "id": 1571,
      "name": "Xã Chiêu Lưu"
    },
    {
      "id": 1572,
      "name": "Xã Na Loi"
    },
    {
      "id": 1573,
      "name": "Xã Mường Típ"
    },
    {
      "id": 1574,
      "name": "Xã Na Ngoi"
    },
    {
      "id": 1575,
      "name": "Xã Mỹ Lý"
    },
    {
      "id": 1576,
      "name": "Xã Bắc Lý"
    },
    {
      "id": 1577,
      "name": "Xã Keng Đu"
    },
    {
      "id": 1578,
      "name": "Xã Huồi Tụ"
    },
    {
      "id": 1579,
      "name": "Xã Mường Lống"
    },
    {
      "id": 1580,
      "name": "Xã Vạn An"
    },
    {
      "id": 1581,
      "name": "Xã Nam Đàn"
    },
    {
      "id": 1582,
      "name": "Xã Đại Huệ"
    },
    {
      "id": 1583,
      "name": "Xã Thiên Nhẫn"
    },
    {
      "id": 1584,
      "name": "Xã Kim Liên"
    },
    {
      "id": 1585,
      "name": "Xã Nghĩa Đàn"
    },
    {
      "id": 1586,
      "name": "Xã Nghĩa Thọ"
    },
    {
      "id": 1587,
      "name": "Xã Nghĩa Lâm"
    },
    {
      "id": 1588,
      "name": "Xã Nghĩa Mai"
    },
    {
      "id": 1589,
      "name": "Xã Nghĩa Hưng"
    },
    {
      "id": 1590,
      "name": "Xã Nghĩa Khánh"
    },
    {
      "id": 1591,
      "name": "Xã Nghĩa Lộc"
    },
    {
      "id": 1592,
      "name": "Xã Nghi Lộc"
    },
    {
      "id": 1593,
      "name": "Xã Phúc Lộc"
    },
    {
      "id": 1594,
      "name": "Xã Đông Lộc"
    },
    {
      "id": 1595,
      "name": "Xã Trung Lộc"
    },
    {
      "id": 1596,
      "name": "Xã Thần Lĩnh"
    },
    {
      "id": 1597,
      "name": "Xã Hải Lộc"
    },
    {
      "id": 1598,
      "name": "Xã Văn Kiều"
    },
    {
      "id": 1599,
      "name": "Xã Quế Phong"
    },
    {
      "id": 1600,
      "name": "Xã Tiền Phong"
    },
    {
      "id": 1601,
      "name": "Xã Tri Lễ"
    },
    {
      "id": 1602,
      "name": "Xã Mường Quàng"
    },
    {
      "id": 1603,
      "name": "Xã Thông Thụ"
    },
    {
      "id": 1604,
      "name": "Xã Quỳ Châu"
    },
    {
      "id": 1605,
      "name": "Xã Châu Tiến"
    },
    {
      "id": 1606,
      "name": "Xã Hùng Chân"
    },
    {
      "id": 1607,
      "name": "Xã Châu Bình"
    },
    {
      "id": 1608,
      "name": "Xã Quỳ Hợp"
    },
    {
      "id": 1609,
      "name": "Xã Tam Hợp"
    },
    {
      "id": 1610,
      "name": "Xã Châu Lộc"
    },
    {
      "id": 1611,
      "name": "Xã Châu Hồng"
    },
    {
      "id": 1612,
      "name": "Xã Mường Ham"
    },
    {
      "id": 1613,
      "name": "Xã Mường Chọng"
    },
    {
      "id": 1614,
      "name": "Xã Minh Hợp"
    },
    {
      "id": 1615,
      "name": "Xã Quỳnh Lưu"
    },
    {
      "id": 1616,
      "name": "Xã Quỳnh Văn"
    },
    {
      "id": 1617,
      "name": "Xã Quỳnh Anh"
    },
    {
      "id": 1618,
      "name": "Xã Quỳnh Tam"
    },
    {
      "id": 1619,
      "name": "Xã Quỳnh Phú"
    },
    {
      "id": 1620,
      "name": "Xã Quỳnh Sơn"
    },
    {
      "id": 1621,
      "name": "Xã Quỳnh Thắng"
    },
    {
      "id": 1622,
      "name": "Xã Tân Kỳ"
    },
    {
      "id": 1623,
      "name": "Xã Tân Phú"
    },
    {
      "id": 1624,
      "name": "Xã Tân An"
    },
    {
      "id": 1625,
      "name": "Xã Nghĩa Đồng"
    },
    {
      "id": 1626,
      "name": "Xã Giai Xuân"
    },
    {
      "id": 1627,
      "name": "Xã Nghĩa Hành"
    },
    {
      "id": 1628,
      "name": "Xã Tiên Đồng"
    },
    {
      "id": 1629,
      "name": "Phường Thái Hoà"
    },
    {
      "id": 1630,
      "name": "Phường Tây Hiếu"
    },
    {
      "id": 1631,
      "name": "Xã Đông Hiếu"
    },
    {
      "id": 1632,
      "name": "Xã Cát Ngạn"
    },
    {
      "id": 1633,
      "name": "Xã Tam Đồng"
    },
    {
      "id": 1634,
      "name": "Xã Hạnh Lâm"
    },
    {
      "id": 1635,
      "name": "Xã Sơn Lâm"
    },
    {
      "id": 1636,
      "name": "Xã Hoa Quân"
    },
    {
      "id": 1637,
      "name": "Xã Kim Bảng"
    },
    {
      "id": 1638,
      "name": "Xã Bích Hào"
    },
    {
      "id": 1639,
      "name": "Xã Đại Đồng"
    },
    {
      "id": 1640,
      "name": "Xã Xuân Lâm"
    },
    {
      "id": 1641,
      "name": "Xã Tam Quang"
    },
    {
      "id": 1642,
      "name": "Xã Tam Thái"
    },
    {
      "id": 1643,
      "name": "Xã Tương Dương"
    },
    {
      "id": 1644,
      "name": "Xã Lượng Minh"
    },
    {
      "id": 1645,
      "name": "Xã Yên Na"
    },
    {
      "id": 1646,
      "name": "Xã Yên Hoà"
    },
    {
      "id": 1647,
      "name": "Xã Nga My"
    },
    {
      "id": 1648,
      "name": "Xã Hữu Khuông"
    },
    {
      "id": 1649,
      "name": "Xã Nhôn Mai"
    },
    {
      "id": 1650,
      "name": "Phường Trường Vinh"
    },
    {
      "id": 1651,
      "name": "Phường Thành Vinh"
    },
    {
      "id": 1652,
      "name": "Phường Vinh Hưng"
    },
    {
      "id": 1653,
      "name": "Phường Vinh Phú"
    },
    {
      "id": 1654,
      "name": "Phường Vinh Lộc"
    },
    {
      "id": 1655,
      "name": "Phường Cửa Lò"
    },
    {
      "id": 1656,
      "name": "Xã Yên Thành"
    },
    {
      "id": 1657,
      "name": "Xã Quan Thành"
    },
    {
      "id": 1658,
      "name": "Xã Hợp Minh"
    },
    {
      "id": 1659,
      "name": "Xã Vân Tụ"
    },
    {
      "id": 1660,
      "name": "Xã Vân Du"
    },
    {
      "id": 1661,
      "name": "Xã Quang Đồng"
    },
    {
      "id": 1662,
      "name": "Xã Giai Lạc"
    },
    {
      "id": 1663,
      "name": "Xã Bình Minh"
    },
    {
      "id": 1664,
      "name": "Xã Đông Thành"
    }
  ],
  "18": [
    {
      "id": 1665,
      "name": "Phường Sông Trí"
    },
    {
      "id": 1666,
      "name": "Phường Hải Ninh"
    },
    {
      "id": 1667,
      "name": "Phường Hoành Sơn"
    },
    {
      "id": 1668,
      "name": "Phường Vũng Áng"
    },
    {
      "id": 1669,
      "name": "Xã Kỳ Xuân"
    },
    {
      "id": 1670,
      "name": "Xã Kỳ Anh"
    },
    {
      "id": 1671,
      "name": "Xã Kỳ Hoa"
    },
    {
      "id": 1672,
      "name": "Xã Kỳ Văn"
    },
    {
      "id": 1673,
      "name": "Xã Kỳ Khang"
    },
    {
      "id": 1674,
      "name": "Xã Kỳ Lạc"
    },
    {
      "id": 1675,
      "name": "Xã Kỳ Thượng"
    },
    {
      "id": 1676,
      "name": "Xã Cẩm Xuyên"
    },
    {
      "id": 1677,
      "name": "Xã Thiên Cầm"
    },
    {
      "id": 1678,
      "name": "Xã Cẩm Duệ"
    },
    {
      "id": 1679,
      "name": "Xã Cẩm Hưng"
    },
    {
      "id": 1680,
      "name": "Xã Cẩm Lạc"
    },
    {
      "id": 1681,
      "name": "Xã Cẩm Trung"
    },
    {
      "id": 1682,
      "name": "Xã Yên Hoà"
    },
    {
      "id": 1683,
      "name": "Phường Thành Sen"
    },
    {
      "id": 1684,
      "name": "Phường Trần Phú"
    },
    {
      "id": 1685,
      "name": "Phường Hà Huy Tập"
    },
    {
      "id": 1686,
      "name": "Xã Thạch Lạc"
    },
    {
      "id": 1687,
      "name": "Xã Đồng Tiến"
    },
    {
      "id": 1688,
      "name": "Xã Thạch Khê"
    },
    {
      "id": 1689,
      "name": "Xã Cẩm Bình"
    },
    {
      "id": 1690,
      "name": "Xã Thạch Hà"
    },
    {
      "id": 1691,
      "name": "Xã Toàn Lưu"
    },
    {
      "id": 1692,
      "name": "Xã Việt Xuyên"
    },
    {
      "id": 1693,
      "name": "Xã Đông Kinh"
    },
    {
      "id": 1694,
      "name": "Xã Thạch Xuân"
    },
    {
      "id": 1695,
      "name": "Xã Lộc Hà"
    },
    {
      "id": 1696,
      "name": "Xã Hồng Lộc"
    },
    {
      "id": 1697,
      "name": "Xã Mai Phụ"
    },
    {
      "id": 1698,
      "name": "Xã Can Lộc"
    },
    {
      "id": 1699,
      "name": "Xã Tùng Lộc"
    },
    {
      "id": 1700,
      "name": "Xã Gia Hanh"
    },
    {
      "id": 1701,
      "name": "Xã Trường Lưu"
    },
    {
      "id": 1702,
      "name": "Xã Xuân Lộc"
    },
    {
      "id": 1703,
      "name": "Xã Đồng Lộc"
    },
    {
      "id": 1704,
      "name": "Phường Bắc Hồng Lĩnh"
    },
    {
      "id": 1705,
      "name": "Phường Nam Hồng Lĩnh"
    },
    {
      "id": 1706,
      "name": "Xã Tiên Điền"
    },
    {
      "id": 1707,
      "name": "Xã Nghi Xuân"
    },
    {
      "id": 1708,
      "name": "Xã Cổ Đạm"
    },
    {
      "id": 1709,
      "name": "Xã Đan Hải"
    },
    {
      "id": 1710,
      "name": "Xã Đức Thọ"
    },
    {
      "id": 1711,
      "name": "Xã Đức Quang"
    },
    {
      "id": 1712,
      "name": "Xã Đức Đồng"
    },
    {
      "id": 1713,
      "name": "Xã Đức Thịnh"
    },
    {
      "id": 1714,
      "name": "Xã Đức Minh"
    },
    {
      "id": 1715,
      "name": "Xã Hương Sơn"
    },
    {
      "id": 1716,
      "name": "Xã Sơn Tây"
    },
    {
      "id": 1717,
      "name": "Xã Tứ Mỹ"
    },
    {
      "id": 1718,
      "name": "Xã Sơn Giang"
    },
    {
      "id": 1719,
      "name": "Xã Sơn Tiến"
    },
    {
      "id": 1720,
      "name": "Xã Sơn Hồng"
    },
    {
      "id": 1721,
      "name": "Xã Kim Hoa"
    },
    {
      "id": 1722,
      "name": "Xã Vũ Quang"
    },
    {
      "id": 1723,
      "name": "Xã Mai Hoa"
    },
    {
      "id": 1724,
      "name": "Xã Thượng Đức"
    },
    {
      "id": 1725,
      "name": "Xã Hương Khê"
    },
    {
      "id": 1726,
      "name": "Xã Hương Phố"
    },
    {
      "id": 1727,
      "name": "Xã Hương Đô"
    },
    {
      "id": 1728,
      "name": "Xã Hà Linh"
    },
    {
      "id": 1729,
      "name": "Xã Hương Bình"
    },
    {
      "id": 1730,
      "name": "Xã Phúc Trạch"
    },
    {
      "id": 1731,
      "name": "Xã Hương Xuân"
    },
    {
      "id": 1732,
      "name": "Xã Sơn Kim 1"
    },
    {
      "id": 1733,
      "name": "Xã Sơn Kim 2"
    }
  ],
  "19": [
    {
      "id": 1734,
      "name": "Phường Đồng Hới"
    },
    {
      "id": 1735,
      "name": "Phường Đồng Thuận"
    },
    {
      "id": 1736,
      "name": "Phường Đồng Sơn"
    },
    {
      "id": 1737,
      "name": "Xã Nam Gianh"
    },
    {
      "id": 1738,
      "name": "Xã Nam Ba Đồn"
    },
    {
      "id": 1739,
      "name": "Phường Ba Đồn"
    },
    {
      "id": 1740,
      "name": "Phường Bắc Gianh"
    },
    {
      "id": 1741,
      "name": "Xã Dân Hóa"
    },
    {
      "id": 1742,
      "name": "Xã Kim Điền"
    },
    {
      "id": 1743,
      "name": "Xã Kim Phú"
    },
    {
      "id": 1744,
      "name": "Xã Minh Hóa"
    },
    {
      "id": 1745,
      "name": "Xã Tân Thành"
    },
    {
      "id": 1746,
      "name": "Xã Tuyên Lâm"
    },
    {
      "id": 1747,
      "name": "Xã Tuyên Sơn"
    },
    {
      "id": 1748,
      "name": "Xã Đồng Lê"
    },
    {
      "id": 1749,
      "name": "Xã Tuyên Phú"
    },
    {
      "id": 1750,
      "name": "Xã Tuyên Bình"
    },
    {
      "id": 1751,
      "name": "Xã Tuyên Hóa"
    },
    {
      "id": 1752,
      "name": "Xã Tân Gianh"
    },
    {
      "id": 1753,
      "name": "Xã Trung Thuần"
    },
    {
      "id": 1754,
      "name": "Xã Quảng Trạch"
    },
    {
      "id": 1755,
      "name": "Xã Hoà Trạch"
    },
    {
      "id": 1756,
      "name": "Xã Phú Trạch"
    },
    {
      "id": 1757,
      "name": "Xã Thượng Trạch"
    },
    {
      "id": 1758,
      "name": "Xã Phong Nha"
    },
    {
      "id": 1759,
      "name": "Xã Bắc Trạch"
    },
    {
      "id": 1760,
      "name": "Xã Đông Trạch"
    },
    {
      "id": 1761,
      "name": "Xã Hoàn Lão"
    },
    {
      "id": 1762,
      "name": "Xã Bố Trạch"
    },
    {
      "id": 1763,
      "name": "Xã Nam Trạch"
    },
    {
      "id": 1764,
      "name": "Xã Quảng Ninh"
    },
    {
      "id": 1765,
      "name": "Xã Ninh Châu"
    },
    {
      "id": 1766,
      "name": "Xã Trường Ninh"
    },
    {
      "id": 1767,
      "name": "Xã Trường Sơn"
    },
    {
      "id": 1768,
      "name": "Xã Lệ Thủy"
    },
    {
      "id": 1769,
      "name": "Xã Cam Hồng"
    },
    {
      "id": 1770,
      "name": "Xã Sen Ngư"
    },
    {
      "id": 1771,
      "name": "Xã Tân Mỹ"
    },
    {
      "id": 1772,
      "name": "Xã Trường Phú"
    },
    {
      "id": 1773,
      "name": "Xã Lệ Ninh"
    },
    {
      "id": 1774,
      "name": "Xã Kim Ngân"
    },
    {
      "id": 1775,
      "name": "Phường Đông Hà"
    },
    {
      "id": 1776,
      "name": "Phường Nam Đông Hà"
    },
    {
      "id": 1777,
      "name": "Phường Quảng Trị"
    },
    {
      "id": 1778,
      "name": "Xã Vĩnh Linh"
    },
    {
      "id": 1779,
      "name": "Xã Cửa Tùng"
    },
    {
      "id": 1780,
      "name": "Xã Vĩnh Hoàng"
    },
    {
      "id": 1781,
      "name": "Xã Vĩnh Thủy"
    },
    {
      "id": 1782,
      "name": "Xã Bến Quan"
    },
    {
      "id": 1783,
      "name": "Xã Cồn Tiên"
    },
    {
      "id": 1784,
      "name": "Xã Cửa Việt"
    },
    {
      "id": 1785,
      "name": "Xã Gio Linh"
    },
    {
      "id": 1786,
      "name": "Xã Bến Hải"
    },
    {
      "id": 1787,
      "name": "Xã Hướng Lập"
    },
    {
      "id": 1788,
      "name": "Xã Hướng Phùng"
    },
    {
      "id": 1789,
      "name": "Xã Khe Sanh"
    },
    {
      "id": 1790,
      "name": "Xã Tân Lập"
    },
    {
      "id": 1791,
      "name": "Xã Lao Bảo"
    },
    {
      "id": 1792,
      "name": "Xã Lìa"
    },
    {
      "id": 1793,
      "name": "Xã A Dơi"
    },
    {
      "id": 1794,
      "name": "Xã La Lay"
    },
    {
      "id": 1795,
      "name": "Xã Tà Rụt"
    },
    {
      "id": 1796,
      "name": "Xã Đakrông"
    },
    {
      "id": 1797,
      "name": "Xã Ba Lòng"
    },
    {
      "id": 1798,
      "name": "Xã Hướng Hiệp"
    },
    {
      "id": 1799,
      "name": "Xã Cam Lộ"
    },
    {
      "id": 1800,
      "name": "Xã Hiếu Giang"
    },
    {
      "id": 1801,
      "name": "Xã Triệu Phong"
    },
    {
      "id": 1802,
      "name": "Xã Ái Tử"
    },
    {
      "id": 1803,
      "name": "Xã Triệu Bình"
    },
    {
      "id": 1804,
      "name": "Xã Triệu Cơ"
    },
    {
      "id": 1805,
      "name": "Xã Nam Cửa Việt"
    },
    {
      "id": 1806,
      "name": "Xã Diên Sanh"
    },
    {
      "id": 1807,
      "name": "Xã Mỹ Thủy"
    },
    {
      "id": 1808,
      "name": "Xã Hải Lăng"
    },
    {
      "id": 1809,
      "name": "Xã Vĩnh Định"
    },
    {
      "id": 1810,
      "name": "Xã Nam Hải Lăng"
    },
    {
      "id": 1811,
      "name": "Đặc khu Cồn Cỏ"
    }
  ],
  "20": [
    {
      "id": 1812,
      "name": "Phường Thuận An"
    },
    {
      "id": 1813,
      "name": "Phường Hóa Châu"
    },
    {
      "id": 1814,
      "name": "Phường Mỹ Thượng"
    },
    {
      "id": 1815,
      "name": "Phường Vỹ Dạ"
    },
    {
      "id": 1816,
      "name": "Phường Thuận Hóa"
    },
    {
      "id": 1817,
      "name": "Phường An Cựu"
    },
    {
      "id": 1818,
      "name": "Phường Thủy Xuân"
    },
    {
      "id": 1819,
      "name": "Phường Kim Long"
    },
    {
      "id": 1820,
      "name": "Phường Hương An"
    },
    {
      "id": 1821,
      "name": "Phường Phú Xuân"
    },
    {
      "id": 1822,
      "name": "Phường Hương Trà"
    },
    {
      "id": 1823,
      "name": "Phường Kim Trà"
    },
    {
      "id": 1824,
      "name": "Phường Thanh Thủy"
    },
    {
      "id": 1825,
      "name": "Phường Hương Thủy"
    },
    {
      "id": 1826,
      "name": "Phường Phú Bài"
    },
    {
      "id": 1827,
      "name": "Phường Phong Điền"
    },
    {
      "id": 1828,
      "name": "Phường Phong Thái"
    },
    {
      "id": 1829,
      "name": "Phường Phong Dinh"
    },
    {
      "id": 1830,
      "name": "Phường Phong Phú"
    },
    {
      "id": 1831,
      "name": "Phường Phong Quảng"
    },
    {
      "id": 1832,
      "name": "Xã Đan Điền"
    },
    {
      "id": 1833,
      "name": "Xã Quảng Điền"
    },
    {
      "id": 1834,
      "name": "Xã Phú Vinh"
    },
    {
      "id": 1835,
      "name": "Xã Phú Hồ"
    },
    {
      "id": 1836,
      "name": "Xã Phú Vang"
    },
    {
      "id": 1837,
      "name": "Xã Vinh Lộc"
    },
    {
      "id": 1838,
      "name": "Xã Hưng Lộc"
    },
    {
      "id": 1839,
      "name": "Xã Lộc An"
    },
    {
      "id": 1840,
      "name": "Xã Phú Lộc"
    },
    {
      "id": 1841,
      "name": "Xã Chân Mây – Lăng Cô"
    },
    {
      "id": 1842,
      "name": "Xã Long Quảng"
    },
    {
      "id": 1843,
      "name": "Xã Nam Đông"
    },
    {
      "id": 1844,
      "name": "Xã Khe Tre"
    },
    {
      "id": 1845,
      "name": "Xã Bình Điền"
    },
    {
      "id": 1846,
      "name": "Xã A Lưới 1"
    },
    {
      "id": 1847,
      "name": "Xã A Lưới 2"
    },
    {
      "id": 1848,
      "name": "Xã A Lưới 3"
    },
    {
      "id": 1849,
      "name": "Xã A Lưới 4"
    },
    {
      "id": 1850,
      "name": "Xã A Lưới 5"
    },
    {
      "id": 1851,
      "name": "Phường Dương Nỗ"
    }
  ],
  "21": [
    {
      "id": 1852,
      "name": "Phường Hải Châu"
    },
    {
      "id": 1853,
      "name": "Phường Hoà Cường"
    },
    {
      "id": 1854,
      "name": "Phường Thanh Khê"
    },
    {
      "id": 1855,
      "name": "Phường An Khê"
    },
    {
      "id": 1856,
      "name": "Phường An Hải"
    },
    {
      "id": 1857,
      "name": "Phường Sơn Trà"
    },
    {
      "id": 1858,
      "name": "Phường Ngũ Hành Sơn"
    },
    {
      "id": 1859,
      "name": "Phường Hoà Khánh"
    },
    {
      "id": 1860,
      "name": "Phường Hải Vân"
    },
    {
      "id": 1861,
      "name": "Phường Liên Chiểu"
    },
    {
      "id": 1862,
      "name": "Phường Cẩm Lệ"
    },
    {
      "id": 1863,
      "name": "Phường Hoà Xuân"
    },
    {
      "id": 1864,
      "name": "Xã Hoà Vang"
    },
    {
      "id": 1865,
      "name": "Xã Hoà Tiến"
    },
    {
      "id": 1866,
      "name": "Xã Bà Nà"
    },
    {
      "id": 1867,
      "name": "Đặc khu Hoàng Sa"
    },
    {
      "id": 1868,
      "name": "Xã Núi Thành"
    },
    {
      "id": 1869,
      "name": "Xã Tam Mỹ"
    },
    {
      "id": 1870,
      "name": "Xã Tam Anh"
    },
    {
      "id": 1871,
      "name": "Xã Đức Phú"
    },
    {
      "id": 1872,
      "name": "Xã Tam Xuân"
    },
    {
      "id": 1873,
      "name": "Xã Tam Hải"
    },
    {
      "id": 1874,
      "name": "Phường Tam Kỳ"
    },
    {
      "id": 1875,
      "name": "Phường Quảng Phú"
    },
    {
      "id": 1876,
      "name": "Phường Hương Trà"
    },
    {
      "id": 1877,
      "name": "Phường Bàn Thạch"
    },
    {
      "id": 1878,
      "name": "Xã Tây Hồ"
    },
    {
      "id": 1879,
      "name": "Xã Chiên Đàn"
    },
    {
      "id": 1880,
      "name": "Xã Phú Ninh"
    },
    {
      "id": 1881,
      "name": "Xã Lãnh Ngọc"
    },
    {
      "id": 1882,
      "name": "Xã Tiên Phước"
    },
    {
      "id": 1883,
      "name": "Xã Thạnh Bình"
    },
    {
      "id": 1884,
      "name": "Xã Sơn Cẩm Hà"
    },
    {
      "id": 1885,
      "name": "Xã Trà Liên"
    },
    {
      "id": 1886,
      "name": "Xã Trà Giáp"
    },
    {
      "id": 1887,
      "name": "Xã Trà Tân"
    },
    {
      "id": 1888,
      "name": "Xã Trà Đốc"
    },
    {
      "id": 1889,
      "name": "Xã Trà My"
    },
    {
      "id": 1890,
      "name": "Xã Nam Trà My"
    },
    {
      "id": 1891,
      "name": "Xã Trà Tập"
    },
    {
      "id": 1892,
      "name": "Xã Trà Vân"
    },
    {
      "id": 1893,
      "name": "Xã Trà Linh"
    },
    {
      "id": 1894,
      "name": "Xã Trà Leng"
    },
    {
      "id": 1895,
      "name": "Xã Thăng Bình"
    },
    {
      "id": 1896,
      "name": "Xã Thăng An"
    },
    {
      "id": 1897,
      "name": "Xã Thăng Trường"
    },
    {
      "id": 1898,
      "name": "Xã Thăng Điền"
    },
    {
      "id": 1899,
      "name": "Xã Thăng Phú"
    },
    {
      "id": 1900,
      "name": "Xã Đồng Dương"
    },
    {
      "id": 1901,
      "name": "Xã Quế Sơn Trung"
    },
    {
      "id": 1902,
      "name": "Xã Quế Sơn"
    },
    {
      "id": 1903,
      "name": "Xã Xuân Phú"
    },
    {
      "id": 1904,
      "name": "Xã Nông Sơn"
    },
    {
      "id": 1905,
      "name": "Xã Quế Phước"
    },
    {
      "id": 1906,
      "name": "Xã Duy Nghĩa"
    },
    {
      "id": 1907,
      "name": "Xã Nam Phước"
    },
    {
      "id": 1908,
      "name": "Xã Duy Xuyên"
    },
    {
      "id": 1909,
      "name": "Xã Thu Bồn"
    },
    {
      "id": 1910,
      "name": "Phường Điện Bàn"
    },
    {
      "id": 1911,
      "name": "Phường Điện Bàn Đông"
    },
    {
      "id": 1912,
      "name": "Phường An Thắng"
    },
    {
      "id": 1913,
      "name": "Phường Điện Bàn Bắc"
    },
    {
      "id": 1914,
      "name": "Xã Điện Bàn Tây"
    },
    {
      "id": 1915,
      "name": "Xã Gò Nổi"
    },
    {
      "id": 1916,
      "name": "Phường Hội An"
    },
    {
      "id": 1917,
      "name": "Phường Hội An Đông"
    },
    {
      "id": 1918,
      "name": "Phường Hội An Tây"
    },
    {
      "id": 1919,
      "name": "Xã Tân Hiệp"
    },
    {
      "id": 1920,
      "name": "Xã Đại Lộc"
    },
    {
      "id": 1921,
      "name": "Xã Hà Nha"
    },
    {
      "id": 1922,
      "name": "Xã Thượng Đức"
    },
    {
      "id": 1923,
      "name": "Xã Vu Gia"
    },
    {
      "id": 1924,
      "name": "Xã Phú Thuận"
    },
    {
      "id": 1925,
      "name": "Xã Thạnh Mỹ"
    },
    {
      "id": 1926,
      "name": "Xã Bến Giằng"
    },
    {
      "id": 1927,
      "name": "Xã Nam Giang"
    },
    {
      "id": 1928,
      "name": "Xã Đắc Pring"
    },
    {
      "id": 1929,
      "name": "Xã La Dêê"
    },
    {
      "id": 1930,
      "name": "Xã La Êê"
    },
    {
      "id": 1931,
      "name": "Xã Sông Vàng"
    },
    {
      "id": 1932,
      "name": "Xã Sông Kôn"
    },
    {
      "id": 1933,
      "name": "Xã Đông Giang"
    },
    {
      "id": 1934,
      "name": "Xã Bến Hiên"
    },
    {
      "id": 1935,
      "name": "Xã Avương"
    },
    {
      "id": 1936,
      "name": "Xã Tây Giang"
    },
    {
      "id": 1937,
      "name": "Xã Hùng Sơn"
    },
    {
      "id": 1938,
      "name": "Xã Hiệp Đức"
    },
    {
      "id": 1939,
      "name": "Xã Việt An"
    },
    {
      "id": 1940,
      "name": "Xã Phước Trà"
    },
    {
      "id": 1941,
      "name": "Xã Khâm Đức"
    },
    {
      "id": 1942,
      "name": "Xã Phước Năng"
    },
    {
      "id": 1943,
      "name": "Xã Phước Chánh"
    },
    {
      "id": 1944,
      "name": "Xã Phước Thành"
    },
    {
      "id": 1945,
      "name": "Xã Phước Hiệp"
    }
  ],
  "22": [
    {
      "id": 1946,
      "name": "Xã Tịnh Khê"
    },
    {
      "id": 1947,
      "name": "Phường Trương Quang Trọng"
    },
    {
      "id": 1948,
      "name": "Xã An Phú"
    },
    {
      "id": 1949,
      "name": "Phường Cẩm Thành"
    },
    {
      "id": 1950,
      "name": "Phường Nghĩa Lộ"
    },
    {
      "id": 1951,
      "name": "Phường Trà Câu"
    },
    {
      "id": 1952,
      "name": "Xã Nguyễn Nghiêm"
    },
    {
      "id": 1953,
      "name": "Phường Đức Phổ"
    },
    {
      "id": 1954,
      "name": "Xã Khánh Cường"
    },
    {
      "id": 1955,
      "name": "Phường Sa Huỳnh"
    },
    {
      "id": 1956,
      "name": "Xã Bình Minh"
    },
    {
      "id": 1957,
      "name": "Xã Bình Chương"
    },
    {
      "id": 1958,
      "name": "Xã Bình Sơn"
    },
    {
      "id": 1959,
      "name": "Xã Vạn Tường"
    },
    {
      "id": 1960,
      "name": "Xã Đông Sơn"
    },
    {
      "id": 1961,
      "name": "Xã Trường Giang"
    },
    {
      "id": 1962,
      "name": "Xã Ba Gia"
    },
    {
      "id": 1963,
      "name": "Xã Sơn Tịnh"
    },
    {
      "id": 1964,
      "name": "Xã Thọ Phong"
    },
    {
      "id": 1965,
      "name": "Xã Tư Nghĩa"
    },
    {
      "id": 1966,
      "name": "Xã Vệ Giang"
    },
    {
      "id": 1967,
      "name": "Xã Nghĩa Giang"
    },
    {
      "id": 1968,
      "name": "Xã Trà Giang"
    },
    {
      "id": 1969,
      "name": "Xã Nghĩa Hành"
    },
    {
      "id": 1970,
      "name": "Xã Đình Cương"
    },
    {
      "id": 1971,
      "name": "Xã Thiện Tín"
    },
    {
      "id": 1972,
      "name": "Xã Phước Giang"
    },
    {
      "id": 1973,
      "name": "Xã Long Phụng"
    },
    {
      "id": 1974,
      "name": "Xã Mỏ Cày"
    },
    {
      "id": 1975,
      "name": "Xã Mộ Đức"
    },
    {
      "id": 1976,
      "name": "Xã Lân Phong"
    },
    {
      "id": 1977,
      "name": "Xã Trà Bồng"
    },
    {
      "id": 1978,
      "name": "Xã Đông Trà Bồng"
    },
    {
      "id": 1979,
      "name": "Xã Tây Trà"
    },
    {
      "id": 1980,
      "name": "Xã Thanh Bồng"
    },
    {
      "id": 1981,
      "name": "Xã Cà Đam"
    },
    {
      "id": 1982,
      "name": "Xã Tây Trà Bồng"
    },
    {
      "id": 1983,
      "name": "Xã Sơn Hạ"
    },
    {
      "id": 1984,
      "name": "Xã Sơn Linh"
    },
    {
      "id": 1985,
      "name": "Xã Sơn Hà"
    },
    {
      "id": 1986,
      "name": "Xã Sơn Thủy"
    },
    {
      "id": 1987,
      "name": "Xã Sơn Kỳ"
    },
    {
      "id": 1988,
      "name": "Xã Sơn Tây"
    },
    {
      "id": 1989,
      "name": "Xã Sơn Tây Thượng"
    },
    {
      "id": 1990,
      "name": "Xã Sơn Tây Hạ"
    },
    {
      "id": 1991,
      "name": "Xã Minh Long"
    },
    {
      "id": 1992,
      "name": "Xã Sơn Mai"
    },
    {
      "id": 1993,
      "name": "Xã Ba Vì"
    },
    {
      "id": 1994,
      "name": "Xã Ba Tô"
    },
    {
      "id": 1995,
      "name": "Xã Ba Dinh"
    },
    {
      "id": 1996,
      "name": "Xã Ba Tơ"
    },
    {
      "id": 1997,
      "name": "Xã Ba Vinh"
    },
    {
      "id": 1998,
      "name": "Xã Ba Động"
    },
    {
      "id": 1999,
      "name": "Xã Đặng Thùy Trâm"
    },
    {
      "id": 2000,
      "name": "Xã Ba Xa"
    },
    {
      "id": 2001,
      "name": "Đặc khu Lý Sơn"
    },
    {
      "id": 2002,
      "name": "Phường Kon Tum"
    },
    {
      "id": 2003,
      "name": "Phường Đăk Cấm"
    },
    {
      "id": 2004,
      "name": "Phường Đăk BLa"
    },
    {
      "id": 2005,
      "name": "Xã Ngọk Bay"
    },
    {
      "id": 2006,
      "name": "Xã Ia Chim"
    },
    {
      "id": 2007,
      "name": "Xã Đăk Rơ Wa"
    },
    {
      "id": 2008,
      "name": "Xã Đăk Pxi"
    },
    {
      "id": 2009,
      "name": "Xã Đăk Mar"
    },
    {
      "id": 2010,
      "name": "Xã Đăk Ui"
    },
    {
      "id": 2011,
      "name": "Xã Ngọk Réo"
    },
    {
      "id": 2012,
      "name": "Xã Đăk Hà"
    },
    {
      "id": 2013,
      "name": "Xã Ngọk Tụ"
    },
    {
      "id": 2014,
      "name": "Xã Đăk Tô"
    },
    {
      "id": 2015,
      "name": "Xã Kon Đào"
    },
    {
      "id": 2016,
      "name": "Xã Đăk Sao"
    },
    {
      "id": 2017,
      "name": "Xã Đăk Tờ Kan"
    },
    {
      "id": 2018,
      "name": "Xã Tu Mơ Rông"
    },
    {
      "id": 2019,
      "name": "Xã Măng Ri"
    },
    {
      "id": 2020,
      "name": "Xã Bờ Y"
    },
    {
      "id": 2021,
      "name": "Xã Sa Loong"
    },
    {
      "id": 2022,
      "name": "Xã Dục Nông"
    },
    {
      "id": 2023,
      "name": "Xã Xốp"
    },
    {
      "id": 2024,
      "name": "Xã Ngọc Linh"
    },
    {
      "id": 2025,
      "name": "Xã Đăk Plô"
    },
    {
      "id": 2026,
      "name": "Xã Đăk Pék"
    },
    {
      "id": 2027,
      "name": "Xã Đăk Môn"
    },
    {
      "id": 2028,
      "name": "Xã Sa Thầy"
    },
    {
      "id": 2029,
      "name": "Xã Sa Bình"
    },
    {
      "id": 2030,
      "name": "Xã Ya Ly"
    },
    {
      "id": 2031,
      "name": "Xã Ia Tơi"
    },
    {
      "id": 2032,
      "name": "Xã Đăk Kôi"
    },
    {
      "id": 2033,
      "name": "Xã Kon Braih"
    },
    {
      "id": 2034,
      "name": "Xã Đăk Rve"
    },
    {
      "id": 2035,
      "name": "Xã Măng Đen"
    },
    {
      "id": 2036,
      "name": "Xã Măng Bút"
    },
    {
      "id": 2037,
      "name": "Xã Kon Plông"
    },
    {
      "id": 2038,
      "name": "Xã Đăk Long"
    },
    {
      "id": 2039,
      "name": "Xã Rờ Kơi"
    },
    {
      "id": 2040,
      "name": "Xã Mô Rai"
    },
    {
      "id": 2041,
      "name": "Xã Ia Đal"
    }
  ],
  "23": [
    {
      "id": 2042,
      "name": "Phường Nha Trang"
    },
    {
      "id": 2043,
      "name": "Phường Bắc Nha Trang"
    },
    {
      "id": 2044,
      "name": "Phường Tây Nha Trang"
    },
    {
      "id": 2045,
      "name": "Phường Nam Nha Trang"
    },
    {
      "id": 2046,
      "name": "Phường Bắc Cam Ranh"
    },
    {
      "id": 2047,
      "name": "Phường Cam Ranh"
    },
    {
      "id": 2048,
      "name": "Phường Cam Linh"
    },
    {
      "id": 2049,
      "name": "Phường Ba Ngòi"
    },
    {
      "id": 2050,
      "name": "Xã Nam Cam Ranh"
    },
    {
      "id": 2051,
      "name": "Xã Bắc Ninh Hoà"
    },
    {
      "id": 2052,
      "name": "Phường Ninh Hoà"
    },
    {
      "id": 2053,
      "name": "Xã Tân Định"
    },
    {
      "id": 2054,
      "name": "Phường Đông Ninh Hoà"
    },
    {
      "id": 2055,
      "name": "Phường Hoà Thắng"
    },
    {
      "id": 2056,
      "name": "Xã Nam Ninh Hoà"
    },
    {
      "id": 2057,
      "name": "Xã Tây Ninh Hoà"
    },
    {
      "id": 2058,
      "name": "Xã Hoà Trí"
    },
    {
      "id": 2059,
      "name": "Xã Đại Lãnh"
    },
    {
      "id": 2060,
      "name": "Xã Tu Bông"
    },
    {
      "id": 2061,
      "name": "Xã Vạn Thắng"
    },
    {
      "id": 2062,
      "name": "Xã Vạn Ninh"
    },
    {
      "id": 2063,
      "name": "Xã Vạn Hưng"
    },
    {
      "id": 2064,
      "name": "Xã Diên Khánh"
    },
    {
      "id": 2065,
      "name": "Xã Diên Lạc"
    },
    {
      "id": 2066,
      "name": "Xã Diên Điền"
    },
    {
      "id": 2067,
      "name": "Xã Diên Lâm"
    },
    {
      "id": 2068,
      "name": "Xã Diên Thọ"
    },
    {
      "id": 2069,
      "name": "Xã Suối Hiệp"
    },
    {
      "id": 2070,
      "name": "Xã Cam Lâm"
    },
    {
      "id": 2071,
      "name": "Xã Suối Dầu"
    },
    {
      "id": 2072,
      "name": "Xã Cam Hiệp"
    },
    {
      "id": 2073,
      "name": "Xã Cam An"
    },
    {
      "id": 2074,
      "name": "Xã Bắc Khánh Vĩnh"
    },
    {
      "id": 2075,
      "name": "Xã Trung Khánh Vĩnh"
    },
    {
      "id": 2076,
      "name": "Xã Tây Khánh Vĩnh"
    },
    {
      "id": 2077,
      "name": "Xã Nam Khánh Vĩnh"
    },
    {
      "id": 2078,
      "name": "Xã Khánh Vĩnh"
    },
    {
      "id": 2079,
      "name": "Xã Khánh Sơn"
    },
    {
      "id": 2080,
      "name": "Xã Tây Khánh Sơn"
    },
    {
      "id": 2081,
      "name": "Xã Đông Khánh Sơn"
    },
    {
      "id": 2082,
      "name": "Đặc khu Trường Sa"
    },
    {
      "id": 2083,
      "name": "Phường Phan Rang"
    },
    {
      "id": 2084,
      "name": "Phường Đông Hải"
    },
    {
      "id": 2085,
      "name": "Phường Ninh Chử"
    },
    {
      "id": 2086,
      "name": "Phường Bảo An"
    },
    {
      "id": 2087,
      "name": "Phường Đô Vinh"
    },
    {
      "id": 2088,
      "name": "Xã Ninh Phước"
    },
    {
      "id": 2089,
      "name": "Xã Phước Hữu"
    },
    {
      "id": 2090,
      "name": "Xã Phước Hậu"
    },
    {
      "id": 2091,
      "name": "Xã Thuận Nam"
    },
    {
      "id": 2092,
      "name": "Xã Cà Ná"
    },
    {
      "id": 2093,
      "name": "Xã Phước Hà"
    },
    {
      "id": 2094,
      "name": "Xã Phước Dinh"
    },
    {
      "id": 2095,
      "name": "Xã Ninh Hải"
    },
    {
      "id": 2096,
      "name": "Xã Xuân Hải"
    },
    {
      "id": 2097,
      "name": "Xã Vĩnh Hải"
    },
    {
      "id": 2098,
      "name": "Xã Thuận Bắc"
    },
    {
      "id": 2099,
      "name": "Xã Công Hải"
    },
    {
      "id": 2100,
      "name": "Xã Ninh Sơn"
    },
    {
      "id": 2101,
      "name": "Xã Lâm Sơn"
    },
    {
      "id": 2102,
      "name": "Xã Anh Dũng"
    },
    {
      "id": 2103,
      "name": "Xã Mỹ Sơn"
    },
    {
      "id": 2104,
      "name": "Xã Bác Ái Đông"
    },
    {
      "id": 2105,
      "name": "Xã Bác Ái"
    },
    {
      "id": 2106,
      "name": "Xã Bác Ái Tây"
    }
  ],
  "24": [
    {
      "id": 2107,
      "name": "Phường Quy Nhơn"
    },
    {
      "id": 2108,
      "name": "Phường Quy Nhơn Đông"
    },
    {
      "id": 2109,
      "name": "Phường Quy Nhơn Tây"
    },
    {
      "id": 2110,
      "name": "Phường Quy Nhơn Nam"
    },
    {
      "id": 2111,
      "name": "Phường Quy Nhơn Bắc"
    },
    {
      "id": 2112,
      "name": "Phường Bình Định"
    },
    {
      "id": 2113,
      "name": "Phường An Nhơn"
    },
    {
      "id": 2114,
      "name": "Phường An Nhơn Đông"
    },
    {
      "id": 2115,
      "name": "Phường An Nhơn Nam"
    },
    {
      "id": 2116,
      "name": "Phường An Nhơn Bắc"
    },
    {
      "id": 2117,
      "name": "Xã An Nhơn Tây"
    },
    {
      "id": 2118,
      "name": "Phường Bồng Sơn"
    },
    {
      "id": 2119,
      "name": "Phường Hoài Nhơn"
    },
    {
      "id": 2120,
      "name": "Phường Tam Quan"
    },
    {
      "id": 2121,
      "name": "Phường Hoài Nhơn Đông"
    },
    {
      "id": 2122,
      "name": "Phường Hoài Nhơn Tây"
    },
    {
      "id": 2123,
      "name": "Phường Hoài Nhơn Nam"
    },
    {
      "id": 2124,
      "name": "Phường Hoài Nhơn Bắc"
    },
    {
      "id": 2125,
      "name": "Xã Phù Cát"
    },
    {
      "id": 2126,
      "name": "Xã Xuân An"
    },
    {
      "id": 2127,
      "name": "Xã Ngô Mây"
    },
    {
      "id": 2128,
      "name": "Xã Cát Tiến"
    },
    {
      "id": 2129,
      "name": "Xã Đề Gi"
    },
    {
      "id": 2130,
      "name": "Xã Hoà Hội"
    },
    {
      "id": 2131,
      "name": "Xã Hội Sơn"
    },
    {
      "id": 2132,
      "name": "Xã Phù Mỹ"
    },
    {
      "id": 2133,
      "name": "Xã An Lương"
    },
    {
      "id": 2134,
      "name": "Xã Bình Dương"
    },
    {
      "id": 2135,
      "name": "Xã Phù Mỹ Đông"
    },
    {
      "id": 2136,
      "name": "Xã Phù Mỹ Tây"
    },
    {
      "id": 2137,
      "name": "Xã Phù Mỹ Nam"
    },
    {
      "id": 2138,
      "name": "Xã Phù Mỹ Bắc"
    },
    {
      "id": 2139,
      "name": "Xã Tuy Phước"
    },
    {
      "id": 2140,
      "name": "Xã Tuy Phước Đông"
    },
    {
      "id": 2141,
      "name": "Xã Tuy Phước Tây"
    },
    {
      "id": 2142,
      "name": "Xã Tuy Phước Bắc"
    },
    {
      "id": 2143,
      "name": "Xã Tây Sơn"
    },
    {
      "id": 2144,
      "name": "Xã Bình Khê"
    },
    {
      "id": 2145,
      "name": "Xã Bình Phú"
    },
    {
      "id": 2146,
      "name": "Xã Bình Hiệp"
    },
    {
      "id": 2147,
      "name": "Xã Bình An"
    },
    {
      "id": 2148,
      "name": "Xã Hoài Ân"
    },
    {
      "id": 2149,
      "name": "Xã Ân Tường"
    },
    {
      "id": 2150,
      "name": "Xã Kim Sơn"
    },
    {
      "id": 2151,
      "name": "Xã Vạn Đức"
    },
    {
      "id": 2152,
      "name": "Xã Ân Hảo"
    },
    {
      "id": 2153,
      "name": "Xã Vân Canh"
    },
    {
      "id": 2154,
      "name": "Xã Canh Vinh"
    },
    {
      "id": 2155,
      "name": "Xã Canh Liên"
    },
    {
      "id": 2156,
      "name": "Xã Vĩnh Thạnh"
    },
    {
      "id": 2157,
      "name": "Xã Vĩnh Thịnh"
    },
    {
      "id": 2158,
      "name": "Xã Vĩnh Quang"
    },
    {
      "id": 2159,
      "name": "Xã Vĩnh Sơn"
    },
    {
      "id": 2160,
      "name": "Xã An Hoà"
    },
    {
      "id": 2161,
      "name": "Xã An Lão"
    },
    {
      "id": 2162,
      "name": "Xã An Vinh"
    },
    {
      "id": 2163,
      "name": "Xã An Toàn"
    },
    {
      "id": 2164,
      "name": "Phường Pleiku"
    },
    {
      "id": 2165,
      "name": "Phường Hội Phú"
    },
    {
      "id": 2166,
      "name": "Phường Thống Nhất"
    },
    {
      "id": 2167,
      "name": "Phường Diên Hồng"
    },
    {
      "id": 2168,
      "name": "Phường An Phú"
    },
    {
      "id": 2169,
      "name": "Xã Biển Hồ"
    },
    {
      "id": 2170,
      "name": "Xã Gào"
    },
    {
      "id": 2171,
      "name": "Xã Ia Ly"
    },
    {
      "id": 2172,
      "name": "Xã Chư Păh"
    },
    {
      "id": 2173,
      "name": "Xã Ia Khươl"
    },
    {
      "id": 2174,
      "name": "Xã Ia Phí"
    },
    {
      "id": 2175,
      "name": "Xã Chư Prông"
    },
    {
      "id": 2176,
      "name": "Xã Bàu Cạn"
    },
    {
      "id": 2177,
      "name": "Xã Ia Boòng"
    },
    {
      "id": 2178,
      "name": "Xã Ia Lâu"
    },
    {
      "id": 2179,
      "name": "Xã Ia Pia"
    },
    {
      "id": 2180,
      "name": "Xã Ia Tôr"
    },
    {
      "id": 2181,
      "name": "Xã Chư Sê"
    },
    {
      "id": 2182,
      "name": "Xã Bờ Ngoong"
    },
    {
      "id": 2183,
      "name": "Xã Ia Ko"
    },
    {
      "id": 2184,
      "name": "Xã Albá"
    },
    {
      "id": 2185,
      "name": "Xã Chư Pưh"
    },
    {
      "id": 2186,
      "name": "Xã Ia Le"
    },
    {
      "id": 2187,
      "name": "Xã Ia Hrú"
    },
    {
      "id": 2188,
      "name": "Phường An Khê"
    },
    {
      "id": 2189,
      "name": "Phường An Bình"
    },
    {
      "id": 2190,
      "name": "Xã Cửu An"
    },
    {
      "id": 2191,
      "name": "Xã Đak Pơ"
    },
    {
      "id": 2192,
      "name": "Xã Ya Hội"
    },
    {
      "id": 2193,
      "name": "Xã Kbang"
    },
    {
      "id": 2194,
      "name": "Xã Kông Bơ La"
    },
    {
      "id": 2195,
      "name": "Xã Tơ Tung"
    },
    {
      "id": 2196,
      "name": "Xã Sơn Lang"
    },
    {
      "id": 2197,
      "name": "Xã Đak Rong"
    },
    {
      "id": 2198,
      "name": "Xã Kông Chro"
    },
    {
      "id": 2199,
      "name": "Xã Ya Ma"
    },
    {
      "id": 2200,
      "name": "Xã Chư Krey"
    },
    {
      "id": 2201,
      "name": "Xã SRó"
    },
    {
      "id": 2202,
      "name": "Xã Đăk Song"
    },
    {
      "id": 2203,
      "name": "Xã Chơ Long"
    },
    {
      "id": 2204,
      "name": "Phường Ayun Pa"
    },
    {
      "id": 2205,
      "name": "Xã Ia Rbol"
    },
    {
      "id": 2206,
      "name": "Xã Ia Sao"
    },
    {
      "id": 2207,
      "name": "Xã Phú Thiện"
    },
    {
      "id": 2208,
      "name": "Xã Chư A Thai"
    },
    {
      "id": 2209,
      "name": "Xã Ia Hiao"
    },
    {
      "id": 2210,
      "name": "Xã Pờ Tó"
    },
    {
      "id": 2211,
      "name": "Xã Ia Pa"
    },
    {
      "id": 2212,
      "name": "Xã Ia Tul"
    },
    {
      "id": 2213,
      "name": "Xã Phú Túc"
    },
    {
      "id": 2214,
      "name": "Xã Ia Dreh"
    },
    {
      "id": 2215,
      "name": "Xã Ia Rsai"
    },
    {
      "id": 2216,
      "name": "Xã Uar"
    },
    {
      "id": 2217,
      "name": "Xã Đak Đoa"
    },
    {
      "id": 2218,
      "name": "Xã Kon Gang"
    },
    {
      "id": 2219,
      "name": "Xã Ia Băng"
    },
    {
      "id": 2220,
      "name": "Xã KDang"
    },
    {
      "id": 2221,
      "name": "Xã Đak Sơmei"
    },
    {
      "id": 2222,
      "name": "Xã Mang Yang"
    },
    {
      "id": 2223,
      "name": "Xã Lơ Pang"
    },
    {
      "id": 2224,
      "name": "Xã Kon Chiêng"
    },
    {
      "id": 2225,
      "name": "Xã Hra"
    },
    {
      "id": 2226,
      "name": "Xã Ayun"
    },
    {
      "id": 2227,
      "name": "Xã Ia Grai"
    },
    {
      "id": 2228,
      "name": "Xã Ia Krái"
    },
    {
      "id": 2229,
      "name": "Xã Ia Hrung"
    },
    {
      "id": 2230,
      "name": "Xã Đức Cơ"
    },
    {
      "id": 2231,
      "name": "Xã Ia Dơk"
    },
    {
      "id": 2232,
      "name": "Xã Ia Krêl"
    },
    {
      "id": 2233,
      "name": "Xã Nhơn Châu"
    },
    {
      "id": 2234,
      "name": "Xã Ia Púch"
    },
    {
      "id": 2235,
      "name": "Xã Ia Mơ"
    },
    {
      "id": 2236,
      "name": "Xã Ia Pnôn"
    },
    {
      "id": 2237,
      "name": "Xã Ia Nan"
    },
    {
      "id": 2238,
      "name": "Xã Ia Dom"
    },
    {
      "id": 2239,
      "name": "Xã Ia Chia"
    },
    {
      "id": 2240,
      "name": "Xã Ia O"
    },
    {
      "id": 2241,
      "name": "Xã Krong"
    }
  ],
  "25": [
    {
      "id": 2242,
      "name": "Xã Hoà Phú"
    },
    {
      "id": 2243,
      "name": "Phường Buôn Ma Thuột"
    },
    {
      "id": 2244,
      "name": "Phường Tân An"
    },
    {
      "id": 2245,
      "name": "Phường Tân Lập"
    },
    {
      "id": 2246,
      "name": "Phường Thành Nhất"
    },
    {
      "id": 2247,
      "name": "Phường Ea Kao"
    },
    {
      "id": 2248,
      "name": "Xã Ea Drông"
    },
    {
      "id": 2249,
      "name": "Phường Buôn Hồ"
    },
    {
      "id": 2250,
      "name": "Phường Cư Bao"
    },
    {
      "id": 2251,
      "name": "Xã Ea Súp"
    },
    {
      "id": 2252,
      "name": "Xã Ea Rốk"
    },
    {
      "id": 2253,
      "name": "Xã Ea Bung"
    },
    {
      "id": 2254,
      "name": "Xã Ia Rvê"
    },
    {
      "id": 2255,
      "name": "Xã Ia Lốp"
    },
    {
      "id": 2256,
      "name": "Xã Ea Wer"
    },
    {
      "id": 2257,
      "name": "Xã Ea Nuôl"
    },
    {
      "id": 2258,
      "name": "Xã Buôn Đôn"
    },
    {
      "id": 2259,
      "name": "Xã Ea Kiết"
    },
    {
      "id": 2260,
      "name": "Xã Ea M’Droh"
    },
    {
      "id": 2261,
      "name": "Xã Quảng Phú"
    },
    {
      "id": 2262,
      "name": "Xã Cuôr Đăng"
    },
    {
      "id": 2263,
      "name": "Xã Cư M’gar"
    },
    {
      "id": 2264,
      "name": "Xã Ea Tul"
    },
    {
      "id": 2265,
      "name": "Xã Pơng Drang"
    },
    {
      "id": 2266,
      "name": "Xã Krông Búk"
    },
    {
      "id": 2267,
      "name": "Xã Cư Pơng"
    },
    {
      "id": 2268,
      "name": "Xã Ea Khăl"
    },
    {
      "id": 2269,
      "name": "Xã Ea Drăng"
    },
    {
      "id": 2270,
      "name": "Xã Ea Wy"
    },
    {
      "id": 2271,
      "name": "Xã Ea H’leo"
    },
    {
      "id": 2272,
      "name": "Xã Ea Hiao"
    },
    {
      "id": 2273,
      "name": "Xã Krông Năng"
    },
    {
      "id": 2274,
      "name": "Xã Dliê Ya"
    },
    {
      "id": 2275,
      "name": "Xã Tam Giang"
    },
    {
      "id": 2276,
      "name": "Xã Phú Xuân"
    },
    {
      "id": 2277,
      "name": "Xã Krông Pắc"
    },
    {
      "id": 2278,
      "name": "Xã Ea Knuếc"
    },
    {
      "id": 2279,
      "name": "Xã Tân Tiến"
    },
    {
      "id": 2280,
      "name": "Xã Ea Phê"
    },
    {
      "id": 2281,
      "name": "Xã Ea Kly"
    },
    {
      "id": 2282,
      "name": "Xã Vụ Bổn"
    },
    {
      "id": 2283,
      "name": "Xã Ea Kar"
    },
    {
      "id": 2284,
      "name": "Xã Ea Ô"
    },
    {
      "id": 2285,
      "name": "Xã Ea Knốp"
    },
    {
      "id": 2286,
      "name": "Xã Cư Yang"
    },
    {
      "id": 2287,
      "name": "Xã Ea Păl"
    },
    {
      "id": 2288,
      "name": "Xã M’Drắk"
    },
    {
      "id": 2289,
      "name": "Xã Ea Riêng"
    },
    {
      "id": 2290,
      "name": "Xã Cư M’ta"
    },
    {
      "id": 2291,
      "name": "Xã Krông Á"
    },
    {
      "id": 2292,
      "name": "Xã Cư Prao"
    },
    {
      "id": 2293,
      "name": "Xã Ea Trang"
    },
    {
      "id": 2294,
      "name": "Xã Hoà Sơn"
    },
    {
      "id": 2295,
      "name": "Xã Dang Kang"
    },
    {
      "id": 2296,
      "name": "Xã Krông Bông"
    },
    {
      "id": 2297,
      "name": "Xã Yang Mao"
    },
    {
      "id": 2298,
      "name": "Xã Cư Pui"
    },
    {
      "id": 2299,
      "name": "Xã Liên Sơn Lắk"
    },
    {
      "id": 2300,
      "name": "Xã Đắk Liêng"
    },
    {
      "id": 2301,
      "name": "Xã Nam Ka"
    },
    {
      "id": 2302,
      "name": "Xã Đắk Phơi"
    },
    {
      "id": 2303,
      "name": "Xã Krông Nô"
    },
    {
      "id": 2304,
      "name": "Xã Ea Ning"
    },
    {
      "id": 2305,
      "name": "Xã Dray Bhăng"
    },
    {
      "id": 2306,
      "name": "Xã Ea Ktur"
    },
    {
      "id": 2307,
      "name": "Xã Krông Ana"
    },
    {
      "id": 2308,
      "name": "Xã Dur Kmăl"
    },
    {
      "id": 2309,
      "name": "Xã Ea Na"
    },
    {
      "id": 2310,
      "name": "Phường Tuy Hòa"
    },
    {
      "id": 2311,
      "name": "Phường Phú Yên"
    },
    {
      "id": 2312,
      "name": "Phường Bình Kiến"
    },
    {
      "id": 2313,
      "name": "Xã Xuân Thọ"
    },
    {
      "id": 2314,
      "name": "Xã Xuân Cảnh"
    },
    {
      "id": 2315,
      "name": "Xã Xuân Lộc"
    },
    {
      "id": 2316,
      "name": "Phường Xuân Đài"
    },
    {
      "id": 2317,
      "name": "Phường Sông Cầu"
    },
    {
      "id": 2318,
      "name": "Xã Hòa Xuân"
    },
    {
      "id": 2319,
      "name": "Phường Đông Hòa"
    },
    {
      "id": 2320,
      "name": "Phường Hòa Hiệp"
    },
    {
      "id": 2321,
      "name": "Xã Tuy An Bắc"
    },
    {
      "id": 2322,
      "name": "Xã Tuy An Đông"
    },
    {
      "id": 2323,
      "name": "Xã Ô Loan"
    },
    {
      "id": 2324,
      "name": "Xã Tuy An Nam"
    },
    {
      "id": 2325,
      "name": "Xã Tuy An Tây"
    },
    {
      "id": 2326,
      "name": "Xã Phú Hòa 1"
    },
    {
      "id": 2327,
      "name": "Xã Phú Hòa 2"
    },
    {
      "id": 2328,
      "name": "Xã Tây Hòa"
    },
    {
      "id": 2329,
      "name": "Xã Hòa Thịnh"
    },
    {
      "id": 2330,
      "name": "Xã Hòa Mỹ"
    },
    {
      "id": 2331,
      "name": "Xã Sơn Thành"
    },
    {
      "id": 2332,
      "name": "Xã Sơn Hòa"
    },
    {
      "id": 2333,
      "name": "Xã Vân Hòa"
    },
    {
      "id": 2334,
      "name": "Xã Tây Sơn"
    },
    {
      "id": 2335,
      "name": "Xã Suối Trai"
    },
    {
      "id": 2336,
      "name": "Xã Ea Ly"
    },
    {
      "id": 2337,
      "name": "Xã Ea Bá"
    },
    {
      "id": 2338,
      "name": "Xã Đức Bình"
    },
    {
      "id": 2339,
      "name": "Xã Sông Hinh"
    },
    {
      "id": 2340,
      "name": "Xã Xuân Lãnh"
    },
    {
      "id": 2341,
      "name": "Xã Phú Mỡ"
    },
    {
      "id": 2342,
      "name": "Xã Xuân Phước"
    },
    {
      "id": 2343,
      "name": "Xã Đồng Xuân"
    }
  ],
  "26": [
    {
      "id": 2344,
      "name": "Phường Xuân Hương - Đà Lạt"
    },
    {
      "id": 2345,
      "name": "Phường Cam Ly - Đà Lạt"
    },
    {
      "id": 2346,
      "name": "Phường Lâm Viên - Đà Lạt"
    },
    {
      "id": 2347,
      "name": "Phường Xuân Trường - Đà Lạt"
    },
    {
      "id": 2348,
      "name": "Phường Langbiang - Đà Lạt"
    },
    {
      "id": 2349,
      "name": "Phường 1 Bảo Lộc"
    },
    {
      "id": 2350,
      "name": "Phường 2 Bảo Lộc"
    },
    {
      "id": 2351,
      "name": "Phường 3 Bảo Lộc"
    },
    {
      "id": 2352,
      "name": "Phường B' Lao"
    },
    {
      "id": 2353,
      "name": "Xã Lạc Dương"
    },
    {
      "id": 2354,
      "name": "Xã Đơn Dương"
    },
    {
      "id": 2355,
      "name": "Xã Ka Đô"
    },
    {
      "id": 2356,
      "name": "Xã Quảng Lập"
    },
    {
      "id": 2357,
      "name": "Xã D'Ran"
    },
    {
      "id": 2358,
      "name": "Xã Hiệp Thạnh"
    },
    {
      "id": 2359,
      "name": "Xã Đức Trọng"
    },
    {
      "id": 2360,
      "name": "Xã Tân Hội"
    },
    {
      "id": 2361,
      "name": "Xã Tà Hine"
    },
    {
      "id": 2362,
      "name": "Xã Tà Năng"
    },
    {
      "id": 2363,
      "name": "Xã Đinh Văn - Lâm Hà"
    },
    {
      "id": 2364,
      "name": "Xã Phú Sơn - Lâm Hà"
    },
    {
      "id": 2365,
      "name": "Xã Nam Hà - Lâm Hà"
    },
    {
      "id": 2366,
      "name": "Xã Nam Ban - Lâm Hà"
    },
    {
      "id": 2367,
      "name": "Xã Tân Hà - Lâm Hà"
    },
    {
      "id": 2368,
      "name": "Xã Phúc Thọ - Lâm Hà"
    },
    {
      "id": 2369,
      "name": "Xã Đam Rông 1"
    },
    {
      "id": 2370,
      "name": "Xã Đam Rông 2"
    },
    {
      "id": 2371,
      "name": "Xã Đam Rông 3"
    },
    {
      "id": 2372,
      "name": "Xã Đam Rông 4"
    },
    {
      "id": 2373,
      "name": "Xã Di Linh"
    },
    {
      "id": 2374,
      "name": "Xã Hoà Ninh"
    },
    {
      "id": 2375,
      "name": "Xã Hoà Bắc"
    },
    {
      "id": 2376,
      "name": "Xã Đinh Trang Thượng"
    },
    {
      "id": 2377,
      "name": "Xã Bảo Thuận"
    },
    {
      "id": 2378,
      "name": "Xã Sơn Điền"
    },
    {
      "id": 2379,
      "name": "Xã Gia Hiệp"
    },
    {
      "id": 2380,
      "name": "Xã Bảo Lâm 1"
    },
    {
      "id": 2381,
      "name": "Xã Bảo Lâm 2"
    },
    {
      "id": 2382,
      "name": "Xã Bảo Lâm 3"
    },
    {
      "id": 2383,
      "name": "Xã Bảo Lâm 4"
    },
    {
      "id": 2384,
      "name": "Xã Bảo Lâm 5"
    },
    {
      "id": 2385,
      "name": "Xã Đạ Huoai"
    },
    {
      "id": 2386,
      "name": "Xã Đạ Huoai 2"
    },
    {
      "id": 2387,
      "name": "Xã Đạ Huoai 3"
    },
    {
      "id": 2388,
      "name": "Xã Đạ Tẻh"
    },
    {
      "id": 2389,
      "name": "Xã Đạ Tẻh 2"
    },
    {
      "id": 2390,
      "name": "Xã Đạ Tẻh 3"
    },
    {
      "id": 2391,
      "name": "Xã Cát Tiên"
    },
    {
      "id": 2392,
      "name": "Xã Cát Tiên 2"
    },
    {
      "id": 2393,
      "name": "Xã Cát Tiên 3"
    },
    {
      "id": 2394,
      "name": "Phường Hàm Thắng"
    },
    {
      "id": 2395,
      "name": "Phường Bình Thuận"
    },
    {
      "id": 2396,
      "name": "Phường Mũi Né"
    },
    {
      "id": 2397,
      "name": "Phường Phú Thuỷ"
    },
    {
      "id": 2398,
      "name": "Phường Phan Thiết"
    },
    {
      "id": 2399,
      "name": "Phường Tiến Thành"
    },
    {
      "id": 2400,
      "name": "Phường La Gi"
    },
    {
      "id": 2401,
      "name": "Phường Phước Hội"
    },
    {
      "id": 2402,
      "name": "Xã Tuyên Quang"
    },
    {
      "id": 2403,
      "name": "Xã Tân Hải"
    },
    {
      "id": 2404,
      "name": "Xã Vĩnh Hảo"
    },
    {
      "id": 2405,
      "name": "Xã Liên Hương"
    },
    {
      "id": 2406,
      "name": "Xã Tuy Phong"
    },
    {
      "id": 2407,
      "name": "Xã Phan Rí Cửa"
    },
    {
      "id": 2408,
      "name": "Xã Bắc Bình"
    },
    {
      "id": 2409,
      "name": "Xã Hồng Thái"
    },
    {
      "id": 2410,
      "name": "Xã Hải Ninh"
    },
    {
      "id": 2411,
      "name": "Xã Phan Sơn"
    },
    {
      "id": 2412,
      "name": "Xã Sông Lũy"
    },
    {
      "id": 2413,
      "name": "Xã Lương Sơn"
    },
    {
      "id": 2414,
      "name": "Xã Hoà Thắng"
    },
    {
      "id": 2415,
      "name": "Xã Đông Giang"
    },
    {
      "id": 2416,
      "name": "Xã La Dạ"
    },
    {
      "id": 2417,
      "name": "Xã Hàm Thuận Bắc"
    },
    {
      "id": 2418,
      "name": "Xã Hàm Thuận"
    },
    {
      "id": 2419,
      "name": "Xã Hồng Sơn"
    },
    {
      "id": 2420,
      "name": "Xã Hàm Liêm"
    },
    {
      "id": 2421,
      "name": "Xã Hàm Thạnh"
    },
    {
      "id": 2422,
      "name": "Xã Hàm Kiệm"
    },
    {
      "id": 2423,
      "name": "Xã Tân Thành"
    },
    {
      "id": 2424,
      "name": "Xã Hàm Thuận Nam"
    },
    {
      "id": 2425,
      "name": "Xã Tân Lập"
    },
    {
      "id": 2426,
      "name": "Xã Tân Minh"
    },
    {
      "id": 2427,
      "name": "Xã Hàm Tân"
    },
    {
      "id": 2428,
      "name": "Xã Sơn Mỹ"
    },
    {
      "id": 2429,
      "name": "Xã Bắc Ruộng"
    },
    {
      "id": 2430,
      "name": "Xã Nghị Đức"
    },
    {
      "id": 2431,
      "name": "Xã Đồng Kho"
    },
    {
      "id": 2432,
      "name": "Xã Tánh Linh"
    },
    {
      "id": 2433,
      "name": "Xã Suối Kiết"
    },
    {
      "id": 2434,
      "name": "Xã Nam Thành"
    },
    {
      "id": 2435,
      "name": "Xã Đức Linh"
    },
    {
      "id": 2436,
      "name": "Xã Hoài Đức"
    },
    {
      "id": 2437,
      "name": "Xã Trà Tân"
    },
    {
      "id": 2438,
      "name": "Đặc khu Phú Quý"
    },
    {
      "id": 2439,
      "name": "Phường Bắc Gia Nghĩa"
    },
    {
      "id": 2440,
      "name": "Phường Nam Gia Nghĩa"
    },
    {
      "id": 2441,
      "name": "Phường Đông Gia Nghĩa"
    },
    {
      "id": 2442,
      "name": "Xã Đắk Wil"
    },
    {
      "id": 2443,
      "name": "Xã Nam Dong"
    },
    {
      "id": 2444,
      "name": "Xã Cư Jút"
    },
    {
      "id": 2445,
      "name": "Xã Thuận An"
    },
    {
      "id": 2446,
      "name": "Xã Đức Lập"
    },
    {
      "id": 2447,
      "name": "Xã Đắk Mil"
    },
    {
      "id": 2448,
      "name": "Xã Đắk Sắk"
    },
    {
      "id": 2449,
      "name": "Xã Nam Đà"
    },
    {
      "id": 2450,
      "name": "Xã Krông Nô"
    },
    {
      "id": 2451,
      "name": "Xã Nâm Nung"
    },
    {
      "id": 2452,
      "name": "Xã Quảng Phú"
    },
    {
      "id": 2453,
      "name": "Xã Đắk song"
    },
    {
      "id": 2454,
      "name": "Xã Đức An"
    },
    {
      "id": 2455,
      "name": "Xã Thuận Hạnh"
    },
    {
      "id": 2456,
      "name": "Xã Trường Xuân"
    },
    {
      "id": 2457,
      "name": "Xã Tà Đùng"
    },
    {
      "id": 2458,
      "name": "Xã Quảng Khê"
    },
    {
      "id": 2459,
      "name": "Xã Quảng Tân"
    },
    {
      "id": 2460,
      "name": "Xã Tuy Đức"
    },
    {
      "id": 2461,
      "name": "Xã Kiến Đức"
    },
    {
      "id": 2462,
      "name": "Xã Nhân Cơ"
    },
    {
      "id": 2463,
      "name": "Xã Quảng Tín"
    },
    {
      "id": 2464,
      "name": "Xã Ninh Gia"
    },
    {
      "id": 2465,
      "name": "Xã Quảng Hoà"
    },
    {
      "id": 2466,
      "name": "Xã Quảng Sơn"
    },
    {
      "id": 2467,
      "name": "Xã Quảng Trực"
    }
  ],
  "27": [
    {
      "id": 2468,
      "name": "Xã Hưng Điền"
    },
    {
      "id": 2469,
      "name": "Xã Vĩnh Thạnh"
    },
    {
      "id": 2470,
      "name": "Xã Tân Hưng"
    },
    {
      "id": 2471,
      "name": "Xã Vĩnh Châu"
    },
    {
      "id": 2472,
      "name": "Xã Tuyên Bình"
    },
    {
      "id": 2473,
      "name": "Xã Vĩnh Hưng"
    },
    {
      "id": 2474,
      "name": "Xã Khánh Hưng"
    },
    {
      "id": 2475,
      "name": "Xã Tuyên Thạnh"
    },
    {
      "id": 2476,
      "name": "Xã Bình Hiệp"
    },
    {
      "id": 2477,
      "name": "Phường Kiến Tường"
    },
    {
      "id": 2478,
      "name": "Xã Bình Hoà"
    },
    {
      "id": 2479,
      "name": "Xã Mộc Hoá"
    },
    {
      "id": 2480,
      "name": "Xã Hậu Thạnh"
    },
    {
      "id": 2481,
      "name": "Xã Nhơn Hoà Lập"
    },
    {
      "id": 2482,
      "name": "Xã Nhơn Ninh"
    },
    {
      "id": 2483,
      "name": "Xã Tân Thạnh"
    },
    {
      "id": 2484,
      "name": "Xã Bình Thành"
    },
    {
      "id": 2485,
      "name": "Xã Thạnh Phước"
    },
    {
      "id": 2486,
      "name": "Xã Thạnh Hóa"
    },
    {
      "id": 2487,
      "name": "Xã Tân Tây"
    },
    {
      "id": 2488,
      "name": "Xã Thủ Thừa"
    },
    {
      "id": 2489,
      "name": "Xã Mỹ An"
    },
    {
      "id": 2490,
      "name": "Xã Mỹ Thạnh"
    },
    {
      "id": 2491,
      "name": "Xã Tân Long"
    },
    {
      "id": 2492,
      "name": "Xã Mỹ Quý"
    },
    {
      "id": 2493,
      "name": "Xã Đông Thành"
    },
    {
      "id": 2494,
      "name": "Xã Đức Huệ"
    },
    {
      "id": 2495,
      "name": "Xã An Ninh"
    },
    {
      "id": 2496,
      "name": "Xã Hiệp Hoà"
    },
    {
      "id": 2497,
      "name": "Xã Hậu Nghĩa"
    },
    {
      "id": 2498,
      "name": "Xã Hoà Khánh"
    },
    {
      "id": 2499,
      "name": "Xã Đức Lập"
    },
    {
      "id": 2500,
      "name": "Xã Mỹ Hạnh"
    },
    {
      "id": 2501,
      "name": "Xã Đức Hoà"
    },
    {
      "id": 2502,
      "name": "Xã Thạnh Lợi"
    },
    {
      "id": 2503,
      "name": "Xã Bình Đức"
    },
    {
      "id": 2504,
      "name": "Xã Lương Hoà"
    },
    {
      "id": 2505,
      "name": "Xã Bến Lức"
    },
    {
      "id": 2506,
      "name": "Xã Mỹ Yên"
    },
    {
      "id": 2507,
      "name": "Xã Long Cang"
    },
    {
      "id": 2508,
      "name": "Xã Rạch Kiến"
    },
    {
      "id": 2509,
      "name": "Xã Mỹ Lệ"
    },
    {
      "id": 2510,
      "name": "Xã Tân Lân"
    },
    {
      "id": 2511,
      "name": "Xã Cần Đước"
    },
    {
      "id": 2512,
      "name": "Xã Long Hựu"
    },
    {
      "id": 2513,
      "name": "Xã Phước Lý"
    },
    {
      "id": 2514,
      "name": "Xã Mỹ Lộc"
    },
    {
      "id": 2515,
      "name": "Xã Cần Giuộc"
    },
    {
      "id": 2516,
      "name": "Xã Phước Vĩnh Tây"
    },
    {
      "id": 2517,
      "name": "Xã Tân Tập"
    },
    {
      "id": 2518,
      "name": "Xã Vàm Cỏ"
    },
    {
      "id": 2519,
      "name": "Xã Tân Trụ"
    },
    {
      "id": 2520,
      "name": "Xã Nhựt Tảo"
    },
    {
      "id": 2521,
      "name": "Xã Thuận Mỹ"
    },
    {
      "id": 2522,
      "name": "Xã An Lục Long"
    },
    {
      "id": 2523,
      "name": "Xã Tầm Vu"
    },
    {
      "id": 2524,
      "name": "Xã Vĩnh Công"
    },
    {
      "id": 2525,
      "name": "Phường Long An"
    },
    {
      "id": 2526,
      "name": "Phường Tân An"
    },
    {
      "id": 2527,
      "name": "Phường Khánh Hậu"
    },
    {
      "id": 2528,
      "name": "Phường Tân Ninh"
    },
    {
      "id": 2529,
      "name": "Phường Bình Minh"
    },
    {
      "id": 2530,
      "name": "Phường Ninh Thạnh"
    },
    {
      "id": 2531,
      "name": "Phường Long Hoa"
    },
    {
      "id": 2532,
      "name": "Phường Hoà Thành"
    },
    {
      "id": 2533,
      "name": "Phường Thanh Điền"
    },
    {
      "id": 2534,
      "name": "Phường Trảng Bàng"
    },
    {
      "id": 2535,
      "name": "Phường An Tịnh"
    },
    {
      "id": 2536,
      "name": "Phường Gò Dầu"
    },
    {
      "id": 2537,
      "name": "Phường Gia Lộc"
    },
    {
      "id": 2538,
      "name": "Xã Hưng Thuận"
    },
    {
      "id": 2539,
      "name": "Xã Phước Chỉ"
    },
    {
      "id": 2540,
      "name": "Xã Thạnh Đức"
    },
    {
      "id": 2541,
      "name": "Xã Phước Thạnh"
    },
    {
      "id": 2542,
      "name": "Xã Truông Mít"
    },
    {
      "id": 2543,
      "name": "Xã Lộc Ninh"
    },
    {
      "id": 2544,
      "name": "Xã Cầu Khởi"
    },
    {
      "id": 2545,
      "name": "Xã Dương Minh Châu"
    },
    {
      "id": 2546,
      "name": "Xã Tân Đông"
    },
    {
      "id": 2547,
      "name": "Xã Tân Châu"
    },
    {
      "id": 2548,
      "name": "Xã Tân Phú"
    },
    {
      "id": 2549,
      "name": "Xã Tân Hội"
    },
    {
      "id": 2550,
      "name": "Xã Tân Thành"
    },
    {
      "id": 2551,
      "name": "Xã Tân Hoà"
    },
    {
      "id": 2552,
      "name": "Xã Tân Lập"
    },
    {
      "id": 2553,
      "name": "Xã Tân Biên"
    },
    {
      "id": 2554,
      "name": "Xã Thạnh Bình"
    },
    {
      "id": 2555,
      "name": "Xã Trà Vong"
    },
    {
      "id": 2556,
      "name": "Xã Phước Vinh"
    },
    {
      "id": 2557,
      "name": "Xã Hoà Hội"
    },
    {
      "id": 2558,
      "name": "Xã Ninh Điền"
    },
    {
      "id": 2559,
      "name": "Xã Châu Thành"
    },
    {
      "id": 2560,
      "name": "Xã Hảo Đước"
    },
    {
      "id": 2561,
      "name": "Xã Long Chữ"
    },
    {
      "id": 2562,
      "name": "Xã Long Thuận"
    },
    {
      "id": 2563,
      "name": "Xã Bến Cầu"
    }
  ],
  "28": [
    {
      "id": 2564,
      "name": "Phường Biên Hoà"
    },
    {
      "id": 2565,
      "name": "Phường Trấn Biên"
    },
    {
      "id": 2566,
      "name": "Phường Tam Hiệp"
    },
    {
      "id": 2567,
      "name": "Phường Long Bình"
    },
    {
      "id": 2568,
      "name": "Phường Trảng Dài"
    },
    {
      "id": 2569,
      "name": "Phường Hố Nai"
    },
    {
      "id": 2570,
      "name": "Phường Long Hưng"
    },
    {
      "id": 2571,
      "name": "Xã Đại Phước"
    },
    {
      "id": 2572,
      "name": "Xã Nhơn Trạch"
    },
    {
      "id": 2573,
      "name": "Xã Phước An"
    },
    {
      "id": 2574,
      "name": "Xã Phước Thái"
    },
    {
      "id": 2575,
      "name": "Xã Long Phước"
    },
    {
      "id": 2576,
      "name": "Xã Bình An"
    },
    {
      "id": 2577,
      "name": "Xã Long Thành"
    },
    {
      "id": 2578,
      "name": "Xã An Phước"
    },
    {
      "id": 2579,
      "name": "Xã An Viễn"
    },
    {
      "id": 2580,
      "name": "Xã Bình Minh"
    },
    {
      "id": 2581,
      "name": "Xã Trảng Bom"
    },
    {
      "id": 2582,
      "name": "Xã Bàu Hàm"
    },
    {
      "id": 2583,
      "name": "Xã Hưng Thịnh"
    },
    {
      "id": 2584,
      "name": "Xã Dầu Giây"
    },
    {
      "id": 2585,
      "name": "Xã Gia Kiệm"
    },
    {
      "id": 2586,
      "name": "Xã Thống Nhất"
    },
    {
      "id": 2587,
      "name": "Phường Bình Lộc"
    },
    {
      "id": 2588,
      "name": "Phường Bảo Vinh"
    },
    {
      "id": 2589,
      "name": "Phường Xuân Lập"
    },
    {
      "id": 2590,
      "name": "Phường Long Khánh"
    },
    {
      "id": 2591,
      "name": "Phường Hàng Gòn"
    },
    {
      "id": 2592,
      "name": "Xã Xuân Quế"
    },
    {
      "id": 2593,
      "name": "Xã Xuân Đường"
    },
    {
      "id": 2594,
      "name": "Xã Cẩm Mỹ"
    },
    {
      "id": 2595,
      "name": "Xã Sông Ray"
    },
    {
      "id": 2596,
      "name": "Xã Xuân Đông"
    },
    {
      "id": 2597,
      "name": "Xã Xuân Định"
    },
    {
      "id": 2598,
      "name": "Xã Xuân Phú"
    },
    {
      "id": 2599,
      "name": "Xã Xuân Lộc"
    },
    {
      "id": 2600,
      "name": "Xã Xuân Hoà"
    },
    {
      "id": 2601,
      "name": "Xã Xuân Thành"
    },
    {
      "id": 2602,
      "name": "Xã Xuân Bắc"
    },
    {
      "id": 2603,
      "name": "Xã La Ngà"
    },
    {
      "id": 2604,
      "name": "Xã Định Quán"
    },
    {
      "id": 2605,
      "name": "Xã Phú Vinh"
    },
    {
      "id": 2606,
      "name": "Xã Phú Hoà"
    },
    {
      "id": 2607,
      "name": "Xã Tà Lài"
    },
    {
      "id": 2608,
      "name": "Xã Nam Cát Tiên"
    },
    {
      "id": 2609,
      "name": "Xã Tân Phú"
    },
    {
      "id": 2610,
      "name": "Xã Phú Lâm"
    },
    {
      "id": 2611,
      "name": "Xã Trị An"
    },
    {
      "id": 2612,
      "name": "Xã Tân An"
    },
    {
      "id": 2613,
      "name": "Phường Tân Triều"
    },
    {
      "id": 2614,
      "name": "Phường Minh Hưng"
    },
    {
      "id": 2615,
      "name": "Phường Chơn Thành"
    },
    {
      "id": 2616,
      "name": "Xã Nha Bích"
    },
    {
      "id": 2617,
      "name": "Xã Tân Quan"
    },
    {
      "id": 2618,
      "name": "Xã Tân Hưng"
    },
    {
      "id": 2619,
      "name": "Xã Tân Khai"
    },
    {
      "id": 2620,
      "name": "Xã Minh Đức"
    },
    {
      "id": 2621,
      "name": "Phường Bình Long"
    },
    {
      "id": 2622,
      "name": "Phường An Lộc"
    },
    {
      "id": 2623,
      "name": "Xã Lộc Thành"
    },
    {
      "id": 2624,
      "name": "Xã Lộc Ninh"
    },
    {
      "id": 2625,
      "name": "Xã Lộc Hưng"
    },
    {
      "id": 2626,
      "name": "Xã Lộc Tấn"
    },
    {
      "id": 2627,
      "name": "Xã Lộc Thạnh"
    },
    {
      "id": 2628,
      "name": "Xã Lộc Quang"
    },
    {
      "id": 2629,
      "name": "Xã Tân Tiến"
    },
    {
      "id": 2630,
      "name": "Xã Thiện Hưng"
    },
    {
      "id": 2631,
      "name": "Xã Hưng Phước"
    },
    {
      "id": 2632,
      "name": "Xã Phú Nghĩa"
    },
    {
      "id": 2633,
      "name": "Xã Đa Kia"
    },
    {
      "id": 2634,
      "name": "Phường Phước Bình"
    },
    {
      "id": 2635,
      "name": "Phường Phước Long"
    },
    {
      "id": 2636,
      "name": "Xã Bình Tân"
    },
    {
      "id": 2637,
      "name": "Xã Long Hà"
    },
    {
      "id": 2638,
      "name": "Xã Phú Riềng"
    },
    {
      "id": 2639,
      "name": "Xã Phú Trung"
    },
    {
      "id": 2640,
      "name": "Phường Đồng Xoài"
    },
    {
      "id": 2641,
      "name": "Phường Bình Phước"
    },
    {
      "id": 2642,
      "name": "Xã Thuận Lợi"
    },
    {
      "id": 2643,
      "name": "Xã Đồng Tâm"
    },
    {
      "id": 2644,
      "name": "Xã Tân Lợi"
    },
    {
      "id": 2645,
      "name": "Xã Đồng Phú"
    },
    {
      "id": 2646,
      "name": "Xã Phước Sơn"
    },
    {
      "id": 2647,
      "name": "Xã Nghĩa Trung"
    },
    {
      "id": 2648,
      "name": "Xã Bù Đăng"
    },
    {
      "id": 2649,
      "name": "Xã Thọ Sơn"
    },
    {
      "id": 2650,
      "name": "Xã Đak Nhau"
    },
    {
      "id": 2651,
      "name": "Xã Bom Bo"
    },
    {
      "id": 2652,
      "name": "Phường Tam Phước"
    },
    {
      "id": 2653,
      "name": "Phường Phước Tân"
    },
    {
      "id": 2654,
      "name": "Xã Thanh Sơn"
    },
    {
      "id": 2655,
      "name": "Xã Đak Lua"
    },
    {
      "id": 2656,
      "name": "Xã Phú Lý"
    },
    {
      "id": 2657,
      "name": "Xã Bù Gia Mập"
    },
    {
      "id": 2658,
      "name": "Xã Đăk Ơ"
    }
  ],
  "29": [
    {
      "id": 2659,
      "name": "Phường Vũng Tàu"
    },
    {
      "id": 2660,
      "name": "Phường Tam Thắng"
    },
    {
      "id": 2661,
      "name": "Phường Rạch Dừa"
    },
    {
      "id": 2662,
      "name": "Phường Phước Thắng"
    },
    {
      "id": 2663,
      "name": "Phường Bà Rịa"
    },
    {
      "id": 2664,
      "name": "Phường Long Hương"
    },
    {
      "id": 2665,
      "name": "Phường Phú Mỹ"
    },
    {
      "id": 2666,
      "name": "Phường Tam Long"
    },
    {
      "id": 2667,
      "name": "Phường Tân Thành"
    },
    {
      "id": 2668,
      "name": "Phường Tân Phước"
    },
    {
      "id": 2669,
      "name": "Phường Tân Hải"
    },
    {
      "id": 2670,
      "name": "Xã Châu Pha"
    },
    {
      "id": 2671,
      "name": "Xã Ngãi Giao"
    },
    {
      "id": 2672,
      "name": "Xã Bình Giã"
    },
    {
      "id": 2673,
      "name": "Xã Kim Long"
    },
    {
      "id": 2674,
      "name": "Xã Châu Đức"
    },
    {
      "id": 2675,
      "name": "Xã Xuân Sơn"
    },
    {
      "id": 2676,
      "name": "Xã Nghĩa Thành"
    },
    {
      "id": 2677,
      "name": "Xã Hồ Tràm"
    },
    {
      "id": 2678,
      "name": "Xã Xuyên Mộc"
    },
    {
      "id": 2679,
      "name": "Xã Hòa Hội"
    },
    {
      "id": 2680,
      "name": "Xã Bàu Lâm"
    },
    {
      "id": 2681,
      "name": "Xã Phước Hải"
    },
    {
      "id": 2682,
      "name": "Xã Long Hải"
    },
    {
      "id": 2683,
      "name": "Xã Đất Đỏ"
    },
    {
      "id": 2684,
      "name": "Xã Long Điền"
    },
    {
      "id": 2685,
      "name": "Đặc khu Côn Đảo"
    },
    {
      "id": 2686,
      "name": "Phường Đông Hoà"
    },
    {
      "id": 2687,
      "name": "Phường Dĩ An"
    },
    {
      "id": 2688,
      "name": "Phường Tân Đông Hiệp"
    },
    {
      "id": 2689,
      "name": "Phường Thuận An"
    },
    {
      "id": 2690,
      "name": "Phường Thuận Giao"
    },
    {
      "id": 2691,
      "name": "Phường Bình Hoà"
    },
    {
      "id": 2692,
      "name": "Phường Lái Thiêu"
    },
    {
      "id": 2693,
      "name": "Phường An Phú"
    },
    {
      "id": 2694,
      "name": "Phường Bình Dương"
    },
    {
      "id": 2695,
      "name": "Phường Chánh Hiệp"
    },
    {
      "id": 2696,
      "name": "Phường Thủ Dầu Một"
    },
    {
      "id": 2697,
      "name": "Phường Phú Lợi"
    },
    {
      "id": 2698,
      "name": "Phường Vĩnh Tân"
    },
    {
      "id": 2699,
      "name": "Phường Bình Cơ"
    },
    {
      "id": 2700,
      "name": "Phường Tân Uyên"
    },
    {
      "id": 2701,
      "name": "Phường Tân Hiệp"
    },
    {
      "id": 2702,
      "name": "Phường Tân Khánh"
    },
    {
      "id": 2703,
      "name": "Phường Hoà Lợi"
    },
    {
      "id": 2704,
      "name": "Phường Phú An"
    },
    {
      "id": 2705,
      "name": "Phường Tây Nam"
    },
    {
      "id": 2706,
      "name": "Phường Long Nguyên"
    },
    {
      "id": 2707,
      "name": "Phường Bến Cát"
    },
    {
      "id": 2708,
      "name": "Phường Chánh Phú Hoà"
    },
    {
      "id": 2709,
      "name": "Xã Bắc Tân Uyên"
    },
    {
      "id": 2710,
      "name": "Xã Thường Tân"
    },
    {
      "id": 2711,
      "name": "Xã An Long"
    },
    {
      "id": 2712,
      "name": "Xã Phước Thành"
    },
    {
      "id": 2713,
      "name": "Xã Phước Hoà"
    },
    {
      "id": 2714,
      "name": "Xã Phú Giáo"
    },
    {
      "id": 2715,
      "name": "Xã Trừ Văn Thố"
    },
    {
      "id": 2716,
      "name": "Xã Bàu Bàng"
    },
    {
      "id": 2717,
      "name": "Xã Minh Thạnh"
    },
    {
      "id": 2718,
      "name": "Xã Long Hoà"
    },
    {
      "id": 2719,
      "name": "Xã Dầu Tiếng"
    },
    {
      "id": 2720,
      "name": "Xã Thanh An"
    },
    {
      "id": 2721,
      "name": "Phường Sài Gòn"
    },
    {
      "id": 2722,
      "name": "Phường Tân Định"
    },
    {
      "id": 2723,
      "name": "Phường Bến Thành"
    },
    {
      "id": 2724,
      "name": "Phường Cầu Ông Lãnh"
    },
    {
      "id": 2725,
      "name": "Phường Bàn Cờ"
    },
    {
      "id": 2726,
      "name": "Phường Xuân Hoà"
    },
    {
      "id": 2727,
      "name": "Phường Nhiêu Lộc"
    },
    {
      "id": 2728,
      "name": "Phường Xóm Chiếu"
    },
    {
      "id": 2729,
      "name": "Phường Khánh Hội"
    },
    {
      "id": 2730,
      "name": "Phường Vĩnh Hội"
    },
    {
      "id": 2731,
      "name": "Phường Chợ Quán"
    },
    {
      "id": 2732,
      "name": "Phường An Đông"
    },
    {
      "id": 2733,
      "name": "Phường Chợ Lớn"
    },
    {
      "id": 2734,
      "name": "Phường Bình Tây"
    },
    {
      "id": 2735,
      "name": "Phường Bình Tiên"
    },
    {
      "id": 2736,
      "name": "Phường Bình Phú"
    },
    {
      "id": 2737,
      "name": "Phường Phú Lâm"
    },
    {
      "id": 2738,
      "name": "Phường Tân Thuận"
    },
    {
      "id": 2739,
      "name": "Phường Phú Thuận"
    },
    {
      "id": 2740,
      "name": "Phường Tân Mỹ"
    },
    {
      "id": 2741,
      "name": "Phường Tân Hưng"
    },
    {
      "id": 2742,
      "name": "Phường Chánh Hưng"
    },
    {
      "id": 2743,
      "name": "Phường Phú Định"
    },
    {
      "id": 2744,
      "name": "Phường Bình Đông"
    },
    {
      "id": 2745,
      "name": "Phường Diên Hồng"
    },
    {
      "id": 2746,
      "name": "Phường Vườn Lài"
    },
    {
      "id": 2747,
      "name": "Phường Hoà Hưng"
    },
    {
      "id": 2748,
      "name": "Phường Minh Phụng"
    },
    {
      "id": 2749,
      "name": "Phường Bình Thới"
    },
    {
      "id": 2750,
      "name": "Phường Hoà Bình"
    },
    {
      "id": 2751,
      "name": "Phường Phú Thọ"
    },
    {
      "id": 2752,
      "name": "Phường Đông Hưng Thuận"
    },
    {
      "id": 2753,
      "name": "Phường Trung Mỹ Tây"
    },
    {
      "id": 2754,
      "name": "Phường Tân Thới Hiệp"
    },
    {
      "id": 2755,
      "name": "Phường Thới An"
    },
    {
      "id": 2756,
      "name": "Phường An Phú Đông"
    },
    {
      "id": 2757,
      "name": "Phường An Lạc"
    },
    {
      "id": 2758,
      "name": "Phường Tân Tạo"
    },
    {
      "id": 2759,
      "name": "Phường Bình Tân"
    },
    {
      "id": 2760,
      "name": "Phường Bình Trị Đông"
    },
    {
      "id": 2761,
      "name": "Phường Bình Hưng Hoà"
    },
    {
      "id": 2762,
      "name": "Phường Gia Định"
    },
    {
      "id": 2763,
      "name": "Phường Bình Thạnh"
    },
    {
      "id": 2764,
      "name": "Phường Bình Lợi Trung"
    },
    {
      "id": 2765,
      "name": "Phường Thạnh Mỹ Tây"
    },
    {
      "id": 2766,
      "name": "Phường Bình Quới"
    },
    {
      "id": 2767,
      "name": "Phường Hạnh Thông"
    },
    {
      "id": 2768,
      "name": "Phường An Nhơn"
    },
    {
      "id": 2769,
      "name": "Phường Gò Vấp"
    },
    {
      "id": 2770,
      "name": "Phường An Hội Đông"
    },
    {
      "id": 2771,
      "name": "Phường Thông Tây Hội"
    },
    {
      "id": 2772,
      "name": "Phường An Hội Tây"
    },
    {
      "id": 2773,
      "name": "Phường Đức Nhuận"
    },
    {
      "id": 2774,
      "name": "Phường Cầu Kiệu"
    },
    {
      "id": 2775,
      "name": "Phường Phú Nhuận"
    },
    {
      "id": 2776,
      "name": "Phường Tân Sơn Hoà"
    },
    {
      "id": 2777,
      "name": "Phường Tân Sơn Nhất"
    },
    {
      "id": 2778,
      "name": "Phường Tân Hoà"
    },
    {
      "id": 2779,
      "name": "Phường Bảy Hiền"
    },
    {
      "id": 2780,
      "name": "Phường Tân Bình"
    },
    {
      "id": 2781,
      "name": "Phường Tân Sơn"
    },
    {
      "id": 2782,
      "name": "Phường Tây Thạnh"
    },
    {
      "id": 2783,
      "name": "Phường Tân Sơn Nhì"
    },
    {
      "id": 2784,
      "name": "Phường Phú Thọ Hoà"
    },
    {
      "id": 2785,
      "name": "Phường Tân Phú"
    },
    {
      "id": 2786,
      "name": "Phường Phú Thạnh"
    },
    {
      "id": 2787,
      "name": "Phường Hiệp Bình"
    },
    {
      "id": 2788,
      "name": "Phường Thủ Đức"
    },
    {
      "id": 2789,
      "name": "Phường Tam Bình"
    },
    {
      "id": 2790,
      "name": "Phường Linh Xuân"
    },
    {
      "id": 2791,
      "name": "Phường Tăng Nhơn Phú"
    },
    {
      "id": 2792,
      "name": "Phường Long Bình"
    },
    {
      "id": 2793,
      "name": "Phường Long Phước"
    },
    {
      "id": 2794,
      "name": "Phường Long Trường"
    },
    {
      "id": 2795,
      "name": "Phường Cát Lái"
    },
    {
      "id": 2796,
      "name": "Phường Bình Trưng"
    },
    {
      "id": 2797,
      "name": "Phường Phước Long"
    },
    {
      "id": 2798,
      "name": "Phường An Khánh"
    },
    {
      "id": 2799,
      "name": "Xã Vĩnh Lộc"
    },
    {
      "id": 2800,
      "name": "Xã Tân Vĩnh Lộc"
    },
    {
      "id": 2801,
      "name": "Xã Bình Lợi"
    },
    {
      "id": 2802,
      "name": "Xã Tân Nhựt"
    },
    {
      "id": 2803,
      "name": "Xã Bình Chánh"
    },
    {
      "id": 2804,
      "name": "Xã Hưng Long"
    },
    {
      "id": 2805,
      "name": "Xã Bình Hưng"
    },
    {
      "id": 2806,
      "name": "Xã Bình Khánh"
    },
    {
      "id": 2807,
      "name": "Xã An Thới Đông"
    },
    {
      "id": 2808,
      "name": "Xã Cần Giờ"
    },
    {
      "id": 2809,
      "name": "Xã Củ Chi"
    },
    {
      "id": 2810,
      "name": "Xã Tân An Hội"
    },
    {
      "id": 2811,
      "name": "Xã Thái Mỹ"
    },
    {
      "id": 2812,
      "name": "Xã An Nhơn Tây"
    },
    {
      "id": 2813,
      "name": "Xã Nhuận Đức"
    },
    {
      "id": 2814,
      "name": "Xã Phú Hoà Đông"
    },
    {
      "id": 2815,
      "name": "Xã Bình Mỹ"
    },
    {
      "id": 2816,
      "name": "Xã Đông Thạnh"
    },
    {
      "id": 2817,
      "name": "Xã Hóc Môn"
    },
    {
      "id": 2818,
      "name": "Xã Xuân Thới Sơn"
    },
    {
      "id": 2819,
      "name": "Xã Bà Điểm"
    },
    {
      "id": 2820,
      "name": "Xã Nhà Bè"
    },
    {
      "id": 2821,
      "name": "Xã Hiệp Phước"
    },
    {
      "id": 2822,
      "name": "Xã Long Sơn"
    },
    {
      "id": 2823,
      "name": "Xã Hòa Hiệp"
    },
    {
      "id": 2824,
      "name": "Xã Bình Châu"
    },
    {
      "id": 2825,
      "name": "Phường Thới Hoà"
    },
    {
      "id": 2826,
      "name": "Xã Thạnh An"
    }
  ],
  "30": [
    {
      "id": 2827,
      "name": "Phường Trà Vinh"
    },
    {
      "id": 2828,
      "name": "Xã Cái Nhum"
    },
    {
      "id": 2829,
      "name": "Phường Long Đức"
    },
    {
      "id": 2830,
      "name": "Xã Tân Long Hội"
    },
    {
      "id": 2831,
      "name": "Phường Nguyệt Hóa"
    },
    {
      "id": 2832,
      "name": "Xã Nhơn Phú"
    },
    {
      "id": 2833,
      "name": "Phường Hòa Thuận"
    },
    {
      "id": 2834,
      "name": "Xã Bình Phước"
    },
    {
      "id": 2835,
      "name": "Xã Càng Long"
    },
    {
      "id": 2836,
      "name": "Xã An Bình"
    },
    {
      "id": 2837,
      "name": "Xã An Trường"
    },
    {
      "id": 2838,
      "name": "Xã Long Hồ"
    },
    {
      "id": 2839,
      "name": "Xã Tân An"
    },
    {
      "id": 2840,
      "name": "Xã Phú Quới"
    },
    {
      "id": 2841,
      "name": "Xã Nhị Long"
    },
    {
      "id": 2842,
      "name": "Phường Thanh Đức"
    },
    {
      "id": 2843,
      "name": "Xã Bình Phú"
    },
    {
      "id": 2844,
      "name": "Phường Long Châu"
    },
    {
      "id": 2845,
      "name": "Xã Châu Thành"
    },
    {
      "id": 2846,
      "name": "Phường Phước Hậu"
    },
    {
      "id": 2847,
      "name": "Xã Song Lộc"
    },
    {
      "id": 2848,
      "name": "Phường Tân Hạnh"
    },
    {
      "id": 2849,
      "name": "Xã Hưng Mỹ"
    },
    {
      "id": 2850,
      "name": "Phường Tân Ngãi"
    },
    {
      "id": 2851,
      "name": "Xã Hòa Minh"
    },
    {
      "id": 2852,
      "name": "Xã Quới Thiện"
    },
    {
      "id": 2853,
      "name": "Xã Long Hòa"
    },
    {
      "id": 2854,
      "name": "Xã Trung Thành"
    },
    {
      "id": 2855,
      "name": "Xã Cầu Kè"
    },
    {
      "id": 2856,
      "name": "Xã Trung Ngãi"
    },
    {
      "id": 2857,
      "name": "Xã Phong Thạnh"
    },
    {
      "id": 2858,
      "name": "Xã Quới An"
    },
    {
      "id": 2859,
      "name": "Xã An Phú Tân"
    },
    {
      "id": 2860,
      "name": "Xã Trung Hiệp"
    },
    {
      "id": 2861,
      "name": "Xã Tam Ngãi"
    },
    {
      "id": 2862,
      "name": "Xã Hiếu Phụng"
    },
    {
      "id": 2863,
      "name": "Xã Tiểu Cần"
    },
    {
      "id": 2864,
      "name": "Xã Hiếu Thành"
    },
    {
      "id": 2865,
      "name": "Xã Tân Hòa"
    },
    {
      "id": 2866,
      "name": "Xã Lục Sỹ Thành"
    },
    {
      "id": 2867,
      "name": "Xã Hùng Hòa"
    },
    {
      "id": 2868,
      "name": "Xã Trà Ôn"
    },
    {
      "id": 2869,
      "name": "Xã Tập Ngãi"
    },
    {
      "id": 2870,
      "name": "Xã Trà Côn"
    },
    {
      "id": 2871,
      "name": "Xã Cầu Ngang"
    },
    {
      "id": 2872,
      "name": "Xã Vĩnh Xuân"
    },
    {
      "id": 2873,
      "name": "Xã Mỹ Long"
    },
    {
      "id": 2874,
      "name": "Xã Hòa Bình"
    },
    {
      "id": 2875,
      "name": "Xã Vinh Kim"
    },
    {
      "id": 2876,
      "name": "Xã Hòa Hiệp"
    },
    {
      "id": 2877,
      "name": "Xã Nhị Trường"
    },
    {
      "id": 2878,
      "name": "Xã Tam Bình"
    },
    {
      "id": 2879,
      "name": "Xã Hiệp Mỹ"
    },
    {
      "id": 2880,
      "name": "Xã Ngãi Tứ"
    },
    {
      "id": 2881,
      "name": "Xã Trà Cú"
    },
    {
      "id": 2882,
      "name": "Xã Song Phú"
    },
    {
      "id": 2883,
      "name": "Xã Lưu Nghiệp Anh"
    },
    {
      "id": 2884,
      "name": "Xã Cái Ngang"
    },
    {
      "id": 2885,
      "name": "Xã Đại An"
    },
    {
      "id": 2886,
      "name": "Xã Tân Quới"
    },
    {
      "id": 2887,
      "name": "Xã Hàm Giang"
    },
    {
      "id": 2888,
      "name": "Xã Tân Lược"
    },
    {
      "id": 2889,
      "name": "Xã Long Hiệp"
    },
    {
      "id": 2890,
      "name": "Xã Mỹ Thuận"
    },
    {
      "id": 2891,
      "name": "Xã Tập Sơn"
    },
    {
      "id": 2892,
      "name": "Phường Bình Minh"
    },
    {
      "id": 2893,
      "name": "Phường Duyên Hải"
    },
    {
      "id": 2894,
      "name": "Phường Cái Vồn"
    },
    {
      "id": 2895,
      "name": "Phường Trường Long Hòa"
    },
    {
      "id": 2896,
      "name": "Phường Đông Thành"
    },
    {
      "id": 2897,
      "name": "Xã Long Hữu"
    },
    {
      "id": 2898,
      "name": "Xã Long Thành"
    },
    {
      "id": 2899,
      "name": "Xã Đông Hải"
    },
    {
      "id": 2900,
      "name": "Xã Long Vĩnh"
    },
    {
      "id": 2901,
      "name": "Xã Đôn Châu"
    },
    {
      "id": 2902,
      "name": "Xã Ngũ Lạc"
    },
    {
      "id": 2903,
      "name": "Phường An Hội"
    },
    {
      "id": 2904,
      "name": "Phường Phú Khương"
    },
    {
      "id": 2905,
      "name": "Phường Bến Tre"
    },
    {
      "id": 2906,
      "name": "Phường Sơn Đông"
    },
    {
      "id": 2907,
      "name": "Phường Phú Tân"
    },
    {
      "id": 2908,
      "name": "Xã Phú Túc"
    },
    {
      "id": 2909,
      "name": "Xã Giao Long"
    },
    {
      "id": 2910,
      "name": "Xã Tiên Thủy"
    },
    {
      "id": 2911,
      "name": "Xã Tân Phú"
    },
    {
      "id": 2912,
      "name": "Xã Phú Phụng"
    },
    {
      "id": 2913,
      "name": "Xã Chợ Lách"
    },
    {
      "id": 2914,
      "name": "Xã Vĩnh Thành"
    },
    {
      "id": 2915,
      "name": "Xã Hưng Khánh Trung"
    },
    {
      "id": 2916,
      "name": "Xã Phước Mỹ Trung"
    },
    {
      "id": 2917,
      "name": "Xã Tân Thành Bình"
    },
    {
      "id": 2918,
      "name": "Xã Nhuận Phú Tân"
    },
    {
      "id": 2919,
      "name": "Xã Đồng Khởi"
    },
    {
      "id": 2920,
      "name": "Xã Mỏ Cày"
    },
    {
      "id": 2921,
      "name": "Xã Thành Thới"
    },
    {
      "id": 2922,
      "name": "Xã An Định"
    },
    {
      "id": 2923,
      "name": "Xã Hương Mỹ"
    },
    {
      "id": 2924,
      "name": "Xã Đại Điền"
    },
    {
      "id": 2925,
      "name": "Xã Quới Điền"
    },
    {
      "id": 2926,
      "name": "Xã Thạnh Phú"
    },
    {
      "id": 2927,
      "name": "Xã An Qui"
    },
    {
      "id": 2928,
      "name": "Xã Thạnh Hải"
    },
    {
      "id": 2929,
      "name": "Xã Thạnh Phong"
    },
    {
      "id": 2930,
      "name": "Xã Tân Thủy"
    },
    {
      "id": 2931,
      "name": "Xã Bảo Thạnh"
    },
    {
      "id": 2932,
      "name": "Xã Ba Tri"
    },
    {
      "id": 2933,
      "name": "Xã Tân Xuân"
    },
    {
      "id": 2934,
      "name": "Xã Mỹ Chánh Hòa"
    },
    {
      "id": 2935,
      "name": "Xã An Ngãi Trung"
    },
    {
      "id": 2936,
      "name": "Xã An Hiệp"
    },
    {
      "id": 2937,
      "name": "Xã Hưng Nhượng"
    },
    {
      "id": 2938,
      "name": "Xã Giồng Trôm"
    },
    {
      "id": 2939,
      "name": "Xã Tân Hào"
    },
    {
      "id": 2940,
      "name": "Xã Phước Long"
    },
    {
      "id": 2941,
      "name": "Xã Lương Phú"
    },
    {
      "id": 2942,
      "name": "Xã Châu Hòa"
    },
    {
      "id": 2943,
      "name": "Xã Lương Hòa"
    },
    {
      "id": 2944,
      "name": "Xã Thới Thuận"
    },
    {
      "id": 2945,
      "name": "Xã Thạnh Phước"
    },
    {
      "id": 2946,
      "name": "Xã Bình Đại"
    },
    {
      "id": 2947,
      "name": "Xã Thạnh Trị"
    },
    {
      "id": 2948,
      "name": "Xã Lộc Thuận"
    },
    {
      "id": 2949,
      "name": "Xã Châu Hưng"
    },
    {
      "id": 2950,
      "name": "Xã Phú Thuận"
    }
  ],
  "31": [
    {
      "id": 2951,
      "name": "Phường Mỹ Tho"
    },
    {
      "id": 2952,
      "name": "Phường Đạo Thạnh"
    },
    {
      "id": 2953,
      "name": "Phường Mỹ Phong"
    },
    {
      "id": 2954,
      "name": "Phường Thới Sơn"
    },
    {
      "id": 2955,
      "name": "Phường Trung An"
    },
    {
      "id": 2956,
      "name": "Phường Gò Công"
    },
    {
      "id": 2957,
      "name": "Phường Long Thuận"
    },
    {
      "id": 2958,
      "name": "Phường Sơn Qui"
    },
    {
      "id": 2959,
      "name": "Phường Bình Xuân"
    },
    {
      "id": 2960,
      "name": "Phường Mỹ Phước Tây"
    },
    {
      "id": 2961,
      "name": "Phường Thanh Hoà"
    },
    {
      "id": 2962,
      "name": "Phường Cai Lậy"
    },
    {
      "id": 2963,
      "name": "Phường Nhị Quý"
    },
    {
      "id": 2964,
      "name": "Xã Tân Phú"
    },
    {
      "id": 2965,
      "name": "Xã Thanh Hưng"
    },
    {
      "id": 2966,
      "name": "Xã An Hữu"
    },
    {
      "id": 2967,
      "name": "Xã Mỹ Lợi"
    },
    {
      "id": 2968,
      "name": "Xã Mỹ Đức Tây"
    },
    {
      "id": 2969,
      "name": "Xã Mỹ Thiện"
    },
    {
      "id": 2970,
      "name": "Xã Hậu Mỹ"
    },
    {
      "id": 2971,
      "name": "Xã Hội Cư"
    },
    {
      "id": 2972,
      "name": "Xã Cái Bè"
    },
    {
      "id": 2973,
      "name": "Xã Bình Phú"
    },
    {
      "id": 2974,
      "name": "Xã Hiệp Đức"
    },
    {
      "id": 2975,
      "name": "Xã Ngũ Hiệp"
    },
    {
      "id": 2976,
      "name": "Xã Long Tiên"
    },
    {
      "id": 2977,
      "name": "Xã Mỹ Thành"
    },
    {
      "id": 2978,
      "name": "Xã Thạnh Phú"
    },
    {
      "id": 2979,
      "name": "Xã Tân Phước 1"
    },
    {
      "id": 2980,
      "name": "Xã Tân Phước 2"
    },
    {
      "id": 2981,
      "name": "Xã Tân Phước 3"
    },
    {
      "id": 2982,
      "name": "Xã Hưng Thạnh"
    },
    {
      "id": 2983,
      "name": "Xã Tân Hương"
    },
    {
      "id": 2984,
      "name": "Xã Châu Thành"
    },
    {
      "id": 2985,
      "name": "Xã Long Hưng"
    },
    {
      "id": 2986,
      "name": "Xã Long Định"
    },
    {
      "id": 2987,
      "name": "Xã Vĩnh Kim"
    },
    {
      "id": 2988,
      "name": "Xã Kim Sơn"
    },
    {
      "id": 2989,
      "name": "Xã Bình Trưng"
    },
    {
      "id": 2990,
      "name": "Xã Mỹ Tịnh An"
    },
    {
      "id": 2991,
      "name": "Xã Lương Hoà Lạc"
    },
    {
      "id": 2992,
      "name": "Xã Tân Thuận Bình"
    },
    {
      "id": 2993,
      "name": "Xã Chợ Gạo"
    },
    {
      "id": 2994,
      "name": "Xã An Thạnh Thủy"
    },
    {
      "id": 2995,
      "name": "Xã Bình Ninh"
    },
    {
      "id": 2996,
      "name": "Xã Vĩnh Bình"
    },
    {
      "id": 2997,
      "name": "Xã Đồng Sơn"
    },
    {
      "id": 2998,
      "name": "Xã Phú Thành"
    },
    {
      "id": 2999,
      "name": "Xã Long Bình"
    },
    {
      "id": 3000,
      "name": "Xã Vĩnh Hựu"
    },
    {
      "id": 3001,
      "name": "Xã Gò Công Đông"
    },
    {
      "id": 3002,
      "name": "Xã Tân Điền"
    },
    {
      "id": 3003,
      "name": "Xã Tân Hoà"
    },
    {
      "id": 3004,
      "name": "Xã Tân Đông"
    },
    {
      "id": 3005,
      "name": "Xã Gia Thuận"
    },
    {
      "id": 3006,
      "name": "Xã Tân Thới"
    },
    {
      "id": 3007,
      "name": "Xã Tân Phú Đông"
    },
    {
      "id": 3008,
      "name": "Xã Tân Hồng"
    },
    {
      "id": 3009,
      "name": "Xã Tân Thành"
    },
    {
      "id": 3010,
      "name": "Xã Tân Hộ Cơ"
    },
    {
      "id": 3011,
      "name": "Xã An Phước"
    },
    {
      "id": 3012,
      "name": "Phường An Bình"
    },
    {
      "id": 3013,
      "name": "Phường Hồng Ngự"
    },
    {
      "id": 3014,
      "name": "Phường Thường Lạc"
    },
    {
      "id": 3015,
      "name": "Xã Thường Phước"
    },
    {
      "id": 3016,
      "name": "Xã Long Khánh"
    },
    {
      "id": 3017,
      "name": "Xã Long Phú Thuận"
    },
    {
      "id": 3018,
      "name": "Xã An Hoà"
    },
    {
      "id": 3019,
      "name": "Xã Tam Nông"
    },
    {
      "id": 3020,
      "name": "Xã Phú Thọ"
    },
    {
      "id": 3021,
      "name": "Xã Tràm Chim"
    },
    {
      "id": 3022,
      "name": "Xã Phú Cường"
    },
    {
      "id": 3023,
      "name": "Xã An Long"
    },
    {
      "id": 3024,
      "name": "Xã Thanh Bình"
    },
    {
      "id": 3025,
      "name": "Xã Tân Thạnh"
    },
    {
      "id": 3026,
      "name": "Xã Bình Thành"
    },
    {
      "id": 3027,
      "name": "Xã Tân Long"
    },
    {
      "id": 3028,
      "name": "Xã Tháp Mười"
    },
    {
      "id": 3029,
      "name": "Xã Thanh Mỹ"
    },
    {
      "id": 3030,
      "name": "Xã Mỹ Quí"
    },
    {
      "id": 3031,
      "name": "Xã Đốc Binh Kiều"
    },
    {
      "id": 3032,
      "name": "Xã Trường Xuân"
    },
    {
      "id": 3033,
      "name": "Xã Phương Thịnh"
    },
    {
      "id": 3034,
      "name": "Xã Phong Mỹ"
    },
    {
      "id": 3035,
      "name": "Xã Ba Sao"
    },
    {
      "id": 3036,
      "name": "Xã Mỹ Thọ"
    },
    {
      "id": 3037,
      "name": "Xã Bình Hàng Trung"
    },
    {
      "id": 3038,
      "name": "Xã Mỹ Hiệp"
    },
    {
      "id": 3039,
      "name": "Phường Cao Lãnh"
    },
    {
      "id": 3040,
      "name": "Phường Mỹ Ngãi"
    },
    {
      "id": 3041,
      "name": "Phường Mỹ Trà"
    },
    {
      "id": 3042,
      "name": "Xã Mỹ An Hưng"
    },
    {
      "id": 3043,
      "name": "Xã Tân Khánh Trung"
    },
    {
      "id": 3044,
      "name": "Xã Lấp Vò"
    },
    {
      "id": 3045,
      "name": "Xã Lai Vung"
    },
    {
      "id": 3046,
      "name": "Xã Hoà Long"
    },
    {
      "id": 3047,
      "name": "Xã Phong Hoà"
    },
    {
      "id": 3048,
      "name": "Phường Sa Đéc"
    },
    {
      "id": 3049,
      "name": "Xã Tân Dương"
    },
    {
      "id": 3050,
      "name": "Xã Phú Hựu"
    },
    {
      "id": 3051,
      "name": "Xã Tân Nhuận Đông"
    },
    {
      "id": 3052,
      "name": "Xã Tân Phú Trung"
    }
  ],
  "32": [
    {
      "id": 3053,
      "name": "Xã Mỹ Hoà Hưng"
    },
    {
      "id": 3054,
      "name": "Phường Long Xuyên"
    },
    {
      "id": 3055,
      "name": "Phường Bình Đức"
    },
    {
      "id": 3056,
      "name": "Phường Mỹ Thới"
    },
    {
      "id": 3057,
      "name": "Phường Châu Đốc"
    },
    {
      "id": 3058,
      "name": "Phường Vĩnh Tế"
    },
    {
      "id": 3059,
      "name": "Xã An Phú"
    },
    {
      "id": 3060,
      "name": "Xã Vĩnh Hậu"
    },
    {
      "id": 3061,
      "name": "Xã Nhơn Hội"
    },
    {
      "id": 3062,
      "name": "Xã Khánh Bình"
    },
    {
      "id": 3063,
      "name": "Xã Phú Hữu"
    },
    {
      "id": 3064,
      "name": "Xã Tân An"
    },
    {
      "id": 3065,
      "name": "Xã Châu Phong"
    },
    {
      "id": 3066,
      "name": "Xã Vĩnh Xương"
    },
    {
      "id": 3067,
      "name": "Phường Tân Châu"
    },
    {
      "id": 3068,
      "name": "Phường Long Phú"
    },
    {
      "id": 3069,
      "name": "Xã Phú Tân"
    },
    {
      "id": 3070,
      "name": "Xã Phú An"
    },
    {
      "id": 3071,
      "name": "Xã Bình Thạnh Đông"
    },
    {
      "id": 3072,
      "name": "Xã Chợ Vàm"
    },
    {
      "id": 3073,
      "name": "Xã Hoà Lạc"
    },
    {
      "id": 3074,
      "name": "Xã Phú Lâm"
    },
    {
      "id": 3075,
      "name": "Xã Châu Phú"
    },
    {
      "id": 3076,
      "name": "Xã Mỹ Đức"
    },
    {
      "id": 3077,
      "name": "Xã Vĩnh Thạnh Trung"
    },
    {
      "id": 3078,
      "name": "Xã Bình Mỹ"
    },
    {
      "id": 3079,
      "name": "Xã Thạnh Mỹ Tây"
    },
    {
      "id": 3080,
      "name": "Xã An Cư"
    },
    {
      "id": 3081,
      "name": "Xã Núi Cấm"
    },
    {
      "id": 3082,
      "name": "Phường Tịnh Biên"
    },
    {
      "id": 3083,
      "name": "Phường Thới Sơn"
    },
    {
      "id": 3084,
      "name": "Phường Chi Lăng"
    },
    {
      "id": 3085,
      "name": "Xã Ba Chúc"
    },
    {
      "id": 3086,
      "name": "Xã Tri Tôn"
    },
    {
      "id": 3087,
      "name": "Xã Ô Lâm"
    },
    {
      "id": 3088,
      "name": "Xã Cô Tô"
    },
    {
      "id": 3089,
      "name": "Xã Vĩnh Gia"
    },
    {
      "id": 3090,
      "name": "Xã An Châu"
    },
    {
      "id": 3091,
      "name": "Xã Bình Hoà"
    },
    {
      "id": 3092,
      "name": "Xã Cần Đăng"
    },
    {
      "id": 3093,
      "name": "Xã Vĩnh Hanh"
    },
    {
      "id": 3094,
      "name": "Xã Vĩnh An"
    },
    {
      "id": 3095,
      "name": "Xã Chợ Mới"
    },
    {
      "id": 3096,
      "name": "Xã Cù Lao Giêng"
    },
    {
      "id": 3097,
      "name": "Xã Hội An"
    },
    {
      "id": 3098,
      "name": "Xã Long Điền"
    },
    {
      "id": 3099,
      "name": "Xã Nhơn Mỹ"
    },
    {
      "id": 3100,
      "name": "Xã Long Kiến"
    },
    {
      "id": 3101,
      "name": "Xã Thoại Sơn"
    },
    {
      "id": 3102,
      "name": "Xã Óc Eo"
    },
    {
      "id": 3103,
      "name": "Xã Định Mỹ"
    },
    {
      "id": 3104,
      "name": "Xã Phú Hoà"
    },
    {
      "id": 3105,
      "name": "Xã Vĩnh Trạch"
    },
    {
      "id": 3106,
      "name": "Xã Tây Phú"
    },
    {
      "id": 3107,
      "name": "Xã Vĩnh Bình"
    },
    {
      "id": 3108,
      "name": "Xã Vĩnh Thuận"
    },
    {
      "id": 3109,
      "name": "Xã Vĩnh Phong"
    },
    {
      "id": 3110,
      "name": "Xã Vĩnh Hoà"
    },
    {
      "id": 3111,
      "name": "Xã U Minh Thượng"
    },
    {
      "id": 3112,
      "name": "Xã Đông Hoà"
    },
    {
      "id": 3113,
      "name": "Xã Tân Thạnh"
    },
    {
      "id": 3114,
      "name": "Xã Đông Hưng"
    },
    {
      "id": 3115,
      "name": "Xã An Minh"
    },
    {
      "id": 3116,
      "name": "Xã Vân Khánh"
    },
    {
      "id": 3117,
      "name": "Xã Tây Yên"
    },
    {
      "id": 3118,
      "name": "Xã Đông Thái"
    },
    {
      "id": 3119,
      "name": "Xã An Biên"
    },
    {
      "id": 3120,
      "name": "Xã Định Hoà"
    },
    {
      "id": 3121,
      "name": "Xã Gò Quao"
    },
    {
      "id": 3122,
      "name": "Xã Vĩnh Hoà Hưng"
    },
    {
      "id": 3123,
      "name": "Xã Vĩnh Tuy"
    },
    {
      "id": 3124,
      "name": "Xã Giồng Riềng"
    },
    {
      "id": 3125,
      "name": "Xã Thạnh Hưng"
    },
    {
      "id": 3126,
      "name": "Xã Long Thạnh"
    },
    {
      "id": 3127,
      "name": "Xã Hoà Hưng"
    },
    {
      "id": 3128,
      "name": "Xã Ngọc Chúc"
    },
    {
      "id": 3129,
      "name": "Xã Hoà Thuận"
    },
    {
      "id": 3130,
      "name": "Xã Tân Hội"
    },
    {
      "id": 3131,
      "name": "Xã Tân Hiệp"
    },
    {
      "id": 3132,
      "name": "Xã Thạnh Đông"
    },
    {
      "id": 3133,
      "name": "Xã Thạnh Lộc"
    },
    {
      "id": 3134,
      "name": "Xã Châu Thành"
    },
    {
      "id": 3135,
      "name": "Xã Bình An"
    },
    {
      "id": 3136,
      "name": "Xã Hòn Đất"
    },
    {
      "id": 3137,
      "name": "Xã Sơn Kiên"
    },
    {
      "id": 3138,
      "name": "Xã Mỹ Thuận"
    },
    {
      "id": 3139,
      "name": "Xã Bình Sơn"
    },
    {
      "id": 3140,
      "name": "Xã Bình Giang"
    },
    {
      "id": 3141,
      "name": "Xã Giang Thành"
    },
    {
      "id": 3142,
      "name": "Xã Vĩnh Điều"
    },
    {
      "id": 3143,
      "name": "Xã Hoà Điền"
    },
    {
      "id": 3144,
      "name": "Xã Kiên Lương"
    },
    {
      "id": 3145,
      "name": "Xã Sơn Hải"
    },
    {
      "id": 3146,
      "name": "Xã Hòn Nghệ"
    },
    {
      "id": 3147,
      "name": "Đặc khu Kiên Hải"
    },
    {
      "id": 3148,
      "name": "Phường Vĩnh Thông"
    },
    {
      "id": 3149,
      "name": "Phường Rạch Giá"
    },
    {
      "id": 3150,
      "name": "Phường Hà Tiên"
    },
    {
      "id": 3151,
      "name": "Phường Tô Châu"
    },
    {
      "id": 3152,
      "name": "Xã Tiên Hải"
    },
    {
      "id": 3153,
      "name": "Đặc khu Phú Quốc"
    },
    {
      "id": 3154,
      "name": "Đặc khu Thổ Châu"
    }
  ],
  "33": [
    {
      "id": 3155,
      "name": "Phường Ninh Kiều"
    },
    {
      "id": 3156,
      "name": "Phường Cái Khế"
    },
    {
      "id": 3157,
      "name": "Phường Tân An"
    },
    {
      "id": 3158,
      "name": "Phường An Bình"
    },
    {
      "id": 3159,
      "name": "Phường Thới An Đông"
    },
    {
      "id": 3160,
      "name": "Phường Bình Thủy"
    },
    {
      "id": 3161,
      "name": "Phường Long Tuyền"
    },
    {
      "id": 3162,
      "name": "Phường Cái Răng"
    },
    {
      "id": 3163,
      "name": "Phường Hưng Phú"
    },
    {
      "id": 3164,
      "name": "Phường Ô Môn"
    },
    {
      "id": 3165,
      "name": "Phường Thới Long"
    },
    {
      "id": 3166,
      "name": "Phường Phước Thới"
    },
    {
      "id": 3167,
      "name": "Phường Trung Nhứt"
    },
    {
      "id": 3168,
      "name": "Phường Thốt Nốt"
    },
    {
      "id": 3169,
      "name": "Phường Thuận Hưng"
    },
    {
      "id": 3170,
      "name": "Phường Tân Lộc"
    },
    {
      "id": 3171,
      "name": "Xã Phong Điền"
    },
    {
      "id": 3172,
      "name": "Xã Nhơn Ái"
    },
    {
      "id": 3173,
      "name": "Xã Trường Long"
    },
    {
      "id": 3174,
      "name": "Xã Thới Lai"
    },
    {
      "id": 3175,
      "name": "Xã Đông Thuận"
    },
    {
      "id": 3176,
      "name": "Xã Trường Xuân"
    },
    {
      "id": 3177,
      "name": "Xã Trường Thành"
    },
    {
      "id": 3178,
      "name": "Xã Cờ Đỏ"
    },
    {
      "id": 3179,
      "name": "Xã Đông Hiệp"
    },
    {
      "id": 3180,
      "name": "Xã Thạnh Phú"
    },
    {
      "id": 3181,
      "name": "Xã Thới Hưng"
    },
    {
      "id": 3182,
      "name": "Xã Trung Hưng"
    },
    {
      "id": 3183,
      "name": "Xã Vĩnh Thạnh"
    },
    {
      "id": 3184,
      "name": "Xã Vĩnh Trinh"
    },
    {
      "id": 3185,
      "name": "Xã Thạnh An"
    },
    {
      "id": 3186,
      "name": "Xã Thạnh Quới"
    },
    {
      "id": 3187,
      "name": "Xã Hỏa Lựu"
    },
    {
      "id": 3188,
      "name": "Phường Vị Thanh"
    },
    {
      "id": 3189,
      "name": "Phường Vị Tân"
    },
    {
      "id": 3190,
      "name": "Xã Vị Thủy"
    },
    {
      "id": 3191,
      "name": "Xã Vĩnh Thuận Đông"
    },
    {
      "id": 3192,
      "name": "Xã Vị Thanh 1"
    },
    {
      "id": 3193,
      "name": "Xã Vĩnh Tường"
    },
    {
      "id": 3194,
      "name": "Xã Vĩnh Viễn"
    },
    {
      "id": 3195,
      "name": "Xã Xà Phiên"
    },
    {
      "id": 3196,
      "name": "Xã Lương Tâm"
    },
    {
      "id": 3197,
      "name": "Phường Long Bình"
    },
    {
      "id": 3198,
      "name": "Phường Long Mỹ"
    },
    {
      "id": 3199,
      "name": "Phường Long Phú 1"
    },
    {
      "id": 3200,
      "name": "Xã Thạnh Xuân"
    },
    {
      "id": 3201,
      "name": "Xã Tân Hoà"
    },
    {
      "id": 3202,
      "name": "Xã Trường Long Tây"
    },
    {
      "id": 3203,
      "name": "Xã Châu Thành"
    },
    {
      "id": 3204,
      "name": "Xã Đông Phước"
    },
    {
      "id": 3205,
      "name": "Xã Phú Hữu"
    },
    {
      "id": 3206,
      "name": "Phường Đại Thành"
    },
    {
      "id": 3207,
      "name": "Phường Ngã Bảy"
    },
    {
      "id": 3208,
      "name": "Xã Tân Bình"
    },
    {
      "id": 3209,
      "name": "Xã Hoà An"
    },
    {
      "id": 3210,
      "name": "Xã Phương Bình"
    },
    {
      "id": 3211,
      "name": "Xã Tân Phước Hưng"
    },
    {
      "id": 3212,
      "name": "Xã Hiệp Hưng"
    },
    {
      "id": 3213,
      "name": "Xã Phụng Hiệp"
    },
    {
      "id": 3214,
      "name": "Xã Thạnh Hoà"
    },
    {
      "id": 3215,
      "name": "Phường Phú Lợi"
    },
    {
      "id": 3216,
      "name": "Phường Sóc Trăng"
    },
    {
      "id": 3217,
      "name": "Phường Mỹ Xuyên"
    },
    {
      "id": 3218,
      "name": "Xã Hoà Tú"
    },
    {
      "id": 3219,
      "name": "Xã Gia Hoà"
    },
    {
      "id": 3220,
      "name": "Xã Nhu Gia"
    },
    {
      "id": 3221,
      "name": "Xã Ngọc Tố"
    },
    {
      "id": 3222,
      "name": "Xã Trường Khánh"
    },
    {
      "id": 3223,
      "name": "Xã Đại Ngãi"
    },
    {
      "id": 3224,
      "name": "Xã Tân Thạnh"
    },
    {
      "id": 3225,
      "name": "Xã Long Phú"
    },
    {
      "id": 3226,
      "name": "Xã Nhơn Mỹ"
    },
    {
      "id": 3227,
      "name": "Xã Phong Nẫm"
    },
    {
      "id": 3228,
      "name": "Xã An Lạc Thôn"
    },
    {
      "id": 3229,
      "name": "Xã Kế Sách"
    },
    {
      "id": 3230,
      "name": "Xã Thới An Hội"
    },
    {
      "id": 3231,
      "name": "Xã Đại Hải"
    },
    {
      "id": 3232,
      "name": "Xã Phú Tâm"
    },
    {
      "id": 3233,
      "name": "Xã An Ninh"
    },
    {
      "id": 3234,
      "name": "Xã Thuận Hoà"
    },
    {
      "id": 3235,
      "name": "Xã Hồ Đắc Kiện"
    },
    {
      "id": 3236,
      "name": "Xã Mỹ Tú"
    },
    {
      "id": 3237,
      "name": "Xã Long Hưng"
    },
    {
      "id": 3238,
      "name": "Xã Mỹ Phước"
    },
    {
      "id": 3239,
      "name": "Xã Mỹ Hương"
    },
    {
      "id": 3240,
      "name": "Xã Vĩnh Hải"
    },
    {
      "id": 3241,
      "name": "Xã Lai Hoà"
    },
    {
      "id": 3242,
      "name": "Phường Vĩnh Phước"
    },
    {
      "id": 3243,
      "name": "Phường Vĩnh Châu"
    },
    {
      "id": 3244,
      "name": "Phường Khánh Hoà"
    },
    {
      "id": 3245,
      "name": "Xã Tân Long"
    },
    {
      "id": 3246,
      "name": "Phường Ngã Năm"
    },
    {
      "id": 3247,
      "name": "Phường Mỹ Quới"
    },
    {
      "id": 3248,
      "name": "Xã Phú Lộc"
    },
    {
      "id": 3249,
      "name": "Xã Vĩnh Lợi"
    },
    {
      "id": 3250,
      "name": "Xã Lâm Tân"
    },
    {
      "id": 3251,
      "name": "Xã Thạnh Thới An"
    },
    {
      "id": 3252,
      "name": "Xã Tài Văn"
    },
    {
      "id": 3253,
      "name": "Xã Liêu Tú"
    },
    {
      "id": 3254,
      "name": "Xã Lịch Hội Thượng"
    },
    {
      "id": 3255,
      "name": "Xã Trần Đề"
    },
    {
      "id": 3256,
      "name": "Xã An Thạnh"
    },
    {
      "id": 3257,
      "name": "Xã Cù Lao Dung"
    }
  ],
  "34": [
    {
      "id": 3258,
      "name": "Phường An Xuyên"
    },
    {
      "id": 3259,
      "name": "Phường Lý Văn Lâm"
    },
    {
      "id": 3260,
      "name": "Phường Tân Thành"
    },
    {
      "id": 3261,
      "name": "Phường Hòa Thành"
    },
    {
      "id": 3262,
      "name": "Xã Tân Thuận"
    },
    {
      "id": 3263,
      "name": "Xã Tân Tiến"
    },
    {
      "id": 3264,
      "name": "Xã Tạ An Khương"
    },
    {
      "id": 3265,
      "name": "Xã Trần Phán"
    },
    {
      "id": 3266,
      "name": "Xã Thanh Tùng"
    },
    {
      "id": 3267,
      "name": "Xã Đầm Dơi"
    },
    {
      "id": 3268,
      "name": "Xã Quách Phẩm"
    },
    {
      "id": 3269,
      "name": "Xã U Minh"
    },
    {
      "id": 3270,
      "name": "Xã Nguyễn Phích"
    },
    {
      "id": 3271,
      "name": "Xã Khánh Lâm"
    },
    {
      "id": 3272,
      "name": "Xã Khánh An"
    },
    {
      "id": 3273,
      "name": "Xã Phan Ngọc Hiển"
    },
    {
      "id": 3274,
      "name": "Xã Đất Mũi"
    },
    {
      "id": 3275,
      "name": "Xã Tân Ân"
    },
    {
      "id": 3276,
      "name": "Xã Khánh Bình"
    },
    {
      "id": 3277,
      "name": "Xã Đá Bạc"
    },
    {
      "id": 3278,
      "name": "Xã Khánh Hưng"
    },
    {
      "id": 3279,
      "name": "Xã Sông Đốc"
    },
    {
      "id": 3280,
      "name": "Xã Trần Văn Thời"
    },
    {
      "id": 3281,
      "name": "Xã Thới Bình"
    },
    {
      "id": 3282,
      "name": "Xã Trí Phải"
    },
    {
      "id": 3283,
      "name": "Xã Tân Lộc"
    },
    {
      "id": 3284,
      "name": "Xã Hồ Thị Kỷ"
    },
    {
      "id": 3285,
      "name": "Xã Biển Bạch"
    },
    {
      "id": 3286,
      "name": "Xã Đất Mới"
    },
    {
      "id": 3287,
      "name": "Xã Năm Căn"
    },
    {
      "id": 3288,
      "name": "Xã Tam Giang"
    },
    {
      "id": 3289,
      "name": "Xã Cái Đôi Vàm"
    },
    {
      "id": 3290,
      "name": "Xã Nguyễn Việt Khái"
    },
    {
      "id": 3291,
      "name": "Xã Phú Tân"
    },
    {
      "id": 3292,
      "name": "Xã Phú Mỹ"
    },
    {
      "id": 3293,
      "name": "Xã Lương Thế Trân"
    },
    {
      "id": 3294,
      "name": "Xã Tân Hưng"
    },
    {
      "id": 3295,
      "name": "Xã Hưng Mỹ"
    },
    {
      "id": 3296,
      "name": "Xã Cái Nước"
    },
    {
      "id": 3297,
      "name": "Phường Bạc Liêu"
    },
    {
      "id": 3298,
      "name": "Phường Vĩnh Trạch"
    },
    {
      "id": 3299,
      "name": "Phường Hiệp Thành"
    },
    {
      "id": 3300,
      "name": "Phường Giá Rai"
    },
    {
      "id": 3301,
      "name": "Phường Láng Tròn"
    },
    {
      "id": 3302,
      "name": "Xã Phong Thạnh"
    },
    {
      "id": 3303,
      "name": "Xã Hồng Dân"
    },
    {
      "id": 3304,
      "name": "Xã Vĩnh Lộc"
    },
    {
      "id": 3305,
      "name": "Xã Ninh Thạnh Lợi"
    },
    {
      "id": 3306,
      "name": "Xã Ninh Quới"
    },
    {
      "id": 3307,
      "name": "Xã Gành Hào"
    },
    {
      "id": 3308,
      "name": "Xã Định Thành"
    },
    {
      "id": 3309,
      "name": "Xã An Trạch"
    },
    {
      "id": 3310,
      "name": "Xã Long Điền"
    },
    {
      "id": 3311,
      "name": "Xã Đông Hải"
    },
    {
      "id": 3312,
      "name": "Xã Hoà Bình"
    },
    {
      "id": 3313,
      "name": "Xã Vĩnh Mỹ"
    },
    {
      "id": 3314,
      "name": "Xã Vĩnh Hậu"
    },
    {
      "id": 3315,
      "name": "Xã Phước Long"
    },
    {
      "id": 3316,
      "name": "Xã Vĩnh Phước"
    },
    {
      "id": 3317,
      "name": "Xã Phong Hiệp"
    },
    {
      "id": 3318,
      "name": "Xã Vĩnh Thanh"
    },
    {
      "id": 3319,
      "name": "Xã Vĩnh Lợi"
    },
    {
      "id": 3320,
      "name": "Xã Hưng Hội"
    },
    {
      "id": 3321,
      "name": "Xã Châu Thới"
    }
  ]
};
