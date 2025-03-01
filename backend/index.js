// import Arweave from 'arweave';
import fs from "fs";
import { ethers } from "ethers";
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3OWM3ODM3NS1mMDRhLTQ4ZDYtYmVhNS01NThlMWMwMjgxM2YiLCJlbWFpbCI6ImFydHVyby5zcGFtZWFtZTE4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlMjgyZWRjNmRmZmYyY2RhMTg4MiIsInNjb3BlZEtleVNlY3JldCI6IjEyNDY4MmUyMGQzM2E0ZGQ5NmM1NmJjNmRmZDkxOGNkNzVjOTVmNzQ1NDU3NjYwYWZlMTFjYzVhYWU2MTA1M2MiLCJleHAiOjE3NzIzNzUwNjJ9._uG3nzpyKA1751TeD7tFFT2tvyol0P0gWePW_iffj58';

// initialize an arweave instance
/* const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
}); */

export const createKey = async () => {
    await arweave.wallets.generate().then((key) => {
        console.log(key);
        fs.writeFileSync("walletFile.txt", JSON.stringify(key));
    });
}
export const postData = async (tokenName, description, file) => {
    const formData = new FormData();
    const fileStream = fs.createReadStream(file);
    formData.append('file', fileStream);


    const uploadOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        body: formData
    };

      try {
        // Subir archivo
        const uploadResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', uploadOptions);
        const uploadData = await uploadResponse.json();
        const fileHash = uploadData.IpfsHash;

        // Crear metadata
        const metadata = {
            name: tokenName,
            description: description,
            token: token,
            file: `ipfs://${fileHash}`,
            "file-hash": ethers.keccak256(fileHash)
        };

       
        const options = {
            method: 'PUT',
            headers: {Authorization: `Bearer ${JWT}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                ipfsPinHash: fileHash,
                name: tokenName,
                keyvalues: metadata
            })
          };
          const metadataResponse = await fetch('https://api.pinata.cloud/pinning/hashMetadata', options);
          const metadataResult = await metadataResponse.json();
          console.log('Metadata actualizada:', metadataResult);
          
    } catch (err) {
        console.error('Error en la petición:', err);
    }
      
      /* fetch('https://api.pinata.cloud/pinning/hashMetadata', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));*/
}

postData();
/* API_KEY=e282edc6dfff2cda1882
API_SECRET=124682e20d33a4dd96c56bc6dfd918cd75c95f745457660afe11cc5aae61053c
JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3OWM3ODM3NS1mMDRhLTQ4ZDYtYmVhNS01NThlMWMwMjgxM2YiLCJlbWFpbCI6ImFydHVyby5zcGFtZWFtZTE4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlMjgyZWRjNmRmZmYyY2RhMTg4MiIsInNjb3BlZEtleVNlY3JldCI6IjEyNDY4MmUyMGQzM2E0ZGQ5NmM1NmJjNmRmZDkxOGNkNzVjOTVmNzQ1NDU3NjYwYWZlMTFjYzVhYWU2MTA1M2MiLCJleHAiOjE3NzIzNzUwNjJ9._uG3nzpyKA1751TeD7tFFT2tvyol0P0gWePW_iffj58 */