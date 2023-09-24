const works = await fetch("http://http://localhost:5678/works").then(works => works.json())
console.log(works)