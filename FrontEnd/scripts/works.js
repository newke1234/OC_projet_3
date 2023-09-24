async function getWorks() {

    const works = await fetch("http://localhost:5678/api/works").then(works => works.json())

console.log(works)
}

getWorks()