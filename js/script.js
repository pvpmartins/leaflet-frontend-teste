'use strict'

// Criação de elementos, manipulações de DOM
const body = document.querySelector("body")
const displayUser = document.querySelector('.menu-flutuante')
const btnOpenUser = document.createElement("div")
const btnCloseUser = document.createElement("img")
btnOpenUser.className = "btn-open_menu"
btnOpenUser.innerText="Abrir Menu Usuário"

const displayDadosPonto = document.createElement("div")
displayDadosPonto.className = "display_dados-ponto"

const btnOpenPoints = document.createElement("div")
btnOpenPoints.className = "btn-open_points-panel"
btnOpenPoints.innerText = "Selecionar Historico de Pontos"

btnCloseUser.className="btn-close_user"
btnCloseUser.src="images/btnCancelCircled.png"

const modalRecords = document.createElement("div")
modalRecords.className="modal-records"

const btnCloseModal = document.createElement("img")
btnCloseModal.className = "btn-close_modal"
btnCloseModal.src="images/btnCancelCircled.png"

const title = document.createElement("div")

body.append(btnOpenUser, modalRecords)
displayUser.append(btnCloseUser)
modalRecords.append(title, btnCloseModal)

// Eventos para troca de display em botões

// Seleção de botão via Event Delegation
body.addEventListener('click', (e)=>{
    if(e.target.className === "btn_historico") {
        renderModal(e.target.value)
    }
})

btnOpenUser.addEventListener('click', ()=>{
    if(displayUser.style.display = "none") {
        displayUser.style.display = "flex"
        btnOpen.style.display = "none"
    }
})

btnCloseUser.addEventListener('click', ()=>{
    if(displayUser.style.display="flex") {
        displayUser.style.display = "none"
        btnOpen.style.display = "flex"
    }
})

btnCloseModal.addEventListener('click', ()=>{
    if(modalRecords.style.display = "flex") {
        modalRecords.style.display = "none"
        pointsPanel.style.display = "flex"
    }
})


// Funções para requisições à API.
const baseUrl = 'https://terraq.com.br/'

const visaoInicial = async() => {
    const res = await fetch(baseUrl + 'api/teste-leaflet/visao-inicial')
    const {initial_view} = await res.json()
    const coords = Object.values(initial_view.center)
    return coords
}

const mapLayers = async() => {
    const res = await fetch(baseUrl + 'api/teste-leaflet/visao-inicial')
    const {tile_layers} = await res.json() 
    return tile_layers
}

const dadosPonto = async(id) => {
    const res = await fetch(baseUrl + `api/teste-leaflet/ponto/${id}`)
    return res.json()
}

const dadosUsuario = async () => {
    const res = await fetch(baseUrl + 'api/teste-leaflet/user')
    return res.json()
}

// Funções para renderização de elementos no DOM

const renderModal = async(id) => {
    if(modalRecords.style.display = "none") {
        modalRecords.style.display = "flex"
    }
    if(!document.getElementById("my-chart")){
        await renderChart((await dadosPonto(id)))
    } else {
        document.getElementById("my-chart").remove()
        await renderChart((await dadosPonto(id)))
    }
}

const renderList = async (data) => {
    data.forEach(id => {
        const pointEl = document.createElement("div")
        pointEl.className = "point_id"
        pointEl.innerText = id
        pointsPanel.append(pointEl)
        pointEl.addEventListener('click', async()=>{
            title.textContent = `Gráfico: Ponto ${id}`
            if(modalRecords.style.display = "none") {
                modalRecords.style.display = "flex"
                pointsPanel.style.display = "none"

            }
            if(!document.getElementById("my-chart")){
                await renderChart((await dadosPonto(id)))
            } else {
                document.getElementById("my-chart").remove()
                await renderChart((await dadosPonto(id)))
            }
        })
    })
}

const renderChart = (dados) => {
    const chart = document.createElement("canvas")
    chart.setAttribute("id", "my-chart")
    
    modalRecords.append(chart)
    
    const labels = dados.map(dado=>dado?.data)

    // Função para seleção de cores para cada dataset
    const colorDataset = (index) => {
        const colors = ["#00a1ff", "rgb(185 96 187 / 73%)", "rgb(96 187 162 / 73%)", "#bac55b"]
        const select = index % colors.length

        return colors[select]    
    }
    console.log(Object.keys(dados[0]));
    

    console.log(dados[0]);

    // Retirando a chave data
    const propertiesKeys = Object.keys(dados[0]).filter(dado => dado !== 'data')
    
    const data = {
        labels,
        
        // Renderização dinamica
        datasets: propertiesKeys.map((propertie,index)=> {
            const dataset = {
                data: dados.map(dado=>dado[propertie]),
                label: propertie,
                borderColor: colorDataset(index),
                hidden: propertie === "temperatura" ? false : true
            }
            return dataset
        })     
    }

    const config = {
        type: 'line',
        data: data,
        responsive: true,
        options: {
            scales:{
                y: {
                    suggestedMin: 20,
                    suggestedMax: 80
                }
            },
            responsive: true,
            maintainAspectRatio:false,
            plugins: {
                zoom: {
                  zoom: {
                    wheel: {
                      enabled: true,
                    },
                    pinch: {
                      enabled: true
                    },
                    mode: 'x',
                  },
                  pan: {
                    enabled: true
                  }
                }
              }
        }
    }

    const myChart = new Chart(chart, config)
}

const listarDadosUsuario = async () => {
    const dados = await dadosUsuario()
      
    const avatar = document.createElement("img")
    avatar.className = "avatar"
    avatar.src = dados.avatar
    const nome = document.createElement("p")
    nome.className = "user"
    nome.innerText = "Usuário: "+dados.nome
    const birthYear = document.createElement("p")
    birthYear.className = "user_birthyear"
    birthYear.innerText = "Data Nasc: " + dados.data_nascimento
    const email = document.createElement("p")
    email.className = "user_email"
    email.innerText = "E-mail: "+dados.email
    const id = document.createElement("p")
    id.className = "user_id"
    id.innerText = "ID: "+dados.id
    const sexo = document.createElement("p")
    sexo.className = "user_genre"
    sexo.innerText = "Sexo: "+dados.sexo
    const telefone = document.createElement("p")
    telefone.className= "user_phone-number"
    telefone.innerHTML= "telefone: "+dados.telefone

    displayUser.appendChild(avatar)
    displayUser.appendChild(nome)
    displayUser.appendChild(birthYear)
    displayUser.appendChild(email)
    displayUser.appendChild(id)
    displayUser.appendChild(sexo)
    displayUser.appendChild(telefone)
}


// Criação de IIFE assíncrona
(async()=>{
    displayUser.style.display = "none"
    await listarDadosUsuario()

    
    // Visão inicial obtida a partir de requisição da API
    const map = L.map('map').setView(await visaoInicial(), 12);
    
    //Mapas para renderização obtidas do endpoint visao inicial   
    const layers = await mapLayers()
    
    //Objeto com os Mapas(Layers) obtidos
    const baseMaps={
        openStreet: L.tileLayer(layers[0].url),
        satelite: L.tileLayer(layers[1].url)
    }

    //Adição de layers ao metodo control da biblioteca
    L.control.layers(baseMaps).addTo(map)

    //Mapa padrão ao carregar biblioteca
    baseMaps.openStreet.addTo(map)
    
    function onEachFeature(feature, layer) {
        
        let popupContent = feature.properties.popupContent
        if (feature.properties && feature.properties.popupContent) {
                popupContent += `<br> Precipitação: ` + feature.properties.precipitacao
                popupContent += `<br> Temperatura: ` + feature.properties.temperatura
                popupContent += `<br> Umidade: ` + feature.properties.umidade
                popupContent += `<br> Vento: ` + feature.properties.vento
                popupContent += `<br> Visibilidade: ` + feature.properties.visibilidade
                popupContent += `<br> <button value ="${feature.properties.id}" class="btn_historico">Histórico</button>`            
        }

    layer.bindPopup(popupContent);
}

$.getJSON("https://terraq.com.br/api/teste-leaflet/pontos", function(data) {}).done(
    function(data) {
        renderList(data.map(point=>point.properties.id))
      
        var featureCollection = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var featureIcon = L.icon({
                    iconUrl : feature.properties.icon,
                    iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -28]
                });
                
                return L.marker(latlng, {icon: featureIcon});
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    }		
    );
})()



// Gostaria de deixar registrado o meu agradecimento à oportunidade de mostrar meu trabalho.
// Talvez não muito maduro ainda, mas que já serviu como exercicio para desenvolver ainda mais minhas 
// habilidades como front-end developer.

// Obrigado. Espero que gostem! :)