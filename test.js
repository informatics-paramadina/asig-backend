var arrPhone = ['6285155075676', '6281905101057', '2882', '2'];



async function delay(time)
{
    return new Promise(resolve => setTimeout(resolve, time));
}


async function coba()
{
    for(var i=0; i < arrPhone.length; i++)
    {
        console.log(arrPhone[i]);
        await delay(3000);
    }
}

coba();