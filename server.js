const express = require('express')
const mongoose = require('mongoose')
const exhbs = require('express-handlebars')
const path = require('path')
const SinhVienModel = require('./models/sinhVien')
const app = express()
const port = 3000


//connnect to database
const uri = 'mongodb+srv://tientnph19989:tien03@cluster0.jicczym.mongodb.net/ThiThu'
mongoose.connect(uri, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
}
).then(() => {
     console.log('====================================');
     console.log('Kết nối database thành công');
     console.log('====================================');
}).catch((err) => {
     console.log('====================================');
     console.log('Lỗi không thể kết nối với database', err);
     console.log('====================================');
})
// Set up middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//handlebars
app.engine('handlebars', exhbs.engine())
app.set('view engine', 'handlebars')
//danh sách sinh viên
app.get('/danhsachsinhvien', async (req, res, next) => {
     await SinhVienModel.find({}).lean() /// thêm 
          .then((students) => {
               res.render(path.join(__dirname, 'views/home.hbs'), { students })
          }).catch(next)
})

//get form thêm sinh viên
app.get('/themsinhvien', (req, res) => {
     res.render(path.join(__dirname, 'views/themsinhvien.hbs'))
})

//post sinh viên
app.post('/themsinhvien/new', async (req, res, next) => {
     const namesv = req.body.namesv;
     const avatar = req.body.avatar;
     const namsx = req.body.namsx;
     const gia = req.body.gia;

        // Kiểm tra các trường dữ liệu không được rỗng
        if (!namesv || !avatar || !namsx  || !gia) {
          // Thông báo cho người dùng nhập đầy đủ
          return res.status(400).send("Vui lòng nhập đầy đủ thông tin.");
     }

     // Kiểm tra giá trị của diemtb không nhỏ hơn hoặc bằng 0
     if (parseInt(namsx) <= 0) {
          // Thông báo cho người dùng nhập giá trị hợp lệ
          return res.status(400).send("Điểm trung bình phải lớn hơn 0.");
     }
     await SinhVienModel.create({ namesv: namesv, avatar: avatar, namsx: namsx, gia: gia })
          .then(() => {
               res.redirect('/danhsachsinhvien');
          })
          .catch(next)
})

//get form sửa sinh viên
app.get('/edit-sinh-vien/:_id', async (req, res, next) => {
     await SinhVienModel.findById(req.params._id)
          .then((students) => {
               res.render(path.join(__dirname, 'views/edit.hbs'), { students })
          })
          .catch(next)
})

//Sửa sinh viên
app.post('/edit-sinh-vien', (req, res) => {
     SinhVienModel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
          .then((updateSinhVien) => {
               res.redirect('/danhsachsinhvien');
          })
          .catch(error => {
               console.log('Lỗi trong quá trình cập nhật:', error);
          })
});

// //chi tiết sinh viên
// app.get('/chitietsinhvien', async (req, res, next) => {
//      await SinhVienModel.findById(req.params.id)
//           .then((students) => {
//                res.render(path.join(__dirname, 'views/chitietsinhvien.hbs'), { students })
//           }).catch(next)
// })

//delete sinh vien

app.get('/delete-sinh-vien/:id', (req, res, next) => {
     const IdStudent = req.params.id;
     SinhVienModel.findOneAndDelete({ _id: IdStudent })
          .then(() => {
               res.redirect('/danhsachsinhvien')
          })
          .catch(next)


})
app.get('/timkiemsinhvien', async (req, res, next) => {
     try {
          const keyword = req.query.keyword; // Lấy từ khóa tìm kiếm từ query params
          const result = await SinhVienModel.find({ namesv: { $regex: keyword, $options: 'i' } }); // Tìm kiếm trong CSDL
          res.render('/danhsachsinhvien', { students: result }); // Render kết quả tìm kiếm ra view timkiem
     } catch (error) {
          next(error);
     }
});


app.listen(port, () => {
     console.log('====================================');
     console.log(`Server chạy ở cổng: ${port}`);
     console.log('====================================');
})