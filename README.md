# 餐廳清單

一個收藏喜好餐廳的清單頁面。

![image](/public/images/homepage.png)

## 功能說明

1. 可以瀏覽所有的收藏餐廳。
2. 點擊餐廳圖示可以瀏覽詳細資料。
3. 點擊詳細資料裡的`導航按鈕`可以連結至 `google map`。
4. 在搜尋欄位可以輸入關鍵字(餐廳中/英文名、類型)篩選餐廳。
5. 點擊最上層的`我的餐廳清單 `可以返回首頁。

## 環境建置
- Visual Studio Code
- Node.js + Express
- Express-handlebars

## 安裝與執行步驟
1. 使用終端機(Terminal)下載此專案
```
git clone https://github.com/MioRain/ac_restaurant_list.git
```
2. 進入專案資料夾並載入相關套件
```
cd ac_restaurant_list
npm install nodemon
npm install
```
3. 啟動伺服器
```
npm run dev
```
4. 當出現以下畫面，即可於瀏覽器網址內輸入 `http://localhost:3000` 進入餐廳清單囉！
```
The Express server is running on http://localhost:3000
```