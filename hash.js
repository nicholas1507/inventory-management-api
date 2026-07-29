const data = [
    {id: 1, name: "Laptop"},
    {id: 2, name: "Mouse"},
    {id: 3, name: "Remote"},
    {id: 4, name: "USB"},
    {id: 5, name: "Charger"},
    {id: 6, name: "Shoes"},
    {id: 7, name: "Chair"},
    {id: 8, name: "Desk"},
    {id: 9, name: "PC"},
    {id: 10, name: "T-shirt"},
    {id: 11, name: "Pants"},
    {id: 12, name: "Bag"},
    {id: 13, name: "Keyboard"},
    {id: 14, name: "Tissue"},
    {id: 15, name: "Shampoo"},
]

let page = 1;
const limit = 5;
let start = (page - 1) * limit;
let end = start + limit;

const search = "B";
const searching = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
console.log(searching);

// let paginatedData = searching.slice(start, end);
// console.log(paginatedData);