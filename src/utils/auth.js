const fs = require('fs')
const create = (name, pass, callback) => {
    const File = loadToken()
    const duplicateName = File.find((data) => data.admin === name)
    if (duplicateName) {
        return callback({
            feedBack: 'admin already exist!'
        })
    }
    File.push({
        admin: name,
        lockpass: pass
    })
    saveFile(File)
    callback({
        feedBack: 'admin created!'
    })
}
const edit = (name, pass, callback) => {
    const File = loadToken()
    const adminToEdit = File.find((data) => data.admin === name)
    if (adminToEdit) {
        const adminToKeep = File.filter((data) => data.admin !== name)
        adminToEdit.lockpass = pass
        adminToKeep.push(adminToEdit)
        saveFile(adminToKeep)
        callback({
            feedBack: 'admin updated!'
        })
    } else {
        callback({
            feedBack: 'admin does not exist!'
        })
    }            
}
const remove = (name, callback) => {
    const File = loadToken()
    const adminToRemove = File.find((data) => data.admin === name)
    if (adminToRemove) {
        const adminToKeep = File.filter((data) => data.admin !== name)
        saveFile(adminToKeep)
        callback({
            feedBack: 'admin deleted!'
        })
    } else {
        callback({
            feedBack: 'admin does not exist!'
        })
    }   
}
const authenticate = (lockpass, callback) => {
    const tokens = loadToken()
    const token = tokens.find((data) => data.lockpass === lockpass)
    if (!token) {
        callback({
            admin: 'null',
            feedBack: 'fail'
        })
    } else {
        callback({
            admin: token.admin,
            feedBack: 'success'
        })
    }
}
const saveFile = (File) => {
    const str = JSON.stringify(File)
    fs.writeFileSync('./tokens.json', str)
}
const loadToken = () => {
    try {
        const token = fs.readFileSync('./tokens.json')
        return JSON.parse(token)
    } catch {
        return []
    }
}
module.exports = {
    auth: authenticate,
    create: create,
    edit: edit,
    delete: remove
}