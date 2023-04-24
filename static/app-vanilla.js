const query = `
  [out:json];
  node
    [amenity=hospital]
    (around:5000,13.811904643254758,100.505677859299)
  out;
`

const fetchData = async () => {
  const mapData = await fetch(`https://www.overpass-api.de/api/interpreter?`)
  console.log(mapData)
}

fetchData()
