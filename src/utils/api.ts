export const fetchDataset = async()=>{
    const res = await fetch("http://localhost:8000/datasets");
    const data = await res.json();
    return data;
}