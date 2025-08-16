axios.defaults.baseURL = SERVER
const getSession = async () => {
    try {
        const session = localStorage.getItem("authToken")

        if(!session){
            return null
        }

        const payload = {
            token : session
        }

        const { data } = await axios.post('/api/jwt/verify', payload)
        return data
    }

    catch(err) {
        return null
    }
    

}

const logout = () => {
    localStorage.clear()
    location.href = '/'
}

const userProfile = async()=>{
    const session = await getSession()
    const fullname = document.getElementById('fullname')
    const email = document.getElementById('email')

    if(!session)
    {
        location.href = '/'
        return
    }

    fullname.innerHTML = session.fullname
    email.innerHTML = session.email
}


