# 餐廳清單

一個收藏喜好餐廳的清單頁面。

![image](/public/images/homepage3.png)
![image](/public/images/homepage4.png)

## 功能說明

1. 可以瀏覽所有的收藏餐廳。
2. 點擊餐廳圖示可以瀏覽詳細資料。
3. 點擊詳細資料裡的`導航按鈕`可以連結至 `google map`。
4. 在搜尋欄位可以輸入關鍵字(餐廳中/英文名、類型)篩選餐廳。
5. 點擊最上層的`我的餐廳清單 `可以返回首頁。
6. 可以點擊 Create 新增餐廳清單
7. 可以點擊 Edit 更新清單內容
8. 可以點擊 Delete 刪除目標餐廳
9. 可以註冊使用者帳戶
10. 可以登入使用者帳戶
11. 可以登出使用者帳戶

## 環境建置
- Visual Studio Code
- Node.js + Express(4.16.4)
- Express-handlebars(3.0.0)
- Mongoose(6.3.4) + Mongoose-connect(0.0.3)
- passport(0.4.1) + passport-facebook(3.0.0)

## 安裝與執行步驟
1. 使用終端機(Terminal)下載此專案
```
git clone https://github.com/MioRain/ac_restaurant_list.git
```
2. 進入專案資料夾並載入相關套件
```
cd ac_restaurant_list & npm install
```
2. 根據 .env.example 創建 .env 檔案並替換內容
MONGODB_URI = mongodb+srv://`id:password`@cluster0.un1ij.mongodb.net/restaurant-list?retryWrites=true&w=majority

3. 輸入種子資料
```
npm run seed
```

4. 啟動伺服器
```
npm run dev
```
5. 當出現以下畫面，即可於瀏覽器網址內輸入 `http://localhost:3000` 進入首頁囉！
```
The Express server is running on http://localhost:3000
MongoDB connected!
```

測試用帳號密碼
```
email:user1@example.com
password:12345678
```
```
email:user2@example.com
password:12345678
```