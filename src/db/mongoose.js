const mongoose = require('mongoose')
mongoose
  .connect(encodeURI(process.env.MONGODB_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log(`MongoDB Connected: ${res.connection.host}`)
  })
  .catch((e) => {
    console.log(e.message)
  })
