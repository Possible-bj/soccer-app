const mongoose = require('mongoose')
mongoose.connect(encodeURI(process.env.MONGODB_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
).catch(e => {console.log(e.message)})