import 'dotenv/config'

let key={}

key={
    port:process.env.PORT,
    mongo_url:process.env.DATABASE_URI,
    FRONT_URL:process.env.FRONT_URL,
    BASE_URL:process.env.BASE_URL,
    SECRETKEY:process.env.SECRETKEY,
    DEFAULTADMIN_EMAIL:process.env.DEFAULTADMIN_EMAIL,
    DEFAULTADMIN_PWD:process.env.DEFAULTADMIN_PWD,
    DEFAULTADMIN_ID:process.env.DEFAULTADMIN_ID
}

export default key