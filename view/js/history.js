axios.defaults.baseURL = SERVER

window.onload = () => {
    userProfile()
    fetchtHistory()
}

const getToken = () =>{
        const options = {
            headers : {
                Authorization : `Bearer ${localStorage.getItem("authToken")}`
            }
        }
        return options
}

const toast = new Notyf({ position : { x: 'center', y: 'top' }})

const fetchtHistory = async () => {
    try 
    {
        const {data} = await axios.get('/api/share', getToken())
        const table = document.getElementById("table")
        const notFoundUi = `
        <div class="p-16 text-center">
        <h1 class="text-4xl text-gray-300"> Oops ! You have not History yet!</h1>
        </div>`

        if(data.length === 0)
            return table.innerHTML = notFoundUi

        for ( let item of data) 
        {
            console.log(item)
            const ui = `
            <tr class="bg-white text-gray-500 border-b border-gray-200">
                <td class="py-3 pl-6 "> ${item.file.filename}</td>
                <td> ${item.receiverEmail}</td>
                <td> ${moment(item.createdAt).format('DD MM YYYY , hh:mm A')}</td>
            </tr>`

            table.innerHTML +=  ui
        }
    }
    catch(err) 
    {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}

