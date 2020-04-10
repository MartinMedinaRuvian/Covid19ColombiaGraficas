const app = new Vue({
  el: "#app",
  created() {
    this.getDatos();
  },
  data: {
    //INICIO DE DATA ***************************************************************
    titulo: "Se han reportado un total de",
    datos:[],
    fechasConfirmados:[],
    url_api: 'https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json',
    totalCasos: 0,
    //FIN DE DATA ******************************************************************
  },
  methods: {

    //INICIO DE METODOS *********************************************************

    async getDatos() {
      const respuesta = await fetch(this.url_api);
      const datos = await respuesta.json();
      this.datos = datos.data;
 
      this.totalCasos = this.datos.length;
      this.getFechas();
      this.getCasosPorFecha();
      this.renderisarChart();
    },
    getFechas() {
      let fechas = [];
      for (let dato of this.datos) {
          fechas.push(dato[9]);     
      }
      this.fechasConfirmados = this.ordenarPorFecha(fechas); 
    },
    async getCasosPorFecha() {
      let fechas = await this.fechasConfirmados;
      const casos = {};
      let total = 0;
      for (let i = 0; i < fechas.length; i++) {
        for (let j = 0; j < fechas.length; j++) {
          if (fechas[i] === fechas[j]) {
            total++;
            casos[i] = {
              casos: total,
              fecha: fechas[i],
            };
          } else {
            total = 0;
          }
        }
      }
      return this.eliminarFechasRepetidas(casos,'fecha');;
    },

    //METODOS UTILES ------------------------------------
    ordenarPorFecha(datos_confirmados) {
      return import("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js" ).then(() => {
        const datos_confirmados_ordenados = _.sortBy(
          Object.values(datos_confirmados),
          ['fecha']
        );
        return datos_confirmados_ordenados;
      });
    },

    eliminarFechasRepetidas(arreglo, propiedadValidar) {
      var nuevoArreglo = [];
      var objeto = {};

      for (var i in arreglo) {
        objeto[arreglo[i][propiedadValidar]] = arreglo[i];
      }

      for (i in objeto) {
        nuevoArreglo.push(objeto[i]);
      }
      return nuevoArreglo;
    },

    //CREACION DEL CHART O GRÁFICO CON LOS DATOS ------------------
    renderisarChart() {
      let grafica = document.querySelector("#grafica");
      let contexto = grafica.getContext("2d");
      this.totalCasosPorFecha(contexto);
    },
    async totalCasosPorFecha(contexto) {
      const casos = await this.getCasosPorFecha();
      new Chart(contexto, {
        type: "line",
        data: {
          labels: casos.map((dato)=> dato.fecha),
          datasets: [
            {
              label: "Confirmados",
              data: casos.map((dato) => dato.casos),
              borderColor: "#40C4FF",
            }
          ],
        },
        options:{                           
            legend:{
            position:'top',
            labels:{
                fontSize:15,
                padding:15,
                boxWidth: 15,
                fontColor: '#fff',
                fontStyle: 'bold'
            }
           
        },
        layout:{
       padding:{
           right:50
       }
        },
        tooltips:{
        backgroundColor: '#69F0AE',
        titleFontColor:'black',
        titleFontSize:20,
        xPadding:20,
        yPadding:20,
        bodyFontColor:'black',
        bodyFontStyle:'bold',
        bodyFontSize:17,
        bodySpacing:10,
        mode: 'x',
        },
        elements:{
            line:{
                borderWidth:3,
                fill:true
            },
            point:{
                radius:6,
                borderWidth:4,
                backgroundColor:'white',
                hoverRadius:8,
                hoverBorderWidth:4,
            }
    
        },
        scales:{
            xAxes:[{
                gridLines:{
                    display:false 
                },
                ticks:{
                  fontColor:'#fff'
                }
            }],

            yAxes:[{
              ticks:{
                fontColor:'#fff'
              },
              gridLines:{
                color:'#616161'
              }
            }]
            }
     
    
        }
      });
    }
    //FIN DE METODOS ****************************************************
  }

});
