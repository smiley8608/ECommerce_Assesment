
const view = 'local'

let key = {}
if(view=='local'){
    key={
        apiurl:'http://localhost:2053',
        frontendurl:'http://localhost:3000'
    }
}

export default key