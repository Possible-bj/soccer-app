const mongoose = require('mongoose')
mongoose.connect(encodeURI(process.env.MONGODB_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
).then((result) => {
    console.log(result)
}).catch(e => {
    console.log(e.message)
})