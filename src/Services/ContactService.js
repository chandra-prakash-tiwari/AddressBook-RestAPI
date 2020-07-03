export const contactService = {
    getAllContacts,
    addNewContact,
    editContact,
    deleteContact
};

// async function getToken(){
//     var token='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNzWnNCTmhaY0YzUTlTNHRycFFCVEJ5TlJSSSIsImtpZCI6IlNzWnNCTmhaY0YzUTlTNHRycFFCVEJ5TlJSSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvY2hhbmRyYXByYWthc2h0aXdhcml2LnNoYXJlcG9pbnQuY29tQDRlODQ3YmM4LTYxNWEtNGM5MS1hOGNhLThjZmY3MTA2NDgxZSIsImlzcyI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA0ZTg0N2JjOC02MTVhLTRjOTEtYThjYS04Y2ZmNzEwNjQ4MWUiLCJpYXQiOjE1OTM3NzE3MTgsIm5iZiI6MTU5Mzc3MTcxOCwiZXhwIjoxNTkzODU4NDE4LCJpZGVudGl0eXByb3ZpZGVyIjoiMDAwMDAwMDEtMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwQDRlODQ3YmM4LTYxNWEtNGM5MS1hOGNhLThjZmY3MTA2NDgxZSIsIm5hbWVpZCI6ImRjOWRiYjJjLWVmZmUtNDBjYi1iZGQwLWM1MjYzOGY5Y2Q5MUA0ZTg0N2JjOC02MTVhLTRjOTEtYThjYS04Y2ZmNzEwNjQ4MWUiLCJvaWQiOiIzMjg5MmYzOC0wMWQyLTRiYjEtYTAwZi00OTEwZGEwNDRkYWMiLCJzdWIiOiIzMjg5MmYzOC0wMWQyLTRiYjEtYTAwZi00OTEwZGEwNDRkYWMiLCJ0cnVzdGVkZm9yZGVsZWdhdGlvbiI6ImZhbHNlIn0.g5jo_lOEEhwUCLeUkUS351741jEj_FrrrnFHsWKX-GWP9gcyO4VnFSXJ5B5goFMDYkkzw7qevrWrAbN7QYEVCgjLt6JYwfPy7DQPJ1obIp3PGUMBiLLDC5kCkaZZR3mcLhUfH7CnoQ1RNP7xt8w20MCaDuYRcdFYKBJUzjq9v-r4Zf34TRxwckfdbPLl5vf2I0I5SiShJWDKT0IYQZ21OTDzGCQSNlkrTE6cDP9xs-Vu1YOEqYsg_RBovma1pEB24zlPCKv3dXfYSJK0gPZ96mpUz2v-tSva9UEXUW3vjk4Eh3Izof5j0xVbvdmPa725OUHl-BIgokqtkCIxMJX5JA';
//     localStorage.setItem('token',token);

//     return fetch('https://cors-anywhere.herokuapp.com/https://accounts.accesscontrol.windows.net/4e847bc8-615a-4c91-a8ca-8cff7106481e/tokens/OAuth/2',{
//         method:"POST",
//         headers:{
//             Accept:"application/json;odata=verbose",
//             "Content-Type":"application/x-www-form-urlencoded"
//         },

//         body : `grant_type=client_credentials&client_id=dc9dbb2c-effe-40cb-bdd0-c52638f9cd91@4e847bc8-615a-4c91-a8ca-8cff7106481e&client_secret=PfgGgYYjSUCSQrw4aLphZ8+kkrSI/8seY5cMs6jQ7w4=&resource=00000003-0000-0ff1-ce00-000000000000/chandraprakashtiwariv.sharepoint.com@4e847bc8-615a-4c91-a8ca-8cff7106481e`
//     }).then(a => a.json()).then(a => localStorage.setItem('token1',a.access_token)).catch(e => console.log(e))
// }
async function getRequestDigest(){
    var token=localStorage.getItem('token');

    return fetch("https://chandraprakashtiwariv.sharepoint.com/sites/addressbook/_api/contextinfo",{
        method:"POST",
		headers:{
            Accept:"application/json;odata=nometadata",
            Authorization:`Bearer ${token}`
        },
    }).then(async res=>{
        localStorage.setItem('digest',JSON.stringify(await res.json()));
    })
}

function getAllContacts(){
    var token=localStorage.getItem('token');
    var url="https://chandraprakashtiwariv.sharepoint.com/sites/addressbook/_api/lists/getbytitle('Contacts')/items"
    return fetch(url,{
        method:"GET",
        headers: { 
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`
        }
    }).then(async response=>{
        if(response.status===200){
            var data=await response.json();
            return Promise.resolve(data);
        }

        return Promise.reject();
    })
}
function addNewContact(details){
    getRequestDigest();
    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    var data={
        "FirstName":details.firstName,
        "LastName":details.lastName,
        "Email":details.email,
        "Mobile":details.mobile,
        "Address":details.address
    }

    var url="https://chandraprakashtiwariv.sharepoint.com/sites/addressbook/_api/lists/getbytitle('Contacts')/items";

    return fetch(url,{
		method:"POST",
		headers:{
			Accept:"application/json;odata=verbose",
            "x-RequestDigest":digest.FormDigestValue,
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
		},
		body:JSON.stringify(data)	
	}).then(async r=>{
        console.log(await r.json())
        if(r.status===201){
            return Promise.resolve("Ok");
        }

        return Promise.reject("Reject");
    });
}

function editContact(details, id){
    getRequestDigest();
    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    var data={
        "FirstName":details.firstName,
        "LastName":details.lastName,
        "Email":details.email,
        "Mobile":details.mobile,
        "Address":details.address
    }

    var url=`https://chandraprakashtiwariv.sharepoint.com/sites/addressbook/_api/lists/getbytitle('Contacts')/items(${id})`;

    return fetch(url,{
		method:"POST",
		headers:{
            Accept:'application/json;odata=nometadata',
            'Content-Type': 'application/json' ,
            Authorization:`Bearer ${token}`,
            "x-RequestDigest":digest.FormDigestValue,
            "If-Match":"*",
            "X-HTTP-Method":"MERGE"
		},
		body:JSON.stringify(data)	
	}).then(async r=>{
        console.log(await r);

        if(r.status===204){
            return Promise.resolve("Ok");
        }

        return Promise.reject("Reject");
    });
}

function deleteContact(id){
    getRequestDigest();
    var digest=localStorage.getItem('digest');
    var token=localStorage.getItem('token');
    var url=`https://chandraprakashtiwariv.sharepoint.com/sites/addressbook/_api/lists/getbytitle('Contacts')/items(${id})`;

    return fetch(url,{
		method:"DELETE",
		headers:{
			"accept":"application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest":digest.FormDigestValue,
            "IF-MATCH":"*",
            Authorization:`Bearer ${token}`
		},	
	}).then(async r=>{
        console.log(r);
        console.log(await r)
        if(r.status===200){
            return Promise.resolve("Ok");
        }

        return Promise.reject("Reject");
    });
}