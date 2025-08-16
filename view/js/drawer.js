axios.defaults.baseURL = SERVER
window.onload = ()=>{
    fetchFile()
    userProfile()
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

const toggleDrawer = () => {
    const drawer = document.getElementById('drawer')
    const finalRight = drawer.style.right

    if(finalRight === '0px')
    {
        drawer.style.right = '-33.33%'
        return
    }

    drawer.style.right = '0px'
}

const uploadFile = async(e) =>{
    const uploadButton = document.getElementById('uploadButton')
    try 
    {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)

        //Checking file size
        const file = formData.get('file')
        const size = getSize(file.size)
        if(size>200)
            return toast.error("File size is too large max size allowd 200Mb!")


        const options = {
            onUploadProgress : (e)=>{
                const loaded = e.loaded
                const total = e.total
                const percentageValue = Math.floor((loaded*100)/total)
                const progress = document.getElementById("progress")
                const percent =  document.getElementById("percent")
                progress.style.width = percentageValue + '%'
                percent.innerHTML = percentageValue + '%'
            },
            headers : {
                Authorization : `Bearer ${localStorage.getItem("authToken")}`
            }
            

        }
        uploadButton.disabled = true
        const { data } =await axios.post('/api/file', formData, options)
        progress.style.width = 0
        percent.innerHTML = ''
        form.reset()
        toast.success(`${data.filename} Uploaded successfully!`)
        toggleDrawer()
        fetchFile()
    }
    catch(err) {
        console.log(err.message)
    }
    finally {
        uploadButton.disabled = false
    }
}

const getSize = b => {
  if (b < 0 || isNaN(b)) return "Invalid";
  const u = ["B","KB","MB","GB","TB"];
  let i = 0;
  while (b >= 1024 && i < u.length - 1) b /= 1024, i++;
  return `${b.toFixed(2)} ${u[i]}`;
};

const fetchFile = async( ) =>{
    try 
    {
        const { data } = await axios.get('/api/file', getToken())
        const table = document.getElementById('files-table')
        table.innerHTML = ''
        for ( let file of data )
        {
            const ui = `<tr class="bg-white text-gray-500 border-b border-gray-200">
                                <td class="py-3 pl-6 capitalize"> ${file.filename}</td>
                                <td> ${file.type}</td>
                                <td> ${getSize(file.size)}</td>
                                <td> ${moment(file.createdAt).format('DD-MM-YY HH:MM')}</td>
                                <td>
                                    <div class="space-x-2 ">
                                        <button class="bg-rose-400 px-2 py-1 rounded text-white hover:bg-rose-600" onclick="deleteFile('${file._id}', this)">
                                            <i class="ri-delete-bin-line"></i>
                                        </button>

                                        <button class="bg-green-400 px-2 py-1 rounded text-white hover:bg-green-600" onclick="downloadFile('${file._id}', '${file.filename}', this)">
                                            <i class="ri-download-2-line"></i>
                                        </button>

                                        <button class="bg-amber-400 px-2 py-1 rounded text-white hover:bg-amber-600" onclick="openModelForShare('${file._id}', '${file.filename}')">
                                            <i class="ri-share-2-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>`
                            table.innerHTML += ui
        }
    }
    catch(err)
    {
        console.log(err.message)
    }
}

const deleteFile = async (id, button) =>{
    try 
    {
        button.innerHTML = '<i class="ri-loader-2-line"></i>'
        button.disabled = true
        const { data: file } = await axios.delete(`/api/file/${id}`)
        toast.success(`${file.filename} deleted successfully!`)
        setTimeout(()=>{
            fetchFile()
        },2000)
        
    }
    catch(err)
    {
        toast.error(`File not deleted!`)
        console.error(err)
    }
    finally {
        button.innerHTML = '<i class="ri-delete-bin-line"></i>'
        button.disabled = false
    }
}

const downloadFile = async (id, name, button) => {
    try {
        button.innerHTML = '<i class="ri-loader-2-line"></i>'
        button.disabled = true
        const options = { responseType: 'blob' };
        const { data } = await axios.get(`/api/file/download/${id}`, options);

        const extn = data.type ? data.type.split("/").pop() : name;
        const fileName = extn ? `${name}.${extn}` : '';

        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a); 
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    } catch (err) {
        toast.error(err.response?.data?.message || err.message);
    }
    finally {
        button.innerHTML = '<i class="ri-download-2-line"></i>'
        button.disabled = false
    }
};

const openModelForShare = (id, name) => {
    Swal.fire({
        showConfirmButton: false,
        html: `
        <form class="text-left flex flex-col gap-6" onsubmit="shareFile('${id}', event)">
            <h1 class="font-medium text-2xl text-black">Email id</h1>
            <input class="p-3 rounded border border-gray-500 w-full" placeholder="example@mail.com" required name="email" type="email"/>
            <button class="bg-indigo-400 text-white rounded py-3 px-8 w-fit font-medium hover:bg-indigo-600" id="send-button">Send</button>
            <div class=" flex items-center gap-2 ">
                <p class=" text-gray-300"> You are Sharing - </p>
                <p class=" text-green-300 text-lg font-medium">${name}</p>
            </div>
        </form>`
    });
}


const shareFile = async (id, e) =>{
    const sendButton = document.getElementById("send-button")
    const form = e.target
    try 
    {
        e.preventDefault()
        
        sendButton.disabled = true
        sendButton.innerHTML = "Sending..."
        const email = form.elements.email.value.trim()
        const payload = {
            email : email,
            fieldId : id
        }
        const { data } = await axios.post('/api/share', payload , getToken())
        console.log(data)
        toast.success(data.message)
    }
    catch (err){
        toast.error(err.response ? err.response.data.message : err.message)
    }
    finally
    {
        Swal.close()
    }
    
}
