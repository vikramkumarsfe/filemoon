axios.defaults.baseURL = SERVER

window.onload = () =>{
    userProfile(),
    fetchFilesReport(),
    fetchRecentFiles(),
    fetchRecentShares()
}

const getToken = () =>{
        const options = {
            headers : {
                Authorization : `Bearer ${localStorage.getItem("authToken")}`
            }
        }
        return options
}

const getSize = b => {
  if (b < 0 || isNaN(b)) return "Invalid";
  const u = ["B","KB","MB","GB","TB"];
  let i = 0;
  while (b >= 1024 && i < u.length - 1) b /= 1024, i++;
  return `${b.toFixed(2)} ${u[i]}`;
};

const toast = new Notyf({ position : { x: 'center', y: 'top' }})

const fetchRecentFiles = async() =>{
    try 
    {
        const { data } = await axios.get('/api/file?limit=3', getToken())
        const recentFiles = document.getElementById('recent-file-box')
        for ( let item of data)
        {
            const ui = `
            <div class="flex justify-between items-center">
                <div>
                    <h1 class=" font-medium text-zinc-500"> ${item.filename}</h1>
                    <small class="text-gray-500"> ${getSize(item.size)} </small>
                </div>
                <p class=" text-sm text-gray-600 "> ${moment(item.createdAt).format('DD MM YYYY hh:mm A')}</p>
            </div>`

            recentFiles.innerHTML += ui
        }
    }
    catch(err)
    {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}


const fetchRecentShares = async () =>{
    try 
    {
        const { data } = await axios.get('/api/share?limit=3', getToken())
        console.log(data)
        const recentShare = document.getElementById('recent-shared-file')

        for( let item of data )
        {
            // console.log(item)
            const ui = `
            <div class="flex justify-between items-center">
                <div>
                    <h1 class=" font-medium text-zinc-500"> ${ item.file.filename }</h1>
                    <small class="text-gray-500"> ${ getSize(item.file.size)} </small>
                </div>
                <p class=" text-sm text-gray-600 "> ${moment(item.createdAt).format('DD MM YYYY hh:mm A')}</p>
            </div>`

            recentShare.innerHTML += ui
        }
    }
    catch (err)
    {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}


const fetchFilesReport = async () =>{
    try 
    {
        const {data} = await axios.get('/api/dashboard', getToken())
        const report = document.getElementById('report-box')

        for( let item of data)
        {
            console.log(item)
            const ui = `
            <div class="bg-white shadow-lg h-[150px] rounded flex items-center justify-center gap-3  overflow-hidden">
                <div class="h-[110px] rounded-full bg-radial from-pink-400 from-40% to-fuchsia-700 w-[110px] rounded-full ml-[-120px] flex items-center justify-center text-white">
                    <i class="ri-file-2-fill text-5xl"></i>
                </div>
                <div>
                    <h1 class=" font-medium text-xl text-center"> ${item._id.split('/')[0]} </h1>
                    <p class="text-3xl font-bold text-center"> ${item.total} </p>
                </div>   
            </div>`

            report.innerHTML += ui
        }
    }
    catch (err)
    {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}